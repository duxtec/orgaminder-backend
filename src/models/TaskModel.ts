import admin from '@app/firebase/admin';
import TaskInterface from '@app/interfaces/TaskInterface';
import TaskStatusType from '@app/types/TaskStatusType';

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
    }

    /**
     * Creates a new task in Firestore with a numeric ID.
     * @param data - The task data excluding the 'id'.
     * @returns A promise that resolves to the newly created TaskModel instance.
     */
    static async create(data: Omit<TaskInterface, 'id'>): Promise<TaskModel> {
        const newId = await TaskModel.getNextId(); // Gets the next numeric ID
        const taskData = { ...data, id: newId };
        
        await admin.firestore().collection('tasks').doc(newId.toString()).set(taskData);
        return new TaskModel(taskData);
    }

    /**
     * Gets the next ID in the format YYMMDD000X.
     * @returns A promise that resolves to the next available ID as a string.
     */
    static async getNextId(): Promise<string> {
        const today = new Date();
        const yy = today.getFullYear().toString().slice(-2);
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const datePrefix = `${yy}${mm}${dd}`;

        // Searches for the task with the highest ID that starts with today's date
        const tasksSnapshot = await admin.firestore()
            .collection('tasks')
            .orderBy(admin.firestore.FieldPath.documentId())
            .startAt(datePrefix)
            .endAt(`${datePrefix}\uf8ff`)
            .limit(1)
            .get();

        let maxId = '';

        // Checks if any document was returned
        if (!tasksSnapshot.empty) {
            maxId = tasksSnapshot.docs[0].id; // Gets the highest ID found
        }

        let nextIncrement = 1; // Default value if no tasks for the day

        if (maxId) {
            // If there is already an ID for today, gets the increment
            const lastIncrement = parseInt(maxId.slice(8), 10); // Gets the increment part of the highest ID
            nextIncrement = lastIncrement + 1; // Increments
        }

        const newId = `${datePrefix}${String(nextIncrement).padStart(3, '0')}`; // Creates the new ID
        return newId;
    }

    /**
     * Fetches a task by ID from Firestore.
     * @param id - The ID of the task to fetch.
     * @returns A promise that resolves to the TaskModel instance or null if not found.
     */
    static async fetch(id: number): Promise<TaskModel | null> {
        const docRef = admin.firestore().collection('tasks').doc(id.toString());
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            return new TaskModel({ id: docSnap.data()?.id, ...docSnap.data() } as TaskInterface);
        }
        return null; // Returns null if the task is not found
    }

    /**
     * Updates the task in Firestore with the provided data.
     * @param data - An object containing the fields to update.
     * @returns A promise that resolves when the update is complete.
     */
    async update(data: Partial<TaskInterface>): Promise<void> {
        const docRef = admin.firestore().collection('tasks').doc(this.id.toString());
        await docRef.update(data);
        Object.assign(this, data); // Updates the local instance with the new data
    }

    /**
     * Deletes a task by ID from Firestore.
     * @param id - The ID of the task to delete.
     * @returns A promise that resolves when the deletion is complete.
     */
    static async delete(id: number): Promise<void> {
        const docRef = admin.firestore().collection('tasks').doc(id.toString());
        await docRef.delete();
    }
}

export default TaskModel;
