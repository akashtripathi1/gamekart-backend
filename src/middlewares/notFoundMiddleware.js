import { NotFoundError } from '../errors/customApiErrors.js';

/**
 * Middleware to handle requests to undefined routes.
 * Throws a NotFoundError with a message indicating the route was not found.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {NotFoundError} - Indicates the route was not found.
 */
export default function notFoundMiddleWare(req, res) {
  throw new NotFoundError(
    'Api route not found for this request, Please check the route',
  );
}
