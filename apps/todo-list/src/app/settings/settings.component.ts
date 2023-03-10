import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LetModule } from '@rx-angular/template/let';
import { FormsModule } from '@angular/forms';
import { SettingsService } from './settings.service';
import { ButtonComponent, FieldComponent } from '@todo-lists/todo/ui';

@Component({
    selector: 'todo-lists-settings',
    standalone: true,
    imports: [LetModule, FormsModule, FieldComponent, ButtonComponent],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
    private settingsService = inject(SettingsService);

    protected vm$ = this.settingsService.vm$;
    protected setTheme = this.settingsService.setTheme;
    protected setPrimaryColorHue = this.settingsService.setPrimaryColorHue;
    protected resetPrimaryColorHue = this.settingsService.resetPrimaryColorHue;
    protected setSecondaryColorHue = this.settingsService.setSecondaryColorHue;
    protected resetSecondaryColorHue = this.settingsService.resetSecondaryColorHue;
    protected setSimulateServerDelay = this.settingsService.setSimulateServerDelay;
}
