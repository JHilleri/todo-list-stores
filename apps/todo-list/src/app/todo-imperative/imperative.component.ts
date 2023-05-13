import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiComponentsModule } from '@todo-lists/todo/ui';
import { filterTodoItems, TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';

@Component({
    selector: 'todo-lists-imperative',
    standalone: true,
    templateUrl: './imperative.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [CommonModule, FormsModule, UiComponentsModule],
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
        this.handleQueryWithLoading(this.todoService.createTodo(item), {
            next: (item) => this.items.push(item),
            before: () => (this.isDialogCreateItemOpen = false),

        });
    }

    protected updateCompleted({ itemId, changes }: { itemId: TodoItem['id']; changes: Partial<TodoItem> }) {
        this.handleQueryWithLoading(this.todoService.updateTodo(itemId, changes), {
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
            next: (itemId) =>
                this.items.splice(
                    this.items.findIndex((it) => it.id === itemId),
                    1
                ),
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

    private handleQueryWithLoading<T>(query: Observable<T>, { next, before }: { next: (value: T) => void, before?: () => void }) {
        this.isUpdating = true;
        before?.();
        this.updateIsLoading();
        query.pipe(takeUntil(this.destroy$)).subscribe({
            next: (value) => {
                next(value);
                this.isUpdating = false;
                this.updateIsLoading();
                this.updateCounts();
                this.updateFilteredItems();
            },
            error: (err: unknown) => {
                console.error(err);
                this.isUpdating = false;
                this.updateIsLoading();
            },
        });
    }
}
