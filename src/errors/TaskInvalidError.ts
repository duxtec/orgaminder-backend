class TaskInvalidError extends Error {
    constructor(message: string = "The task is invalid") {
        super(message);
        this.name = "TaskInvalidError";
        Error.captureStackTrace(this, this.constructor);
    }
}

export default TaskInvalidError;
