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
    TodoItemCreationParams,
    UpdateTodoCompletionParams,
} from '@todo-lists/todo/util';
import { delay, tap } from 'rxjs';
import { TodoState, todoStateAdapter } from './todo-state-adapter';

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
    private dataLoaded$ = getMockedTodoItems().pipe(
        delay(2000),
        toSource('[stateAdapt] data loaded')
    );
    private store = adaptNgrx(['stateAdapt', initialState, todoStateAdapter], {
        addItems: this.dataLoaded$,
    });

    protected vm$ = this.store.vm$;

    protected createItem(params: TodoItemCreationParams) {
        this.store.createItems(params);
    }

    protected updateShowCompleted(showCompleted: boolean) {
        this.store.setShowCompleted(showCompleted);
    }

    protected updateCompleted(params: UpdateTodoCompletionParams) {
        this.store.updateItemsCompleted(params);
    }

    protected completeAll() {
        this.store.completeItemsAll();
    }

    protected uncompleteAll() {
        this.store.uncompleteItemsAll();
    }
}
