import TaskInvalidError from "@app/errors/TaskInvalidError";
import admin from "@app/firebase/admin";
import TaskInterface from "@app/interfaces/TaskInterface";
import TaskStatusType from "@app/types/TaskStatusType";
import validateTask from "@app/utils/validators/validateTask";

/**
 * TaskModel represents a task in the application.
 * It implements the TaskInterface and provides methods to interact
 * with the Firestore database for task-related operations.
 */
class TaskModel implements TaskInterface {
    id: string;
    title: string;
    description: string;
    status: TaskStatusType;
    dueDate: Date;
    userIds: [string];

    /**
     * Creates an instance of TaskModel.
     * @param data - An object implementing TaskInterface containing task data.
     */
    constructor(data: TaskInterface) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.status = data.status;
        this.dueDate = data.dueDate;
        this.userIds = data.userIds;
    }

    static async existCollection() {
        const tasksCollectionRef = admin.firestore().collection("tasks");
        try {
            const tasksSnapshot = await tasksCollectionRef.get();

            if (tasksSnapshot.empty) {
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Creates a new task in Firestore with a numeric ID.
     * @param data - The task data excluding the 'id'.
     * @returns A promise that resolves to the newly created TaskModel instance.
     */
    static async create(data: Omit<TaskInterface, "id">): Promise<TaskModel> {
        const newId = await TaskModel.getNextId();
        const taskData: TaskInterface = { ...data, id: newId };

        if (!validateTask(taskData)) {
            throw new TaskInvalidError();
        }
        await admin.firestore().collection("tasks").doc(newId).set(taskData);
        return new TaskModel(taskData);
    }

    /**
     * Gets the next ID in the format YYMMDD000X.
     * @returns A promise that resolves to the next available ID as a string.
     */
    static async getNextId(): Promise<string> {
        const today = new Date();
        const yy = today.getFullYear().toString().slice(-2);
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const datePrefix = `${yy}${mm}${dd}`;

        if (!(await TaskModel.existCollection())) {
            return `${datePrefix}001`;
        }

        const dailyTasksSnapshot = await admin
            .firestore()
            .collection("tasks")
            .where(admin.firestore.FieldPath.documentId(), ">=", datePrefix)
            .get();

        let maxdayId = 0;

        dailyTasksSnapshot.forEach((doc) => {
            const id = parseInt(doc.id.slice(6), 10);

            if (!maxdayId || id > maxdayId) {
                maxdayId = id;
            }
        });

        const nextIncrement = maxdayId + 1;

        const newId = `${datePrefix}${String(nextIncrement).padStart(3, "0")}`;
        return newId;
    }

    /**
     * Fetches a task by ID from Firestore.
     * @param id - The ID of the task to fetch.
     * @returns A promise that resolves to the TaskModel instance or null if not found.
     */
    static async fetch(id: string): Promise<TaskModel | null> {
        const docRef = admin.firestore().collection("tasks").doc(id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            return new TaskModel({
                id: docSnap.data()?.id,
                ...docSnap.data(),
            } as TaskInterface);
        }
        return null; // Returns null if the task is not found
    }

    /**
     * Fetches all tasks from Firestore.
     * @returns A promise that resolves to an array of TaskModel instances.
     */
    static async fetchAll(): Promise<TaskModel[]> {
        if (!(await TaskModel.existCollection())) {
            return [];
        }
        const snapshot = await admin.firestore().collection("tasks").get();
        const tasks: TaskModel[] = [];

        snapshot.forEach((doc) => {
            tasks.push(
                new TaskModel({ id: doc.id, ...doc.data() } as TaskInterface)
            );
        });

        return tasks;
    }

    static async fetchByUserId(userId: string): Promise<TaskModel[]> {
        if (!(await TaskModel.existCollection())) {
            return [];
        }
        const snapshot = await admin
            .firestore()
            .collection("tasks")
            .where("userIds", "array-contains", userId)
            .get();
        const tasks: TaskModel[] = [];

        snapshot.forEach((doc) => {
            tasks.push(
                new TaskModel({ id: doc.id, ...doc.data() } as TaskInterface)
            );
        });

        return tasks;
    }

    /**
     * Updates the task in Firestore with the provided data.
     * @param data - An object containing the fields to update.
     * @returns A promise that resolves when the update is complete.
     */
    async update(data: Partial<TaskInterface>): Promise<boolean> {
        const docRef = admin.firestore().collection("tasks").doc(this.id);
        const docSnapshot = await docRef.get();

        if (!docSnapshot.exists) {
            return false;
        }
        await docRef.update(data);
        Object.assign(this, data);
        return true;
    }

    /**
     * Deletes a task by ID from Firestore.
     * @param id - The ID of the task to delete.
     * @returns A promise that resolves when the deletion is complete.
     */
    async delete(): Promise<boolean> {
        const docRef = admin.firestore().collection("tasks").doc(this.id);
        const docSnapshot = await docRef.get();

        if (!docSnapshot.exists) {
            return false;
        }

        await docRef.delete();
        return true;
    }
}

export default TaskModel;
