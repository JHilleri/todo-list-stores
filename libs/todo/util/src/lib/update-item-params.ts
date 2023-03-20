import { TodoItem } from './todo-item';

export type UpdateItemParams = { itemId: TodoItem['id']; changes: Partial<TodoItem> };
