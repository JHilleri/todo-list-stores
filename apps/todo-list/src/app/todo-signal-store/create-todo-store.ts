import { computed } from '@angular/core';
import { TodoItem, filterTodoItems } from '@todo-lists/todo/util';
import { createJoinSignalFactory } from './signal-store/joinSignalFactory';
import { createUpdater } from './signal-store/create-updater';
import {
    createCollectionSignalFactory,
    booleanSignalFactory,
    createArraySignalFactory,
    createBasicSignalFactory,
} from './signal-store/signal-factories';

const createItemSignalFactory = createJoinSignalFactory({
    values: createCollectionSignalFactory<TodoItem>(),
    isLoading: booleanSignalFactory,
    isUpdating: booleanSignalFactory,
}).withAdditionalApi((store) => ({
    addUpdated: createUpdater((item: TodoItem) => {
        store.values.add(item);
        store.isUpdating.set(false);
    }),
    setLoaded: createUpdater((items: TodoItem[]) => {
        store.values.set(items);
        store.isLoading.set(false);
    }),
    setUpdated: createUpdater((item: TodoItem[]) => {
        store.values.set(item);
        store.isUpdating.set(false);
    }),
    updateUpdated: createUpdater((item: TodoItem) => {
        store.values.update(item);
        store.isUpdating.set(false);
    }),
    removeUpdated: createUpdater((id: TodoItem['id']) => {
        store.values.remove(id);
        store.isUpdating.set(false);
    }),
    startLoading: createUpdater(() => {
        store.isLoading.set(true);
    }),
    cancelLoading: createUpdater(() => {
        store.isLoading.set(false);
    }),
    startUpdating: createUpdater(() => {
        store.isUpdating.set(true);
    }),
    cancelUpdating: createUpdater(() => {
        store.isUpdating.set(false);
    }),
}));

const createCategorySignalFactory = createJoinSignalFactory({
    values: createArraySignalFactory<string>(),
    isLoading: booleanSignalFactory,
});

export const createTodoStore = createJoinSignalFactory({
    items: createItemSignalFactory,
    categories: createCategorySignalFactory,
    showCompleted: booleanSignalFactory,
    filter: createBasicSignalFactory<string>(),
    isDialogCreateItemOpen: booleanSignalFactory,
}).withAdditionalApi((store) => ({
    completedCount: computed(() => store.items.values().filter((item) => item.completed).length),
    uncompletedCount: computed(() => store.items.values().filter((item) => !item.completed).length),
    isLoading: computed(() => store.items.isLoading() || store.categories.isLoading()),
    filteredItems: computed(() => {
        return filterTodoItems(store.items.values(), {
            showCompleted: store.showCompleted(),
            filter: store.filter(),
        });
    }),
}));
