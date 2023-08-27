import { BehaviorSubject, Observable } from 'rxjs';
import { ContainerFactory } from './container-factory';

export function usingBehaviourSubject<T>(initialValue: T): ContainerFactory<T, Observable<T>> {
    const base = new BehaviorSubject(initialValue);
    return {
        getter: () => base.getValue(),
        setter: (value) => base.next(value),
        valueContainer: base.asObservable(),
        initialValue,
    };
}
