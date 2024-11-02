class TaskNotFoundError extends Error {
    constructor(message: string = 'Task not found') {
        super(message);
        this.name = 'TaskNotFoundError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export default TaskNotFoundError;
