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

    public getTodos() {
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
    }

    public createTodo(params: TodoItemCreationParams) {
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
    }

    public updateTodo(todoId: TodoItem['id'], params: Partial<TodoItem>) {
        return combineLatest({
            serverDelay: this.serverDelay,
            serverErrors: this.serverErrors,
        }).pipe(
            switchMap(({ serverDelay, serverErrors }) => {
                if (serverErrors.updateTodo) {
                    throw new Error('Simulated server error');
                }
                return this.localTodoItemStorage.updateTodo(todoId, params).pipe(delay(serverDelay));
            }),
            take(1)
        );
    }

    public updateManyTodos(todos: TodoItem['id'][], params: Partial<TodoItem>) {
        return combineLatest({
            serverDelay: this.serverDelay,
            serverErrors: this.serverErrors,
        }).pipe(
            switchMap(({ serverDelay, serverErrors }) => {
                if (serverErrors.completeAllTodos) {
                    throw new Error('Simulated server error');
                }
                return this.localTodoItemStorage.updateManyTodos(todos, params).pipe(delay(serverDelay));
            }),
            take(1)
        );
    }

    public updateAllTodos(params: Partial<TodoItem>) {
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
    }

    public deleteTodo(todoId: TodoItem['id']) {
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
    }
}
