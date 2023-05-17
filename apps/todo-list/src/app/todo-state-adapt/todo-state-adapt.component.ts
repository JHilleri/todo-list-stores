import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LetDirective } from '@rx-angular/template/let';
import { adaptNgrx } from '@state-adapt/ngrx';
import { Source } from '@state-adapt/rxjs';
import { UiComponentsModule } from '@todo-lists/todo/ui';
import { TodoItemCreationParams, UpdateItemParams } from '@todo-lists/todo/util';
import { merge, tap, using } from 'rxjs';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';
import { TodoState, todoStateAdapter } from './todo-state-adapter';
import { createRequestsGroup } from './create-request';

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
    imports: [LetDirective, NgIf, FormsModule, UiComponentsModule],
    templateUrl: './todo-state-adapt.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoStateAdaptComponent {
    private todoService = inject(TodoService);
    private categoryService = inject(CategoryService);

    // ui actions
    protected updateShowCompleted$ = new Source<boolean>('[stateAdapt] update show completed');
    protected updateFilter$ = new Source<string>('[stateAdapt] update filter');
    protected dialogCreateItemClosed$ = new Source<void>('[stateAdapt] close create dialog item');
    protected dialogCreateItemOpened$ = new Source<void>('[stateAdapt] open create dialog item');

    protected requests = createRequestsGroup('create item', {
        todoItemsLoad: this.todoService.getTodos(),
        categoriesLoad: this.categoryService.getCategories(),
        createItem: (args: TodoItemCreationParams) => this.todoService.createTodo(args),
        updateItem: ({ itemId, changes }: UpdateItemParams) => this.todoService.updateTodo(itemId, changes),
        completeAll: (_: void) => this.todoService.updateAllTodos({ completed: true }),
        uncompleteAll: (_: void) => this.todoService.updateAllTodos({ completed: false }),
    });

    private store = adaptNgrx(['stateAdapt', initialState, todoStateAdapter], {
        setLoadedItems: this.requests.todoItemsLoad.success$,
        setLoadedCategories: this.requests.categoriesLoad.success$,
        setShowCompleted: this.updateShowCompleted$,
        setFilter: this.updateFilter$,
        addItems: this.requests.createItem.success$,
        updateItems: this.requests.updateItem.success$,
        setItems: [this.requests.completeAll.success$, this.requests.uncompleteAll.success$],
        setIsDialogCreateItemOpenTrue: this.dialogCreateItemOpened$,
        setIsDialogCreateItemOpenFalse: [this.dialogCreateItemClosed$, this.requests.createItem.source$],
        setIsUpdatingTrue: [
            this.requests.createItem.source$,
            this.requests.updateItem.source$,
            this.requests.completeAll.source$,
            this.requests.uncompleteAll.source$,
        ],
        setIsUpdatingFalse: [
            this.requests.createItem.success$,
            this.requests.createItem.error$,
            this.requests.updateItem.success$,
            this.requests.updateItem.error$,
            this.requests.completeAll.success$,
            this.requests.completeAll.error$,
            this.requests.uncompleteAll.success$,
            this.requests.uncompleteAll.error$,
        ],
    });

    protected vm$ = using(
        () =>
            merge(
                this.requests.createItem.error$,
                this.requests.updateItem.error$,
                this.requests.completeAll.error$,
                this.requests.uncompleteAll.error$,
                this.requests.todoItemsLoad.error$,
                this.requests.categoriesLoad.error$
            )
                .pipe(tap((error) => console.error(error)))
                .subscribe(),
        () => this.store.vm$
    );
}
