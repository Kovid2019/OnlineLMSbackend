import { responseClient } from "../responseClient.js";
import Joi from "joi";

export const validateData = ({ req, res, next, obj }) => {
  //Create a schema or rules for the data to be validated
  const schema = Joi.object(obj);

  //Pass your data, req.body to the schema
  const { error } = schema.validate(req.body);

  //If pass, go next() or response error from here.
  if (error) {
    return responseClient({
      req,
      res,
      message: error.message,
      statusCode: 400,
    });
  }
  next();
};
