import Roles from "@app/constants/Roles";
import TaskAccessDeniedError from "@app/errors/TaskAccessDeniedError";
import TaskInvalidError from "@app/errors/TaskInvalidError";
import TaskNotFoundError from "@app/errors/TaskNotFoundError";
import AuthRequest from "@app/interfaces/AuthenticatedRequestInterface";
import TaskInterface from "@app/interfaces/TaskInterface";
import UserInterface from "@app/interfaces/UserInterface";
import authorizationMiddleware from "@app/middlewares/authorizationMiddleware";
import TaskService from "@app/services/TaskService";
import authMiddleware from "@middlewares/authMiddleware";
import { NextFunction, Response, Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Creates a new task.
 *     description: Creates a new task in the system. Only admin users can assign tasks to other users. Non-admin users can only create tasks for themselves.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInterface'
 *     responses:
 *       201:
 *         description: Task created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskInterface'
 *       204:
 *         description: Task not found.
 *       400:
 *         description: Invalid task data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message detailing the validation failure.
 *       403:
 *         description: Access denied. User does not have permission to create the task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating access is denied.
 *       500:
 *         description: Server error.
 */

router.post(
    "/",
    authMiddleware,
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (req.User?.role !== Roles.Admin) {
                req.body.userIds = [req.User?.id];
            }
            const taskbody: TaskInterface = req.body;
            const task = await TaskService.create(taskbody);
            res.status(201).json(task);
        } catch (error) {
            if (error instanceof TaskNotFoundError) {
                res.status(204).end();
            } else if (error instanceof TaskAccessDeniedError) {
                res.status(403).json({ message: error.message });
            } else if (error instanceof TaskInvalidError) {
                res.status(400).json({ message: error.message });
            } else {
                next(error);
            }
        }
    }
);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Fetches all tasks for the authenticated user.
 *     description: Retrieves all tasks associated with the authenticated user. If the user does not have any tasks, it will return a 204 No Content status.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tasks for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TaskInterface'
 *       204:
 *         description: No tasks found for the user.
 *       403:
 *         description: Access denied. User does not have permission to access the tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating access is denied.
 *       500:
 *         description: Server error.
 */

router.get(
    "/",
    authMiddleware,
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const user = req.User as UserInterface;
            const tasks = await TaskService.fetchAll(user);
            res.json(tasks);
        } catch (error) {
            if (error instanceof TaskNotFoundError) {
                res.status(204).end();
            } else if (error instanceof TaskAccessDeniedError) {
                res.status(403).json({ message: error.message });
            } else {
                next(error);
            }
        }
    }
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Fetches a specific task by ID.
 *     description: Retrieves the task associated with the specified ID. If the task is not found, a 404 error is returned. If access is denied, a 403 error is returned.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the task to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A task object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskInterface'
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the task was not found.
 *       403:
 *         description: Access denied. User does not have permission to access the task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating access is denied.
 *       500:
 *         description: Server error.
 */

router.get(
    "/:id",
    authMiddleware,
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const user = req.User;
            const task = await TaskService.fetchById(req.params.id, user);
            res.json(task);
        } catch (error) {
            if (error instanceof TaskNotFoundError) {
                res.status(404).json({ message: error.message });
            } else if (error instanceof TaskAccessDeniedError) {
                res.status(403).json({ message: error.message });
            } else {
                throw error;
            }
        }
    }
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Updates a specific task by ID.
 *     description: Updates the task associated with the specified ID with the provided data. If the task is not found, a 404 error is returned. If access is denied, a 403 error is returned.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the task to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInterface'
 *     responses:
 *       200:
 *         description: The updated task object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskInterface'
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the task was not found.
 *       403:
 *         description: Access denied. User does not have permission to update the task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating access is denied.
 *       500:
 *         description: Server error.
 */

router.put(
    "/:id",
    authMiddleware,
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const task = await TaskService.update(
                req.params.id,
                req.body,
                req.User
            );
            res.json(task);
        } catch (error) {
            if (error instanceof TaskNotFoundError) {
                res.status(404).json({ message: error.message });
            } else if (error instanceof TaskAccessDeniedError) {
                res.status(403).json({ message: error.message });
            } else {
                next(error);
            }
        }
    }
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Deletes a specific task by ID.
 *     description: Deletes the task associated with the specified ID. If the task is not found, a 404 error is returned. If access is denied, a 403 error is returned.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the task to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task deleted successfully"
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the task was not found.
 *       403:
 *         description: Access denied. User does not have permission to delete the task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating access is denied.
 *       500:
 *         description: Server error.
 */

router.delete(
    "/:id",
    authMiddleware,
    authorizationMiddleware([Roles.Admin]),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            await TaskService.delete(req.params.id, req.User);
            res.json({ message: "Task deleted successfully" });
        } catch (error) {
            if (error instanceof TaskNotFoundError) {
                res.status(404).json({ message: error.message });
            } else if (error instanceof TaskAccessDeniedError) {
                res.status(403).json({ message: error.message });
            } else {
                throw error;
            }
        }
    }
);

export default router;
