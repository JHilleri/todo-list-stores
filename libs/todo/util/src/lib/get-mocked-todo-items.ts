import { createTodoItem } from './create-todo-item';
import { TodoItem } from './todo-item';

export function getMockedTodoItems(): TodoItem[] {
    return [
        createTodoItem({
            title: 'Todo 1',
            text: 'Todo 1 text',
        }),
        createTodoItem({
            title: 'Todo 2',
            text: 'Todo 2 text',
        }),
    ];
}
