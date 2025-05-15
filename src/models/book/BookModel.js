import BookSchema from "./BookSchema.js";
//Insert new book
export const createNewBook = (bookObj) => {
  return BookSchema(bookObj).save();
};
