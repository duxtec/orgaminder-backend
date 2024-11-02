import RoleType from "@app/types/RoleType";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserInterface:
 *       type: object
 *       required:
 *         - id
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the user.
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *           description: The user's email address. Can be null if the authentication method does not use email.
 *         displayName:
 *           type: string
 *           nullable: true
 *           description: The display name of the user.
 *         role:
 *           type: string
 *           enum: [Admin, User]
 *           description: The role of the user. Determines access level within the system.
 *         photoURL:
 *           type: string
 *           format: uri
 *           nullable: true
 *           description: URL of the user's profile photo.
 *         emailVerified:
 *           type: boolean
 *           description: Indicates whether the user's email has been verified.
 */

interface UserInterface {
    id: string;
    // E-mail can be null if the authentication method does not use email
    email?: string | null;
    displayName?: string | null;
    role: RoleType;
    photoURL?: string | null;
    emailVerified?: boolean;
}

export default UserInterface;
