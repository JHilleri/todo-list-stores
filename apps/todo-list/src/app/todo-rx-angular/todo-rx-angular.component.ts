import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { insert } from '@rx-angular/cdk/transformations';
import { RxState, stateful } from '@rx-angular/state';
import { RxActionFactory } from '@rx-angular/state/actions';
import { LetModule } from '@rx-angular/template/let';
import {
    ButtonComponent,
    FiltersComponent,
    LoadingComponent,
    LogStateDirective,
    TodoCardGridComponent,
    TodoCreationComponent,
} from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { combineLatest, map, mergeMap, startWith, withLatestFrom } from 'rxjs';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';
import { patchItemById } from './transformation-helpers';

export interface TodoState {
    items: TodoItem[];
    showCompleted: boolean;
    isUpdating: boolean;
    areItemsLoading: boolean;
    categories: string[];
    areCategoriesLoading: boolean;
    filter: string;
}

interface TodoEvents {
    createItem: TodoItemCreationParams;
    updateShowCompleted: boolean;
    updateCompleted: { item: TodoItem; completed: boolean };
    completeAll: void;
    uncompleteAll: void;
    updateFilter: string;
}

@Component({
    selector: 'todo-lists-todo-rx-angular',
    standalone: true,
    imports: [
        LetModule,
        NgIf,
        TodoCreationComponent,
        FormsModule,
        ButtonComponent,
        TodoCardGridComponent,
        LoadingComponent,
        FiltersComponent,
        LogStateDirective,
    ],
    templateUrl: './todo-rx-angular.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [RxActionFactory, RxState],
})
export class TodoRxAngularComponent {
    private actionFactory = inject(RxActionFactory<TodoEvents>);
    private store = inject<RxState<TodoState>>(RxState);
    private todoService = inject(TodoService);
    private categoryService = inject(CategoryService);

    protected uiActions = this.actionFactory.create({
        createItem: (params: TodoItemCreationParams) => params,
        updateShowCompleted: (showCompleted: boolean) => showCompleted,
        updateCompleted: (params: { item: TodoItem; completed: boolean }) => params,
        completeAll: () => null,
        uncompleteAll: () => null,
        updateFilter: (filter: string) => filter,
    });

    private filteredItems$ = this.store.select().pipe(
        stateful(
            map(({ items, showCompleted, filter }) => {
                return items.filter((todo) => {
                    const matchCompleted = showCompleted || !todo.completed;
                    const matchFilter = filter
                        ? todo.title.includes(filter) ||
                          todo.text.includes(filter) ||
                          todo.tags.some((tag) => tag.includes(filter))
                        : true;
                    return matchCompleted && matchFilter;
                });
            })
        )
    );
    private items$ = this.store.select('items');
    private completedCount$ = this.items$.pipe(stateful(map((items) => items.filter((item) => item.completed).length)));
    private uncompletedCount$ = this.items$.pipe(
        stateful(map((items) => items.filter((item) => !item.completed).length))
    );
    private categories$ = this.store.select('categories');
    private areCategoriesLoading$ = this.store.select('areCategoriesLoading');
    private areItemsLoading$ = this.store.select('areItemsLoading');
    private isUpdating$ = this.store.select('isUpdating');
    private filter$ = this.store.select('filter');
    private isLoading$ = combineLatest({
        areItemsLoading: this.areItemsLoading$,
        areCategoriesLoading: this.areCategoriesLoading$,
        isUpdating: this.isUpdating$,
    }).pipe(
        stateful(
            map(({ areItemsLoading, areCategoriesLoading, isUpdating }) => {
                return areItemsLoading || areCategoriesLoading || isUpdating;
            })
        )
    );

    public vm$ = combineLatest({
        filteredItems: this.filteredItems$,
        completedCount: this.completedCount$,
        uncompletedCount: this.uncompletedCount$,
        showCompleted: this.store.select('showCompleted'),
        categories: this.categories$,
        isLoading: this.isLoading$,
        filter: this.filter$,
    });

    constructor() {
        this.store.set({
            items: [],
            showCompleted: false,
            isUpdating: false,
            areItemsLoading: false,
            categories: [],
            areCategoriesLoading: false,
            filter: '',
        });

        this.store.connect('showCompleted', this.uiActions.updateShowCompleted$);
        this.store.connect(
            this.uiActions.createItem$.pipe(
                mergeMap((params) => {
                    return this.todoService.createTodo(params).pipe(
                        withLatestFrom(this.items$),
                        map(([item, items]) => insert(items, item)),
                        map((items) => ({ items, isUpdating: false })),
                        startWith({ isUpdating: true })
                    );
                })
            )
        );
        this.store.connect(
            this.uiActions.updateCompleted$.pipe(
                mergeMap(({ item, completed }) => {
                    return this.todoService.updateTodo(item, { completed }).pipe(
                        withLatestFrom(this.items$),
                        map(([item, items]) => patchItemById(items, item.id, item)),
                        map((items) => ({ items, isUpdating: false })),
                        startWith({ isUpdating: true })
                    );
                })
            )
        );
        this.store.connect(
            this.uiActions.completeAll$.pipe(
                withLatestFrom(this.items$),
                mergeMap(([, items]) => {
                    return this.todoService.updateManyTodos(items, { completed: true }).pipe(
                        map((items) => ({ items, isUpdating: false })),
                        startWith({ isUpdating: true })
                    );
                })
            )
        );
        this.store.connect(
            this.uiActions.uncompleteAll$.pipe(
                withLatestFrom(this.items$),
                mergeMap(([, items]) => {
                    return this.todoService.updateManyTodos(items, { completed: false }).pipe(
                        map((items) => ({ items, isUpdating: false })),
                        startWith({ isUpdating: true })
                    );
                })
            )
        );
        this.store.connect('filter', this.uiActions.updateFilter$);
        this.store.connect(this.todoService.getTodos(), (state, items) => {
            return { ...state, items, areItemsLoading: false };
        });
        this.store.connect(this.categoryService.getCategories(), (state, categories) => {
            return { ...state, categories, areCategoriesLoading: false };
        });
    }
}
