import TaskStatusType from '@app/types/TaskStatusType';

interface TaskInterface {
    id: number;
    title: string;
    description: string;
    status: TaskStatusType
    dueDate: Date;
}

export default TaskInterface

