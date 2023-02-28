import { TodoItem } from './todo-item';

let nextId = 1;

export type TodoItemCreationParams = Pick<TodoItem, 'title' | 'text' | 'tags'>;

export function createTodoItem(data: TodoItemCreationParams): TodoItem {
    return {
        id: nextId++,
        completed: false,
        ...data,
    };
}
