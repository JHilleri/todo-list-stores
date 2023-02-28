import { inject, Injectable } from '@angular/core';
import { createTodoItem, TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { SettingsService } from './settings/settings.service';

@Injectable({
    providedIn: 'root',
})
export class TodoService {
    private settingsService = inject(SettingsService);
    private serverDelay = this.settingsService.simulateServerDelay$;
    private todoItems$ = of([
        createTodoItem({
            title: 'Todo 1',
            text: 'Todo 1 text',
            tags: [],
        }),
        createTodoItem({
            title: 'Todo 2',
            text: 'Todo 2 text',
            tags: [],
        }),
    ]);

    public getTodos() {
        return this.serverDelay.pipe(
            switchMap((serverDelay) => {
                return this.todoItems$.pipe(delay(serverDelay));
            })
        );
    }

    public createTodo(params: TodoItemCreationParams) {
        return this.serverDelay.pipe(
            switchMap((serverDelay) => {
                return of(createTodoItem(params)).pipe(delay(serverDelay));
            })
        );
    }

    public updateTodo(todo: TodoItem, params: Partial<TodoItem>) {
        return this.serverDelay.pipe(
            switchMap((serverDelay) => {
                return of({ ...todo, ...params }).pipe(delay(serverDelay));
            })
        );
    }

    public updateManyTodos(todos: TodoItem[], params: Partial<TodoItem>) {
        return this.serverDelay.pipe(
            switchMap((serverDelay) => {
                return of(todos.map((todo) => ({ ...todo, ...params }))).pipe(delay(serverDelay));
            })
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public deleteTodo(todo: TodoItem) {
        return this.serverDelay.pipe(
            switchMap((serverDelay) => {
                return of(true).pipe(delay(serverDelay));
            })
        );
    }
}
