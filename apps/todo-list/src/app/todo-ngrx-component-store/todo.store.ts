import { computed, inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, mergeMap, tap } from 'rxjs/operators';
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
        super();
    }

    init() {
        this.setState(
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
            tap(() => this.patchState({ isUpdating: true, isDialogCreateItemOpen: false })),
            mergeMap((params) => {
                return this.todoService.createTodo(params).pipe(
                    map((item) => {
                        this.patchState((state) => adapter.addOne(item, { ...state }));
                    }),
                    catchError((error) => {
                        console.log(error);
                        return of(undefined);
                    }),
                    finalize(() => {
                        this.patchState({ isUpdating: false });
                    })
                );
            })
        );
    });

    readonly updateShowCompleted = this.updater((state, showCompleted: boolean) => {
        return { ...state, showCompleted };
    });

    readonly updateCompleted = this.effect((params$: Observable<{ id: TodoItem['id']; value: Partial<TodoItem> }>) => {
        return params$.pipe(
            tap(() => this.patchState({ isUpdating: true })),
            mergeMap((params) => {
                return this.todoService.updateTodo(params);
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
    });

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

    private readonly allItems = this.selectSignal((state) => adapter.getSelectors().selectAll(state));
    private readonly areItemsLoading = this.selectSignal((state) => state.areItemsLoading);
    private readonly areCategoriesLoading = this.selectSignal((state) => state.areCategoriesLoading);

    public readonly showCompleted = this.selectSignal((state) => state.showCompleted);
    public readonly isUpdating = this.selectSignal((state) => state.isUpdating);
    public readonly categories = this.selectSignal((state) => state.categories);
    public readonly filter = this.selectSignal((state) => state.filter);
    public readonly isDialogCreateItemOpen = this.selectSignal((state) => state.isDialogCreateItemOpen);
    public readonly isLoading = computed(() => this.areItemsLoading() || this.areCategoriesLoading());
    public readonly filteredItems = computed(() => {
        return this.allItems().filter((todo) => {
            const matchCompleted = this.showCompleted() || !todo.completed;
            const matchFilter = this.filter()
                ? todo.title.includes(this.filter()) ||
                  todo.text.includes(this.filter()) ||
                  todo.tags.some((tag) => tag.includes(this.filter()))
                : true;
            return matchCompleted && matchFilter;
        });
    });
    public readonly completedCount = computed(() => this.allItems().filter((item) => item.completed).length);
    public readonly uncompletedCount = computed(() => this.allItems().filter((item) => !item.completed).length);
}
