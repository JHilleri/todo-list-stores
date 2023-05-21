import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LetDirective } from '@rx-angular/template/let';
import { adaptNgrx } from '@state-adapt/ngrx';
import { UiComponentsModule } from '@todo-lists/todo/ui';
import { UpdateItemParams } from '@todo-lists/todo/util';
import { merge, tap, using } from 'rxjs';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';
import { TodoState, todoStateAdapter } from './todo-state-adapter';
import { createSourceGroup } from './sources-helpers/create-source-group';
import { withImediatRequests, withRequests } from './sources-helpers/with-request';
import { withSources, sourceBuilder } from './sources-helpers/with-sources';

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

    protected sources = createSourceGroup(
        'stateAdapt',
        withSources({
            updateShowCompleted: sourceBuilder<boolean>(),
            updateFilter: sourceBuilder<string>(),
            dialogCreateItemClosed: sourceBuilder<void>(),
            dialogCreateItemOpened: sourceBuilder<void>(),
            deleteItem: sourceBuilder<string>(),
        }),
        withImediatRequests({
            todoItemsLoad: this.todoService.getTodos(),
            categoriesLoad: this.categoryService.getCategories(),
        }),
        withRequests({
            createItem: this.todoService.createTodo,
            updateItem: ({ itemId, changes }: UpdateItemParams) => this.todoService.updateTodo(itemId, changes),
            completeAll: () => this.todoService.updateAllTodos({ completed: true }),
            uncompleteAll: () => this.todoService.updateAllTodos({ completed: false }),
            deleteItem: this.todoService.deleteTodo,
        })
    );

    private store = adaptNgrx(['stateAdapt', initialState, todoStateAdapter], {
        setLoadedItems: this.sources.todoItemsLoad.success$,
        setLoadedCategories: this.sources.categoriesLoad.success$,
        setShowCompleted: this.sources.updateShowCompleted,
        setFilter: this.sources.updateFilter,
        addItems: this.sources.createItem.success$,
        updateItems: this.sources.updateItem.success$,
        setItems: [this.sources.completeAll.success$, this.sources.uncompleteAll.success$],
        removeItems: this.sources.deleteItem.success$,
        setIsDialogCreateItemOpenTrue: this.sources.dialogCreateItemOpened,
        setIsDialogCreateItemOpenFalse: [this.sources.dialogCreateItemClosed, this.sources.createItem.source$],
        setIsUpdatingTrue: [
            this.sources.createItem.source$,
            this.sources.updateItem.source$,
            this.sources.completeAll.source$,
            this.sources.uncompleteAll.source$,
            this.sources.deleteItem.source$,
        ],
        setIsUpdatingFalse: [
            this.sources.createItem.success$,
            this.sources.createItem.error$,
            this.sources.updateItem.success$,
            this.sources.updateItem.error$,
            this.sources.completeAll.success$,
            this.sources.completeAll.error$,
            this.sources.uncompleteAll.success$,
            this.sources.uncompleteAll.error$,
            this.sources.deleteItem.success$,
            this.sources.deleteItem.error$,
        ],
    });

    protected vm$ = using(
        () =>
            merge(
                this.sources.categoriesLoad.error$,
                this.sources.todoItemsLoad.error$,
                this.sources.createItem.error$,
                this.sources.updateItem.error$,
                this.sources.completeAll.error$,
                this.sources.uncompleteAll.error$,
                this.sources.deleteItem.error$
            )
                .pipe(tap(console.error))
                .subscribe(),
        () => this.store.vm$
    );
}
