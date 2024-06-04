export const errorHandler = (statusCode, message) => {
  const err = new Error();
  err.statusCode = statusCode;
  err.message = message;
  throw err;
  //or return err;
};
