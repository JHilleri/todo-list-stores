import { RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LetDirective } from '@rx-angular/template/let';
import { SettingsService } from '@todo-lists/settings/data-access';
import { ColorsLoaderDirective, ThemeLoaderDirective } from '@todo-lists/settings/ui';

@Component({
    standalone: true,
    imports: [RouterModule, FormsModule, LetDirective, NgFor, ThemeLoaderDirective, ColorsLoaderDirective],
    selector: 'todo-lists-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent {
    private settingsService = inject(SettingsService);

    protected readonly vm$ = this.settingsService.vm$;

    protected readonly links = [
        { path: '/imperative', label: 'Imperative' },
        { path: '/rxjs', label: 'RxJS' },
        { path: '/ngrx', label: 'Ngrx' },
        { path: '/ngrx-component-store', label: 'Ngrx Component Store' },
        { path: '/state-adapt', label: 'State Adapt' },
        { path: '/rx-angular', label: 'Rx Angular' },
        { path: '/signal', label: 'Signal' },
        { path: '/reactive-signal', label: 'Reactive Signal'},
        { path: '/signal-advanced', label: 'Signal Advanced' },
    ];
}
