import { createReactiveSignal } from './create-reactive-signal';
import { Signal } from '@angular/core';

export const reactiveBooleanSignal = createReactiveSignal((state: Signal<boolean>) => ({
    setTrue: () => true,
    setFalse: () => false,
    switch: () => !state(),
}));
