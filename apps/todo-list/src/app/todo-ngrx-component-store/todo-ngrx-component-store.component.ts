import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { LoadingComponent, TodoListComponent } from '@todo-lists/todo/ui';
import { TodoStore } from './todo.store';

@Component({
    selector: 'todo-lists-todo-ngrx-component-store',
    standalone: true,
    imports: [NgIf, LoadingComponent, TodoListComponent],
    templateUrl: './todo-ngrx-component-store.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideComponentStore(TodoStore)],
})
export class TodoNgrxComponentStoreComponent implements OnInit {
    private store = inject(TodoStore);

    protected isLoading = this.store.isLoading;
    protected showCompleted = this.store.showCompleted;
    protected filter = this.store.filter;
    protected filteredTodos = this.store.filteredItems;
    protected completedCount = this.store.completedCount;
    protected uncompletedCount = this.store.uncompletedCount;
    protected categories = this.store.categories;
    protected isUpdating = this.store.isUpdating;
    protected isDialogCreateItemOpen = this.store.isDialogCreateItemOpen;

    protected createItem = this.store.createItem;
    protected updateFilter = this.store.updateFilter;
    protected updateShowCompleted = this.store.updateShowCompleted;
    protected updateCompleted = this.store.updateCompleted;
    protected completeAll = this.store.completeAll;
    protected uncompleteAll = this.store.uncompleteAll;
    protected dialogCreateItemOpened = this.store.dialogCreateItemOpened;
    protected dialogCreateItemClosed = this.store.dialogCreateItemClosed;

    ngOnInit(): void {
        this.store.init();
    }
}
