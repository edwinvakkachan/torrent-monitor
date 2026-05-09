const SLOW_SPEED = 200 * 1024;
const HEALTHY_SPEED = 500 * 1024;

const SLOW_TIME = 20 * 60 * 1000;
const HEALTHY_TIME = 5 * 60 * 1000;

const META_TIMEOUT = 5 * 60 * 1000;

export function analyze(torrent, dbTorrent) {

  const now = Date.now();

  // =========================
  // METADATA FAILURE DETECTION
  // =========================

  if (torrent.state === "metaDL") {

    if (!dbTorrent.metaSince) {
      dbTorrent.metaSince = now;
    }

    const metaDuration =
      now - new Date(
        dbTorrent.metaSince
      ).getTime();

    if (
      metaDuration >= META_TIMEOUT &&
      !dbTorrent.metaFailed
    ) {
      return "META_FAILED";
    }

  } else {

    dbTorrent.metaSince = null;
  }

  // =========================
  // SLOW DETECTION
  // =========================

  if (
    torrent.state === "downloading" ||
    torrent.state === "stalledDL"
  ) {

    if (torrent.dlspeed < SLOW_SPEED) {

      if (!dbTorrent.slowSince) {
        dbTorrent.slowSince = now;
      }

      const slowDuration =
        now -
        new Date(
          dbTorrent.slowSince
        ).getTime();

      if (
        slowDuration >= SLOW_TIME &&
        !dbTorrent.isSlow
      ) {
        return "MOVE_BOTTOM";
      }

    } else {

      dbTorrent.slowSince = null;
    }
  }

  // =========================
  // RECOVERY
  // =========================

  if (
    dbTorrent.isSlow &&
    torrent.dlspeed > HEALTHY_SPEED
  ) {

    if (!dbTorrent.recoveredSince) {
      dbTorrent.recoveredSince = now;
    }

    const recoveryDuration =
      now -
      new Date(
        dbTorrent.recoveredSince
      ).getTime();

    if (
      recoveryDuration >= HEALTHY_TIME
    ) {
      return "RESTORE_PRIORITY";
    }

  } else {

    dbTorrent.recoveredSince = null;
  }

  return null;
}