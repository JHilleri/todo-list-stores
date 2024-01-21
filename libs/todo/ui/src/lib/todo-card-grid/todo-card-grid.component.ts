import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TrackByFunction } from '@angular/core';

import { TodoCardComponent } from '../todo-card/todo-card.component';
import { TodoItem } from '@todo-lists/todo/util';

@Component({
    selector: 'tdl-todo-card-grid',
    standalone: true,
    templateUrl: './todo-card-grid.component.html',
    styleUrls: ['./todo-card-grid.component.scss'],
    imports: [TodoCardComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoCardGridComponent {
    @Input()
    public items: TodoItem[] = [];

    @Output()
    public updateCompleted = new EventEmitter<{
        id: TodoItem['id'];
        value: Partial<TodoItem>;
    }>();

    protected updateCompletedItem(item: TodoItem, completed: boolean) {
        this.updateCompleted.emit({ id: item.id, value: { completed } });
    }
}
