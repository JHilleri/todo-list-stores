import { Signal, WritableSignal, signal } from '@angular/core';
import { ContainerFactory } from './container-factory';

export function usingSignal<T>(factory: (initial: T) => WritableSignal<T> = signal) {
    return (initialValue: T): ContainerFactory<T, Signal<T>> => {
        const base = factory(initialValue);
        return {
            getter: base,
            setter: base.set,
            valueContainer: base,
            initialValue,
        };
    };
}
