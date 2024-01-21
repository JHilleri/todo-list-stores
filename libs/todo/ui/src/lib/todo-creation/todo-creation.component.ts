import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';

import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { TodoItemCreationParams } from '@todo-lists/todo/util';

@Component({
    selector: 'tdl-todo-creation',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, ButtonComponent],
    templateUrl: './todo-creation.component.html',
    styleUrls: ['./todo-creation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoCreationComponent {
    @Input() public categories: string[] = [];

    @Output() public create = new EventEmitter<TodoItemCreationParams>();
    protected form = new FormGroup({
        title: new FormControl('', { validators: [Validators.required] }),
        text: new FormControl(''),
        category: new FormControl(''),
    });

    protected add() {
        const { title, text, category } = this.form.value;
        if (!title) return;
        this.create.emit({
            title,
            text: text ?? '',
            tags: [category].filter((category): category is string =>
                Boolean(category)
            ),
        });
        this.form.reset();
    }
}
