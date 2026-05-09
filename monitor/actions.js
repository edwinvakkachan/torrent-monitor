import {
  moveBottom,
  restorePriority
} from "../services/qb.js";

export async function executeAction(
  action,
  torrent,
  dbTorrent
) {

  switch (action) {

    // =========================
    // SLOW TORRENT
    // =========================

    case "MOVE_BOTTOM":

      try {

        await moveBottom(torrent.hash);

        dbTorrent.isSlow = true;

        dbTorrent.lastAction =
          "Moved to bottom (slow)";

        console.log(
          `[SLOW] ${torrent.name}`
        );

      } catch (err) {

        console.error(
          `Failed moving ${torrent.name}:`,
          err.message
        );
      }

      break;

    // =========================
    // METADATA FAILURE
    // =========================

    case "META_FAILED":

      try {

        await moveBottom(torrent.hash);

        dbTorrent.metaFailed = true;

        dbTorrent.lastAction =
          "Moved to bottom (metadata failed)";

        console.log(
          `[META FAILED] ${torrent.name}`
        );

      } catch (err) {

        console.error(
          `Failed metadata action ${torrent.name}:`,
          err.message
        );
      }

      break;

    // =========================
    // RECOVERY
    // =========================

    case "RESTORE_PRIORITY":

      try {

        await restorePriority(torrent.hash);

        dbTorrent.isSlow = false;

        dbTorrent.slowSince = null;

        dbTorrent.recoveredSince = null;

        dbTorrent.lastAction =
          "Restored priority";

        console.log(
          `[RECOVERED] ${torrent.name}`
        );

      } catch (err) {

        console.error(
          `Failed restoring ${torrent.name}:`,
          err.message
        );
      }

      break;
  }
}