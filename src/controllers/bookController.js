import { responseClient } from "../middleware/responseClient.js";
import { createNewBook } from "../models/book/BookModel.js";

export const insertNewBook = async (req, res, next) => {
  try {
    const { fName, _id } = req.userInfo;
    const obj = {
      ...req.body, // Get all the data from the request body.

      addedBy: { name: fName, adminId: _id },
      lastUpdateBy: { name: fName, adminId: _id },
    };
    const book = await createNewBook(obj);
    book._id
      ? responseClient({ req, res, message: "Book added successfully!" })
      : responseClient({
          req,
          res,
          message: "Book not added. Try again later..",
          statusCode: 401,
        });
  } catch (error) {
    next(error);
  }
};
