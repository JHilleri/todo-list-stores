import { createSelector } from '@ngrx/store';
import { todoFeature, selectAll } from './todo.reducer';

const selectAllItems = createSelector(
    todoFeature.selectTodoNgrxState,
    selectAll
);

export const selectCompletedCount = createSelector(
    selectAllItems,
    (todos) => todos.filter((todo) => todo.completed).length
);

export const selectUncompletedCount = createSelector(
    selectAllItems,
    (todos) => todos.filter((todo) => !todo.completed).length
);

export const selectFilteredTodos = createSelector(
    selectAllItems,
    todoFeature.selectShowCompleted,
    (todos, showCompleted) =>
        todos.filter((todo) => showCompleted || !todo.completed)
);

export const selectViewModel = createSelector({
    filteredTodos: selectFilteredTodos,
    completedCount: selectCompletedCount,
    uncompletedCount: selectUncompletedCount,
    showCompleted: todoFeature.selectShowCompleted,
});
