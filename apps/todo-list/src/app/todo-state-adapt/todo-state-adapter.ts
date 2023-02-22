import { createAdapter, joinAdapters } from '@state-adapt/core';
import { booleanAdapter } from '@state-adapt/core/adapters';
import {
    createTodoItem,
    TodoItem,
    TodoItemCreationParams,
    UpdateTodoCompletionParams,
} from '@todo-lists/todo/util';

export interface TodoState {
    items: TodoItem[];
    showCompleted: boolean;
}

const todoListAdapter = createAdapter<TodoItem[]>()({
    create: (items, params: TodoItemCreationParams) => [
        ...items,
        createTodoItem(params),
    ],
    updateCompleted: (items, params: UpdateTodoCompletionParams) =>
        items.map((item) =>
            item.id === params.id
                ? { ...item, completed: params.completed }
                : item
        ),
    completeAll: (items) => items.map((item) => ({ ...item, completed: true })),
    uncompleteAll: (items) =>
        items.map((item) => ({ ...item, completed: false })),
    add: (items, newItems: TodoItem[]) => [...items, ...newItems],
    selectors: {
        items: (items) => items,
        completedCount: (items) =>
            items.filter((item) => item.completed).length,
        uncompletedCount: (items) =>
            items.filter((item) => !item.completed).length,
    },
});

export const todoStateAdapter = joinAdapters<TodoState>()({
    items: todoListAdapter,
    showCompleted: booleanAdapter,
})({
    filteredTodos: (selectors) =>
        selectors.items.filter((item) =>
            selectors.showCompleted ? true : !item.completed
        ),
})({
    vm: (selectors) => ({
        filteredTodos: selectors.filteredTodos,
        completedCount: selectors.itemsCompletedCount,
        uncompletedCount: selectors.itemsUncompletedCount,
        showCompleted: selectors.showCompleted,
    }),
})();
