import { responseClient } from "../middleware/responseClient.js";
import {
  createNewBook,
  deleteBook,
  findABook,
  getAllBooks,
  getAllPublicBooks,
  updateBook,
} from "../models/book/BookModel.js";
import slugify from "slugify";
import { deleteFile, deleteUploadedFiles } from "../utils/fileUtil.js";

export const insertNewBook = async (req, res, next) => {
  console.log(req.file);

  try {
    const { fName, _id } = req.userInfo;
    const { path } = req.file;
    const obj = {
      ...req.body, // Get all the data from the request body.
      slug: slugify(req.body.title, { lower: true }), // Create a slug from the title.
      addedBy: { name: fName, adminId: _id },
      lastUpdateBy: { name: fName, adminId: _id },
      imgUrl: path,
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
    if (error.message.includes("E11000 duplicate key")) {
      // If the error is a duplicate key error, delete the uploaded file.
      if (req.file || Array.isArray(req.files)) {
        deleteUploadedFiles(req);
      }
      return responseClient({
        req,
        res,
        message:
          "Duplicate data not alowed : " + JSON.stringify(error.keyValue),
        statusCode: 400,
      });
    }
    next(error);
  }
};
export const getAllPublicBooksController = async (req, res, next) => {
  try {
    const payload = await getAllPublicBooks();
    responseClient({
      req,
      res,
      payload,
      message: " All books fetched successfully!",
    });
  } catch (error) {
    next(error);
  }
};
export const getSinglePublicBookController = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const payload = await findABook({ slug, status: "active" });
    if (payload) {
      responseClient({
        req,
        res,
        payload,
        message: " Your book fetched successfully!",
      });
    } else {
      responseClient({
        req,
        res,
        payload,
        statusCode: 400,
        message: "Something went wrong. Couldn't fetch book",
      });
    }
  } catch (error) {
    next(error);
  }
};
export const getAllBooksController = async (req, res, next) => {
  try {
    const payload = await getAllBooks();
    responseClient({
      req,
      res,
      payload,
      message: " All books fetched successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const updateBookController = async (req, res, next) => {
  try {
    const { fName, _id } = req.userInfo;

    req.body.imageList = req.body.imageList.split(",");
    //Remove imgToDelete list from imageList
    if (req.body.imgToDelete && !Array.isArray(req.body.imgToDelete)) {
      req.body.imgToDelete = [req.body.imgToDelete];
    }
    //
    if (req.body?.imgToDelete?.length) {
      req.body.imageList = req.body.imageList.filter(
        (img) => !req.body.imgToDelete.includes(img)
      );
      req.body.imgToDelete.map((img) => deleteFile(img));
    }

    if (Array.isArray(req.files)) {
      req.body.imageList = [
        ...req.body.imageList,
        ...req.files.map((obj) => obj.path),
      ];
    }

    const obj = {
      ...req.body, // Get all the data from the request body.

      lastUpdateBy: { name: fName, adminId: _id },
    };
    const book = await updateBook(obj);
    book?._id
      ? responseClient({ req, res, message: "Book Updated successfully!" })
      : responseClient({
          req,
          res,
          message: "Unable to update book in the DB. Try again later..",
          statusCode: 400,
        });
  } catch (error) {
    next(error);
  }
};
export const deleteBookController = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const book = await deleteBook(_id);
    book.imageList.map((img) => deleteFile(img)); // Delete all images associated with the book.
    book?._id
      ? responseClient({
          req,
          res,
          message: "Book has been deleted successfully!",
        })
      : responseClient({
          req,
          res,
          message: "Unable to delete book from the DB. Try again later..",
          statusCode: 400,
        });
  } catch (error) {
    next(error);
  }
};
