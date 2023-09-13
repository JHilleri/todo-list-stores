import { signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, merge } from 'rxjs';

type TypeOrUnknown<T> = T extends undefined ? unknown : T;

type UpdaterConnect<T> = <P = unknown>(
    updater: (state: T, param: TypeOrUnknown<P>) => T
) => (...streams: Observable<TypeOrUnknown<P>>[]) => void;

export function createReactiveSignal<T>(initialValue: T, factory: (connect: UpdaterConnect<T>) => void) {
    const result = signal(initialValue);
    factory(
        <P = unknown>(updater: (state: T, param: TypeOrUnknown<P>) => T) =>
            (...streams: Observable<TypeOrUnknown<P>>[]) => {
                merge(...streams)
                    .pipe(takeUntilDestroyed())
                    .subscribe((param) => {
                        result.set(updater(result(), param));
                    });
            }
    );
    return result;
}

export function setState<T>() {
    return (state: T, value: T) => value;
}

export function set<T>(value: T) {
    return () => value;
}
