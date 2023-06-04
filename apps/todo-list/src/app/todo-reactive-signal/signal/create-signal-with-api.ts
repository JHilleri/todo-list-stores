import { Signal, WritableSignal } from '@angular/core';
import { createUpdater } from './create-updater';

export function createSignalWithApi<T, API extends Record<string, any>>(
    initialSignal: Signal<T>,
    additionalApi: API
): Signal<T> & API {
    return Object.assign(initialSignal, additionalApi);
}

export function defaultUpdaters<T>(initialSignal: WritableSignal<T>) {
    return {
        set: createUpdater(initialSignal.set),
    };
}
