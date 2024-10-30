import TaskStatusType from '@app/types/TaskStatusType';

interface TaskInterface {
    id: string;
    title: string;
    description: string;
    status: TaskStatusType
    dueDate: Date;
}

export default TaskInterface

