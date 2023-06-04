import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { LoadingComponent, TodoListComponent } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { Subject } from 'rxjs';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';
import { ErrorService } from './error.service';
import { createQuery, withEvents, withRequests } from './events';
import { createActionGroup } from './events/create-action-group';
import { createTodoStore } from './create-todo-store';

@Component({
    selector: 'todo-lists-reactive-signal',
    standalone: true,
    templateUrl: './reactive-signal.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, LoadingComponent, TodoListComponent],
})
export default class ReactiveSignalComponent implements OnInit {
    private readonly todoService = inject(TodoService);
    private readonly categoryService = inject(CategoryService);
    private readonly errorService = inject(ErrorService);

    protected actions = createActionGroup(
        withEvents({
            openCreateItemDialog$: new Subject<void>(),
            closeCreateItemDialog$: new Subject<void>(),
            updateShowCompleted$: new Subject<boolean>(),
            createItem$: new Subject<TodoItemCreationParams>(),
            updateCompleted$: new Subject<{ id: TodoItem['id']; value: Partial<TodoItem> }>(),
            completeAll$: new Subject<void>(),
            uncompleteAll$: new Subject<void>(),
            deleteItem$: new Subject<TodoItem['id']>(),
        }),
        withRequests(({ init$, createItem$, completeAll$, uncompleteAll$, deleteItem$, updateCompleted$ }) => ({
            loadItems: createQuery(init$, this.todoService.getTodos),
            loadCategories: createQuery(init$, this.categoryService.getCategories),
            createItem: createQuery(createItem$, this.todoService.createTodo),
            updateItem: createQuery(updateCompleted$, this.todoService.updateTodo),
            completeAll: createQuery(completeAll$, () => this.todoService.updateAllTodos({ completed: true })),
            uncompleteAll: createQuery(uncompleteAll$, () => this.todoService.updateAllTodos({ completed: false })),
            deleteItem: createQuery(deleteItem$, this.todoService.deleteTodo),
        }))
    );

    protected store = createTodoStore({
        items: {
            values: [],
            isLoading: false,
            isUpdating: false,
        },
        categories: {
            values: [],
            isLoading: false,
        },
        showCompleted: false,
        filter: '',
        isDialogCreateItemOpen: false,
    });

    constructor() {
        this.store.categories.values.set.when(this.actions.loadCategories.success$);
        this.store.categories.isLoading.setFalse.when(this.actions.loadCategories.success$);
        this.store.categories.isLoading.setTrue.when(this.actions.init$);
        this.store.items.startLoading.when(this.actions.init$);
        this.store.items.setLoaded.when(this.actions.loadItems.success$);
        this.store.items.cancelLoading.when(this.actions.loadItems.error$);
        this.store.items.startUpdating.when(this.actions.createItem$);
        this.store.items.startUpdating.when(this.actions.updateCompleted$);
        this.store.items.startUpdating.when(this.actions.completeAll$);
        this.store.items.startUpdating.when(this.actions.uncompleteAll$);
        this.store.items.startUpdating.when(this.actions.deleteItem$);
        this.store.items.setUpdated.when(this.actions.completeAll.success$);
        this.store.items.setUpdated.when(this.actions.uncompleteAll.success$);
        this.store.items.addUpdated.when(this.actions.createItem.success$);
        this.store.items.updateUpdated.when(this.actions.updateItem.success$);
        this.store.items.removeUpdated.when(this.actions.deleteItem.success$);
        this.store.items.cancelUpdating.when(this.actions.createItem.error$);
        this.store.items.cancelUpdating.when(this.actions.updateItem.error$);
        this.store.items.cancelUpdating.when(this.actions.completeAll.error$);
        this.store.items.cancelUpdating.when(this.actions.uncompleteAll.error$);
        this.store.items.cancelUpdating.when(this.actions.deleteItem.error$);
        this.store.isDialogCreateItemOpen.setTrue.when(this.actions.openCreateItemDialog$);
        this.store.isDialogCreateItemOpen.setFalse.when(this.actions.createItem$);
        this.store.isDialogCreateItemOpen.setFalse.when(this.actions.closeCreateItemDialog$);
        this.store.showCompleted.set.when(this.actions.updateShowCompleted$);
        this.errorService.handleError.when(this.actions.loadCategories.error$);
        this.errorService.handleError.when(this.actions.loadItems.error$);
        this.errorService.handleError.when(this.actions.createItem.error$);
        this.errorService.handleError.when(this.actions.updateItem.error$);
        this.errorService.handleError.when(this.actions.completeAll.error$);
        this.errorService.handleError.when(this.actions.uncompleteAll.error$);
        this.errorService.handleError.when(this.actions.deleteItem.error$);

        effect(() => {
            console.log('signal store', this.store());
        });
    }

    ngOnInit() {
        this.actions.init$.next();
    }

    // also support imperative
    protected onFilterChange(filter: string) {
        this.store.filter.set(filter);
    }
}
