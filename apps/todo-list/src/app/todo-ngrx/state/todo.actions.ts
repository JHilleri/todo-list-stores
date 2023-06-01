import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const todoActions = createActionGroup({
    source: 'todo',
    events: {
        add: props<{ params: TodoItemCreationParams }>(),
        addCompleted: props<{ item: TodoItem }>(),
        addFailed: props<{ error: unknown }>(),
        updateItem: props<{ id: TodoItem['id']; value: Partial<TodoItem> }>(),
        updateItemCompleted: props<{ item: TodoItem }>(),
        updateItemFailed: props<{ error: unknown }>(),
        completeAll: emptyProps(),
        completeAllCompleted: props<{ items: TodoItem[] }>(),
        completeAllFailed: props<{ error: unknown }>(),
        uncompleteAll: emptyProps(),
        uncompleteAllCompleted: props<{ items: TodoItem[] }>(),
        uncompleteAllFailed: props<{ error: unknown }>(),
        load: emptyProps(),
        loadItemsCompleted: props<{ items: TodoItem[] }>(),
        loadItemsFailed: props<{ error: unknown }>(),
        loadCategoriesCompleted: props<{ categories: string[] }>(),
        loadCategoriesFailed: props<{ error: unknown }>(),
        updateShowCompleted: props<{ showCompleted: boolean }>(),
        updateFilter: props<{ filter: string }>(),
        openDialogCreateItem: emptyProps(),
        closeDialogCreateItem: emptyProps(),
    },
});
