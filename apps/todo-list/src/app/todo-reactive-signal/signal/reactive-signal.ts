import { signal } from '@angular/core';
import { createReactive, usingSignal, withUpdaters } from './../reactive';

export const reactiveSignal = createReactive(usingSignal(signal), withUpdaters());
