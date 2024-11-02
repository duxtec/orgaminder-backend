import Roles from "@app/constants/Roles";
import admin from "@app/firebase/admin"; // Ajuste o caminho conforme necessário
import Config from "@app/utils/Config";
import Logger from "@app/utils/Logger";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

function isFirebaseError(error: unknown): error is { code: string } {
    return typeof error === "object" && error !== null && "code" in error;
}

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and return a JWT token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the user trying to log in.
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated user.
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       401:
 *         description: Unauthorized. Invalid token or no token provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */

router.post("/login", async (req: Request, res: Response) => {
    const idToken = req.headers.authorization?.split("Bearer ")[1]; // Extrai o ID token

    if (!idToken) {
        res.status(401).json({ message: "No token provided." });
        return;
    }

    const { email } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        const { uid } = await admin.auth().getUser(decodedToken.uid);

        const secret = Config.JWT_SECRET as string;

        const newToken = jwt.sign({ uid: uid, role: Roles.User }, secret, {
            expiresIn: "1h",
        });

        res.json({
            token: newToken,
            message: "User logged in successfully.",
        });
    } catch (error) {
        Logger.error(error);
        res.status(401).json({ message: "Invalid token." });
    }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     description: Create a new user with email and password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the user to register.
 *               password:
 *                 type: string
 *                 description: The password for the user account.
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uid:
 *                   type: string
 *                   description: Unique identifier of the registered user.
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       400:
 *         description: Bad request. Email already exists or other validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message for the registration issue.
 *       500:
 *         description: Internal server error. Unexpected error during registration.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the server issue.
 */

router.post("/register", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });

        res.status(201).json({
            uid: userRecord.uid,
            message: "User registered successfully.",
        });
    } catch (error) {
        Logger.error(error);

        if (isFirebaseError(error)) {
            if (error.code === "auth/email-already-exists") {
                res.status(400).json({ message: "Email already exists." });
            } else {
                res.status(500).json({ message: "Error registering user." });
            }
        } else {
            res.status(500).json({ message: "Internal server error." });
        }
    }
});

export default router;
