import TaskInterface from "@app/interfaces/TaskInterface";

const validateTask = (task: TaskInterface): boolean => {
    return (
        task.id.trim() !== "" &&
        task.title.trim() !== "" &&
        task.description.trim() !== "" &&
        task.status !== undefined &&
        new Date(task.dueDate).toString() !== "Invalid Date" &&
        Array.isArray(task.userIds) &&
        task.userIds.length > 0
    );
};

export default validateTask;
