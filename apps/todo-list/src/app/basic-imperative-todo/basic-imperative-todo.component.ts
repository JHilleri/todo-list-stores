
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CategoryService, TodoService } from '@todo-lists/todo/data-access';
import { LoadingComponent, TodoListComponent } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'todo-lists-imperative',
    standalone: true,
    templateUrl: './basic-imperative-todo.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [TodoListComponent, LoadingComponent],
})
export class ImperativeComponent implements OnInit, OnDestroy {
    private todoService = inject(TodoService);
    private categoryService = inject(CategoryService);

    private destroy$ = new Subject<void>();

    // state
    protected items: TodoItem[] = [];
    protected showCompleted = false;
    protected filter = '';
    protected categories: string[] = [];
    protected areItemsLoading = true;
    protected areCategoriesLoading = true;
    protected isUpdating = false;
    protected isDialogCreateItemOpen = false;

    // derived state
    protected filteredItems: TodoItem[] = [];
    protected completedCount = 0;
    protected uncompletedCount = 0;
    protected isLoading = false;

    ngOnInit(): void {
        this.loadItems();
        this.loadCategories();
        this.updateIsLoading();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // event handlers
    protected openDialogCreateItem() {
        this.isDialogCreateItemOpen = true;
    }

    protected dialogCreateItemClosed() {
        this.isDialogCreateItemOpen = false;
    }

    protected createItem(item: TodoItemCreationParams) {
        this.isUpdating = true;
        this.isDialogCreateItemOpen = false;
        this.updateIsLoading();
        this.todoService
            .createTodo(item)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (item) => {
                    this.items.push(item);
                    this.isUpdating = false;
                    this.updateIsLoading();
                    this.updateCounts();
                    this.updateFilteredItems();
                },
                error: this.handleError,
            });
    }

    protected updateCompleted({ id, value }: { id: TodoItem['id']; value: Partial<TodoItem> }) {
        this.isUpdating = true;
        this.updateIsLoading();
        this.todoService
            .updateTodo({ id, value })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (item) => {
                    this.items.splice(
                        this.items.findIndex((i) => i.id === item.id),
                        1,
                        item
                    );
                    this.isUpdating = false;
                    this.updateIsLoading();
                    this.updateCounts();
                    this.updateFilteredItems();
                },
                error: this.handleError,
            });
    }

    protected completeAll() {
        this.isUpdating = true;
        this.updateIsLoading();
        this.todoService
            .updateAllTodos({ completed: true })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (items) => {
                    this.items = items;
                    this.isUpdating = false;
                    this.updateIsLoading();
                    this.updateCounts();
                    this.updateFilteredItems();
                },
                error: this.handleError,
            });
    }

    protected uncompleteAll() {
        this.isUpdating = true;
        this.updateIsLoading();
        this.todoService
            .updateAllTodos({ completed: false })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (items) => {
                    this.items = items;
                    this.isUpdating = false;
                    this.updateIsLoading();
                    this.updateCounts();
                    this.updateFilteredItems();
                },
                error: this.handleError,
            });
    }

    protected deleteItem(id: TodoItem['id']) {
        this.isUpdating = true;
        this.updateIsLoading();
        this.todoService
            .deleteTodo(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (itemId) => {
                    this.items.splice(
                        this.items.findIndex((it) => it.id === itemId),
                        1
                    );
                    this.isUpdating = false;
                    this.updateIsLoading();
                    this.updateCounts();
                    this.updateFilteredItems();
                },
                error: this.handleError,
            });
    }

    protected updateShowCompleted(showCompleted: boolean) {
        this.showCompleted = showCompleted;
        this.updateFilteredItems();
    }

    protected updateFilter(filter: string) {
        this.filter = filter;
        this.updateFilteredItems();
    }

    // update derived state
    private updateCounts() {
        if (this.isLoading) return;
        this.completedCount = this.items.filter((item) => item.completed).length;
        this.uncompletedCount = this.items.filter((item) => !item.completed).length;
    }

    private updateFilteredItems() {
        if (this.isLoading) return;
        this.filteredItems = this.items.filter((item) => {
            const matchCompleted = this.showCompleted || !item.completed;
            const matchFilter = this.filter
                ? item.title.includes(this.filter) ||
                  item.text.includes(this.filter) ||
                  item.tags.some((tag) => tag.includes(this.filter))
                : true;
            return matchCompleted && matchFilter;
        });
    }

    protected updateIsLoading() {
        this.isLoading = this.areItemsLoading || this.areCategoriesLoading;
    }

    private handleError = (err: unknown) => {
        console.error(err);
        this.isUpdating = false;
        this.updateIsLoading();
    };

    // initial load
    private loadCategories() {
        this.categoryService
            .getCategories()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (categories) => {
                    this.categories = categories;
                    this.areCategoriesLoading = false;
                    this.updateIsLoading();
                },
                error: (err) => {
                    console.error(err);
                    this.categories = [];
                    this.areCategoriesLoading = false;
                    this.updateIsLoading();
                },
            });
    }

    private loadItems() {
        this.todoService
            .getTodos()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (items) => {
                    this.items = items;
                    this.areItemsLoading = false;
                    this.updateIsLoading();
                    this.updateCounts();
                    this.updateFilteredItems();
                },
                error: (err) => {
                    console.error(err);
                    this.items = [];
                    this.areItemsLoading = false;
                    this.updateIsLoading();
                    this.updateCounts();
                    this.updateFilteredItems();
                },
            });
    }
}
