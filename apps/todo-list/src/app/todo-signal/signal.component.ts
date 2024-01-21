
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryService, TodoService } from '@todo-lists/todo/data-access';
import { LoadingComponent, TodoListComponent } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams, filterTodoItems } from '@todo-lists/todo/util';
import { tap } from 'rxjs';

@Component({
    selector: 'todo-lists-signal',
    standalone: true,
    templateUrl: './signal.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LoadingComponent, TodoListComponent],
})
export class SignalComponent implements OnInit {
    private readonly todoService = inject(TodoService);
    private readonly categoryService = inject(CategoryService);
    private readonly destroyRef = inject(DestroyRef);

    // state
    protected items = signal<TodoItem[]>([]);
    protected areItemsLoading = signal(true);
    protected categories = signal<string[]>([]);
    protected areCategoriesLoading = signal(true);
    protected isUpdating = signal(false);
    protected showCompleted = signal(false);
    protected filter = signal('');
    protected isDialogCreateItemOpen = signal(false);

    // derived state
    protected completedCount = computed(() => this.items().filter((item) => item.completed).length);
    protected uncompletedCount = computed(() => this.items().filter((item) => !item.completed).length);
    protected isLoading = computed(() => this.areItemsLoading() || this.areCategoriesLoading());
    protected filteredItems = computed(() => {
        return filterTodoItems(this.items(), {
            showCompleted: this.showCompleted(),
            filter: this.filter(),
        });
    });

    ngOnInit() {
        this.loadItems();
        this.loadCategories();
    }

    // handlers
    protected updateShowCompleted(value: boolean) {
        this.showCompleted.set(value);
    }

    protected updateFilter(value: string) {
        this.filter.set(value);
    }

    protected openDialogCreateItem() {
        this.isDialogCreateItemOpen.set(true);
    }

    protected closeDialogCreateItem() {
        this.isDialogCreateItemOpen.set(false);
    }

    protected createItem(params: TodoItemCreationParams) {
        this.isUpdating.set(true);
        this.isDialogCreateItemOpen.set(false);
        this.todoService
            .createTodo(params)
            .pipe(
                tap({
                    next: (item) => this.items.update((items) => [...items, item]),
                    error: (error) => console.error(error),
                    finalize: () => this.isUpdating.set(false),
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    protected updateItem(params: { id: TodoItem['id']; value: Partial<TodoItem> }) {
        this.isUpdating.set(true);
        this.todoService
            .updateTodo(params)
            .pipe(
                tap({
                    next: (item) => this.items.update((items) => items.map((it) => (it.id === item.id ? item : it))),
                    error: (error) => console.error(error),
                    finalize: () => this.isUpdating.set(false),
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    protected completeAll() {
        this.isUpdating.set(true);
        this.todoService
            .updateAllTodos({ completed: true })
            .pipe(
                tap({
                    next: this.items.set,
                    error: (error) => console.error(error),
                    finalize: () => this.isUpdating.set(false),
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    protected uncompleteAll() {
        this.isUpdating.set(true);
        this.todoService
            .updateAllTodos({ completed: false })
            .pipe(
                tap({
                    next: this.items.set,
                    error: (error) => console.error(error),
                    finalize: () => this.isUpdating.set(false),
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    protected deleteItem(itemId: TodoItem['id']) {
        this.isUpdating.set(true);
        this.todoService
            .deleteTodo(itemId)
            .pipe(
                tap({
                    next: (itemId) => this.items.update((items) => items.filter((item) => item.id !== itemId)),
                    error: (error) => console.error(error),
                    finalize: () => this.isUpdating.set(false),
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    private loadItems() {
        this.areItemsLoading.set(true);
        this.todoService
            .getTodos()
            .pipe(
                tap({
                    next: this.items.set,
                    error: (error) => console.error(error),
                    finalize: () => this.areItemsLoading.set(false),
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    private loadCategories() {
        this.areCategoriesLoading.set(true);
        this.categoryService
            .getCategories()
            .pipe(
                tap({
                    next: this.categories.set,
                    error: (error) => console.error(error),
                    finalize: () => this.areCategoriesLoading.set(false),
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }
}
