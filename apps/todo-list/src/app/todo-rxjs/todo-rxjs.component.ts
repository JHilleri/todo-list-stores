import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiComponentsModule } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { BehaviorSubject, combineLatest, Subject, using } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';

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

    // state
    protected items$ = new BehaviorSubject<TodoItem[]>([]);
    protected showCompleted$ = new BehaviorSubject<boolean>(false);
    protected isUpdating$ = new BehaviorSubject<boolean>(false);
    protected areItemsLoading$ = new BehaviorSubject<boolean>(true);
    protected categories$ = new BehaviorSubject<string[]>([]);
    protected areCategoriesLoading$ = new BehaviorSubject<boolean>(true);
    protected filter$ = new BehaviorSubject<string>('');

    // derived state
    private filteredItems$ = combineLatest({
        items: this.items$,
        showCompleted: this.showCompleted$,
        filter: this.filter$,
    }).pipe(
        map(({ items, showCompleted, filter }) =>
            items.filter((item) => {
                const matchCompleted = showCompleted || !item.completed;
                const matchFilter = filter
                    ? item.title.includes(filter) ||
                      item.text.includes(filter) ||
                      item.tags.some((tag) => tag.includes(filter))
                    : true;
                return matchCompleted && matchFilter;
            })
        )
    );
    private completedCount$ = this.items$.pipe(map((items) => items.filter((item) => item.completed).length));
    private uncompletedCount$ = this.items$.pipe(map((items) => items.filter((item) => !item.completed).length));
    private isLoading$ = combineLatest({
        areItemsLoading: this.areItemsLoading$,
        areCategoriesLoading: this.areCategoriesLoading$,
        isUpdating: this.isUpdating$,
    }).pipe(
        map(({ areItemsLoading, areCategoriesLoading, isUpdating }) => {
            return areItemsLoading || areCategoriesLoading || isUpdating;
        })
    );

    // side effects
    private loadItems$ = this.todoService.getTodos().pipe(
        tap((items) => {
            this.items$.next(items);
            this.areItemsLoading$.next(false);
        })
    );
    private loadCategories$ = this.categoryService.getCategories().pipe(
        tap((categories) => {
            this.categories$.next(categories);
            this.areCategoriesLoading$.next(false);
        })
    );

    // actions
    protected createTodoItem$ = new Subject<TodoItemCreationParams>();
    protected updateItemCompletion$ = new Subject<{ item: TodoItem; completed: boolean }>();
    protected completeAll$ = new Subject<void>();
    protected uncompleteAll$ = new Subject<void>();

    // effects
    protected efects$ = combineLatest([
        this.createTodoItem$.pipe(
            tap(() => this.isUpdating$.next(true)),
            mergeMap((item) => this.todoService.createTodo(item)),
            tap((item) => {
                this.items$.next([...this.items$.value, item]);
                this.isUpdating$.next(false);
            })
        ),
        this.updateItemCompletion$.pipe(
            tap(() => this.isUpdating$.next(true)),
            mergeMap(({ item, completed }) => this.todoService.updateTodo(item, { completed })),
            tap((result) => {
                this.items$.next(this.items$.value.map((i) => (i.id === result.id ? result : i)));
                this.isUpdating$.next(false);
            })
        ),
        this.completeAll$.pipe(
            tap(() => this.isUpdating$.next(true)),
            mergeMap(() => this.todoService.updateManyTodos(this.items$.value, { completed: true })),
            tap((items) => {
                this.items$.next(items);
                this.isUpdating$.next(false);
            })
        ),
        this.uncompleteAll$.pipe(
            tap(() => this.isUpdating$.next(true)),
            mergeMap(() => this.todoService.updateManyTodos(this.items$.value, { completed: false })),
            tap((items) => {
                this.items$.next(items);
                this.isUpdating$.next(false);
            })
        ),
        this.loadItems$,
        this.loadCategories$,
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
            })
    );
}
