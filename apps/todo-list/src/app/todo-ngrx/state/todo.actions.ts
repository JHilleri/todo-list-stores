import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const todoActions = createActionGroup({
    source: 'todo',
    events: {
        add: props<{ params: TodoItemCreationParams }>(),
        add_completed: props<{ item: TodoItem }>(),
        update_item: props<{ itemId: TodoItem['id']; changes: Partial<TodoItem> }>(),
        update_item_completed: props<{ result: TodoItem }>(),
        complete_all: emptyProps(),
        complete_all_completed: props<{ items: TodoItem[] }>(),
        unComplete_all: emptyProps(),
        unComplete_all_completed: props<{ items: TodoItem[] }>(),
        load: emptyProps(),
        load_items_completed: props<{ items: TodoItem[] }>(),
        load_categories_completed: props<{ categories: string[] }>(),
        update_show_completed: props<{ showCompleted: boolean }>(),
        update_filter: props<{ filter: string }>(),
        open_dialog_create_item: emptyProps(),
        close_dialog_create_item: emptyProps(),
    },
});
