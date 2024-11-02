import Logger from "@app/utils/Logger";
import { NextFunction, Request, Response } from "express";

/**
 * Middleware function for handling errors in the application.
 *
 * This middleware is used to catch and log errors that occur during
 * request processing. It logs the error details using the Logger utility
 * and responds to the client with a 500 Internal Server Error status
 * and a generic error message. This helps prevent sensitive error information
 * from being exposed to the user while still logging the details for debugging.
 *
 * @param err - The error object that contains information about the error.
 * @param req - The Express request object representing the HTTP request.
 * @param res - The Express response object used to send responses to the client.
 * @param next - The next middleware function in the request-response cycle.
 *
 * @returns {void} - This function does not return a value; it either sends a response
 *                   to the client or passes control to the next middleware in the stack.
 */

const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Logger.error({
        error: err.message,
        stack: err.stack,
    });
    res.status(500).json({ message: "Internal Server Error" });
};

export default errorMiddleware;
