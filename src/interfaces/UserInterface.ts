import RoleType from '@app/types/RoleType';

interface UserInterface {
    id: string;
    // E-mail can be null if the authentication method does not use email
    email: string | null;
    displayName?: string | null;
    role: RoleType;
    photoURL?: string | null;
    emailVerified: boolean;
}

export default UserInterface;
