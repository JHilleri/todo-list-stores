import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

type TypeOrUnknown<T> = T extends undefined ? unknown : T;
export type Effect<T> = (first: Observable<TypeOrUnknown<T>>, ...rest: Observable<TypeOrUnknown<T>>[]) => void;

export function createEffect<T = unknown>(project: (value: T) => void) {
    return (first: Observable<T>, ...rest: Observable<T>[]) => {
        for (const item of [first, ...rest]) {
            item.pipe(takeUntilDestroyed()).subscribe(project);
        }
    };
}
