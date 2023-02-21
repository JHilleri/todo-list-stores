import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    TodoCreationComponent,
    ButtonComponent,
    TodoCardGridComponent,
} from '@todo-lists/todo/ui';
import {
    createTodoItem,
    getMockedTodoItems,
    TodoItem,
    TodoItemCreationParams,
    UpdateTodoCompletionParams,
} from '@todo-lists/todo/util';
import { BehaviorSubject, combineLatest, using } from 'rxjs';
import { debounceTime, delay, map, tap } from 'rxjs/operators';

@Component({
    selector: 'todo-lists-todo-rxjs',
    standalone: true,
    imports: [
        CommonModule,
        TodoCreationComponent,
        FormsModule,
        ButtonComponent,
        TodoCardGridComponent,
    ],
    templateUrl: './todo-rxjs.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoRxjsComponent {
    // state
    protected items$ = new BehaviorSubject<TodoItem[]>([]);
    protected showCompleted$ = new BehaviorSubject<boolean>(false);

    // derived state
    protected filteredItems$ = combineLatest({
        items: this.items$,
        showCompleted: this.showCompleted$,
    }).pipe(
        map(({ items, showCompleted }) =>
            items.filter((item) => showCompleted || !item.completed)
        )
    );
    protected completedCount$ = this.items$.pipe(
        map((items) => items.filter((item) => item.completed).length)
    );
    protected uncompletedCount$ = this.items$.pipe(
        map((items) => items.filter((item) => !item.completed).length)
    );

    // side effects
    private loadItems$ = getMockedTodoItems().pipe(
        delay(2000),
        tap((items) => {
            this.items$.next(items);
        })
    );

    protected vm$ = using(
        () => this.loadItems$.subscribe(),
        () =>
            combineLatest({
                filteredItems: this.filteredItems$,
                completedCount: this.completedCount$,
                uncompletedCount: this.uncompletedCount$,
                showCompleted: this.showCompleted$,
            }).pipe(
                debounceTime(0), // prevent glitch
                tap((vm) => console.log('rxjs vm', vm))
            )
    );

    protected createItem(item: TodoItemCreationParams) {
        this.items$.next([...this.items$.value, createTodoItem(item)]);
    }

    protected updateShowCompleted(showCompleted: boolean) {
        this.showCompleted$.next(showCompleted);
    }

    protected updateCompleted({ id, completed }: UpdateTodoCompletionParams) {
        this.items$.next(
            this.items$.value.map((item) =>
                item.id === id ? { ...item, completed } : item
            )
        );
    }

    protected completeAll() {
        this.items$.next(
            this.items$.value.map((item) => ({ ...item, completed: true }))
        );
    }

    protected unCompleteAll() {
        this.items$.next(
            this.items$.value.map((item) => ({ ...item, completed: false }))
        );
    }
}
