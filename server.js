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

//API endpoints
import authRoute from "./src/routes/authRoute.js";
import usersRoute from "./src/routes/usersRoute.js";
import booksRoute from "./src/routes/booksRoute.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { responseClient } from "./src/middleware/responseClient.js";
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/books", booksRoute);

//Server status
app.get("/", (req, res) => {
  const message = "Server is LIVE...";
  responseClient({ req, res, message });
});
app.use(errorHandler);
dbConnect()
  .then(() => {
    app.listen(PORT, (error) => {
      error
        ? console.log(error)
        : console.log("Server is running at http://localhost:" + PORT);
    });
  })
  .catch((error) => console.log(error));
