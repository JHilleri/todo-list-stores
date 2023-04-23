import { Injectable } from '@angular/core';
import { adaptNgrx } from '@state-adapt/ngrx';
import { settingsAdapter, settingsInitialState } from './settings.state';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    private readonly store = adaptNgrx(['settings', settingsInitialState], settingsAdapter);

    public readonly setTheme = this.store.setTheme;
    public readonly setPrimaryColorHue = this.store.setPrimaryColorHue;
    public readonly resetPrimaryColorHue = this.store.resetPrimaryColorHue;
    public readonly setSecondaryColorHue = this.store.setSecondaryColorHue;
    public readonly resetSecondaryColorHue = this.store.resetSecondaryColorHue;
    public readonly setSimulateServerDelay = this.store.setSimulateServerDelay;
    public readonly setSimulateServerErrorsAddTodo = this.store.setSimulateServerErrorsAddTodo;
    public readonly setSimulateServerErrorsUpdateTodo = this.store.setSimulateServerErrorsUpdateTodo;
    public readonly setSimulateServerErrorsDeleteTodo = this.store.setSimulateServerErrorsDeleteTodo;
    public readonly setSimulateServerErrorsLoadTodos = this.store.setSimulateServerErrorsLoadTodos;

    public readonly vm$ = this.store.vm$;

    public readonly simulateServerDelay$ = this.store.simulateServerDelay$;
    public readonly simulateServerErrors$ = this.store.simulateServerErrors$;
}
