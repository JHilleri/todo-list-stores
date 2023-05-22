import { signal } from '@angular/core';
import { createSignalWithApi, createUpdater, defaultUpdaters } from './create-signal-with-api';

export function reactiveCollectionSignal<T extends { id: string | number }>(config?: { initialValue?: T[] }) {
    const initialSignal = signal(config?.initialValue ?? []);
    return createSignalWithApi(initialSignal.asReadonly(), {
        ...defaultUpdaters(initialSignal),
        addItem: createUpdater((value: T) => initialSignal.set([...initialSignal(), value])),
        replaceItem: createUpdater((item: T) =>
            initialSignal.update((items) => items.map((it) => (it.id === item.id ? item : it)))
        ),
        removeItem: createUpdater((id: T['id']) => initialSignal.update((items) => items.filter((it) => it.id !== id))),
    });
}
