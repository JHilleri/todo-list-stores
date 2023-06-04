import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subscription, isObservable, pipe } from 'rxjs';

interface EffectOptions {
    manualCleanup?: boolean;
}

type TypeOrAny<T> = T extends void ? any : T;
export type Updater<T> = (value: T) => void & {
    when: (value: Observable<TypeOrAny<T>> | Observable<TypeOrAny<T>>[], options?: EffectOptions) => Subscription;
};

export function createEffect<T = void>(set: (value: T) => void) {
    type ObservableOrArray<T> = Observable<TypeOrAny<T>> | Observable<TypeOrAny<T>>[];
    return Object.assign(set, {
        when: (value: ObservableOrArray<T>, options?: EffectOptions) => {
            const unsubscribePipe = options?.manualCleanup ? pipe() : takeUntilDestroyed<T>();
            if (isObservable(value)) {
                return value.pipe(unsubscribePipe).subscribe(set);
            }
            const subscription = new Subscription();
            for (const item of value) {
                subscription.add(item.pipe(unsubscribePipe).subscribe(set));
            }
            return subscription;
        },
    });
}
