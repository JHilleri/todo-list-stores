import { Observable, ObservableNotification, dematerialize, map, materialize, partition, share } from 'rxjs';

export function splitErrors<T>(source$: Observable<T>) {
    const notifications$ = source$.pipe(share(), materialize());
    const [next$, error$] = partition(notifications$, (n) => n.kind !== 'E');
    return {
        success$: next$.pipe(dematerialize()) as Observable<T>,
        error$: error$.pipe(
            map((notif): ObservableNotification<unknown> => ({ kind: 'N', value: notif.error })),
            dematerialize()
        ),
    };
}

export interface Request<T> {
    success$: Observable<T>;
    error$: Observable<any>;
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
