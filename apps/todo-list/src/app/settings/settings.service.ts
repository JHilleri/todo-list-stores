import { Injectable } from '@angular/core';
import { settingsAdapter, settingsInitialState } from './settings.state';
import { adaptNgrx } from '@state-adapt/ngrx';
import { share, tap } from 'rxjs/operators';
import { combineLatest, using } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    private readonly store = adaptNgrx(
        ['settings', settingsInitialState],
        settingsAdapter
    );

    public readonly setTheme = this.store.setTheme;
    public readonly setPrimaryColorHue = this.store.setPrimaryColorHue;
    public readonly resetPrimaryColorHue = this.store.resetPrimaryColorHue;
    public readonly setSecondaryColorHue = this.store.setSecondaryColorHue;
    public readonly resetSecondaryColorHue = this.store.resetSecondaryColorHue;
    public readonly setSimulateServerDelay = this.store.setSimulateServerDelay;

    private readonly themeUpdated$ = this.store.theme$.pipe(
        tap((theme) => {
            switch (theme) {
                case 'light':
                    document.body.classList.add('light');
                    document.body.classList.remove('dark');
                    break;
                case 'dark':
                    document.body.classList.remove('light');
                    document.body.classList.add('dark');
                    break;
                case 'auto':
                    document.body.classList.remove('dark');
                    document.body.classList.remove('light');
                    break;
            }
        })
    );

    public readonly customCssStyleSheet = new CSSStyleSheet();
    private readonly customCssUpdated$ = this.store.styleSeetContent$.pipe(
        tap((content) => {
            this.customCssStyleSheet.replaceSync(content);
        })
    );

    public readonly effect$ = combineLatest([
        this.themeUpdated$,
        this.customCssUpdated$,
    ]).pipe(share());

    public readonly vm$ = using(
        () => this.effect$.subscribe(),
        () => this.store.state$
    );
    public readonly simulateServerDelay$ = this.store.simulateServerDelay$;
}
