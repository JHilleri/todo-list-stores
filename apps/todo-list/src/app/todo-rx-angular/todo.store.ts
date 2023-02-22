import { Injectable, OnDestroy } from '@angular/core';
import { insert, setProp } from '@rx-angular/cdk/transformations';
import { RxState, stateful } from '@rx-angular/state';
import { RxActionFactory } from '@rx-angular/state/actions';
import {
    createTodoItem,
    getMockedTodoItems,
    TodoItem,
    TodoItemCreationParams,
    UpdateTodoCompletionParams,
} from '@todo-lists/todo/util';
import { combineLatest, map } from 'rxjs';
import { patchItemById } from './transformation-helpers';

export interface TodoState {
    items: TodoItem[];
    showCompleted: boolean;
}

interface TodoEvents {
    createItem: TodoItemCreationParams;
    updateShowCompleted: boolean;
    updateCompleted: UpdateTodoCompletionParams;
    completeAll: void;
    uncompleteAll: void;
}

@Injectable()
export class TodoStore extends RxState<TodoState> implements OnDestroy {
    private actionFactory = new RxActionFactory<TodoEvents>();

    public readonly actions = this.actionFactory.create({
        createItem: (params: TodoItemCreationParams) => params,
        updateShowCompleted: (showCompleted: boolean) => showCompleted,
        updateCompleted: (params: UpdateTodoCompletionParams) => params,
        completeAll: () => null,
        uncompleteAll: () => null,
    });

    private filteredItems$ = this.select().pipe(
        map(({ items, showCompleted }) =>
            items.filter((item) => showCompleted || !item.completed)
        )
    );

    private completedCount$ = this.select('items').pipe(
        stateful(map((items) => items.filter((item) => item.completed).length))
    );

    private uncompletedCount$ = this.select('items').pipe(
        stateful(map((items) => items.filter((item) => !item.completed).length))
    );

    public vm$ = combineLatest({
        filteredItems: this.filteredItems$,
        completedCount: this.completedCount$,
        uncompletedCount: this.uncompletedCount$,
        showCompleted: this.select('showCompleted'),
    });

    constructor() {
        super();
        this.set({
            items: [],
            showCompleted: false,
        });

        this.connect('showCompleted', this.actions.updateShowCompleted$);
        this.connect('items', this.actions.createItem$, ({ items }, params) =>
            insert(items, createTodoItem(params))
        );
        this.connect(
            'items',
            this.actions.updateCompleted$,
            ({ items }, { id, completed }) =>
                patchItemById(items, id, { completed })
        );
        this.connect('items', this.actions.completeAll$, (state) =>
            state.items.map((item) => setProp(item, 'completed', true))
        );
        this.connect('items', this.actions.uncompleteAll$, (state) =>
            state.items.map((item) => setProp(item, 'completed', false))
        );
        this.connect('items', getMockedTodoItems(), (state, items) =>
            insert(state.items, items)
        );
    }

    override ngOnDestroy() {
        this.actionFactory.destroy();
        super.ngOnDestroy();
    }
}
