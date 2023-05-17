import { Action } from '@state-adapt/core';
import { Source, getRequestSources } from '@state-adapt/rxjs';
import { Observable, isObservable, mergeMap } from 'rxjs';

export type requestActions<Result> = {
    success$: Observable<Action<Result, `${string}.success$`>>;
    error$: Observable<Action<unknown, `${string}.error$`>>;
};

export type RequestActionsWithSource<Result, Args = void> = requestActions<Result> & {
    source$: Source<Args>;
    next: Args extends void ? () => void : (args: Args) => void;
};

export type RequestProject<Result, Args = void> = (() => Observable<Result>) | ((args: Args) => Observable<Result>);

export function createRequestActions<Result, Args = void>(type: string, request: RequestProject<Result, Args>) {
    if (isObservable(request)) {
        return getRequestSources(`${type}.start$`, request);
    }
    const source$ = new Source<Args>(type);
    const requestSources = getRequestSources(
        type,
        source$.pipe(
            mergeMap((action) => {
                return (request as any)(action.payload);
            })
        )
    );
    return {
        ...requestSources,
        source$: source$.asObservable(),
        next: source$.next.bind(source$) as Args extends void ? () => void : (args: Args) => void,
    };
}

export function createRequestsGroup<
    Props extends Record<string, RequestProject<any, any> | RequestProject<any, void> | Observable<any>>
>(typePrefix: string, requests: Props) {
    const requestActions: Record<string, unknown> = {};
    for (const [key, request] of Object.entries(requests)) {
        if (isObservable(request)) {
            requestActions[key] = getRequestSources(`[${typePrefix}] ${key}.start$`, request);
            continue;
        }
        requestActions[key] = createRequestActions(`${typePrefix} ${key}`, request as RequestProject<unknown, unknown>);
    }
    return requestActions as {
        [K in keyof Props]: Props[K] extends RequestProject<infer Result, infer Args>
            ? RequestActionsWithSource<Result, Args>
            : Props[K] extends Observable<infer Result>
            ? requestActions<Result>
            : never;
    };
}
