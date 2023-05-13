import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { insert } from '@rx-angular/cdk/transformations';
import { RxState } from '@rx-angular/state';
import { RxActionFactory } from '@rx-angular/state/actions';
import { LetDirective } from '@rx-angular/template/let';
import { UiComponentsModule } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams, filterTodoItems } from '@todo-lists/todo/util';
import { combineLatest, merge, mergeMap, share } from 'rxjs';
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
    isDialogCreateItemOpen: boolean;
}

interface TodoEvents {
    createItem: TodoItemCreationParams;
    updateShowCompleted: boolean;
    updateCompleted: { itemId: TodoItem['id']; changes: Partial<TodoItem> };
    completeAll: void;
    uncompleteAll: void;
    updateFilter: string;
    isDialogCreateItemOpen: boolean;
    dialogCreateItemClosed: void;
    openDialogCreateItem: void;
}

@Component({
    selector: 'todo-lists-todo-rx-angular',
    standalone: true,
    imports: [LetDirective, NgIf, FormsModule, UiComponentsModule],
    templateUrl: './todo-rx-angular.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [RxActionFactory, RxState],
})
export class TodoRxAngularComponent {
    private actionFactory = inject<RxActionFactory<TodoEvents>>(RxActionFactory);
    private store = inject<RxState<TodoState>>(RxState);
    private todoService = inject(TodoService);
    private categoryService = inject(CategoryService);

    protected uiActions = this.actionFactory.create({
        createItem: (params: TodoItemCreationParams) => params,
        updateShowCompleted: (showCompleted: boolean) => showCompleted,
        updateCompleted: (params: { itemId: TodoItem['id']; changes: Partial<TodoItem> }) => params,
        completeAll: () => null,
        uncompleteAll: () => null,
        updateFilter: (filter: string) => filter,
        openDialogCreateItem: () => null,
        dialogCreateItemClosed: () => null,
    });

    // derived state

    private filteredItems$ = this.store.select(
        ['items', 'showCompleted', 'filter'],
        ({ items, filter, showCompleted }) => filterTodoItems(items, { filter, showCompleted })
    );
    private completedCount$ = this.store.select('items', (items) => {
        return items.filter((item) => item.completed).length;
    });
    private uncompletedCount$ = this.store.select('items', (items) => {
        return items.filter((item) => !item.completed).length;
    });
    private isLoading$ = this.store.select(
        ['areItemsLoading', 'areCategoriesLoading'],
        ({ areItemsLoading, areCategoriesLoading }) => {
            return areItemsLoading || areCategoriesLoading;
        }
    );

    // async operations

    private itemsLoaded$ = this.todoService.getTodos().pipe(share());
    private categoriesLoaded$ = this.categoryService.getCategories().pipe(share());

    private createdItem$ = this.uiActions.createItem$.pipe(
        mergeMap((params) => this.todoService.createTodo(params)),
        share()
    );

    private updatedItem$ = this.uiActions.updateCompleted$.pipe(
        mergeMap(({ itemId, changes }) => this.todoService.updateTodo(itemId, changes)),
        share()
    );

    private completedAll$ = this.uiActions.completeAll$.pipe(
        mergeMap(() => this.todoService.updateAllTodos({ completed: true })),
        share()
    );

    private uncompletedAll$ = this.uiActions.uncompleteAll$.pipe(
        mergeMap(() => this.todoService.updateAllTodos({ completed: false })),
        share()
    );

    protected vm$ = combineLatest({
        showCompleted: this.store.select('showCompleted'),
        filter: this.store.select('filter'),
        categories: this.store.select('categories'),
        filteredItems: this.filteredItems$,
        completedCount: this.completedCount$,
        uncompletedCount: this.uncompletedCount$,
        isLoading: this.isLoading$,
        isUpdating: this.store.select('isUpdating'),
        isDialogCreateItemOpen: this.store.select('isDialogCreateItemOpen'),
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
            isDialogCreateItemOpen: false,
        });

        const startLoading$ = merge(
            this.uiActions.createItem$,
            this.uiActions.updateCompleted$,
            this.uiActions.completeAll$,
            this.uiActions.uncompleteAll$
        );

        const endLoading$ = merge(this.createdItem$, this.updatedItem$, this.completedAll$, this.uncompletedAll$);

        this.store.connect('showCompleted', this.uiActions.updateShowCompleted$);
        this.store.connect('filter', this.uiActions.updateFilter$);
        this.store.connect('isUpdating', startLoading$, () => true);
        this.store.connect('isUpdating', endLoading$, () => false);
        this.store.connect('items', this.createdItem$, ({ items }, item) => insert(items, item));
        this.store.connect('items', this.updatedItem$, ({ items }, item) => patchItemById(items, item.id, item));
        this.store.connect('items', this.completedAll$);
        this.store.connect('items', this.uncompletedAll$);
        this.store.connect('items', this.itemsLoaded$);
        this.store.connect('areItemsLoading', this.itemsLoaded$, () => false);
        this.store.connect('categories', this.categoriesLoaded$);
        this.store.connect('areCategoriesLoading', this.categoriesLoaded$, () => false);
        this.store.connect('isDialogCreateItemOpen', this.uiActions.openDialogCreateItem$, () => true);
        this.store.connect('isDialogCreateItemOpen', this.uiActions.dialogCreateItemClosed$, () => false);
        this.store.connect('isDialogCreateItemOpen', this.uiActions.createItem$, () => false);
    }
}
