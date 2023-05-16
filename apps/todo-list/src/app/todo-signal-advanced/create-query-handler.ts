import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, catchError, finalize, tap } from 'rxjs';

export function createQueryHandler<Events extends unknown[], QueryResult>({
    query,
    next,
    loadingStatus,
}: {
    query: (...events: Events) => Observable<QueryResult>;
    next: (result: QueryResult) => void;
    loadingStatus?: (value: boolean) => void;
}) {
    const destroyRef = inject(DestroyRef);

    return (...events: Events) => {
        loadingStatus?.(true);
        query(...events)
            .pipe(
                tap(next),
                finalize(() => loadingStatus?.(false)),
                takeUntilDestroyed(destroyRef),
                catchError((error: unknown) => {
                    console.error(error);
                    return EMPTY;
                })
            )
            .subscribe();
    };
}
