import { DestroyRef, WritableSignal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, catchError, finalize, tap } from 'rxjs';

export function createQueryHandler<Events extends unknown[], QueryResult>({
    query,
    then,
    loadingStatus,
}: {
    query: (...events: Events) => Observable<QueryResult>;
    then: (result: QueryResult) => void;
    loadingStatus?: WritableSignal<boolean>;
}) {
    const destroyRef = inject(DestroyRef);
    return (...events: Events) => {
        loadingStatus?.set(true);
        query(...events)
            .pipe(
                tap(then),
                finalize(() => loadingStatus?.set(false)),
                takeUntilDestroyed(destroyRef),
                catchError((error: unknown) => {
                    console.error(error);
                    return EMPTY;
                })
            )
            .subscribe();
    };
}
