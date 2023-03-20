import { createAdapter, joinAdapters } from '@state-adapt/core';
import { booleanAdapter } from '@state-adapt/core/adapters';
import { TodoItem } from '@todo-lists/todo/util';

export interface TodoState {
    items: TodoItem[];
    showCompleted: boolean;
    isUpdating: boolean;
    areItemsLoading: boolean;
    categories: string[];
    areCategoriesLoading: boolean;
    filter: string;
    isDialogCreateItemOpen: boolean;
}

const todoListAdapter = createAdapter<TodoItem[]>()({
    add: (items, param: TodoItem) => [...items, param],
    update: (items, change: TodoItem) => items.map((item) => (item.id === change.id ? change : item)),
    selectors: {
        items: (items) => items,
        completedCount: (items) => items.filter((item) => item.completed).length,
        uncompletedCount: (items) => items.filter((item) => !item.completed).length,
    },
});

const categoryListAdapter = createAdapter<string[]>()({});

export const todoStateAdapter = joinAdapters<TodoState>()({
    items: todoListAdapter,
    showCompleted: booleanAdapter,
    isUpdating: booleanAdapter,
    areItemsLoading: booleanAdapter,
    categories: categoryListAdapter,
    areCategoriesLoading: booleanAdapter,
    filter: createAdapter<string>()({}),
    isDialogCreateItemOpen: booleanAdapter,
})({
    filteredTodos: (selectors) => {
        return selectors.items.filter((todo) => {
            const matchCompleted = selectors.showCompleted || !todo.completed;
            const matchFilter = selectors.filter
                ? todo.title.includes(selectors.filter) ||
                  todo.text.includes(selectors.filter) ||
                  todo.tags.some((tag) => tag.includes(selectors.filter))
                : true;
            return matchCompleted && matchFilter;
        });
    },
    isLoading: (selectors) => {
        return selectors.areItemsLoading || selectors.areCategoriesLoading;
    },
})({
    vm: (selectors) => ({
        filteredTodos: selectors.filteredTodos,
        completedCount: selectors.itemsCompletedCount,
        uncompletedCount: selectors.itemsUncompletedCount,
        showCompleted: selectors.showCompleted,
        isLoading: selectors.isLoading,
        filter: selectors.filter,
        categories: selectors.categories,
        items: selectors.items,
        isUpdating: selectors.isUpdating,
        isDialogCreateItemOpen: selectors.isDialogCreateItemOpen,
    }),
})({
    setLoadedItems: {
        items: todoListAdapter.set,
        areItemsLoading: booleanAdapter.setFalse,
    },
    setLoadedCategories: {
        categories: categoryListAdapter.set,
        areCategoriesLoading: booleanAdapter.setFalse,
    },
})();
