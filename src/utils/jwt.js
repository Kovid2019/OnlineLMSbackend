import jwt from "jsonwebtoken";
import { createNewSession } from "../models/session/SessionModel.js";
import { updateUser } from "../models/user/userModel.js";

//Generate accessJWT
export const createAccessJWT = async (email) => {
  //Create
  const token = jwt.sign({ email }, process.env.ACCESSJWT_SECRET, {
    expiresIn: "15m",
  });
  //Store
  const obj = {
    token,
    association: email,
    expire: new Date(Date.now() + 15 * 60 * 1000), //15 minutes
  };
  const newSession = await createNewSession(obj);
  return newSession?._id ? token : null;
};
//Decode accessJWT
export const verifyAccessJWT = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESSJWT_SECRET);
  } catch (error) {
    return error.message;
  }
};

//Generate refreshJWT
export const createRefreshJWT = async (email) => {
  //Create
  const refreshJWT = jwt.sign({ email }, process.env.REFRESHJWT_SECRET, {
    expiresIn: "30d",
  });
  //Store
  const user = await updateUser({ email }, { refreshJWT });
  return user?._id ? refreshJWT : null;
};
//Decode refreshJWT
export const verifyRefreshJWT = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESHJWT_SECRET);
  } catch (error) {
    return error.message;
  }
};

export const getJwts = async (email) => {
  return {
    accessJWT: await createAccessJWT(email),
    refreshJWT: await createRefreshJWT(email),
  };
};
