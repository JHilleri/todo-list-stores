import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';

interface TodoState extends EntityState<TodoItem> {
    showCompleted: boolean;
    isUpdating: boolean;
    areItemsLoading: boolean;
    categories: string[];
    areCategoriesLoading: boolean;
    filter: string;
    isDialogCreateItemOpen: boolean;
}

const adapter = createEntityAdapter<TodoItem>();

@Injectable()
export class TodoStore extends ComponentStore<TodoState> {
    private todoService = inject(TodoService);
    private categoryService = inject(CategoryService);

    constructor() {
        super(
            adapter.getInitialState({
                showCompleted: false,
                isUpdating: false,
                areItemsLoading: true,
                categories: [],
                areCategoriesLoading: true,
                filter: '',
                isDialogCreateItemOpen: false,
            })
        );
        this.setItems(this.todoService.getTodos());
        this.setCategories(this.categoryService.getCategories());
    }

    readonly createItem = this.effect((params$: Observable<TodoItemCreationParams>) => {
        return params$.pipe(
            tap(() => this.patchState({ isUpdating: true })),
            mergeMap((params) => {
                return this.todoService.createTodo(params);
            }),
            tap((item) => {
                this.patchState((state) => adapter.addOne(item, { ...state, isUpdating: false }));
            })
        );
    });

    readonly updateShowCompleted = this.updater((state, showCompleted: boolean) => {
        return { ...state, showCompleted };
    });

    readonly updateCompleted = this.effect(
        (params$: Observable<{ itemId: TodoItem['id']; changes: Partial<TodoItem> }>) => {
            return params$.pipe(
                tap(() => this.patchState({ isUpdating: true })),
                mergeMap(({ itemId: itemId, changes }) => {
                    return this.todoService.updateTodo(itemId, changes);
                }),
                tap((item) => {
                    this.patchState((state) =>
                        adapter.updateOne(
                            {
                                id: item.id,
                                changes: item,
                            },
                            { ...state, isUpdating: false }
                        )
                    );
                })
            );
        }
    );

    readonly completeAll = this.effect((event$: Observable<void>) => {
        return event$.pipe(
            tap(() => this.patchState({ isUpdating: true })),
            mergeMap(() => {
                return this.todoService.updateAllTodos({
                    completed: true,
                });
            }),
            tap((items) => {
                this.patchState((state) => adapter.upsertMany(items, { ...state, isUpdating: false }));
            })
        );
    });

    readonly uncompleteAll = this.effect((events$: Observable<void>) => {
        return events$.pipe(
            tap(() => this.patchState({ isUpdating: true })),
            mergeMap(() => {
                return this.todoService.updateAllTodos({
                    completed: false,
                });
            }),
            tap((items) => {
                this.patchState((state) => adapter.upsertMany(items, { ...state, isUpdating: false }));
            })
        );
    });

    readonly setItems = this.updater((state, items: TodoItem[]) => {
        return adapter.setAll(items, { ...state, areItemsLoading: false });
    });

    readonly updateFilter = this.updater((state, filter: string) => {
        return { ...state, filter };
    });

    readonly setCategories = this.updater((state, categories: string[]) => {
        return { ...state, categories, areCategoriesLoading: false };
    });

    readonly dialogCreateItemOpened = this.updater((state) => {
        return { ...state, isDialogCreateItemOpen: true };
    });

    readonly dialogCreateItemClosed = this.updater((state) => {
        return { ...state, isDialogCreateItemOpen: false };
    });

    private readonly allItems$ = this.select(this.state$, (state) => {
        return adapter.getSelectors().selectAll(state);
    });

    readonly showCompleted$ = this.select(this.state$, (state) => {
        return state.showCompleted;
    });

    readonly isUpdating$ = this.select(this.state$, (state) => {
        return state.isUpdating;
    });

    readonly areItemsLoading$ = this.select(this.state$, (state) => {
        return state.areItemsLoading;
    });

    readonly areCategoriesLoading$ = this.select(this.state$, (state) => {
        return state.areCategoriesLoading;
    });

    readonly categories$ = this.select(this.state$, (state) => {
        return state.categories;
    });

    readonly filter$ = this.select(this.state$, (state) => {
        return state.filter;
    });

    readonly isDialogCreateItemOpen$ = this.select(this.state$, (state) => {
        return state.isDialogCreateItemOpen;
    });

    readonly isLoading$ = this.select(
        this.areItemsLoading$,
        this.areCategoriesLoading$,
        (areItemsLoading, areCategoriesLoading) => {
            return areItemsLoading || areCategoriesLoading;
        }
    );

    readonly filteredItems$ = this.select(
        this.allItems$,
        this.showCompleted$,
        this.filter$,
        (items, showCompleted, filter) => {
            return items.filter((todo) => {
                const matchCompleted = showCompleted || !todo.completed;
                const matchFilter = filter
                    ? todo.title.includes(filter) ||
                      todo.text.includes(filter) ||
                      todo.tags.some((tag) => tag.includes(filter))
                    : true;
                return matchCompleted && matchFilter;
            });
        }
    );

    readonly completedCount$ = this.select(this.allItems$, (items) => items.filter((item) => item.completed).length);

    readonly uncompletedCount$ = this.select(this.allItems$, (items) => items.filter((item) => !item.completed).length);

    readonly vm$ = this.select({
        filteredTodos: this.filteredItems$,
        completedCount: this.completedCount$,
        uncompletedCount: this.uncompletedCount$,
        showCompleted: this.showCompleted$,
        categories: this.categories$,
        isLoading: this.isLoading$,
        filter: this.filter$,
        isUpdating: this.isUpdating$,
        isDialogCreateItemOpen: this.isDialogCreateItemOpen$,
    });
}
