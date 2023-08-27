import { Injectable } from '@angular/core';
import { createTodoItem, LocalStorageHelper, TodoItem, TodoItemCreationParams } from '@todo-lists/todo/util';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageTodoService {
    private helper = new LocalStorageHelper<TodoItem[]>('todo-items');
    private getTodosSync() {
        return this.helper.get() ?? [];
    }

    public getTodos() {
        return of(this.helper.get() ?? []);
    }

    public createTodo(params: TodoItemCreationParams) {
        const newItem = createTodoItem(params);
        this.helper.set([...this.getTodosSync(), newItem]);
        return of(newItem);
    }

    public updateTodo(todoId: TodoItem['id'], params: Partial<TodoItem>) {
        const items = this.getTodosSync();
        const itemIndex = items.findIndex((item) => item.id === todoId);
        const updatedItem = { ...items[itemIndex], ...params };
        items[itemIndex] = updatedItem;
        this.helper.set(items);
        return of(updatedItem);
    }

    public updateManyTodos(todoIds: TodoItem['id'][], params: Partial<TodoItem>) {
        const items = this.getTodosSync();
        const updatedItems = items.map((item) => {
            const todo = todoIds.find((id) => id === item.id);
            return todo ? { ...item, ...params } : item;
        });
        this.helper.set(updatedItems);
        return of(updatedItems);
    }

    public updateAllTodos(params: Partial<TodoItem>): Observable<TodoItem[]> {
        const items = this.getTodosSync();
        const updatedItems = items.map((item) => ({ ...item, ...params }));
        this.helper.set(updatedItems);
        return of(updatedItems);
    }

    public deleteTodoItem(todoId: TodoItem['id']) {
        const items = this.getTodosSync();
        const updatedItems = items.filter((item) => item.id !== todoId);
        this.helper.set(updatedItems);
        return of(todoId);
    }

    public deleteAllTodoItems() {
        this.helper.set([]);
    }
}
