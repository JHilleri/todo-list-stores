import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
export class TodoNgrxComponent {
    private store = inject(Store);

    protected vm$ = this.store.select(selectViewModel);

    protected createItem(params: TodoItemCreationParams) {
        this.store.dispatch(todoActions.add({ params }));
    }

    protected updateShowCompleted(showCompleted: boolean) {
        this.store.dispatch(todoActions.update_show_completed({ showCompleted }));
    }

    protected updateCompleted({ item, completed }: { item: TodoItem; completed: boolean }) {
        this.store.dispatch(todoActions.update_item({ item, changes: { completed } }));
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
}
