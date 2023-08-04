import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

export function createUpdater<T = unknown>(set: (value: T) => void) {
    return (first: Observable<T>, ...rest: Observable<T>[]) => {
        for (const item of [first, ...rest]) {
            item.pipe(takeUntilDestroyed()).subscribe(set);
        }
    };
}

type TypeOrUnknown<T> = T extends undefined ? unknown : T;
export type Updater<T> = (first: Observable<TypeOrUnknown<T>>, ...rest: Observable<TypeOrUnknown<T>>[]) => void;
