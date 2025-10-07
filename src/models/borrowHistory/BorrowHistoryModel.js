import BorrowSchema from "./BorrowHistorySchema.js";
//Insert new borrow
export const createBorrows = (borrowsArr) => {
  return BorrowSchema.insertMany(borrowsArr);
};
//Use filter to get borrows for specific user
//If @filter is undefined, it will return entire records
export const getBorrows = (filter) => {
  return BorrowSchema.find(filter);
};
//Update borrow table
export const updateBorrow = (filter, obj) => {
  return BorrowSchema.findOneAndUpdate(filter, obj);
};
