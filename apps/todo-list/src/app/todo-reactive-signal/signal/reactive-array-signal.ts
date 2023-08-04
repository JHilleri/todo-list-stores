import { signal } from '@angular/core';
import { createReactive, usingSignal, withUpdaters } from './../reactive';

export const reactiveArraySignal = createReactive(
    usingSignal(<T>(initial: T[]) => signal(initial)),
    withUpdaters(<T>(getState: () => T[]) => ({
        addItem: (item: T) => [...getState(), item],
    }))
);
