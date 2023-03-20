import { TodoItem } from './todo-item';

export type TodoItemCreationParams = Pick<TodoItem, 'title' | 'text' | 'tags'>;
