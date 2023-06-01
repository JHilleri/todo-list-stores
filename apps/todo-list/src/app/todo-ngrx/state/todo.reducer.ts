import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { TodoItem } from '@todo-lists/todo/util';
import { todoActions } from './todo.actions';

interface State extends EntityState<TodoItem> {
    showCompleted: boolean;
    isUpdating: boolean;
    areItemsLoading: boolean;
    categories: string[];
    areCategoriesLoading: boolean;
    filter: string;
    isDialogCreateItemOpen: boolean;
}

const adapter = createEntityAdapter<TodoItem>();
export const initialState: State = adapter.getInitialState({
    showCompleted: false,
    isUpdating: false,
    areItemsLoading: false,
    categories: [],
    areCategoriesLoading: false,
    filter: '',
    isDialogCreateItemOpen: false,
});

export const todoFeature = createFeature({
    name: 'todoNgrx',
    reducer: createReducer(
        initialState,
        on(todoActions.add, (state) => ({
            ...state,
            isUpdating: true,
            isDialogCreateItemOpen: false,
        })),
        on(todoActions.addCompleted, (state, { item }) =>
            adapter.addOne(item, {
                ...state,
                isUpdating: false,
            })
        ),
        on(todoActions.addFailed, (state) => ({
            ...state,
            isUpdating: false,
        })),
        on(todoActions.updateShowCompleted, (state, { showCompleted }) => ({
            ...state,
            showCompleted,
        })),
        on(todoActions.updateItem, (state) => ({
            ...state,
            isUpdating: true,
        })),
        on(todoActions.updateItemCompleted, (state, { item }) =>
            adapter.updateOne(
                { id: item.id, changes: item },
                {
                    ...state,
                    isUpdating: false,
                }
            )
        ),
        on(todoActions.updateItemFailed, (state) => ({
            ...state,
            isUpdating: false,
        })),
        on(todoActions.completeAll, (state) => ({
            ...state,
            isUpdating: true,
        })),
        on(todoActions.completeAllCompleted, (state, { items }) =>
            adapter.setAll(items, {
                ...state,
                isUpdating: false,
            })
        ),
        on(todoActions.completeAllFailed, (state) => ({
            ...state,
            isUpdating: false,
        })),
        on(todoActions.uncompleteAll, (state) => ({
            ...state,
            isUpdating: true,
        })),
        on(todoActions.uncompleteAllCompleted, (state, { items }) =>
            adapter.setAll(items, {
                ...state,
                isUpdating: false,
            })
        ),
        on(todoActions.uncompleteAllFailed, (state) => ({
            ...state,
            isUpdating: false,
        })),
        on(todoActions.loadItemsCompleted, (state, { items }) =>
            adapter.setAll(items, {
                ...state,
                areItemsLoading: false,
            })
        ),
        on(todoActions.loadCategoriesCompleted, (state, { categories }) => ({
            ...state,
            categories,
            areCategoriesLoading: false,
        })),
        on(todoActions.loadItemsFailed, (state) => ({
            ...state,
            areItemsLoading: false,
        })),
        on(todoActions.load, (state) => ({
            ...state,
            areItemsLoading: true,
            areCategoriesLoading: true,
        })),
        on(todoActions.updateFilter, (state, { filter }) => ({
            ...state,
            filter,
        })),
        on(todoActions.openDialogCreateItem, (state) => ({
            ...state,
            isDialogCreateItemOpen: true,
        })),
        on(todoActions.closeDialogCreateItem, (state) => ({
            ...state,
            isDialogCreateItemOpen: false,
        }))
    ),
    extraSelectors: ({ selectTodoNgrxState }) => adapter.getSelectors(selectTodoNgrxState),
});
