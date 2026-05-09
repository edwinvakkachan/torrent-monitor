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

    case "MOVE_BOTTOM":

      try {

        await moveBottom(torrent.hash);

        dbTorrent.isSlow = true;

        dbTorrent.lastAction =
          "Moved to bottom";

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