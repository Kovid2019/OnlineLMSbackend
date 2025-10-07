import { responseClient } from "../middleware/responseClient.js";
import { updateBook } from "../models/book/BookModel.js";
import {
  createBorrows,
  getBorrows,
  updateBorrow,
} from "../models/borrowHistory/BorrowHistoryModel.js";

import { deleteFile, deleteUploadedFiles } from "../utils/fileUtil.js";
const BOOK_DUE_DAYS = 15;
export const insertNewBorrow = async (req, res, next) => {
  try {
    const { _id } = req.userInfo;
    const today = new Date();
    const dueDate = today.setDate(today.getDate() + BOOK_DUE_DAYS);

    req.body = req.body.map((book) => {
      return {
        ...book,
        userId: _id,
        dueDate,
      };
    });

    const borrow = await createBorrows(req.body);
    if (borrow.length) {
      //Update book table with expectedAvailableDate = dueDate
      borrow.map(async ({ bookId }) => {
        await updateBook({ _id: bookId, expectedAvailable: dueDate });
      });
    }
    borrow.length
      ? responseClient({
          req,
          res,
          message: "Borrow added successfully!",
          payload: borrow,
        })
      : responseClient({
          req,
          res,
          message: "Borrow not added. Try again later..",
          statusCode: 401,
        });
  } catch (error) {
    next(error);
  }
};
export const getBorrowsController = async (req, res, next) => {
  try {
    const { _id } = req.userInfo;
    const path = req.path;
    const isAdmin = path === "/admin";

    const borrows = isAdmin
      ? await getBorrows()
      : await getBorrows({ userId: _id });

    responseClient({
      req,
      res,
      message: " Here is thre borrows list!",
      payload: borrows,
    });
  } catch (error) {
    next(error);
  }
};
export const returnBookController = async (req, res, next) => {
  try {
    const { _id } = req.userInfo;

    //Update borrow table
    const filter = { _id: req.body._id, userId: _id }; //borrowId and userId
    const obj = { isReturned: true, returnedDate: Date.now() };

    const result = await updateBorrow(filter, obj);
    if (result?._id) {
      //Update book table : set expectedAvailable to null
      const updatedBook = await updateBook({
        _id: result.bookId,
        expectedAvailable: null,
      });
      if (updatedBook?._id) {
        //Send email notification :TODO
        //Book returned successfully
        return responseClient({
          req,
          res,
          message: " Your book has been returned successfully..!",
        });
      }
    }

    responseClient({
      req,
      res,
      message: " Unable to return book. Please contact Admin..!",
      statusCode: 400,
    });
  } catch (error) {
    next(error);
  }
};
