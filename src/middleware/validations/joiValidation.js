import { deleteUploadedFiles } from "../../utils/fileUtil.js";
import { responseClient } from "../responseClient.js";
import Joi from "joi";

export const validateData = ({ req, res, next, obj }) => {
  //Create a schema or rules for the data to be validated
  const schema = Array.isArray(req.body)
    ? Joi.array().items(obj).min(1).required()
    : Joi.object(obj);

  //Pass your data, req.body to the schema
  const { error } = schema.validate(req.body);

  //If pass, go next() or response error from here.
  if (error) {
    if (req.file || Array.isArray(req.files)) {
      deleteUploadedFiles(req);
    }
    return responseClient({
      req,
      res,
      message: error.message,
      statusCode: 400,
    });
  }
  next();
};
