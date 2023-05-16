import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiComponentsModule } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams, filterTodoItems } from '@todo-lists/todo/util';
import { Subject, merge } from 'rxjs';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';
import { handleQuery } from './handle-query';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'todo-lists-signal',
    standalone: true,
    templateUrl: './signal.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, UiComponentsModule],
})
export class SignalComponent implements OnInit {
    private readonly todoService = inject(TodoService);
    private readonly categoryService = inject(CategoryService);

    protected readonly events = {
        createItem$: new Subject<TodoItemCreationParams>(),
        updateCompleted$: new Subject<{ itemId: TodoItem['id']; changes: Partial<TodoItem> }>(),
        completeAll$: new Subject<void>(),
        uncompleteAll$: new Subject<void>(),
        deleteItem$: new Subject<TodoItem['id']>(),
    };

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

    protected effects$ = merge(
        handleQuery(() => this.todoService.getTodos(), {
            loadingStatus: this.areItemsLoading,
            next: this.items.set,
        }),
        handleQuery(() => this.categoryService.getCategories(), {
            loadingStatus: this.areCategoriesLoading,
            next: this.categories.set,
        }),
        handleQuery((params) => this.todoService.createTodo(params), {
            trigger$: this.events.createItem$,
            loadingStatus: this.isUpdating,
            before: () => this.isDialogCreateItemOpen.set(false),
            next: (item) => this.items.update((items) => [...items, item]),
        }),
        handleQuery(({ itemId, changes }) => this.todoService.updateTodo(itemId, changes), {
            trigger$: this.events.updateCompleted$,
            loadingStatus: this.isUpdating,
            next: (item) => this.items.update((items) => items.map((it) => (it.id === item.id ? item : it))),
        }),
        handleQuery(() => this.todoService.updateAllTodos({ completed: true }), {
            trigger$: this.events.completeAll$,
            loadingStatus: this.isUpdating,
            next: this.items.set,
        }),
        handleQuery(() => this.todoService.updateAllTodos({ completed: false }), {
            trigger$: this.events.uncompleteAll$,
            loadingStatus: this.isUpdating,
            next: this.items.set,
        }),
        handleQuery((itemId) => this.todoService.deleteTodo(itemId), {
            trigger$: this.events.deleteItem$,
            loadingStatus: this.isUpdating,
            next: (itemId) => this.items.update((items) => items.filter((item) => item.id !== itemId)),
        })
    ).pipe(takeUntilDestroyed());

    ngOnInit() {
        this.effects$.subscribe();
    }
}
