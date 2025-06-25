import BookSchema from "./BookSchema.js";
//Insert new book
export const createNewBook = (bookObj) => {
  return BookSchema(bookObj).save();
};
//Insert many books
export const createManyBooks = (booksArg) => {
  return BookSchema.insertMany(booksArg);
};
//Empty the table
export const emptyBooks = () => {
  return BookSchema.deleteMany({});
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
//Find single book. filter={slug, status : "active"}
export const findABook = (filter) => {
  return BookSchema.findOne(filter);
};
