import { Observable, Subject, catchError, share, tap, using } from 'rxjs';

export function splitErrors<T>(source$: Observable<T>) {
    const errors$ = new Subject<unknown>();
    const success$ = source$.pipe(
        catchError((error, caught) => {
            errors$.next(error);
            return caught;
        }),
        tap({
            complete: () => errors$.complete(),
        }),
        share()
    );
    return {
        success$,
        error$: using(
            () => success$.subscribe(),
            () => errors$
        ),
    };
}

export interface Request<T> {
    success$: Observable<T>;
    error$: Observable<unknown>;
}

export function withRequests<Base, T extends Record<string, Observable<any>>>(project: (base: Base) => T) {
    return (base: Base) => {
        const requests = {} as Record<string, Request<unknown>>;
        for (const [key, value$] of Object.entries(project(base))) {
            const { success$, error$ } = splitErrors(value$);
            requests[key] = {
                success$,
                error$,
            };
        }
        return {
            ...base,
            ...(requests as {
                [K in keyof T]: T[K] extends Observable<infer R> ? Request<R> : never;
            }),
        };
    };
}
