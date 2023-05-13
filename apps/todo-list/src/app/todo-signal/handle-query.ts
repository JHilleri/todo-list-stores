import { WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, Observable, of, switchMap, tap, EMPTY, finalize } from 'rxjs';

export function handleQuery<T, R>(
    query: (value: T) => Observable<R>,
    config: {
        loadingStatus?: WritableSignal<boolean>;
        trigger$?: Observable<T>;
        before?: () => void;
        next: (result: R) => void;
    }
) {
    return (config.trigger$ ?? (of(undefined) as Observable<T>))
        .pipe(
            switchMap((value) => {
                config.loadingStatus?.set(true);
                config.before?.();
                return query(value).pipe(
                    finalize(() => config.loadingStatus?.set(false)),
                    tap(config.next),
                    catchError((error: unknown) => {
                        console.error(error);
                        return EMPTY;
                    })
                );
            }),
            takeUntilDestroyed()
        )
        .subscribe();
}
