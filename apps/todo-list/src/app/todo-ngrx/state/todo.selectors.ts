import { createSelector } from '@ngrx/store';
import { todoFeature } from './todo.reducer';

export const selectCompletedCount = createSelector(
    todoFeature.selectTodos,
    (todos) => todos.filter((todo) => todo.completed).length
);

export const selectUncompletedCount = createSelector(
    todoFeature.selectTodos,
    (todos) => todos.filter((todo) => !todo.completed).length
);

export const selectFilteredTodos = createSelector(
    todoFeature.selectTodos,
    todoFeature.selectShowCompleted,
    (todos, showCompleted) =>
        todos.filter((todo) => showCompleted || !todo.completed)
);

export const selectViewModel = createSelector({
    todos: selectFilteredTodos,
    completedCount: selectCompletedCount,
    uncompletedCount: selectUncompletedCount,
    showCompleted: todoFeature.selectShowCompleted,
});
