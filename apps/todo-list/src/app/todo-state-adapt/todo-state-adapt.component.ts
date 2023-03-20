import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LetModule } from '@rx-angular/template/let';
import { adaptNgrx } from '@state-adapt/ngrx';
import { getRequestSources, Source } from '@state-adapt/rxjs';
import { UiComponentsModule } from '@todo-lists/todo/ui';
import { TodoItemCreationParams, UpdateItemParams } from '@todo-lists/todo/util';
import { merge, mergeMap, tap, using } from 'rxjs';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';
import { TodoState, todoStateAdapter } from './todo-state-adapter';

const initialState: TodoState = {
    items: [],
    showCompleted: false,
    isUpdating: false,
    areItemsLoading: true,
    categories: [],
    areCategoriesLoading: true,
    filter: '',
    isDialogCreateItemOpen: false,
};

@Component({
    selector: 'todo-lists-todo-state-adapt',
    standalone: true,
    imports: [LetModule, NgIf, FormsModule, UiComponentsModule],
    templateUrl: './todo-state-adapt.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoStateAdaptComponent {
    private todoService = inject(TodoService);
    private categoryService = inject(CategoryService);

    // ui actions
    protected createItem$ = new Source<TodoItemCreationParams>('[stateAdapt] create item');
    protected updateShowCompleted$ = new Source<boolean>('[stateAdapt] update show completed');
    protected updateItem$ = new Source<UpdateItemParams>('[stateAdapt] update item');
    protected completeAll$ = new Source<void>('[stateAdapt] complete all items');
    protected uncompleteAll$ = new Source<void>('[stateAdapt] uncomplete all items');
    protected updateFilter$ = new Source<string>('[stateAdapt] update filter');
    protected dialogCreateItemClosed$ = new Source<void>('[stateAdapt] close create dialog item');
    protected dialogCreateItemOpened$ = new Source<void>('[stateAdapt] open create dialog item');

    // api actions
    private todoItemsLoaded = getRequestSources(this.todoService.getTodos(), '[stateAdapt] loaded items');
    private categoriesLoaded = getRequestSources(
        this.categoryService.getCategories(),
        '[stateAdapt] loaded categories'
    );
    private createdItem = getRequestSources(
        this.createItem$.pipe(mergeMap(({ payload }) => this.todoService.createTodo(payload))),
        '[stateAdapt] created item'
    );
    private updatedItem = getRequestSources(
        this.updateItem$.pipe(
            mergeMap(({ payload: { itemId, changes } }) => this.todoService.updateTodo(itemId, changes))
        ),
        '[stateAdapt] updated item'
    );
    private completedAll = getRequestSources(
        this.completeAll$.pipe(mergeMap(() => this.todoService.updateAllTodos({ completed: true }))),
        '[stateAdapt] marked all as completed'
    );
    private uncompletedAll = getRequestSources(
        this.uncompleteAll$.pipe(mergeMap(() => this.todoService.updateAllTodos({ completed: false }))),
        '[stateAdapt] marked all as uncompleted'
    );

    private store = adaptNgrx(['stateAdapt', initialState, todoStateAdapter], {
        setLoadedItems: this.todoItemsLoaded.success$,
        setLoadedCategories: this.categoriesLoaded.success$,
        setShowCompleted: this.updateShowCompleted$,
        setFilter: this.updateFilter$,
        addItems: this.createdItem.success$,
        updateItems: this.updatedItem.success$,
        setItems: [this.completedAll.success$, this.uncompletedAll.success$],
        setIsDialogCreateItemOpenTrue: this.dialogCreateItemOpened$,
        setIsDialogCreateItemOpenFalse: [this.dialogCreateItemClosed$, this.createItem$],
        setIsUpdatingTrue: [this.createItem$, this.updateItem$, this.completeAll$, this.uncompleteAll$],
        setIsUpdatingFalse: [
            this.createdItem.success$,
            this.createdItem.error$,
            this.updatedItem.success$,
            this.updatedItem.error$,
            this.completedAll.success$,
            this.completedAll.error$,
            this.uncompletedAll.success$,
            this.uncompletedAll.error$,
        ],
    });

    protected vm$ = using(
        () =>
            merge(
                this.createdItem.error$,
                this.updatedItem.error$,
                this.completedAll.error$,
                this.uncompletedAll.error$,
                this.todoItemsLoaded.error$,
                this.categoriesLoaded.error$
            )
                .pipe(tap((error) => console.error(error)))
                .subscribe(),
        () => this.store.vm$
    );
}
