import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiComponentsModule } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams, filterTodoItems } from '@todo-lists/todo/util';
import { BehaviorSubject, combineLatest, Subject, using } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';
import { handleQuery } from './handle-query';

@Component({
    selector: 'todo-lists-todo-rxjs',
    standalone: true,
    imports: [NgIf, AsyncPipe, FormsModule, UiComponentsModule],
    templateUrl: './todo-rxjs.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoRxjsComponent {
    private todoService = inject(TodoService);
    private categoryService = inject(CategoryService);

    // actions
    protected createTodoItem$ = new Subject<TodoItemCreationParams>();
    protected updateItemCompletion$ = new Subject<{ id: TodoItem['id']; value: Partial<TodoItem> }>();
    protected completeAll$ = new Subject<void>();
    protected uncompleteAll$ = new Subject<void>();

    // state
    protected items$ = new BehaviorSubject<TodoItem[]>([]);
    protected areItemsLoading$ = new BehaviorSubject<boolean>(true);
    protected categories$ = new BehaviorSubject<string[]>([]);
    protected areCategoriesLoading$ = new BehaviorSubject<boolean>(true);
    protected isUpdating$ = new BehaviorSubject<boolean>(false);
    protected showCompleted$ = new BehaviorSubject<boolean>(false);
    protected filter$ = new BehaviorSubject<string>('');
    protected isDialogCreateItemOpen$ = new BehaviorSubject<boolean>(false);

    // derived state
    private completedCount$ = this.items$.pipe(map((items) => items.filter((item) => item.completed).length));
    private uncompletedCount$ = this.items$.pipe(map((items) => items.filter((item) => !item.completed).length));
    private isLoading$ = combineLatest({
        areItemsLoading: this.areItemsLoading$,
        areCategoriesLoading: this.areCategoriesLoading$,
    }).pipe(
        map(({ areItemsLoading, areCategoriesLoading }) => {
            return areItemsLoading || areCategoriesLoading;
        })
    );
    private filteredItems$ = combineLatest({
        items: this.items$,
        showCompleted: this.showCompleted$,
        filter: this.filter$,
    }).pipe(
        map(({ items, showCompleted, filter }) => {
            return filterTodoItems(items, {
                showCompleted,
                filter,
            });
        })
    );

    // effects
    protected efects$ = combineLatest([
        handleQuery(() => this.todoService.getTodos(), {
            loadingStatus: this.areItemsLoading$,
            next: (items) => this.items$.next(items),
        }),
        handleQuery(() => this.categoryService.getCategories(), {
            loadingStatus: this.areCategoriesLoading$,
            next: (categories) => this.categories$.next(categories),
        }),
        handleQuery((item) => this.todoService.createTodo(item), {
            trigger$: this.createTodoItem$,
            loadingStatus: this.isUpdating$,
            next: (item) => this.items$.next([...this.items$.value, item]),
            before: () => this.isDialogCreateItemOpen$.next(false),
        }),
        handleQuery(this.todoService.updateTodo, {
            trigger$: this.updateItemCompletion$,
            loadingStatus: this.isUpdating$,
            next: (result) => {
                this.items$.next(this.items$.value.map((i) => (i.id === result.id ? result : i)));
            },
        }),
        handleQuery(() => this.todoService.updateAllTodos({ completed: true }), {
            trigger$: this.completeAll$,
            loadingStatus: this.isUpdating$,
            next: (items) => this.items$.next(items),
        }),
        handleQuery(() => this.todoService.updateAllTodos({ completed: false }), {
            trigger$: this.uncompleteAll$,
            loadingStatus: this.isUpdating$,
            next: (items) => this.items$.next(items),
        }),
    ]);

    protected vm$ = using(
        () => this.efects$.subscribe(),
        () =>
            combineLatest({
                filteredItems: this.filteredItems$,
                completedCount: this.completedCount$,
                uncompletedCount: this.uncompletedCount$,
                showCompleted: this.showCompleted$,
                isLoading: this.isLoading$,
                categories: this.categories$,
                filter: this.filter$,
                isUpdating: this.isUpdating$,
                isDialogCreateItemOpen: this.isDialogCreateItemOpen$,
            })
    );
}
