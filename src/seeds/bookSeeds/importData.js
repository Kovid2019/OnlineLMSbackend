//THIS FILE IS NOT CONNECTED WITH OUR APPLICATION. WE NEED TO RUN THIS FILE SEPARATELY TO IMPORT DATA INTO OUR DATABASE.

//Connect your Database

//Import any existing model to do queries

import { dbConnect } from "../../config/dbconfig.js";
import { createManyBooks, emptyBooks } from "../../models/book/BookModel.js";
import bookData from "./book-seeds.js";

const importData = async () => {
  try {
    //You have to create your own connection.
    await dbConnect();
    //Also separate query.
    await emptyBooks(); // Clear the Book collection before importing new data
    await createManyBooks(bookData); // Import the book data from book-seeds.js and create multiple book entries in the database
    console.log("All the books have been imported successfully");
  } catch (error) {
    console.log(error);
  }
};

importData();
