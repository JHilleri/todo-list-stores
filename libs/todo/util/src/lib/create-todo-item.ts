import { TodoItem } from './todo-item';
import { TodoItemCreationParams } from './todo-item-creation-params';

export function createTodoItem(data: TodoItemCreationParams): TodoItem {
    return {
        id: crypto.randomUUID(),
        completed: false,
        ...data,
    };
}
