export const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const BadRequest = (msg) => createError(400, msg);
export const Unauthorized = (msg) => createError(401, msg);
export const Forbidden = (msg) => createError(403, msg);
export const NotFound = (msg) => createError(404, msg);
export const InternalServerError = (msg) => createError(500, msg);
