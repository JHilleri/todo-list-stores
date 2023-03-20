import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LetModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { UiComponentsModule } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { todoActions } from './state/todo.actions';
import { selectViewModel } from './state/todo.selectors';

@Component({
    selector: 'todo-lists-todo-ngrx',
    standalone: true,
    templateUrl: './todo-ngrx.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, FormsModule, LetModule, UiComponentsModule],
})
export class TodoNgrxComponent implements OnInit {
    private store = inject(Store);

    protected vm$ = this.store.select(selectViewModel);

    ngOnInit(): void {
        this.store.dispatch(todoActions.load());
    }

    protected openDialogCreateItem() {
        this.store.dispatch(todoActions.open_dialog_create_item());
    }

    protected createItem(params: TodoItemCreationParams) {
        this.store.dispatch(todoActions.add({ params }));
    }

    protected updateShowCompleted(showCompleted: boolean) {
        this.store.dispatch(todoActions.update_show_completed({ showCompleted }));
    }

    protected updateItem({ itemId, changes }: { itemId: TodoItem['id']; changes: Partial<TodoItem> }) {
        this.store.dispatch(todoActions.update_item({ itemId, changes }));
    }

    protected completeAll() {
        this.store.dispatch(todoActions.complete_all());
    }

    protected uncompleteAll() {
        this.store.dispatch(todoActions.uncomplete_all());
    }

    protected updateFilter(filter: string) {
        this.store.dispatch(todoActions.update_filter({ filter }));
    }

    protected dialogCreateItemClosed() {
        this.store.dispatch(todoActions.close_dialog_create_item());
    }

}
