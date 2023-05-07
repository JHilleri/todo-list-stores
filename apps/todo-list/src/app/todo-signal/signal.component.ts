import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { UiComponentsModule } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { catchError, Observable, of, Subject, switchMap, tap, EMPTY, finalize } from 'rxjs';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';

@Component({
    selector: 'todo-lists-signal',
    standalone: true,
    templateUrl: './signal.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [CommonModule, FormsModule, UiComponentsModule],
})
export class SignalComponent {
    private readonly todoService = inject(TodoService);
    private readonly categoryService = inject(CategoryService);
    private readonly categories$ = this.categoryService.getCategories().pipe(catchError(() => of(new Array<string>())));

    protected readonly events = {
        createItem$: new Subject<TodoItemCreationParams>(),
        updateCompleted$: new Subject<{ itemId: TodoItem['id']; changes: Partial<TodoItem> }>(),
        completeAll$: new Subject<void>(),
        uncompleteAll$: new Subject<void>(),
        deleteItem$: new Subject<TodoItem['id']>(),
    };

    // state
    protected items = signal<TodoItem[]>([]);
    protected showCompleted = signal(false);
    protected filter = signal('');
    protected categories = toSignal(this.categories$);
    protected areItemsLoading = signal(true);
    protected isUpdating = signal(false);
    protected isDialogCreateItemOpen = signal(false);

    // derived state
    protected filteredItems = computed(() => {
        if (this.isLoading()) return [];
        return this.items().filter((item) => {
            const matchCompleted = this.showCompleted() || !item.completed;
            const matchFilter = this.filter
                ? item.title.includes(this.filter()) ||
                  item.text.includes(this.filter()) ||
                  item.tags.some((tag) => tag.includes(this.filter()))
                : true;
            return matchCompleted && matchFilter;
        });
    });
    protected completedCount = computed(() => this.items().filter((item) => item.completed).length);
    protected uncompletedCount = computed(() => this.items().filter((item) => !item.completed).length);
    protected isLoading = computed(() => this.areItemsLoading() || this.categories() === undefined);

    constructor() {
        handleQuery(() => this.todoService.getTodos(), {
            loadingStatus: this.areItemsLoading,
            next: this.items.set,
        });
        handleQuery((params) => this.todoService.createTodo(params), {
            trigger$: this.events.createItem$,
            loadingStatus: this.isUpdating,
            before: () => this.isDialogCreateItemOpen.set(false),
            next: (item) => this.items.update((items) => [...items, item]),
        });
        handleQuery(({ itemId, changes }) => this.todoService.updateTodo(itemId, changes), {
            trigger$: this.events.updateCompleted$,
            loadingStatus: this.isUpdating,
            next: (item) => this.items.update((items) => items.map((it) => (it.id === item.id ? item : it))),
        });
        handleQuery(() => this.todoService.updateAllTodos({ completed: true }), {
            trigger$: this.events.completeAll$,
            loadingStatus: this.isUpdating,
            next: this.items.set,
        });
        handleQuery(() => this.todoService.updateAllTodos({ completed: false }), {
            trigger$: this.events.uncompleteAll$,
            loadingStatus: this.isUpdating,
            next: this.items.set,
        });
        handleQuery((itemId) => this.todoService.deleteTodo(itemId), {
            trigger$: this.events.deleteItem$,
            loadingStatus: this.isUpdating,
            next: (itemId) => this.items.update((items) => items.filter((item) => item.id !== itemId)),
        });
    }
}

function handleQuery<T, R>(
    query: (value: T) => Observable<R>,
    config: {
        loadingStatus: WritableSignal<boolean>;
        trigger$?: Observable<T>;
        before?: () => void;
        next: (result: R) => void;
    }
) {
    return (config.trigger$ ?? (of(undefined) as Observable<T>))
        .pipe(
            switchMap((value) => {
                config.loadingStatus.set(true);
                config.before?.();
                return query(value).pipe(
                    finalize(() => config.loadingStatus.set(false)),
                    tap(config.next),
                    catchError((error: unknown) => {
                        console.error(error);
                        return EMPTY;
                    })
                );
            }),
            takeUntilDestroyed()
        )
        .subscribe();
}
