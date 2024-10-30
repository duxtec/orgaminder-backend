import AuthenticatedRequestInterface from '@app/interfaces/AuthenticatedRequestInterface';
import RoleType from '@app/types/RoleType';
import { NextFunction, RequestHandler, Response } from 'express';

/**
 * Middleware function for authorizing requests based on user roles.
 * 
 * This middleware checks if the authenticated user has the required role 
 * to access a specific resource. It takes an array of allowed roles as a parameter.
 * If the user's role is not present or does not match any of the allowed roles, 
 * it responds with a 403 Forbidden status and an appropriate error message.
 * If the user is authorized, the middleware calls the next function in the stack.
 * 
 * @param roles - An array of roles that are permitted to access the resource.
 * 
 * @returns {RequestHandler} - A request handler function that processes the incoming request.
 */

const authorizationMiddleware = (roles: RoleType[]): RequestHandler => {
    return (req: AuthenticatedRequestInterface, res: Response, next: NextFunction): void => {
        const userRole = req.User?.role; 

        if (!userRole || !roles.includes(userRole)) {
            res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
            return;
        }
        next();
    };
};

export default authorizationMiddleware;
