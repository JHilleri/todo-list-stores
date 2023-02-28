import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { SettingsService } from './settings/settings.service';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    private settingsService = inject(SettingsService);
    private simulateServerDelay$ = this.settingsService.simulateServerDelay$;
    private categories$ = of(['', 'category 1', 'category 2', 'category 3']);

    getCategories() {
        return this.simulateServerDelay$.pipe(
            switchMap((serverDelay) => {
                return this.categories$.pipe(delay(serverDelay));
            })
        );
    }
}
