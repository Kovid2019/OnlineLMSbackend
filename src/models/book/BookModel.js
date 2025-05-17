import BookSchema from "./BookSchema.js";
//Insert new book
export const createNewBook = (bookObj) => {
  return BookSchema(bookObj).save();
};
export const getAllPublicBooks = () => {
  return BookSchema.find({ status: "active" });
};
export const getAllBooks = () => {
  return BookSchema.find();
};
