import { signal } from '@angular/core';
import { createReactive, usingSignal, withUpdaters } from './../reactive';

type BasicCollectionItem = { id: string | number };

export const reactiveCollectionSignal = createReactive(
    usingSignal(<T extends BasicCollectionItem>(initial: T[]) => signal(initial)),
    withUpdaters(<T extends BasicCollectionItem>(getState: () => T[]) => ({
        addItem: (item: T) => [...getState(), item],
        updateItem: (item: T) => getState().map((current) => (current.id === item.id ? item : current)),
        removeItem: (id: T['id']) => getState().filter((it) => it.id !== id),
    }))
);
