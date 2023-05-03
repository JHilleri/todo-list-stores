import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { UiComponentsModule } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';
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
export class SignalComponent implements OnInit, OnDestroy {
    private readonly todoService = inject(TodoService);
    private readonly categoryService = inject(CategoryService);
    private readonly categories$ = this.categoryService.getCategories().pipe(catchError(() => of(new Array<string>())));

    private destroy$ = new Subject<void>();

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

    // side effects

    private loadItems$ = this.todoService.getTodos().pipe(
        takeUntilDestroyed(),
        tap({
            next: (items) => {
                this.items.set(items);
                this.areItemsLoading.set(false);
            },
            error: (err) => {
                console.error(err);
                this.items.set([]);
                this.areItemsLoading.set(false);
            },
        })
    );

    ngOnInit(): void {
        this.loadItems$.subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // event handlers

    protected openDialogCreateItem() {
        this.isDialogCreateItemOpen.set(true);
    }

    protected dialogCreateItemClosed() {
        this.isDialogCreateItemOpen.set(false);
    }

    protected createItem(item: TodoItemCreationParams) {
        this.isUpdating.set(true);
        this.isDialogCreateItemOpen.set(false);
        this.todoService
            .createTodo(item)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (item) => {
                    this.items.update((items) => [...items, item]);
                    this.isUpdating.set(false);
                },
                error: this.handleError,
            });
    }

    protected updateCompleted({ itemId, changes }: { itemId: TodoItem['id']; changes: Partial<TodoItem> }) {
        this.isUpdating.set(true);
        this.todoService
            .updateTodo(itemId, changes)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (item) => {
                    this.items.mutate((items) => {
                        items.splice(
                            items.findIndex((i) => i.id === item.id),
                            1,
                            item
                        );
                    });
                    this.isUpdating.set(false);
                },
                error: this.handleError,
            });
    }

    protected completeAll() {
        this.isUpdating.set(true);
        this.todoService
            .updateAllTodos({ completed: true })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (items) => {
                    this.items.set(items);
                    this.isUpdating.set(false);
                },
                error: this.handleError,
            });
    }

    protected uncompleteAll() {
        this.isUpdating.set(true);
        this.todoService
            .updateAllTodos({ completed: false })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (items) => {
                    this.items.set(items);
                    this.isUpdating.set(false);
                },
                error: this.handleError,
            });
    }

    protected deleteItem(id: TodoItem['id']) {
        this.isUpdating.set(true);
        this.todoService
            .deleteTodo(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (item) => {
                    this.items.mutate((items) => {
                        items.splice(items.indexOf(item), 1);
                    });
                    this.isUpdating.set(false);
                },
                error: this.handleError,
            });
    }

    protected updateShowCompleted(showCompleted: boolean) {
        this.showCompleted.set(showCompleted);
    }

    protected updateFilter(filter: string) {
        this.filter.set(filter);
    }

    private handleError = (err: unknown) => {
        console.error(err);
        this.isUpdating.set(false);
    };
}
