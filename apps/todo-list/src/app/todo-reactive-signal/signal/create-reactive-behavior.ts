import { Signal, signal } from '@angular/core';
import { Updater, createUpdater } from './create-updater';
import { BehaviorSubject, Observable } from 'rxjs';

interface ContainerFactory<T, C> {
    getter: () => T;
    setter: (value: T) => void;
    value: C;
}

export function createReactive<T, C extends ContainerFactory<T, any>, API extends Record<string, (event: any) => T>>(
    baseApiFactory: (state: () => T) => API,
    containerFactory: (initialValue: T) => C
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
        const { getter, setter, value } = containerFactory(initialValue);

        const baseApi = {
            set: (value: T) => value,
            reset: () => initialValue,
            ...baseApiFactory(getter),
        };

        const api = Object.entries(baseApi).reduce((acc, [key, action]) => {
            acc[key] = createUpdater((value: any) => setter(action(value)));
            return acc;
        }, {} as Record<string, Updater<T>>) as {
            set: Updater<T>;
            reset: Updater<void>;
        } & {
            [key in keyof API]: Updater<Parameters<API[key]>['0']>;
        };

        actions?.(api);

        return value as C['value'];
    };
}

export function signalReactiveFactory<T>(initialValue: T): ContainerFactory<T, Signal<T>> {
    const base = signal<T>(initialValue);
    return {
        getter: base,
        setter: base.set,
        value: base.asReadonly(),
    };
}

export function behaviourSubjectReactiveFactory<T>(initialValue: T): ContainerFactory<T, Observable<T>> {
    const base = new BehaviorSubject(initialValue);
    return {
        getter: () => base.getValue(),
        setter: (value) => base.next(value),
        value: base.asObservable(),
    };
}
