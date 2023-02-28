import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LetModule } from '@rx-angular/template/let';
import { adaptNgrx } from '@state-adapt/ngrx';
import { Source, toRequestSource, toSource } from '@state-adapt/rxjs';
import { UiComponentsModule } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { asapScheduler, mergeMap, observeOn } from 'rxjs';
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
    protected createItem$ = new Source<TodoItemCreationParams>('[stateAdapt] item created started');
    protected updateShowCompleted$ = new Source<boolean>('[stateAdapt] show completed updated');
    protected updateCompleted$ = new Source<{ item: TodoItem; completed: boolean }>(
        '[stateAdapt] item completed update started'
    );
    protected completeAll$ = new Source<TodoItem[]>('[stateAdapt] all items completed started');
    protected uncompleteAll$ = new Source<TodoItem[]>('[stateAdapt] all items uncompleted started');
    protected updateFilter$ = new Source<string>('[stateAdapt] filter updated');

    // api actions
    private todoItemsLoaded$ = this.todoService.getTodos().pipe(toSource('[stateAdapt] items loaded'));
    private categoriesLoaded$ = this.categoryService.getCategories().pipe(toSource('[stateAdapt] categories loaded'));
    private createItemSuccess$ = this.createItem$.pipe(
        mergeMap(({ payload }) => this.todoService.createTodo(payload)),
        toRequestSource('[stateAdapt] item created success'),
        observeOn(asapScheduler)
    );
    private updateCompletedSuccess$ = this.updateCompleted$.pipe(
        mergeMap(({ payload: { item, completed } }) => this.todoService.updateTodo(item, { completed })),
        toRequestSource('[stateAdapt] item completed update success'),
        observeOn(asapScheduler)
    );
    private completeAllSuccess$ = this.completeAll$.pipe(
        mergeMap(({ payload }) => this.todoService.updateManyTodos(payload, { completed: true })),
        toRequestSource('[stateAdapt] all items completed success'),
        observeOn(asapScheduler)
    );
    private uncompleteAllSuccess$ = this.uncompleteAll$.pipe(
        mergeMap(({ payload }) => this.todoService.updateManyTodos(payload, { completed: false })),
        toRequestSource('[stateAdapt] all items uncompleted success'),
        observeOn(asapScheduler)
    );

    private store = adaptNgrx(['stateAdapt', initialState, todoStateAdapter], {
        setLoadedItems: this.todoItemsLoaded$,
        setLoadedCategories: this.categoriesLoaded$,
        setShowCompleted: this.updateShowCompleted$,
        setFilter: this.updateFilter$,
        setIsUpdatingTrue: [this.createItem$, this.updateCompleted$, this.completeAll$, this.uncompleteAll$],
        setIsUpdatingFalse: [
            this.createItemSuccess$,
            this.updateCompletedSuccess$,
            this.completeAllSuccess$,
            this.uncompleteAllSuccess$,
        ],
        addItems: this.createItemSuccess$,
        updateItems: this.updateCompletedSuccess$,
        setItems: [this.completeAllSuccess$, this.uncompleteAllSuccess$],
    });

    protected vm$ = this.store.vm$;
}
