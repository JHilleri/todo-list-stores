import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { LoadingComponent, TodoListComponent } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams, filterTodoItems } from '@todo-lists/todo/util';
import { CategoryService, TodoService } from '@todo-lists/todo/data-access';
import { createCollectionSignal } from './collection-signal';
import { createQueryHandler } from './create-query-handler';

@Component({
    selector: 'todo-lists-signal',
    standalone: true,
    templateUrl: './signal-advanced.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, LoadingComponent, TodoListComponent],
})
export default class SignalComponent implements OnInit {
    private readonly todoService = inject(TodoService);
    private readonly categoryService = inject(CategoryService);

    // state
    protected items = createCollectionSignal<TodoItem>((item) => item.id);
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

    // handlers
    protected loadItems = createQueryHandler({
        query: () => this.todoService.getTodos(),
        next: this.items.set,
        loadingStatus: this.areItemsLoading.set,
    });

    protected loadCategories = createQueryHandler({
        query: this.categoryService.getCategories,
        next: this.categories.set,
        loadingStatus: this.areCategoriesLoading.set,
    });

    protected createItem = createQueryHandler({
        query: (params: TodoItemCreationParams) => {
            this.isDialogCreateItemOpen.set(false);
            return this.todoService.createTodo(params);
        },
        next: this.items.push,
        loadingStatus: this.isUpdating.set,
    });

    protected updateItem = createQueryHandler({
        query: this.todoService.updateTodo,
        next: this.items.updateItem,
        loadingStatus: this.isUpdating.set,
    });

    protected updateAllCompletion = createQueryHandler({
        query: (completed: boolean) => this.todoService.updateAllTodos({ completed }),
        next: this.items.set,
        loadingStatus: this.isUpdating.set,
    });

    protected deleteItem = createQueryHandler({
        query: this.todoService.deleteTodo,
        next: this.items.remove,
        loadingStatus: this.isUpdating.set,
    });

    ngOnInit() {
        this.loadItems();
        this.loadCategories();
    }
}
