import { responseClient } from "../middleware/responseClient.js";
import {
  createNewSession,
  deleteManySessions,
  deleteSession,
  getSession,
} from "../models/session/SessionModel.js";
import {
  createNewUser,
  getUserByEmail,
  updateUser,
} from "../models/user/userModel.js";
import {
  passwordResetOTPNotificationEmail,
  userActivatedNotificationEmail,
  userActivationUrlEmail,
  userProfileUpdatedNotificationEmail,
} from "../services/email/emailService.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { v4 as uuidv4 } from "uuid";
import { getJwts } from "../utils/jwt.js";
import { generateRandomOTP } from "../utils/randomGenerator.js";

export const insertNewUser = async (req, res, next) => {
  try {
    //TO DO signup process

    //Receive the user data
    const { password } = req.body;
    //Encrypt the password
    req.body.password = hashPassword(password);

    //Insert the user info in the database
    const user = await createNewUser(req.body);
    if (user?._id) {
      //Create and Send unique activation link to the user for email verification

      const session = await createNewSession({
        token: uuidv4(),
        association: user.email,
      });
      if (session?._id) {
        const url = `${process.env.ROOT_URL}/activate-user?sessionId=${session._id}&t=${session.token}`;

        //Send this url to their email

        const emailId = await userActivationUrlEmail({
          email: user.email,
          url,
          name: user.fName,
        });

        if (emailId) {
          const message =
            "We have sent an activation link to your email. Please check and follow the instructions to actvate your account ";
          return responseClient({ req, res, message });
        }
      }
    }
    throw new Error("Unable to create an accout. Try again later");
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.message = "This email already exists. Try another email";
      error.statusCode = 400;
    }
    // if (error.code === 11000) {
    //   error.message = "This email already exists. Try another email";
    //   error.statusCode = 400;
    // } ChatGPT
    next(error);
  }
};

export const activateUser = async (req, res, next) => {
  try {
    const { sessionId, t } = req.body;

    const session = await deleteSession({
      _id: sessionId,
      token: t,
    });
    if (session?._id) {
      //Update the user status to active
      const user = await updateUser(
        { email: session.association },
        { status: "active" }
      );
      if (user?._id) {
        //Send email notification to the user
        userActivatedNotificationEmail({ email: user.email, name: user.fName });
        const message =
          "Your account has been activated successfully. You may now login";
        return responseClient({ req, res, message });
      }
    }
    const message = "Invalid link or token expired";
    const statusCode = 400;
    responseClient({ req, res, message, statusCode });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Get user by email

    const user = await getUserByEmail(email);
    if (user?._id) {
      console.log(user);
      //Compare the password

      const isPassMatch = comparePassword(password, user.password);
      if (isPassMatch) {
        console.log("User authenticated successfully ..!");

        //Create jwts
        const jwts = await getJwts(email);
        //Response jwts
        return responseClient({
          req,
          res,
          message: "Login successful..!",
          payload: jwts,
        });
      }
    }

    const message = "Invalid Login details!";
    const statusCode = 401;
    responseClient({ req, res, message, statusCode });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    //Get the token
    const { email } = req.userInfo;
    //Update refresh token(refreshJWT) to ""
    await updateUser({ email }, { refreshJWT: "" });
    //Remove the accessJWT from session table.
    await deleteManySessions({ association: email });
    responseClient({ req, res, message: "You are logged out successfully..!" });
  } catch (error) {
    next(error);
  }
};
export const generateOTP = async (req, res, next) => {
  try {
    //Get the Email from body
    const { email } = req.body;
    //Get the user by email(TO check if the user exists)
    const user = typeof email === "string" ? await getUserByEmail(email) : null;
    if (user?._id) {
      //Generate OTP
      const otp = generateRandomOTP();

      //Store in session table
      const session = await createNewSession({
        token: otp,
        association: email,
        expire: new Date(Date.now() + 25 * 60 * 1000), // 5 minutes expiration
      });
      if (session?._id) {
        console.log(session);
        //Send OTP to user email
        const info = passwordResetOTPNotificationEmail({
          email,
          name: user.fName,
          otp,
        });
        console.log(info);
      }
    }

    responseClient({ req, res, message: "OTP is sent to your email..!" });
  } catch (error) {
    next(error);
  }
};

export const resetNewPassword = async (req, res, next) => {
  try {
    const { email, password, otp } = req.body;
    //Check OTP in session table
    const sessions = await getSession({
      token: otp,
      association: email,
    });
    if (sessions?._id) {
      // Encrypt the password
      const hashPass = hashPassword(password);
      //Update the encrypted password in user table
      const user = await updateUser({ email }, { password: hashPass });
      if (user?._id) {
        //Send Email Notification
        userProfileUpdatedNotificationEmail({ name: user.fName, email });
        return responseClient({
          req,
          res,
          message:
            "Your password has been updated successfully. You may login now..!",
        });
      }
    }
    responseClient({
      req,
      res,
      message: "Invalid data or tolen is expired!",
      statusCode: 400,
    });
  } catch (error) {
    next(error);
  }
};
