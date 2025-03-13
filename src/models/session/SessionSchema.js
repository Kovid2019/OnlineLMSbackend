import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    association: {
      type: String,
    },
    expire: {
      type: Date,
      required: true,
      default: new Date(Date.now() + 36000000000), //1000ms * 60sec * 60min = 1Hr
      expires: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("session", sessionSchema); //sessions
