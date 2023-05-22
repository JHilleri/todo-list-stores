import { Signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, isObservable } from 'rxjs';

export function createUpdater(set: () => void): (value: void | Observable<unknown> | Observable<unknown>[]) => void;
export function createUpdater<T>(set: (value: T) => void): (value: T | Observable<T> | Observable<T>[]) => void;
export function createUpdater<T>(set: (value: T) => void) {
    return (value: T | Observable<T> | Observable<T>[]) => {
        if (isObservable(value)) {
            value.pipe(takeUntilDestroyed()).subscribe(set);
            return;
        }
        if (Array.isArray(value)) {
            if (isObservable(value[0])) {
                for (const item of value) {
                    if (!isObservable(item)) {
                        throw new Error('Expected an array of observables');
                    }
                    item.pipe(takeUntilDestroyed()).subscribe(set);
                }
                return;
            }
        }
        set(value as T);
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
        update: initialSignal.update,
        mutate: initialSignal.mutate,
    };
}


