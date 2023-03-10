import { createSelector } from '@ngrx/store';
import { todoFeature, selectAll } from './todo.reducer';

export const selectAllItems = createSelector(todoFeature.selectTodoNgrxState, selectAll);

export const selectCompletedCount = createSelector(
    selectAllItems,
    (todos) => todos.filter((todo) => todo.completed).length
);

export const selectUncompletedCount = createSelector(
    selectAllItems,
    (todos) => todos.filter((todo) => !todo.completed).length
);

export const selectFilter = createSelector(todoFeature.selectTodoNgrxState, (state) => state.filter);

export const selectFilteredTodos = createSelector(
    selectAllItems,
    todoFeature.selectShowCompleted,
    selectFilter,
    (todos, showCompleted, filter) =>
        todos.filter((todo) => {
            const matchCompleted = showCompleted || !todo.completed;
            const matchFilter = filter
                ? todo.title.includes(filter) ||
                  todo.text.includes(filter) ||
                  todo.tags.some((tag) => tag.includes(filter))
                : true;
            return matchCompleted && matchFilter;
        })
);

export const selectAreItemsLoading = createSelector(todoFeature.selectTodoNgrxState, (state) => state.areItemsLoading);

export const selectAreCategoriesLoading = createSelector(
    todoFeature.selectTodoNgrxState,
    (state) => state.areCategoriesLoading
);

export const selectCategories = createSelector(todoFeature.selectTodoNgrxState, (state) => state.categories);

export const selectIsUpdating = createSelector(todoFeature.selectTodoNgrxState, (state) => state.isUpdating);

export const selectIsLoading = createSelector(
    selectAreItemsLoading,
    selectAreCategoriesLoading,
    selectIsUpdating,
    (areItemsLoading, areCategoriesLoading, isUpdating) => areItemsLoading || areCategoriesLoading || isUpdating
);

export const selectViewModel = createSelector({
    filteredTodos: selectFilteredTodos,
    completedCount: selectCompletedCount,
    uncompletedCount: selectUncompletedCount,
    showCompleted: todoFeature.selectShowCompleted,
    categories: selectCategories,
    isLoading: selectIsLoading,
    filter: selectFilter,
});
