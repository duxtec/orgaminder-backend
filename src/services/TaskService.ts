import Roles from "@app/constants/Roles";
import TaskNotFoundError from "@app/errors/TaskNotFoundError";
import TaskInterface from "@app/interfaces/TaskInterface";
import UserInterface from "@app/interfaces/UserInterface";
import TaskModel from "@app/models/TaskModel";

class TaskService {
    static hasAccess(task: TaskInterface, user?: UserInterface) {
        return (
            user &&
            (user.role === Roles.Admin || task?.userIds.includes(user.id))
        );
    }

    static async create(data: Omit<TaskInterface, "id">): Promise<TaskModel> {
        return await TaskModel.create(data);
    }

    static async fetchAll(user: UserInterface): Promise<TaskModel[]> {
        let tasks;
        const userRole = user.role || Roles.User;
        if (userRole == Roles.Admin) {
            tasks = await TaskModel.fetchAll();
        } else {
            tasks = await TaskModel.fetchByUserId(user.id);
        }

        if (!tasks) {
            throw new TaskNotFoundError();
        }

        return tasks;
    }

    static async fetchById(
        id: string,
        user: UserInterface | undefined
    ): Promise<TaskModel> {
        const task = await TaskModel.fetch(id);

        if (!task) {
            throw new TaskNotFoundError();
        }

        return task;
    }

    static async fetchByUserId(
        userId: string,
        user: UserInterface | undefined
    ): Promise<TaskModel[]> {
        const tasks = await TaskModel.fetchByUserId(userId);

        if (!tasks) {
            throw new TaskNotFoundError();
        }

        return tasks;
    }

    /**
     * Updates a task by ID.
     * @param id - The ID of the task to update.
     * @param data - The data to update the task with.
     * @throws Will throw a TaskNotFoundError if the task is not found.
     */
    static async update(
        id: string,
        data: Partial<TaskInterface>,
        user: UserInterface | undefined
    ): Promise<TaskModel> {
        const task = await TaskModel.fetch(id);

        if (!task) {
            throw new TaskNotFoundError();
        }

        TaskService.hasAccess(task, user);

        await task.update(data);
        return task;
    }

    static async delete(
        id: string,
        user: UserInterface | undefined
    ): Promise<void> {
        const task = await TaskModel.fetch(id);

        if (!task) {
            throw new TaskNotFoundError();
        }

        TaskService.hasAccess(task, user);

        await task.delete();
    }
}

export default TaskService;
