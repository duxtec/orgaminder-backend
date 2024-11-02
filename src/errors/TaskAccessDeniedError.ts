class TaskAccessDeniedError extends Error {
    constructor(message: string = 'You do not have permission to access this task.') {
        super(message);
        this.name = 'TaskAccessDeniedError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export default TaskAccessDeniedError;
