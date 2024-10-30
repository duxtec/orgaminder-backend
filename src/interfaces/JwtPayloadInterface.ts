import RoleType from '@app/types/RoleType';

interface JwtPayloadInterface {
    User?: {
        id: string;
        role: RoleType;
        email?: string | null;
    } 
}

export default JwtPayloadInterface;

