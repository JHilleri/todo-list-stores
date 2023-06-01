import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { LoadingComponent, TodoListComponent } from '@todo-lists/todo/ui';
import { filterTodoItems, TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { Observable, tap } from 'rxjs';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'todo-lists-imperative',
    standalone: true,
    templateUrl: './imperative.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [CommonModule, LoadingComponent, TodoListComponent],
})
export class ImperativeComponent implements OnInit {
    private readonly todoService = inject(TodoService);
    private readonly categoryService = inject(CategoryService);
    private readonly destroyRef = inject(DestroyRef);

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
        this.todoService
            .getTodos()
            .pipe(takeUntilDestroyed(this.destroyRef))
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
        this.categoryService
            .getCategories()
            .pipe(takeUntilDestroyed(this.destroyRef))
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
        this.updateIsLoading();
    }

    // event handlers
    protected openDialogCreateItem() {
        this.isDialogCreateItemOpen = true;
    }

    protected dialogCreateItemClosed() {
        this.isDialogCreateItemOpen = false;
    }

    protected createItem(item: TodoItemCreationParams) {
        this.isDialogCreateItemOpen = false;
        this.handleQueryWithLoading(this.todoService.createTodo(item), {
            next: (item) => this.items.push(item),
        });
    }

    protected updateCompleted(params: { id: TodoItem['id']; value: Partial<TodoItem> }) {
        this.handleQueryWithLoading(this.todoService.updateTodo(params), {
            next: (item) =>
                this.items.splice(
                    this.items.findIndex((i) => i.id === item.id),
                    1,
                    item
                ),
        });
    }

    protected completeAll() {
        this.handleQueryWithLoading(this.todoService.updateAllTodos({ completed: true }), {
            next: (items) => (this.items = items),
        });
    }

    protected uncompleteAll() {
        this.handleQueryWithLoading(this.todoService.updateAllTodos({ completed: false }), {
            next: (items) => (this.items = items),
        });
    }

    protected deleteItem(id: TodoItem['id']) {
        this.handleQueryWithLoading(this.todoService.deleteTodo(id), {
            next: (itemId) => (this.items = this.items.filter((it) => it.id !== itemId)),
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
        this.filteredItems = filterTodoItems(this.items, {
            showCompleted: this.showCompleted,
            filter: this.filter,
        });
    }

    protected updateIsLoading() {
        this.isLoading = this.areItemsLoading || this.areCategoriesLoading;
    }

    // utils
    private handleQueryWithLoading<T>(query: Observable<T>, { next }: { next: (value: T) => void }) {
        this.isUpdating = true;
        this.updateIsLoading();
        query
            .pipe(
                tap({
                    next: (value) => {
                        next(value);
                        this.updateCounts();
                        this.updateFilteredItems();
                    },
                    error: (err: unknown) => {
                        console.error(err);
                        this.isUpdating = false;
                        this.updateIsLoading();
                    },
                    finalize: () => {
                        this.isUpdating = false;
                        this.updateIsLoading();
                    },
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }
}
