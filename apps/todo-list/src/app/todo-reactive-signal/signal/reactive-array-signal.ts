import { Signal } from '@angular/core';
import { createReactiveSignal } from './create-reactive-signal';

export const reactiveArraySignal = createReactiveSignal(<T>(state: Signal<T[]>) => ({
    addItem: (item: T) => [...state(), item],
}));
