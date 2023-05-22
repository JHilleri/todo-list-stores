import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, merge } from 'rxjs';

type Effect<Args extends [] | [any] = []> = Args extends [infer Arg] ? (value: Observable<Arg> | Observable<Arg>[]) => void : (value?: Observable<any> | Observable<any>[]) => void;

export function createEffect<V>(project: (value: V) => void): Effect<[V]>;
export function createEffect(project: () => void): Effect;
export function createEffect<V = void>(project: (value: V) => void | (() => void)) {
    return (value: Observable<V> | Observable<V>[]) => {
        if (Array.isArray(value)) {
            merge(...value)
                .pipe(takeUntilDestroyed())
                .subscribe(project);
            return;
        }
        value.pipe(takeUntilDestroyed()).subscribe(project);
    };
}
