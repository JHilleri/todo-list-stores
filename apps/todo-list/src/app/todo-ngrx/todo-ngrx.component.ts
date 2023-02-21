import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { todoActions } from './state/todo.actions';
import { selectViewModel } from './state/todo.selectors';
import { Store } from '@ngrx/store';
import {
    TodoItemCreationParams,
    UpdateTodoCompletionParams,
} from '@todo-lists/todo/util';
import { FormsModule } from '@angular/forms';
import {
    TodoCreationComponent,
    ButtonComponent,
    TodoCardGridComponent,
} from '@todo-lists/todo/ui';

@Component({
    selector: 'todo-lists-todo-ngrx',
    standalone: true,
    imports: [
        CommonModule,
        TodoCreationComponent,
        FormsModule,
        ButtonComponent,
        TodoCardGridComponent,
    ],
    templateUrl: './todo-ngrx.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoNgrxComponent {
    private store = inject(Store);

    protected vm$ = this.store.select(selectViewModel);

    protected createItem(params: TodoItemCreationParams) {
        this.store.dispatch(todoActions.add({ params }));
    }

    protected updateShowCompleted(showCompleted: boolean) {
        this.store.dispatch(
            todoActions.update_show_completed({ showCompleted })
        );
    }

    protected updateCompleted(params: UpdateTodoCompletionParams) {
        this.store.dispatch(todoActions.update_completed(params));
    }

    protected completeAll() {
        this.store.dispatch(todoActions.complete_all());
    }

    protected uncompleteAll() {
        this.store.dispatch(todoActions.uncomplete_all());
    }
}
