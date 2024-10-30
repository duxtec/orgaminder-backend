import TaskStatus from "@app/constants/TaskStatus";

type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];

export default TaskStatusType
