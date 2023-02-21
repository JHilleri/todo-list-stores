import {
    TodoItem,
    TodoItemCreationParams,
    UpdateTodoCompletionParams,
} from '@todo-lists/todo/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const todoActions = createActionGroup({
    source: 'todo',
    events: {
        add: props<{ params: TodoItemCreationParams }>(),
        update_show_completed: props<{ showCompleted: boolean }>(),
        update_completed: props<{params: UpdateTodoCompletionParams}>(),
        complete_all: emptyProps(),
        unComplete_all: emptyProps(),
        load_items: emptyProps(),
        loading_completed: props<{ items: TodoItem[] }>(),
    },
});
