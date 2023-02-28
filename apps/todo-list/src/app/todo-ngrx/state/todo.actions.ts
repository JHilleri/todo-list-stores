import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const todoActions = createActionGroup({
    source: 'todo',
    events: {
        add: props<{ params: TodoItemCreationParams }>(),
        add_completed: props<{ item: TodoItem }>(),
        update_show_completed: props<{ showCompleted: boolean }>(),
        update_item: props<{ item: TodoItem; changes: Partial<TodoItem> }>(),
        update_item_completed: props<{ result: TodoItem }>(),
        complete_all: emptyProps(),
        complete_all_completed: props<{ items: TodoItem[] }>(),
        unComplete_all: emptyProps(),
        unComplete_all_completed: props<{ items: TodoItem[] }>(),
        load: emptyProps(),
        load_items_completed: props<{ items: TodoItem[] }>(),
        load_categories_completed: props<{ categories: string[] }>(),
        update_filter: props<{ filter: string }>(),
    },
});
