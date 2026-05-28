import { sanitizeBody } from '../utils/sanitize.js';

export const validate = (schema) => (req, _res, next) => {
  try {
    req.body = sanitizeBody(req.body);
    const result = schema(req.body);
    if (result !== true) {
      const error = new Error(result);
      error.statusCode = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};
