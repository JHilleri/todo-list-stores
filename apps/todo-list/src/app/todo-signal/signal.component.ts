import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { UiComponentsModule } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { catchError, merge, Observable, of, Subject, switchMap, tap, map, pipe } from 'rxjs';
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
export class SignalComponent implements OnInit {
    private readonly todoService = inject(TodoService);
    private readonly categoryService = inject(CategoryService);
    private readonly categories$ = this.categoryService.getCategories().pipe(catchError(() => of(new Array<string>())));

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

    protected readonly events = {
        openItemCreationModal$: new Subject<void>(),
        closeItemCreateModal$: new Subject<void>(),
        createItem$: new Subject<TodoItemCreationParams>(),
        updateCompleted$: new Subject<{ itemId: TodoItem['id']; changes: Partial<TodoItem> }>(),
        completeAll$: new Subject<void>(),
        uncompleteAll$: new Subject<void>(),
        deleteItem$: new Subject<TodoItem['id']>(),
        updateFilter$: new Subject<string>(),
        updateShowCompleted$: new Subject<boolean>(),
    };

    private readonly updateItemsEffects$ = merge(
        this.todoService.getTodos().pipe(
            tap({
                error: console.error,
                finalize: () => this.areItemsLoading.set(false),
            })
        ),
        this.events.createItem$.pipe(
            handleItemQuery(this.isUpdating, {
                query: (item) => this.todoService.createTodo(item).pipe(map((result) => [...this.items(), result])),
                start: () => this.isDialogCreateItemOpen.set(false),
            })
        ),
        this.events.updateCompleted$.pipe(
            handleItemQuery(this.isUpdating, {
                query: ({ itemId, changes }) => this.todoService.updateTodo(itemId, changes),
                mapper: (item) => this.items().map((it) => (it.id === item.id ? item : it)),
            })
        ),
        this.events.completeAll$.pipe(
            handleItemQuery(this.isUpdating, {
                query: () => this.todoService.updateAllTodos({ completed: true }),
            })
        ),
        this.events.uncompleteAll$.pipe(
            handleItemQuery(this.isUpdating, {
                query: () => this.todoService.updateAllTodos({ completed: false }),
            })
        ),
        this.events.deleteItem$.pipe(
            handleItemQuery(this.isUpdating, {
                query: (itemId) => this.todoService.deleteTodo(itemId),
                mapper: (itemId) => this.items().filter((item) => item.id !== itemId),
            })
        )
    ).pipe(tap(this.items.set));

    private readonly effects = merge(
        this.events.openItemCreationModal$.pipe(tap(() => this.isDialogCreateItemOpen.set(true))),
        this.events.closeItemCreateModal$.pipe(tap(() => this.isDialogCreateItemOpen.set(false))),
        this.events.updateFilter$.pipe(tap(this.filter.set)),
        this.events.updateShowCompleted$.pipe(tap(this.showCompleted.set)),
        this.updateItemsEffects$
    ).pipe(takeUntilDestroyed());

    ngOnInit(): void {
        this.effects.subscribe();
    }
}

function handleItemQuery<I, T>(
    updatingSignal: WritableSignal<boolean>,
    config:
        | { query: (value: I) => Observable<T>; start?: () => void; mapper: (value: T) => TodoItem[] }
        | { query: (value: I) => Observable<TodoItem[]>; start?: () => void }
) {
    return pipe(
        switchMap((value: I) => {
            const observer = {
                subscribe: () => {
                    updatingSignal.set(true);
                    config.start?.();
                },
                finalize: () => updatingSignal.set(false),
            };
            if ('mapper' in config) {
                return config.query(value).pipe(map(config.mapper), tap(observer));
            }
            return config.query(value).pipe(tap(observer));
        }),
        catchError((error, caught) => {
            console.error(error);
            return caught;
        })
    );
}
