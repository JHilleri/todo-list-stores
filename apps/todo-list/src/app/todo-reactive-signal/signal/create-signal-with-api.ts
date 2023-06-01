import { Signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, isObservable } from 'rxjs';

export function createUpdater(set: () => void): (value: Observable<unknown> | Observable<unknown>[]) => void;
export function createUpdater<T>(set: (value: T) => void): (value: Observable<T> | Observable<T>[]) => void;
export function createUpdater<T>(set: (value: T) => void) {
    return (value: Observable<T> | Observable<T>[]) => {
        if (isObservable(value)) {
            value.pipe(takeUntilDestroyed()).subscribe(set);
            return;
        }
        for (const item of value) {
            item.pipe(takeUntilDestroyed()).subscribe(set);
        }
    };
}

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
