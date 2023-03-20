import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LetModule } from '@ngrx/component';
import { provideComponentStore } from '@ngrx/component-store';
import { UiComponentsModule } from '@todo-lists/todo/ui';
import { TodoStore } from './todo.store';

@Component({
    selector: 'todo-lists-todo-ngrx-component-store',
    standalone: true,
    imports: [LetModule, NgIf, FormsModule, UiComponentsModule],
    templateUrl: './todo-ngrx-component-store.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideComponentStore(TodoStore)],
})
export class TodoNgrxComponentStoreComponent {
    private store = inject(TodoStore);

    protected vm$ = this.store.vm$;

    protected createItem = this.store.createItem;
    protected updateFilter = this.store.updateFilter;
    protected updateShowCompleted = this.store.updateShowCompleted;
    protected updateCompleted = this.store.updateCompleted;
    protected completeAll = this.store.completeAll;
    protected uncompleteAll = this.store.uncompleteAll;
    protected dialogCreateItemOpened = this.store.dialogCreateItemOpened;
    protected dialogCreateItemClosed = this.store.dialogCreateItemClosed;
}
