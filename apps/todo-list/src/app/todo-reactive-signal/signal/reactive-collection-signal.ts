import { Signal } from '@angular/core';
import { createReactiveSignal } from './create-reactive-signal';

export const reactiveCollectionSignal = createReactiveSignal(
    <T extends { id: string | number }>(state: Signal<T[]>) => ({
        addItem: (item: T) => [...state(), item],
        replaceItem: (item: T) => state().map((it) => (it.id === item.id ? item : it)),
        removeItem: (id: T['id']) => state().filter((it) => it.id !== id),
    })
);
