import { RouterModule } from '@angular/router';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { NgFor } from '@angular/common';
import { SettingsService } from './settings/settings.service';
import { FormsModule } from '@angular/forms';
import { LetModule } from '@rx-angular/template/let';

@Component({
    standalone: true,
    imports: [RouterModule, FormsModule, LetModule, NgFor],
    selector: 'todo-lists-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent implements OnInit {
    private settingsService = inject(SettingsService);

    protected readonly links = [
        { path: '/imperative', label: 'Imperative' },
        { path: '/rxjs', label: 'RxJS' },
        { path: '/ngrx', label: 'Ngrx' },
        { path: '/ngrx-component-store', label: 'Ngrx Component Store' },
        { path: '/state-adapt', label: 'State Adapt' },
        { path: '/rx-angular', label: 'Rx Angular' },
    ];

    ngOnInit() {
        this.settingsService.effect$.subscribe();
        document.adoptedStyleSheets = [this.settingsService.customCssStyleSheet];
    }
}
