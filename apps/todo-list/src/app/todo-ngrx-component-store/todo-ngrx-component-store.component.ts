import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { TodoStore } from './todo.store';
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
import { debounceTime, tap } from 'rxjs/operators';

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

    protected vm$ = this.store.vm$.pipe(
        debounceTime(0), // prevent diamond problem
        tap((vm) => {
            console.log('component vm', vm);
        })
    );

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
