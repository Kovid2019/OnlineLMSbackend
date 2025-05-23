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

//Update book
export const updateBook = ({ _id, ...rest }) => {
  return BookSchema.findByIdAndUpdate(_id, rest);
};
//Delete book
export const deleteBook = (_id) => {
  return BookSchema.findByIdAndDelete(_id);
};
