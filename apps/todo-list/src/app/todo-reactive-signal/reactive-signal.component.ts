import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject } from '@angular/core';
import { LoadingComponent, TodoListComponent } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams, filterTodoItems } from '@todo-lists/todo/util';
import { Subject } from 'rxjs';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';
import { ErrorService } from './error.service';
import { createQuery, withEvents, withRequests } from './events';
import { createActionGroup } from './events/create-action-group';
import { reactiveCollectionSignal, reactiveBooleanSignal, reactiveArraySignal, reactiveSignal } from './signal';

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
            updateFilter$: new Subject<string>(),
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

    // state
    protected items = reactiveCollectionSignal<TodoItem>();
    protected items_isLoading = reactiveBooleanSignal();
    protected items_isUpdating = reactiveBooleanSignal();
    protected categories = reactiveArraySignal<string>();
    protected categories_isLoading = reactiveBooleanSignal();
    protected showCompleted = reactiveBooleanSignal();
    protected filter = reactiveSignal({ initialValue: '' });
    protected isDialogCreateItemOpen = reactiveBooleanSignal();

    // derived state
    protected completedCount = computed(() => this.items().filter((item) => item.completed).length);
    protected uncompletedCount = computed(() => this.items().filter((item) => !item.completed).length);
    protected isLoading = computed(() => this.items_isLoading() || this.categories_isLoading());
    protected filteredItems = computed(() => {
        return filterTodoItems(this.items(), {
            showCompleted: this.showCompleted(),
            filter: this.filter(),
        });
    });

    constructor() {
        this.categories.set(this.actions.loadCategories.success$);
        this.categories_isLoading.setFalse(this.actions.loadCategories.success$);
        this.categories_isLoading.setTrue(this.actions.init$);
        this.items.set([
            this.actions.loadItems.success$,
            this.actions.completeAll.success$,
            this.actions.uncompleteAll.success$,
        ]);
        this.items.addItem(this.actions.createItem.success$);
        this.items.replaceItem(this.actions.updateItem.success$);
        this.items.removeItem(this.actions.deleteItem.success$);
        this.items_isLoading.setFalse([this.actions.loadItems.success$, this.actions.loadItems.error$]);
        this.items_isLoading.setTrue(this.actions.init$);
        this.items_isUpdating.setFalse([
            this.actions.createItem.success$,
            this.actions.createItem.error$,
            this.actions.updateItem.success$,
            this.actions.updateItem.error$,
            this.actions.completeAll.success$,
            this.actions.completeAll.error$,
            this.actions.uncompleteAll.success$,
            this.actions.uncompleteAll.error$,
            this.actions.deleteItem.success$,
            this.actions.deleteItem.error$,
        ]);
        this.items_isUpdating.setTrue([
            this.actions.createItem$,
            this.actions.updateCompleted$,
            this.actions.completeAll$,
            this.actions.uncompleteAll$,
            this.actions.deleteItem$,
        ]);
        this.isDialogCreateItemOpen.setTrue(this.actions.openCreateItemDialog$);
        this.isDialogCreateItemOpen.setFalse([this.actions.createItem$, this.actions.closeCreateItemDialog$]);
        this.showCompleted.set(this.actions.updateShowCompleted$);
        this.filter.set(this.actions.updateFilter$);
        this.errorService.handleError([
            this.actions.loadCategories.error$,
            this.actions.loadItems.error$,
            this.actions.createItem.error$,
            this.actions.updateItem.error$,
            this.actions.completeAll.error$,
            this.actions.uncompleteAll.error$,
            this.actions.deleteItem.error$,
        ]);
    }

    ngOnInit() {
        this.actions.init$.next();
    }
}
