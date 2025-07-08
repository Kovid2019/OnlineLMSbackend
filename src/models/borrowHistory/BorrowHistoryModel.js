import BorrowSchema from "./BorrowHistorySchema.js";
//Insert new borrow
export const createBorrows = (borrowsArr) => {
  return BorrowSchema.insertMany(borrowsArr);
};
