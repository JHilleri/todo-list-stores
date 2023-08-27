import { inject, Injectable } from '@angular/core';
import { SettingsService } from '@todo-lists/settings/data-access';
import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { combineLatest } from 'rxjs';
import { delay, switchMap, take } from 'rxjs/operators';
import { LocalStorageTodoService } from './local-storage-todo.service';

@Injectable({
    providedIn: 'root',
})
export class TodoService {
    private settingsService = inject(SettingsService);
    private localTodoItemStorage = inject(LocalStorageTodoService);
    private serverDelay = this.settingsService.simulateServerDelay$;
    private serverErrors = this.settingsService.simulateServerErrors$;

    public readonly getTodos = () => {
        return combineLatest({
            serverDelay: this.serverDelay,
            serverErrors: this.serverErrors,
        }).pipe(
            switchMap(({ serverDelay, serverErrors }) => {
                if (serverErrors.loadTodos) {
                    throw new Error('Simulated server error');
                }
                return this.localTodoItemStorage.getTodos().pipe(delay(serverDelay));
            }),
            take(1)
        );
    };

    public readonly createTodo = (params: TodoItemCreationParams) => {
        return combineLatest({
            serverDelay: this.serverDelay,
            serverErrors: this.serverErrors,
        }).pipe(
            switchMap(({ serverDelay, serverErrors }) => {
                if (serverErrors.addTodo) {
                    throw new Error('Simulated server error');
                }
                return this.localTodoItemStorage.createTodo(params).pipe(delay(serverDelay));
            }),
            take(1)
        );
    };

    public readonly updateTodo = ({ id, value }: { id: TodoItem['id']; value: Partial<TodoItem> }) => {
        return combineLatest({
            serverDelay: this.serverDelay,
            serverErrors: this.serverErrors,
        }).pipe(
            switchMap(({ serverDelay, serverErrors }) => {
                if (serverErrors.updateTodo) {
                    throw new Error('Simulated server error');
                }
                return this.localTodoItemStorage.updateTodo(id, value).pipe(delay(serverDelay));
            }),
            take(1)
        );
    };

    public readonly updateManyTodos = ({ ids, value }: { ids: TodoItem['id'][]; value: Partial<TodoItem> }) => {
        return combineLatest({
            serverDelay: this.serverDelay,
            serverErrors: this.serverErrors,
        }).pipe(
            switchMap(({ serverDelay, serverErrors }) => {
                if (serverErrors.completeAllTodos) {
                    throw new Error('Simulated server error');
                }
                return this.localTodoItemStorage.updateManyTodos(ids, value).pipe(delay(serverDelay));
            }),
            take(1)
        );
    };

    public readonly updateAllTodos = (params: Partial<TodoItem>) => {
        return combineLatest({
            serverDelay: this.serverDelay,
            serverErrors: this.serverErrors,
        }).pipe(
            switchMap(({ serverDelay, serverErrors }) => {
                if (serverErrors.completeAllTodos) {
                    throw new Error('Simulated server error');
                }
                return this.localTodoItemStorage.updateAllTodos(params).pipe(delay(serverDelay));
            }),
            take(1)
        );
    };

    public readonly completeAllTodos = () => {
        return this.updateAllTodos({ completed: true });
    };

    public readonly uncompleteAllTodos = () => {
        return this.updateAllTodos({ completed: false });
    };

    public readonly deleteTodo = (todoId: TodoItem['id']) => {
        return combineLatest({
            serverDelay: this.serverDelay,
            serverErrors: this.serverErrors,
        }).pipe(
            switchMap(({ serverDelay, serverErrors }) => {
                if (serverErrors.deleteTodo) {
                    throw new Error('Simulated server error');
                }
                return this.localTodoItemStorage.deleteTodoItem(todoId).pipe(delay(serverDelay));
            }),
            take(1)
        );
    };
}
