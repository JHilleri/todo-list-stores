import { Signal } from '@angular/core';
import { behaviourSubjectReactiveFactory, createReactive } from './create-reactive-behavior';
import { createReactiveSignal } from './create-reactive-signal';

export const reactiveBooleanSignal = createReactiveSignal((state: Signal<boolean>) => ({
    setTrue: () => true,
    setFalse: () => false,
    switch: () => !state(),
}));

export const reactiveBoolean = createReactive(
    (state: () => boolean) => ({
        setTrue: () => true,
        setFalse: () => false,
        switch: () => !state(),
    }),
    behaviourSubjectReactiveFactory
);
