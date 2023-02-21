import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { adaptNgrx } from '@state-adapt/ngrx';
import { toSource } from '@state-adapt/rxjs';
import {
    ButtonComponent,
    TodoCardGridComponent,
    TodoCreationComponent,
} from '@todo-lists/todo/ui';
import {
    getMockedTodoItems,
    TodoItem,
    TodoItemCreationParams,
    UpdateTodoCompletionParams,
} from '@todo-lists/todo/util';
import { delay } from 'rxjs';
import { todoStateAdapter } from './todo-state-adapter';

export interface TodoState {
    items: TodoItem[];
    showCompleted: boolean;
}

const initialState: TodoState = {
    items: [],
    showCompleted: false,
};

@Component({
    selector: 'todo-lists-todo-state-adapt',
    standalone: true,
    imports: [
        CommonModule,
        TodoCreationComponent,
        FormsModule,
        ButtonComponent,
        TodoCardGridComponent,
    ],
    templateUrl: './todo-state-adapt.component.html',
    styleUrls: ['../todo.component.scss'],
})
export class TodoStateAdaptComponent {
    private store = adaptNgrx(['stateAdapt', initialState, todoStateAdapter], {
        addItems: getMockedTodoItems().pipe(
            delay(2000),
            toSource('[stateAdapt] data loaded')
        ),
    });

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
