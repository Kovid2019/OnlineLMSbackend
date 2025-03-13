import UserSchema from "./userSchema.js";

//Insert new user
export const createNewUser = (userObj) => {
  return UserSchema(userObj).save();
};
//Update user
export const updateUser = (filter, update) => {
  return UserSchema.findOneAndUpdate(filter, update, { new: true });
};
//Get user; @email: Type string
export const getUserByEmail = (email) => {
  return UserSchema.findOne({ email });
};
