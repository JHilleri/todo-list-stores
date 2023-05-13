import { catchError, Observable, of, switchMap, tap, EMPTY, finalize, Subject } from 'rxjs';

export function handleQuery<T, R>(
    query: (value: T) => Observable<R>,
    config: {
        loadingStatus?: Subject<boolean>;
        trigger$?: Observable<T>;
        before?: () => void;
        next: (result: R) => void;
    }
) {
    return (config.trigger$ ?? (of(undefined) as Observable<T>)).pipe(
        switchMap((value) => {
            config.loadingStatus?.next(true);
            config.before?.();
            return query(value).pipe(
                finalize(() => config.loadingStatus?.next(false)),
                tap(config.next),
                catchError((error: unknown) => {
                    console.error(error);
                    return EMPTY;
                })
            );
        })
    );
}
