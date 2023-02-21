import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
    createTodoItem,
    getMockedTodoItems,
    TodoItem,
    TodoItemCreationParams,
    UpdateTodoCompletionParams,
} from '@todo-lists/todo/util';
import { delay } from 'rxjs/operators';

interface TodoState extends EntityState<TodoItem> {
    showCompleted: boolean;
}

const adapter = createEntityAdapter<TodoItem>();

@Injectable()
export class TodoStore extends ComponentStore<TodoState> {
    constructor() {
        super(adapter.getInitialState({ showCompleted: false }));
        this.addItems(getMockedTodoItems().pipe(delay(2000)));
    }

    readonly createItem = this.updater(
        (state, params: TodoItemCreationParams) => {
            return adapter.addOne(createTodoItem(params), state);
        }
    );

    readonly updateShowCompleted = this.updater(
        (state, showCompleted: boolean) => {
            return { ...state, showCompleted };
        }
    );

    readonly updateCompleted = this.updater(
        (state, { id, completed }: UpdateTodoCompletionParams) => {
            return adapter.updateOne({ id, changes: { completed } }, state);
        }
    );

    readonly completeAll = this.updater((state) => {
        return adapter.map((item) => ({ ...item, completed: true }), state);
    });

    readonly uncompleteAll = this.updater((state) => {
        return adapter.map((item) => ({ ...item, completed: false }), state);
    });

    readonly addItems = this.updater((state, items: TodoItem[]) => {
        return adapter.addMany(items, state);
    });

    private readonly allItems$ = this.select(this.state$, (state) => {
        return adapter.getSelectors().selectAll(state);
    });

    readonly showCompleted$ = this.select(this.state$, (state) => {
        return state.showCompleted;
    });

    readonly filteredItems$ = this.select(
        this.allItems$,
        this.showCompleted$,
        (items, showCompleted) => {
            return items.filter((item) => showCompleted || !item.completed);
        }
    );

    readonly completedCount$ = this.select(
        this.allItems$,
        (items) => items.filter((item) => item.completed).length
    );

    readonly uncompletedCount$ = this.select(
        this.allItems$,
        (items) => items.filter((item) => !item.completed).length
    );

    readonly vm$ = this.select({
        filteredTodos: this.filteredItems$,
        completedCount: this.completedCount$,
        uncompletedCount: this.uncompletedCount$,
        showCompleted: this.showCompleted$,
    });
}
