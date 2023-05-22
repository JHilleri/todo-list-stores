import { Observable, mergeMap } from 'rxjs';

export function createQuery<I, R>(source$: Observable<I>, operator: (v: I) => Observable<R>) {
    return mergeMap(operator)(source$);
}
