import admin from "@app/firebase/admin";
import UserInterface from "@app/interfaces/UserInterface";
import RoleType from "@app/types/RoleType";

/**
 * UserModel represents a user in the application.
 * It implements the UserInterface and provides methods to interact
 * with the Firestore database for user-related operations.
 */
class UserModel implements UserInterface {
    id: string;
    email?: string | null;
    displayName?: string | null;
    role: RoleType;
    photoURL?: string | null;
    emailVerified?: boolean;

    /**
     * Creates an instance of UserModel.
     * @param data - An object implementing UserInterface containing user data.
     */
    constructor(data: UserInterface) {
        this.id = data.id;
        this.email = data.email;
        this.displayName = data.displayName;
        this.role = data.role;
        this.photoURL = data.photoURL;
        this.emailVerified = data.emailVerified;
    }

    /**
     * Creates a new user in Firestore.
     * @param data - The user data excluding the 'id'.
     * @returns A promise that resolves to the newly created UserModel instance.
     */
    static async create(data: Omit<UserInterface, "id">): Promise<UserModel> {
        const userRef = await admin.firestore().collection("users").add(data);
        return new UserModel({ id: userRef.id, ...data });
    }

    /**
     * Fetches a user by ID from Firestore.
     * @param id - The ID of the user to fetch.
     * @returns A promise that resolves to the UserModel instance or null if not found.
     */
    static async fetch(id: string): Promise<UserModel | null> {
        const docRef = admin.firestore().collection("users").doc(id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            return new UserModel({
                id: docSnap.id,
                ...docSnap.data(),
            } as UserInterface);
        }
        return null; // Returns null if the user is not found
    }

    /**
     * Updates the user in Firestore with the provided data.
     * @param data - An object containing the fields to update.
     * @returns A promise that resolves when the update is complete.
     */
    async update(data: Partial<UserInterface>): Promise<void> {
        const docRef = admin.firestore().collection("users").doc(this.id);
        await docRef.update(data);
        Object.assign(this, data); // Updates the local instance with the new data
    }

    /**
     * Deletes a user by ID from Firestore.
     * @param id - The ID of the user to delete.
     * @returns A promise that resolves when the deletion is complete.
     */
    static async delete(id: string): Promise<void> {
        const docRef = admin.firestore().collection("users").doc(id);
        await docRef.delete();
    }
}

export default UserModel;
