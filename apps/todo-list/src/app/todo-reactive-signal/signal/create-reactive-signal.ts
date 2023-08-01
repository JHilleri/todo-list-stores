import { Signal, signal } from '@angular/core';
import { Updater, createUpdater } from './create-updater';

export function createReactiveSignal<T, API extends Record<string, (event: any) => T>>(
    baseApiFactory: (state: Signal<T>) => API
) {
    return (
        initialValue: T,
        actions?: (
            api: {
                set: Updater<T>;
                reset: Updater<void>;
            } & { [key in keyof API]: Updater<Parameters<API[key]>['0']> }
        ) => void
    ) => {
        const initialSignal = signal(initialValue);

        const baseApi = {
            set: (value: T) => value,
            reset: () => initialValue,
            ...baseApiFactory(initialSignal),
        };

        const api = Object.entries(baseApi).reduce((acc, [key, action]) => {
            acc[key] = createUpdater((value: any) => initialSignal.set(action(value)));
            return acc;
        }, {} as Record<string, Updater<T>>) as {
            set: Updater<T>;
            reset: Updater<void>;
        } & {
            [key in keyof API]: Updater<Parameters<API[key]>['0']>;
        };

        actions?.(api);

        return initialSignal.asReadonly();
    };
}
