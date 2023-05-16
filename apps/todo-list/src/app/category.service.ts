import { inject, Injectable } from '@angular/core';
import { SettingsService } from '@todo-lists/settings/data-access';
import { of } from 'rxjs';
import { delay, switchMap, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    private settingsService = inject(SettingsService);
    private simulateServerDelay$ = this.settingsService.simulateServerDelay$;
    private categories$ = of(['', 'category 1', 'category 2', 'category 3']);

    readonly getCategories = () => {
        return this.simulateServerDelay$.pipe(
            switchMap((serverDelay) => {
                return this.categories$.pipe(delay(serverDelay));
            }),
            take(1)
        );
    }
}
