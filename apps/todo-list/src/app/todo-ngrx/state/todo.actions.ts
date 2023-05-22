import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const todoActions = createActionGroup({
    source: 'todo',
    events: {
        add: props<{ params: TodoItemCreationParams }>(),
        add_completed: props<{ item: TodoItem }>(),
        add_failed: props<{ error: unknown }>(),
        update_item: props<{ id: TodoItem['id']; value: Partial<TodoItem> }>(),
        update_item_completed: props<{ item: TodoItem }>(),
        update_item_failed: props<{ error: unknown }>(),
        complete_all: emptyProps(),
        complete_all_completed: props<{ items: TodoItem[] }>(),
        complete_all_failed: props<{ error: unknown }>(),
        uncomplete_all: emptyProps(),
        uncomplete_all_completed: props<{ items: TodoItem[] }>(),
        uncomplete_all_failed: props<{ error: unknown }>(),
        load: emptyProps(),
        load_items_completed: props<{ items: TodoItem[] }>(),
        load_items_failed: props<{ error: unknown }>(),
        load_categories_completed: props<{ categories: string[] }>(),
        load_categories_failed: props<{ error: unknown }>(),
        update_show_completed: props<{ showCompleted: boolean }>(),
        update_filter: props<{ filter: string }>(),
        open_dialog_create_item: emptyProps(),
        close_dialog_create_item: emptyProps(),
    },
});
