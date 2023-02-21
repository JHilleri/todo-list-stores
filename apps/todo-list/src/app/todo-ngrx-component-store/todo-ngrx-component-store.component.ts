import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideComponentStore } from '@ngrx/component-store';
import {
    ButtonComponent,
    TodoCardGridComponent,
    TodoCreationComponent,
} from '@todo-lists/todo/ui';
import {
    TodoItemCreationParams,
    UpdateTodoCompletionParams,
} from '@todo-lists/todo/util';
import { TodoStore } from './todo.store';

@Component({
    selector: 'todo-lists-todo-ngrx-component-store',
    standalone: true,
    imports: [
        CommonModule,
        TodoCreationComponent,
        FormsModule,
        ButtonComponent,
        TodoCardGridComponent,
    ],
    templateUrl: './todo-ngrx-component-store.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideComponentStore(TodoStore)],
})
export class TodoNgrxComponentStoreComponent {
    private store = inject(TodoStore);

    protected vm$ = this.store.vm$;

    protected createItem(params: TodoItemCreationParams) {
        this.store.createItem(params);
    }

    protected updateShowCompleted(showCompleted: boolean) {
        this.store.updateShowCompleted(showCompleted);
    }

    protected updateCompleted(params: UpdateTodoCompletionParams) {
        this.store.updateCompleted(params);
    }

    protected completeAll() {
        this.store.completeAll();
    }

    protected uncompleteAll() {
        this.store.uncompleteAll();
    }
}
