import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { TodoItem } from '@todo-lists/todo/util';
import { ButtonComponent } from '../button/button.component';

let nextId = 0;

@Component({
    selector: 'tdl-todo-card',
    standalone: true,
    imports: [ButtonComponent],
    templateUrl: './todo-card.component.html',
    styleUrls: ['./todo-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoCardComponent {
    public item = input<TodoItem>();

    @Output()
    public completedChange = new EventEmitter<boolean>();

    protected headerId = `todo-card-header-${nextId++}`;

    protected updateCompleted(isCompleted: boolean) {
        this.completedChange.emit(isCompleted);
    }
}
