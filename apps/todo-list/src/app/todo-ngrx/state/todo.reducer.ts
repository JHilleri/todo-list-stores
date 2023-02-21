import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { createTodoItem, TodoItem } from '@todo-lists/todo/util';
import { todoActions } from './todo.actions';

interface State extends EntityState<TodoItem> {
    showCompleted: boolean;
}

const adapter = createEntityAdapter<TodoItem>();
export const initialState: State = adapter.getInitialState({
    showCompleted: false,
});

export const todoFeature = createFeature({
    name: 'todoNgrx',
    reducer: createReducer(
        initialState,
        on(todoActions.add, (state, { params }) =>
            adapter.addOne(createTodoItem(params), state)
        ),
        on(todoActions.update_show_completed, (state, { showCompleted }) => ({
            ...state,
            showCompleted,
        })),
        on(todoActions.update_completed, (state, { id, completed }) =>
            adapter.updateOne({ id, changes: { completed } }, state)
        ),
        on(todoActions.complete_all, (state) =>
            adapter.map((item) => ({ ...item, completed: true }), state)
        ),
        on(todoActions.uncomplete_all, (state) =>
            adapter.map((item) => ({ ...item, completed: false }), state)
        ),
        on(todoActions.loading_completed, (state, { items }) =>
            adapter.addMany(items, state)
        )
    ),
});

export const { selectAll } = adapter.getSelectors();
