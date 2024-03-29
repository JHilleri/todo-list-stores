import { createSelector } from '@ngrx/store';
import { todoFeature } from './todo.reducer';
import { filterTodoItems } from '@todo-lists/todo/util';

export const selectCompletedCount = createSelector(
    todoFeature.selectAll,
    (todos) => todos.filter((todo) => todo.completed).length
);

export const selectUncompletedCount = createSelector(
    todoFeature.selectAll,
    (todos) => todos.filter((todo) => !todo.completed).length
);

export const selectFilter = createSelector(todoFeature.selectTodoNgrxState, (state) => state.filter);

export const selectFilteredTodos = createSelector(
    todoFeature.selectAll,
    todoFeature.selectShowCompleted,
    selectFilter,
    (todos, showCompleted, filter) => filterTodoItems(todos, { showCompleted, filter })
);

export const selectAreItemsLoading = createSelector(todoFeature.selectTodoNgrxState, (state) => state.areItemsLoading);

export const selectAreCategoriesLoading = createSelector(
    todoFeature.selectTodoNgrxState,
    (state) => state.areCategoriesLoading
);

export const selectCategories = createSelector(todoFeature.selectTodoNgrxState, (state) => state.categories);
export const selectIsDialogCreateItemOpen = createSelector(
    todoFeature.selectTodoNgrxState,
    (state) => state.isDialogCreateItemOpen
);

export const selectIsUpdating = createSelector(todoFeature.selectTodoNgrxState, (state) => state.isUpdating);

export const selectIsLoading = createSelector(
    selectAreItemsLoading,
    selectAreCategoriesLoading,
    (areItemsLoading, areCategoriesLoading) => areItemsLoading || areCategoriesLoading
);

export const selectViewModel = createSelector({
    filteredTodos: selectFilteredTodos,
    completedCount: selectCompletedCount,
    uncompletedCount: selectUncompletedCount,
    showCompleted: todoFeature.selectShowCompleted,
    categories: selectCategories,
    isLoading: selectIsLoading,
    filter: selectFilter,
    isUpdating: selectIsUpdating,
    isDialogCreateItemOpen: selectIsDialogCreateItemOpen,
});
