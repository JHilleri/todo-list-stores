import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiComponentsModule } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams, filterTodoItems } from '@todo-lists/todo/util';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';
import { createCollectionSignal } from './array-signal';
import { createQueryHandler } from './create-query-handler';

@Component({
    selector: 'todo-lists-signal',
    standalone: true,
    templateUrl: './signal-advanced.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, UiComponentsModule],
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
    protected isLoading = computed(() => this.areItemsLoading() || this.categories() === undefined);
    protected filteredItems = computed(() => {
        return filterTodoItems(this.items(), {
            showCompleted: this.showCompleted(),
            filter: this.filter(),
        });
    });

    // handlers
    protected loadItems = createQueryHandler({
        query: () => this.todoService.getTodos(),
        then: this.items.set,
        loadingStatus: this.areItemsLoading,
    });

    protected loadCategories = createQueryHandler({
        query: () => this.categoryService.getCategories(),
        then: this.categories.set,
        loadingStatus: this.areCategoriesLoading,
    });

    protected createItem = createQueryHandler({
        query: (params: TodoItemCreationParams) => {
            this.isDialogCreateItemOpen.set(false);
            return this.todoService.createTodo(params);
        },
        then: this.items.add,
        loadingStatus: this.isUpdating,
    });

    protected updateItem = createQueryHandler({
        query: ({ itemId, changes }: { itemId: TodoItem['id']; changes: Partial<TodoItem> }) =>
            this.todoService.updateTodo(itemId, changes),
        then: this.items.updateItem,
        loadingStatus: this.isUpdating,
    });

    protected updateAllCompletion = createQueryHandler({
        query: (completed: boolean) => this.todoService.updateAllTodos({ completed }),
        then: this.items.set,
        loadingStatus: this.isUpdating,
    });

    protected deleteItem = createQueryHandler({
        query: (itemId: TodoItem['id']) => this.todoService.deleteTodo(itemId),
        then: this.items.remove,
        loadingStatus: this.isUpdating,
    });

    ngOnInit() {
        this.loadItems();
        this.loadCategories();
    }
}
