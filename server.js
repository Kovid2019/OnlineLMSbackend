import express from "express";
const app = express();
const PORT = process.env.PORT || 8000;

// DB Connection
import { dbConnect } from "./src/config/dbconfig.js";

//Middlewares
import cors from "cors";
import morgan from "morgan";
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //To encode the URL
app.use(express.static("public")); //To serve static files(images here) from the public directory

//API endpoints
import authRoute from "./src/routes/authRoute.js";
import usersRoute from "./src/routes/usersRoute.js";
import booksRoute from "./src/routes/booksRoute.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { responseClient } from "./src/middleware/responseClient.js";
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/books", booksRoute);
app.use((req, res) => {
  throw new Error("Page not found");
});
app.use(errorHandler);

//Server status
app.get("/", (req, res) => {
  const message = "Server is LIVE...";
  responseClient({ req, res, message });
});
dbConnect()
  .then(() => {
    app.listen(PORT, (error) => {
      error
        ? console.log(error)
        : console.log("Server is running at http://localhost:" + PORT);
    });
  })
  .catch((error) => console.log(error));
