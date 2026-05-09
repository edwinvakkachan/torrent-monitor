import dotenv from "dotenv";
dotenv.config();

import connectMongo from "./services/mongo.js";
import startPoller from "./monitor/poller.js";

async function start() {
  try {
    await connectMongo();

    console.log("MongoDB Connected");

    startPoller();

  } catch (err) {
    console.error(err);
  }
}

start();