import { WritableSignal, signal } from '@angular/core';

export interface CollectionSignal<T> extends WritableSignal<T[]> {
    add: (item: T) => void;
    updateItem: (item: T) => void;
    remove: (itemId: string) => void;
}

export function createCollectionSignal<T>(idSelector: (item: T) => string) {
    const result = signal([]) as unknown as CollectionSignal<T>;

    result.add = (item: T) => result.update((items) => [...items, item]);
    result.updateItem = (item: T) =>
        result.update((items) => items.map((it) => (idSelector(it) === idSelector(item) ? item : it)));
    result.remove = (itemId: string) => result.update((items) => items.filter((item) => idSelector(item) !== itemId));

    return result;
}
