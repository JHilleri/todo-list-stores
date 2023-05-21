import { getRequestSources, Source } from '@state-adapt/rxjs';
import { Observable, isObservable, mergeMap } from 'rxjs';

export type RequestProject<Result, Args = void> = (() => Observable<Result>) | ((args: Args) => Observable<Result>);

export function createRequestActions<Type extends string, Result, Args = void>(
    type: Type,
    request: RequestProject<Result, Args>
) {
    if (isObservable(request)) {
        return getRequestSources(type, request);
    }
    const source$ = new Source<Args>(`${type}.start$`);
    const requestSources = getRequestSources(
        type,
        source$.pipe(
            mergeMap((action) => {
                return request(action.payload);
            })
        )
    );
    return {
        ...requestSources,
        source$: source$.asObservable(),
        next: source$.next.bind(source$) as Args extends void ? () => void : (args: Args) => void,
    };
}
