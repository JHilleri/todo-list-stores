import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from '../filters/filters.component';
import { TodoCardGridComponent } from '../todo-card-grid/todo-card-grid.component';
import { DialogComponent } from '../dialog/dialog.component';
import { TodoCreationComponent } from '../todo-creation/todo-creation.component';
import { LoadingComponent } from '../loading/loading.component';
import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'tdl-todo-list',
    standalone: true,
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss'],
    imports: [
        CommonModule,
        FiltersComponent,
        TodoCardGridComponent,
        DialogComponent,
        TodoCreationComponent,
        LoadingComponent,
        ButtonComponent,
    ],
})
export class TodoListComponent {
    @Input() public showCompleted = false;
    @Input() public filter = '';
    @Input() public isUpdating = false;
    @Input() public completedCount = 0;
    @Input() public uncompletedCount = 0;
    @Input() public filteredItems: TodoItem[] = [];
    @Input() public categories: string[] = [];
    @Input() public isDialogCreateItemOpen = false;
    @Input() public isLoading = false;

    @Output() public updateShowCompleted = new EventEmitter<boolean>();
    @Output() public updateFilter = new EventEmitter<string>();
    @Output() public openDialogCreateItem = new EventEmitter<void>();
    @Output() public completeAll = new EventEmitter<void>();
    @Output() public uncompleteAll = new EventEmitter<void>();
    @Output() public updadteItem = new EventEmitter<{
        id: TodoItem['id'];
        value: Partial<TodoItem>;
    }>();
    @Output() public deleteItem = new EventEmitter<TodoItem['id']>();
    @Output() public createItem = new EventEmitter<TodoItemCreationParams>();
    @Output() public dialogCreateItemClosed = new EventEmitter<void>();
}
