import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'tdl-todo-creation',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent],
    templateUrl: './todo-creation.component.html',
    styleUrls: ['./todo-creation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoCreationComponent {
    @Output() protected create = new EventEmitter<{
        title: string;
        text: string;
    }>();
    protected form = new FormGroup({
        title: new FormControl('', { validators: [Validators.required] }),
        text: new FormControl(''),
    });

    protected add() {
        const { title, text } = this.form.value;
        if (!title) return;
        this.create.emit({
            title,
            text: text ?? '',
        });
        this.form.reset();
    }
}
