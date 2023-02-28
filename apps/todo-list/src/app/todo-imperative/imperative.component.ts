import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    ButtonComponent,
    FiltersComponent,
    LoadingComponent,
    LogStateDirective,
    TodoCardGridComponent,
    TodoCreationComponent,
} from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';

@Component({
    selector: 'todo-lists-imperative',
    standalone: true,
    templateUrl: './imperative.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [
        CommonModule,
        TodoCreationComponent,
        FormsModule,
        ButtonComponent,
        TodoCardGridComponent,
        FiltersComponent,
        LogStateDirective,
        LoadingComponent,
    ],
})
export class ImperativeComponent implements OnInit, OnDestroy {
    todoService = inject(TodoService);
    categoryService = inject(CategoryService);

    private destroy$ = new Subject<void>();

    // state
    protected items: TodoItem[] = [];
    protected showCompleted = false;
    protected filter = '';
    protected categories: string[] = [];
    protected selectedCategory = '';
    protected areItemsLoading = true;
    protected areCategoriesLoading = true;
    protected isUpdating = false;

    // derived state
    protected filteredItems: TodoItem[] = [];
    protected completedCount = 0;
    protected uncompletedCount = 0;
    protected isLoading = false;

    // side effects
    private loadItems$ = this.todoService.getTodos().pipe(
        tap((items) => {
            this.items = items;
            this.areItemsLoading = false;
            this.updateIsLoading();
            this.updateCounts();
            this.updateFilteredItems();
        })
    );

    private loadCategories$ = this.categoryService.getCategories().pipe(
        tap((categories) => {
            this.categories = categories;
            this.areCategoriesLoading = false;
            this.updateIsLoading();
        })
    );

    ngOnInit(): void {
        this.loadItems$.pipe(takeUntil(this.destroy$)).subscribe();
        this.loadCategories$.pipe(takeUntil(this.destroy$)).subscribe();
        this.updateIsLoading();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // update state

    protected createItem(item: TodoItemCreationParams) {
        this.isUpdating = true;
        this.updateIsLoading();
        this.todoService
            .createTodo(item)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.items.push(item);
                this.isUpdating = false;
                this.updateIsLoading();
                this.updateCounts();
                this.updateFilteredItems();
            });
    }

    protected updateCompleted({ item, completed }: { item: TodoItem; completed: boolean }) {
        this.isUpdating = true;
        this.updateIsLoading();
        this.todoService
            .updateTodo(item, { completed })
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.items.splice(this.items.indexOf(item), 1, item);
                this.isUpdating = false;
                this.updateIsLoading();
                this.updateCounts();
                this.updateFilteredItems();
            });
    }

    protected completeAll() {
        this.isUpdating = true;
        this.updateIsLoading();
        this.todoService
            .updateManyTodos(this.items, { completed: true })
            .pipe(takeUntil(this.destroy$))
            .subscribe((items) => {
                this.items = items;
                this.isUpdating = false;
                this.updateIsLoading();
                this.updateCounts();
                this.updateFilteredItems();
            });
    }

    protected unCompleteAll() {
        this.isUpdating = true;
        this.updateIsLoading();
        this.todoService
            .updateManyTodos(this.items, { completed: false })
            .pipe(takeUntil(this.destroy$))
            .subscribe((items) => {
                this.items = items;
                this.isUpdating = false;
                this.updateIsLoading();
                this.updateCounts();
                this.updateFilteredItems();
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
        this.isLoading = this.areItemsLoading || this.areCategoriesLoading || this.isUpdating;
    }
}
