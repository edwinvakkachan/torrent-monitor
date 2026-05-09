import Torrent from "../models/Torrent.js";

import {
  loginQB,
  getTorrents
} from "../services/qb.js";

import { analyze }
  from "./analyzer.js";

import { executeAction }
  from "./actions.js";

export default async function startPoller() {

  await loginQB();

  async function poll() {

    try {

      let torrents = [];

      try {

        torrents =
          await getTorrents();

      } catch (err) {

        console.error(
          "Cannot access qBittorrent:",
          err.message
        );

        return;
      }

      const activeHashes =
        torrents.map(t => t.hash);

      for (const torrent of torrents) {

        // Validate torrent
        if (
          !torrent.hash ||
          !torrent.name
        ) {
          continue;
        }

        // Allowed states only
       const allowedStates = [
  "downloading",
  "stalledDL",
  "metaDL"
];

        if (
          !allowedStates.includes(
            torrent.state
          )
        ) {
          continue;
        }

        let dbTorrent =
          await Torrent.findOne({
            hash: torrent.hash
          });

        if (!dbTorrent) {

          dbTorrent =
            new Torrent({
              hash: torrent.hash,
              name: torrent.name
            });
        }

        dbTorrent.speed =
          torrent.dlspeed;

        dbTorrent.updatedAt =
          new Date();

        const action =
          analyze(torrent, dbTorrent);

        if (action) {

          await executeAction(
            action,
            torrent,
            dbTorrent
          );
        }

        await dbTorrent.save();
      }

      // Remove unavailable torrents
      await Torrent.deleteMany({
        hash: { $nin: activeHashes }
      });

      console.log(
        `Checked ${torrents.length} torrents`
      );

    } catch (err) {

      console.error(
        "Poller Error:",
        err.message
      );
    }
  }

  // First run
  await poll();

  // Repeat polling
  setInterval(
    poll,
    Number(process.env.POLL_INTERVAL)
  );
}