import { buildAdapter } from '@state-adapt/core';
import {
    createTodoItem,
    TodoItem,
    TodoItemCreationParams,
    UpdateTodoCompletionParams,
} from '@todo-lists/todo/util';
import { TodoState } from './todo-state-adapt.component';

export const todoStateAdapter = buildAdapter<TodoState>()({
    createItem: (state, params: TodoItemCreationParams) => ({
        ...state,
        items: [...state.items, createTodoItem(params)],
    }),
    updateShowCompleted: (state, showCompleted: boolean) => ({
        ...state,
        showCompleted,
    }),
    updateCompleted: (state, params: UpdateTodoCompletionParams) => ({
        ...state,
        items: state.items.map((item) =>
            item.id === params.id
                ? { ...item, completed: params.completed }
                : item
        ),
    }),
    completeAll: (state) => ({
        ...state,
        items: state.items.map((item) => ({ ...item, completed: true })),
    }),
    uncompleteAll: (state) => ({
        ...state,
        items: state.items.map((item) => ({ ...item, completed: false })),
    }),
    addItems: (state, items: TodoItem[]) => ({
        ...state,
        items: [...state.items, ...items],
    }),
    selectors: {
        items: (state) => state.items,
        showCompleted: (state) => state.showCompleted,
    },
})({
    filteredTodos: (selectors) =>
        selectors.items.filter((item) =>
            selectors.showCompleted ? true : !item.completed
        ),
    completedCount: (selectors) =>
        selectors.items.filter((item) => item.completed).length,
    uncompletedCount: (selectors) =>
        selectors.items.filter((item) => !item.completed).length,
})({
    vm: ({
        completedCount,
        uncompletedCount,
        filteredTodos,
        showCompleted,
    }) => ({
        completedCount,
        uncompletedCount,
        filteredTodos,
        showCompleted,
    }),
})();
