import AuthenticatedRequestInterface from '@app/interfaces/AuthenticatedRequestInterface';
import JwtPayloadInterface from '@app/interfaces/JwtPayloadInterface';
import Config from '@app/utils/Config';
import Logger from '@app/utils/Logger';
import { NextFunction, Response } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

/**
 * Middleware function for authenticating requests using JSON Web Tokens (JWT).
 * 
 * This middleware checks for the presence of an authorization token in the request headers.
 * If a token is found, it verifies the token using a secret key defined in the configuration.
 * On successful verification, it extracts the user information from the token payload 
 * and attaches it to the request object. If the token is missing, invalid, or expired,
 * the middleware responds with an appropriate error message and status code.
 * 
 * @param req - The request object, extended to include authenticated user information.
 * @param res - The response object used to send responses to the client.
 * @param next - The next middleware function in the stack to be executed.
 * 
 * @returns {void} - This function does not return a value; it either calls next() to proceed
 *                   or responds with an error message.
 */

const authMiddleware = (req: AuthenticatedRequestInterface, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'No authorization token provided.' });
        return;
    }

    const secret = Config.JWT_SECRET;
    if (!secret) {
        res.status(500).json({ message: 'Unavailable' });
        Logger.error('JWT_SECRET environment variable is not set');
        return;
    }

    jwt.verify(token, secret, (err: Error | null, decoded?: object | string) => {
        if (err) {
            if (err instanceof JsonWebTokenError) {
                res.status(401).json({ message: 'Invalid token.' });
            } else if (err instanceof TokenExpiredError) {
                res.status(401).json({ message: 'Token expired.' });
            } else {
                Logger.error('Authentication error:', err);
                res.status(401).json({ message: 'Unauthorized.' });
            }
        }

        if (decoded) {
            const { User } = decoded as JwtPayloadInterface;
            req.User = User;
            next();
        } else {
            res.status(401).json({ message: 'Token verification failed.' });
        }
    });
};

export default authMiddleware;
