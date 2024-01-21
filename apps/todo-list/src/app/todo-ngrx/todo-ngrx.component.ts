
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { LoadingComponent, TodoListComponent } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { todoActions } from './state/todo.actions';
import { selectViewModel } from './state/todo.selectors';

@Component({
    selector: 'todo-lists-todo-ngrx',
    standalone: true,
    templateUrl: './todo-ngrx.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LetDirective, LoadingComponent, TodoListComponent],
})
export class TodoNgrxComponent implements OnInit {
    private store = inject(Store);

    protected vm$ = this.store.select(selectViewModel);

    ngOnInit(): void {
        this.store.dispatch(todoActions.load());
    }

    protected openDialogCreateItem() {
        this.store.dispatch(todoActions.openDialogCreateItem());
    }

    protected createItem(params: TodoItemCreationParams) {
        this.store.dispatch(todoActions.add({ params }));
    }

    protected updateShowCompleted(showCompleted: boolean) {
        this.store.dispatch(todoActions.updateShowCompleted({ showCompleted }));
    }

    protected updateItem({ id, value }: { id: TodoItem['id']; value: Partial<TodoItem> }) {
        this.store.dispatch(todoActions.updateItem({ id, value }));
    }

    protected completeAll() {
        this.store.dispatch(todoActions.completeAll());
    }

    protected uncompleteAll() {
        this.store.dispatch(todoActions.uncompleteAll());
    }

    protected updateFilter(filter: string) {
        this.store.dispatch(todoActions.updateFilter({ filter }));
    }

    protected dialogCreateItemClosed() {
        this.store.dispatch(todoActions.closeDialogCreateItem());
    }
}
