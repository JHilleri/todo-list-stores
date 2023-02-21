import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoCreationComponent } from '@todo-lists/todo-ui';
import {
    createTodoItem,
    getMockedTodoItems,
    TodoItem,
    TodoItemCreationParams,
} from '@todo-lists/todo/util';

@Component({
    selector: 'tdl-todo-list',
    standalone: true,
    imports: [CommonModule, TodoCreationComponent],
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
    protected items: TodoItem[] = getMockedTodoItems();
    protected createItem(item: TodoItemCreationParams) {
        this.items.push(createTodoItem(item));
    }

    protected toggle(item: TodoItem) {
        item.completed = !item.completed;
    }

    protected completeAll() {
        this.items.forEach((item) => (item.completed = true));
    }

    protected unCompleteAll() {
        this.items.forEach((item) => (item.completed = false));
    }

    protected trackBy = (_: number, item: TodoItem) => item.id;
}
