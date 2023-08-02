import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { LoadingComponent, TodoListComponent } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams, filterTodoItems } from '@todo-lists/todo/util';
import { Subject, mergeMap } from 'rxjs';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';
import { ErrorService } from './error.service';
import { withEvents, withRequests } from './events';
import { createActionGroup } from './events/create-action-group';
import { reactiveArraySignal, reactiveBooleanSignal, reactiveCollectionSignal, reactiveSignal } from './signal';

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
            loadItems: init$.pipe(mergeMap(this.todoService.getTodos)),
            loadCategories: init$.pipe(mergeMap(this.categoryService.getCategories)),
            createItem: createItem$.pipe(mergeMap(this.todoService.createTodo)),
            updateItem: updateCompleted$.pipe(mergeMap(this.todoService.updateTodo)),
            completeAll: completeAll$.pipe(mergeMap(() => this.todoService.updateAllTodos({ completed: true }))),
            uncompleteAll: uncompleteAll$.pipe(mergeMap(() => this.todoService.updateAllTodos({ completed: false }))),
            deleteItem: deleteItem$.pipe(mergeMap(this.todoService.deleteTodo)),
        }))
    );

    // state
    protected items = reactiveCollectionSignal<TodoItem>([], ({ set, addItem, removeItem, replaceItem }) => {
        set(this.actions.loadItems.success$, this.actions.completeAll.success$, this.actions.uncompleteAll.success$);
        addItem(this.actions.createItem.success$);
        replaceItem(this.actions.updateItem.success$);
        removeItem(this.actions.deleteItem.success$);
    });
    protected items_isLoading = reactiveBooleanSignal(false, ({ setTrue, setFalse }) => {
        setTrue(this.actions.init$);
        setFalse(this.actions.loadItems.success$, this.actions.loadItems.error$);
    });
    protected items_isUpdating = reactiveBooleanSignal(false, ({ setTrue, setFalse }) => {
        setTrue(
            this.actions.createItem$,
            this.actions.updateCompleted$,
            this.actions.completeAll$,
            this.actions.uncompleteAll$,
            this.actions.deleteItem$
        );
        setFalse(
            this.actions.createItem.success$,
            this.actions.createItem.error$,
            this.actions.updateItem.success$,
            this.actions.updateItem.error$,
            this.actions.completeAll.success$,
            this.actions.completeAll.error$,
            this.actions.uncompleteAll.success$,
            this.actions.uncompleteAll.error$,
            this.actions.deleteItem.success$,
            this.actions.deleteItem.error$
        );
    });
    protected categories = reactiveArraySignal<string>([], ({ set }) => set(this.actions.loadCategories.success$));
    protected categories_isLoading = reactiveBooleanSignal(false, ({ setTrue, setFalse }) => {
        setTrue(this.actions.init$);
        setFalse(this.actions.loadCategories.success$);
    });
    protected showCompleted = reactiveBooleanSignal(false, ({ set }) => set(this.actions.updateShowCompleted$));
    protected filter = reactiveSignal('', ({ set }) => set(this.actions.updateFilter$));
    protected isDialogCreateItemOpen = reactiveBooleanSignal(false, ({ setTrue, setFalse }) => {
        setTrue(this.actions.openCreateItemDialog$);
        setFalse(this.actions.createItem$, this.actions.closeCreateItemDialog$);
    });

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
        this.errorService.handleError(
            this.actions.loadCategories.error$,
            this.actions.loadItems.error$,
            this.actions.createItem.error$,
            this.actions.updateItem.error$,
            this.actions.completeAll.error$,
            this.actions.uncompleteAll.error$,
            this.actions.deleteItem.error$
        );
    }

    ngOnInit() {
        this.actions.init$.next();
    }
}
