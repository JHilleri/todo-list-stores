import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    TrackByFunction,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoCardComponent } from '../todo-card/todo-card.component';
import { TodoItem } from '@todo-lists/todo/util';

@Component({
    selector: 'tdl-todo-card-grid',
    standalone: true,
    templateUrl: './todo-card-grid.component.html',
    styleUrls: ['./todo-card-grid.component.scss'],
    imports: [CommonModule, TodoCardComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoCardGridComponent {
    @Input()
    public items: TodoItem[] = [];

    @Output()
    public updateCompleted = new EventEmitter<{
        id: number;
        completed: boolean;
    }>();

    protected trackBy: TrackByFunction<TodoItem> = (_, item) => item.id;

    protected updateCompletedItem(item: TodoItem, completed: boolean) {
        this.updateCompleted.emit({ id: item.id, completed });
    }
}
