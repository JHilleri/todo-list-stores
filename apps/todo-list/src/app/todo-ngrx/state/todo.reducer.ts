import { createFeature, createReducer, on } from '@ngrx/store';
import { createTodoItem, TodoItem } from '@todo-lists/todo/util';
import { todoActions } from './todo.actions';

interface State {
    todos: TodoItem[];
    showCompleted: boolean;
}

export const initialState: State = {
    todos: [],
    showCompleted: false,
};

export const todoFeature = createFeature({
    name: 'todo-ngrx',
    reducer: createReducer(
        initialState,
        on(todoActions.add, (state, { params }) => ({
            ...state,
            todos: [...state.todos, createTodoItem(params)],
        })),
        on(todoActions.update_show_completed, (state, { showCompleted }) => ({
            ...state,
            showCompleted,
        })),
        on(todoActions.update_completed, (state, { id, completed }) => ({
            ...state,
            todos: state.todos.map((item) =>
                item.id === id ? { ...item, completed } : item
            ),
        })),
        on(todoActions.complete_all, (state) => ({
            ...state,
            todos: state.todos.map((item) => ({ ...item, completed: true })),
        })),
        on(todoActions.uncomplete_all, (state) => ({
            ...state,
            todos: state.todos.map((item) => ({ ...item, completed: false })),
        })),
        on(todoActions.loading_completed, (state, { items }) => ({
            ...state,
            todos: [...state.todos, ...items],
        }))
    ),
});
