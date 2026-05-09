import mongoose from "mongoose";

const torrentSchema = new mongoose.Schema({

  hash: {
    type: String,
    unique: true
  },

  name: String,

  speed: Number,

  isSlow: {
    type: Boolean,
    default: false
  },

  metaFailed: {
    type: Boolean,
    default: false
  },

  slowSince: Date,

  recoveredSince: Date,

  metaSince: Date,

  lastAction: String,

  updatedAt: Date

});

export default mongoose.model(
  "Torrent",
  torrentSchema
);