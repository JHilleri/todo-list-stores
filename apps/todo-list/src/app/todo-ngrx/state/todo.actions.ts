import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const todoActions = createActionGroup({
    source: 'todo',
    events: {
        add: props<{ params: TodoItemCreationParams }>(),
        add_completed: props<{ item: TodoItem }>(),
        add_failed: props<{ error: unknown }>(),
        update_item: props<{ itemId: TodoItem['id']; changes: Partial<TodoItem> }>(),
        update_item_completed: props<{ item: TodoItem }>(),
        update_item_failed: props<{ error: unknown }>(),
        complete_all: emptyProps(),
        complete_all_completed: props<{ items: TodoItem[] }>(),
        complete_all_failed: props<{ error: unknown }>(),
        unComplete_all: emptyProps(),
        unComplete_all_completed: props<{ items: TodoItem[] }>(),
        unComplete_all_failed: props<{ error: unknown }>(),
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
