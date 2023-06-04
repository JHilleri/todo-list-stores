import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subscription, isObservable, pipe } from 'rxjs';

interface UpdaterOptions {
    manualCleanup?: boolean;
}

type TypeOrAny<T> = T extends void ? any : T;
export type Updater<T> = (value: T) => void & {
    when: (value: Observable<TypeOrAny<T>> | Observable<TypeOrAny<T>>[], options?: UpdaterOptions) => Subscription;
};

export function createUpdater<T = void>(set: (value: T) => void) {
    type ObservableOrArray<T> = Observable<TypeOrAny<T>> | Observable<TypeOrAny<T>>[];
    return Object.assign(set, {
        when: (value: ObservableOrArray<T>, options?: UpdaterOptions) => {
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
