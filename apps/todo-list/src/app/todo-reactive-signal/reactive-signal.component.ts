import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiComponentsModule } from '@todo-lists/todo/ui';
import { TodoItem, TodoItemCreationParams, filterTodoItems } from '@todo-lists/todo/util';
import { ReplaySubject, Subject, map, pipe } from 'rxjs';
import { CategoryService } from '../category.service';
import { TodoService } from '../todo.service';
import { ErrorService } from './error.service';
import { createQuery, withEvents, withRequests } from './events';
import { createActionGroup } from './events/create-action-group';
import {
    createArraySignal,
    createBooleanSignal,
    createCollectionSignal,
    createSignal,
    extendsSignal,
} from './signal/create-signal';
import { withLoading, withUpdating } from './signal/with-loading';

@Component({
    selector: 'todo-lists-signal',
    standalone: true,
    templateUrl: './reactive-signal.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, UiComponentsModule],
})
export default class ReactiveSignalComponent implements OnInit {
    private readonly todoService = inject(TodoService);
    private readonly categoryService = inject(CategoryService);
    private readonly errorService = inject(ErrorService);

    // state
    protected items = extendsSignal(createCollectionSignal<TodoItem>(), pipe(withLoading(), withUpdating()));
    protected categories = extendsSignal(createArraySignal<string>(), withLoading());
    protected showCompleted = createBooleanSignal(false);
    protected filter = createSignal('');
    protected isDialogCreateItemOpen = createBooleanSignal(false);

    // derived state
    protected completedCount = computed(() => this.items().filter((item) => item.completed).length);
    protected uncompletedCount = computed(() => this.items().filter((item) => !item.completed).length);
    protected isLoading = computed(() => this.items.isLoading() || this.categories.isLoading());
    protected filteredItems = computed(() => {
        return filterTodoItems(this.items(), {
            showCompleted: this.showCompleted(),
            filter: this.filter(),
        });
    });

    protected actions = createActionGroup(
        withEvents({
            init$: new ReplaySubject<void>(1),
            openCreateItemDialog$: new Subject<void>(),
            closeCreateItemDialog$: new Subject<void>(),
            updateShowCompleted$: new Subject<boolean>(),
            updateFilter$: new Subject<string>(),
            createItem$: new Subject<TodoItemCreationParams>(),
            updateCompleted$: new Subject<{ itemId: TodoItem['id']; changes: Partial<TodoItem> }>(),
            completeAll$: new Subject<void>(),
            uncompleteAll$: new Subject<void>(),
            deleteItem$: new Subject<TodoItem['id']>(),
        }),
        withRequests(({ init$, createItem$, completeAll$, uncompleteAll$, deleteItem$, updateCompleted$ }) => ({
            loadItems: createQuery(init$, this.todoService.getTodos),
            loadCategories: createQuery(init$, this.categoryService.getCategories),
            createItem: createQuery(createItem$, this.todoService.createTodo),
            updateCompleted: createQuery(updateCompleted$, ({ itemId, changes }) =>
                this.todoService.updateTodo(itemId, changes)
            ),
            completeAll: createQuery(completeAll$, () => this.todoService.updateAllTodos({ completed: true })),
            uncompleteAll: createQuery(uncompleteAll$, () => this.todoService.updateAllTodos({ completed: false })),
            deleteItem: createQuery(deleteItem$, this.todoService.deleteTodo),
        }))
    );

    constructor() {
        this.errorService.effects.handleError([
            this.actions.loadCategories.error$,
            this.actions.loadItems.error$,
            this.actions.createItem.error$,
            this.actions.updateCompleted.error$,
            this.actions.completeAll.error$,
            this.actions.uncompleteAll.error$,
            this.actions.deleteItem.error$,
        ]);
        this.categories.updater.set(this.actions.loadCategories.success$);
        this.categories.isLoading.updater.set([
            this.actions.init$.pipe(map(() => true)),
            this.actions.loadCategories.success$.pipe(map(() => false)),
        ]);
        this.items.updater.set([
            this.actions.loadItems.success$,
            this.actions.completeAll.success$,
            this.actions.uncompleteAll.success$,
        ]);
        this.items.isLoading.updater.setFalse([this.actions.loadItems.success$, this.actions.loadItems.error$]);
        this.items.isLoading.updater.setTrue(this.actions.init$);
        this.items.isUpdating.updater.setFalse([
            this.actions.createItem.success$,
            this.actions.createItem.error$,
            this.actions.updateCompleted.success$,
            this.actions.updateCompleted.error$,
            this.actions.completeAll.success$,
            this.actions.completeAll.error$,
            this.actions.uncompleteAll.success$,
            this.actions.uncompleteAll.error$,
            this.actions.deleteItem.success$,
            this.actions.deleteItem.error$,
        ]);
        this.items.isUpdating.updater.setTrue([
            this.actions.createItem$,
            this.actions.updateCompleted$,
            this.actions.completeAll$,
            this.actions.uncompleteAll$,
            this.actions.deleteItem$,
        ]);
        this.items.updater.push(this.actions.createItem.success$);
        this.items.updater.replaceItem(this.actions.updateCompleted.success$);
        this.items.updater.removeItem(this.actions.deleteItem.success$);
        this.isDialogCreateItemOpen.updater.setTrue(this.actions.openCreateItemDialog$);
        this.isDialogCreateItemOpen.updater.setFalse([this.actions.createItem$, this.actions.closeCreateItemDialog$]);
        this.showCompleted.updater.set(this.actions.updateShowCompleted$);
        this.filter.updater.set(this.actions.updateFilter$);
    }

    ngOnInit() {
        this.actions.init$.next();
    }
}
