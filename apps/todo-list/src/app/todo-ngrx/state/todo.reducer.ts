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
        on(todoActions.add_completed, (state, { item }) =>
            adapter.addOne(item, {
                ...state,
                isUpdating: false,
            })
        ),
        on(todoActions.add_failed, (state) => ({
            ...state,
            isUpdating: false,
        })),
        on(todoActions.update_show_completed, (state, { showCompleted }) => ({
            ...state,
            showCompleted,
        })),
        on(todoActions.update_item, (state) => ({
            ...state,
            isUpdating: true,
        })),
        on(todoActions.update_item_completed, (state, { item }) =>
            adapter.updateOne(
                { id: item.id, changes: item },
                {
                    ...state,
                    isUpdating: false,
                }
            )
        ),
        on(todoActions.update_item_failed, (state) => ({
            ...state,
            isUpdating: false,
        })),
        on(todoActions.complete_all, (state) => ({
            ...state,
            isUpdating: true,
        })),
        on(todoActions.complete_all_completed, (state, { items }) =>
            adapter.setAll(items, {
                ...state,
                isUpdating: false,
            })
        ),
        on(todoActions.complete_all_failed, (state) => ({
            ...state,
            isUpdating: false,
        })),
        on(todoActions.uncomplete_all, (state) => ({
            ...state,
            isUpdating: true,
        })),
        on(todoActions.uncomplete_all_completed, (state, { items }) =>
            adapter.setAll(items, {
                ...state,
                isUpdating: false,
            })
        ),
        on(todoActions.uncomplete_all_failed, (state) => ({
            ...state,
            isUpdating: false,
        })),
        on(todoActions.load_items_completed, (state, { items }) =>
            adapter.setAll(items, {
                ...state,
                areItemsLoading: false,
            })
        ),
        on(todoActions.load_categories_completed, (state, { categories }) => ({
            ...state,
            categories,
            areCategoriesLoading: false,
        })),
        on(todoActions.load_items_failed, (state) => ({
            ...state,
            areItemsLoading: false,
        })),
        on(todoActions.load, (state) => ({
            ...state,
            areItemsLoading: true,
            areCategoriesLoading: true,
        })),
        on(todoActions.update_filter, (state, { filter }) => ({
            ...state,
            filter,
        })),
        on(todoActions.open_dialog_create_item, (state) => ({
            ...state,
            isDialogCreateItemOpen: true,
        })),
        on(todoActions.close_dialog_create_item, (state) => ({
            ...state,
            isDialogCreateItemOpen: false,
        }))
    ),
});

export const { selectAll } = adapter.getSelectors();
