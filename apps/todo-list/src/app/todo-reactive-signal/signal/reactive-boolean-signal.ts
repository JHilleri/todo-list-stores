import { createReactive, usingSignal, withUpdaters } from './../reactive';

export const reactiveBooleanSignal = createReactive(
    usingSignal<boolean>(),
    withUpdaters((state) => ({
        setTrue: () => true,
        setFalse: () => false,
        switch: () => !state(),
    }))
);
