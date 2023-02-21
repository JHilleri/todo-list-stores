import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'tdl-todo-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './todo-card.component.html',
    styleUrls: ['./todo-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoCardComponent {
    @Input() protected title = '';
    @Input() protected text = '';
    @Input() protected completed = false;
    @Output() protected completedChange = new EventEmitter<boolean>();
}
