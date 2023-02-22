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
    TodoCardGridComponent,
    TodoCreationComponent,
} from '@todo-lists/todo/ui';
import {
    createTodoItem,
    getMockedTodoItems,
    TodoItem,
    TodoItemCreationParams,
    UpdateTodoCompletionParams,
} from '@todo-lists/todo/util';
import { Subject } from 'rxjs';
import { delay, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'todo-lists-imperative',
    standalone: true,
    imports: [
        CommonModule,
        TodoCreationComponent,
        FormsModule,
        ButtonComponent,
        TodoCardGridComponent,
    ],
    templateUrl: './imperative.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImperativeComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    // state
    protected items: TodoItem[] = [];
    protected showCompleted = false;

    // derived state
    protected filteredItems: TodoItem[] = [];
    protected completedCount = 0;
    protected uncompletedCount = 0;

    // side effects
    private loadItems$ = getMockedTodoItems().pipe(
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

    protected updateCompleted({ id, completed }: UpdateTodoCompletionParams) {
        const todoItem = this.items.find((item) => item.id === id);
        if (!todoItem) return;
        todoItem.completed = completed;
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
