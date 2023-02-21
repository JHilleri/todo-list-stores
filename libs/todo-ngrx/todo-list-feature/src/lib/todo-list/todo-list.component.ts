import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    ButtonComponent,
    TodoCardComponent,
    TodoCreationComponent,
} from '@todo-lists/todo/ui';
import {
    createTodoItem,
    getMockedTodoItems,
    TodoItem,
    TodoItemCreationParams,
} from '@todo-lists/todo/util';
import { Subject } from 'rxjs';
import { delay, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'tdl-todo-list',
    standalone: true,
    imports: [
        CommonModule,
        TodoCreationComponent,
        TodoCardComponent,
        FormsModule,
        ButtonComponent,
    ],
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class TodoListComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    protected items: TodoItem[] = [];
    protected filteredItems: TodoItem[] = [];
    protected showCompleted = false;

    protected completedCount = 0;
    protected uncompletedCount = 0;

    private loadItems$ = getMockedTodoItems().pipe(
        delay(2000),
        tap((items) => {
            this.items.push(...items);
            this.updateCounts();
            this.updateFilteredItems();
        })
    );

    ngOnInit(): void {
        this.loadItems$.pipe(takeUntil(this.destroy$)).subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    protected createItem(item: TodoItemCreationParams) {
        this.items.push(createTodoItem(item));
        this.updateFilteredItems();
    }

    protected updateCompleted(item: TodoItem, isCompleted: boolean) {
        item.completed = isCompleted;
        this.updateCounts();
        this.updateFilteredItems();
    }

    protected completeAll() {
        this.items.forEach((item) => (item.completed = true));
        this.updateCounts();
        this.updateFilteredItems();
    }

    protected unCompleteAll() {
        this.items.forEach((item) => (item.completed = false));
        this.updateCounts();
        this.updateFilteredItems();
    }

    protected trackBy = (_: number, item: TodoItem) => item.id;

    private updateCounts() {
        this.completedCount = this.items.filter(
            (item) => item.completed
        ).length;
        this.uncompletedCount = this.items.filter(
            (item) => !item.completed
        ).length;
    }

    protected updateShowCompleted(showCompleted: boolean) {
        this.showCompleted = showCompleted;
        this.updateFilteredItems();
    }

    private updateFilteredItems() {
        this.filteredItems = this.items.filter(
            (item) => this.showCompleted || !item.completed
        );
    }
}
