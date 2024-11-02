import TaskStatusType from "@app/types/TaskStatusType";

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskInterface:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - status
 *         - dueDate
 *         - userIds
 *
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the task.
 *         title:
 *           type: string
 *           description: The title of the task.
 *         description:
 *           type: string
 *           description: Detailed description of the task.
 *         status:
 *           type: string
 *           description: Current status of the task (e.g., pending, completed).
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Due date for the task.
 *         userIds:
 *           type: array
 *           items:
 *             type: string
 *           description: List of user IDs associated with the task.
 */

interface TaskInterface {
    id: string;
    title: string;
    description: string;
    status: TaskStatusType;
    dueDate: Date;
    userIds: [string];
}

export default TaskInterface;
