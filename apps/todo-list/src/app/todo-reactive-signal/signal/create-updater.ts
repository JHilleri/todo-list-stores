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
