import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItem } from '@todo-lists/todo/util';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'tdl-todo-card',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './todo-card.component.html',
    styleUrls: ['./todo-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoCardComponent {
    @Input()
    public item?: TodoItem;
    @Output()
    public completedChange = new EventEmitter<boolean>();

    protected updateCompleted(isCompleted: boolean) {
        this.completedChange.emit(isCompleted);
    }
}
