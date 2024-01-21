
import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { CategoryService, TodoService } from '@todo-lists/todo/data-access';
import { LoadingComponent, TodoListComponent } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams, filterTodoItems } from '@todo-lists/todo/util';
import { Subject, mergeMap } from 'rxjs';
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
    imports: [LoadingComponent, TodoListComponent],
})
export default class ReactiveSignalComponent implements OnInit {
    private readonly todoService = inject(TodoService);
    private readonly categoryService = inject(CategoryService);
    private readonly errorService = inject(ErrorService);

    protected actions = createActionGroup(
        withEvents({
            openItemCreation$: new Subject<void>(),
            closeItemCreation$: new Subject<void>(),
            updateShowCompleted$: new Subject<boolean>(),
            updateFilter$: new Subject<string>(),
            createItem$: new Subject<TodoItemCreationParams>(),
            completeItem$: new Subject<{ id: TodoItem['id']; value: Partial<TodoItem> }>(),
            completeAll$: new Subject<void>(),
            uncompleteAll$: new Subject<void>(),
            deleteItem$: new Subject<TodoItem['id']>(),
        }),
        withRequests(({ init$, createItem$, completeItem$, completeAll$, uncompleteAll$, deleteItem$ }) => ({
            itemLoading: init$.pipe(mergeMap(this.todoService.getTodos)),
            categoriesLoading: init$.pipe(mergeMap(this.categoryService.getCategories)),
            itemCreation: createItem$.pipe(mergeMap(this.todoService.createTodo)),
            itemUpdate: completeItem$.pipe(mergeMap(this.todoService.updateTodo)),
            completeAll: completeAll$.pipe(mergeMap(this.todoService.completeAllTodos)),
            uncompleteAll: uncompleteAll$.pipe(mergeMap(this.todoService.uncompleteAllTodos)),
            itemDeletion: deleteItem$.pipe(mergeMap(this.todoService.deleteTodo)),
        }))
    );

    // state
    protected items = reactiveCollectionSignal<TodoItem>([], ({ set, addItem, removeItem, updateItem }) => {
        set(this.actions.itemLoading.success$, this.actions.completeAll.success$, this.actions.uncompleteAll.success$);
        addItem(this.actions.itemCreation.success$);
        updateItem(this.actions.itemUpdate.success$);
        removeItem(this.actions.itemDeletion.success$);
    });
    protected items_isLoading = reactiveBooleanSignal(false, ({ setTrue, setFalse }) => {
        setTrue(this.actions.init$);
        setFalse(this.actions.itemLoading.success$, this.actions.itemLoading.error$);
    });
    protected items_isUpdating = reactiveBooleanSignal(false, ({ setTrue, setFalse }) => {
        setTrue(
            this.actions.createItem$,
            this.actions.completeItem$,
            this.actions.completeAll$,
            this.actions.uncompleteAll$,
            this.actions.deleteItem$
        );
        setFalse(
            this.actions.itemCreation.success$,
            this.actions.itemCreation.error$,
            this.actions.itemUpdate.success$,
            this.actions.itemUpdate.error$,
            this.actions.completeAll.success$,
            this.actions.completeAll.error$,
            this.actions.uncompleteAll.success$,
            this.actions.uncompleteAll.error$,
            this.actions.itemDeletion.success$,
            this.actions.itemDeletion.error$
        );
    });
    protected categories = reactiveArraySignal<string>([], ({ set }) => set(this.actions.categoriesLoading.success$));
    protected categories_isLoading = reactiveBooleanSignal(false, ({ setTrue, setFalse }) => {
        setTrue(this.actions.init$);
        setFalse(this.actions.categoriesLoading.success$);
    });
    protected showCompleted = reactiveBooleanSignal(false, ({ set }) => set(this.actions.updateShowCompleted$));
    protected filter = reactiveSignal('', ({ set }) => set(this.actions.updateFilter$));
    protected isDialogCreateItemOpen = reactiveBooleanSignal(false, ({ setTrue, setFalse }) => {
        setTrue(this.actions.openItemCreation$);
        setFalse(this.actions.createItem$, this.actions.closeItemCreation$);
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
            this.actions.categoriesLoading.error$,
            this.actions.itemLoading.error$,
            this.actions.itemCreation.error$,
            this.actions.itemUpdate.error$,
            this.actions.completeAll.error$,
            this.actions.uncompleteAll.error$,
            this.actions.itemDeletion.error$
        );
    }

    ngOnInit() {
        this.actions.init$.next();
    }
}
