import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RxActionFactory } from '@rx-angular/state/actions';
import { LetModule } from '@rx-angular/template/let';
import {
    ButtonComponent,
    TodoCardGridComponent,
    TodoCreationComponent,
} from '@todo-lists/todo/ui';
import { TodoStore } from './todo.store';

@Component({
    selector: 'todo-lists-todo-rx-angular',
    standalone: true,
    imports: [
        LetModule,
        TodoCreationComponent,
        FormsModule,
        ButtonComponent,
        TodoCardGridComponent,
    ],
    templateUrl: './todo-rx-angular.component.html',
    styleUrls: ['../todo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TodoStore, RxActionFactory],
})
export class TodoRxAngularComponent {
    private store = inject(TodoStore);

    protected ui = this.store.actions;
    protected vm$ = this.store.vm$;
}
