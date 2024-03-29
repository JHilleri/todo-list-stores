import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RxLet } from '@rx-angular/template/let';
import { FormsModule } from '@angular/forms';
import { ButtonComponent, FieldComponent } from '@todo-lists/todo/ui';
import { SettingsService } from '@todo-lists/settings/data-access';
import { TodoService } from '@todo-lists/todo/data-access';

@Component({
    selector: 'todo-lists-settings',
    standalone: true,
    imports: [RxLet, FormsModule, FieldComponent, ButtonComponent],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
    private settingsService = inject(SettingsService);
    private todoItemsService = inject(TodoService);

    protected vm$ = this.settingsService.vm$;
    protected setTheme = this.settingsService.setTheme;
    protected setPrimaryColorHue = this.settingsService.setPrimaryColorHue;
    protected resetPrimaryColorHue = this.settingsService.resetPrimaryColorHue;
    protected setSecondaryColorHue = this.settingsService.setSecondaryColorHue;
    protected resetSecondaryColorHue = this.settingsService.resetSecondaryColorHue;
    protected setSimulateServerDelay = this.settingsService.setSimulateServerDelay;
    protected resetTodoItems = this.todoItemsService.deleteAllTodos;

    protected setSimulateServerErrorsAddTodo = this.settingsService.setSimulateServerErrorsAddTodo;
    protected setSimulateServerErrorsUpdateTodo = this.settingsService.setSimulateServerErrorsUpdateTodo;
    protected setSimulateServerErrorsDeleteTodo = this.settingsService.setSimulateServerErrorsDeleteTodo;
    protected setSimulateServerErrorsLoadTodos = this.settingsService.setSimulateServerErrorsLoadTodos;
}
