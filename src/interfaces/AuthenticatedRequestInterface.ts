import JwtPayloadInterface from '@app/interfaces/JwtPayloadInterface';
import { Request } from 'express';

interface AuthenticatedRequestInterface extends Request, JwtPayloadInterface{}

export default AuthenticatedRequestInterface;
