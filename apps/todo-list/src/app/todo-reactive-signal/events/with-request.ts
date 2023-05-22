import {
    Observable,
    ObservableNotification,
    OperatorFunction,
    Subject,
    dematerialize,
    map,
    materialize,
    merge,
    of,
    partition,
    pipe,
    share,
} from 'rxjs';

export function splitErrors<T>() {
    return pipe(
        materialize(),
        (source$) => partition(source$, (n) => n.kind !== 'E'),
        ([next$, error$]) => ({
            success$: next$.pipe(dematerialize()) as Observable<T>,
            error$: error$.pipe(
                map((notif): ObservableNotification<unknown> => ({ kind: 'N', value: notif.error })),
                dematerialize()
            ),
        })
    );
}

export interface Request<T> {
    success$: Observable<T>;
    error$: Observable<any>;
    trigger: (value: any) => void;
}

export function withRequests<Base, T extends Record<string, Observable<any>>>(project: (base: Base) => T) {
    return (base: Base) => {
        const requests = {} as Record<string, Request<unknown>>;
        for (const [key, value] of Object.entries(project(base))) {
            const subject = new Subject<unknown>();
            const { success$, error$ } = pipe(share(), splitErrors())(value);
            requests[key] = {
                success$,
                error$,
                trigger: subject.next.bind(subject),
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
