import { inject, Injectable } from '@angular/core';
import { TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { delay, switchMap } from 'rxjs/operators';
import { LocalStorageTodoService } from './local-storage-todo.service';
import { SettingsService } from './settings/settings.service';

@Injectable({
    providedIn: 'root',
})
export class TodoService {
    private settingsService = inject(SettingsService);
    private localTodoItemStorage = inject(LocalStorageTodoService);
    private serverDelay = this.settingsService.simulateServerDelay$;

    public getTodos() {
        return this.serverDelay.pipe(
            switchMap((serverDelay) => {
                return this.localTodoItemStorage.getTodos().pipe(delay(serverDelay));
            })
        );
    }

    public createTodo(params: TodoItemCreationParams) {
        return this.serverDelay.pipe(
            switchMap((serverDelay) => {
                return this.localTodoItemStorage.createTodo(params).pipe(delay(serverDelay));
            })
        );
    }

    public updateTodo(todoId: TodoItem['id'], params: Partial<TodoItem>) {
        return this.serverDelay.pipe(
            switchMap((serverDelay) => {
                return this.localTodoItemStorage.updateTodo(todoId, params).pipe(delay(serverDelay));
            })
        );
    }

    public updateManyTodos(todos: TodoItem['id'][], params: Partial<TodoItem>) {
        return this.serverDelay.pipe(
            switchMap((serverDelay) => {
                return this.localTodoItemStorage.updateManyTodos(todos, params).pipe(delay(serverDelay));
            })
        );
    }

    public updateAllTodos(params: Partial<TodoItem>) {
        return this.serverDelay.pipe(
            switchMap((serverDelay) => {
                return this.localTodoItemStorage.updateAllTodos(params).pipe(delay(serverDelay));
            })
        );
    }

    public deleteTodo(todoId: TodoItem['id']) {
        return this.serverDelay.pipe(
            switchMap((serverDelay) => {
                return this.localTodoItemStorage.deleteTodoItem(todoId).pipe(delay(serverDelay));
            })
        );
    }
}
