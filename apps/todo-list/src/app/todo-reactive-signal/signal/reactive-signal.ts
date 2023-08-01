import { Signal } from '@angular/core';
import { createReactiveSignal } from './create-reactive-signal';

export const reactiveSignal = createReactiveSignal(<T>(_: Signal<T>) => ({}));
