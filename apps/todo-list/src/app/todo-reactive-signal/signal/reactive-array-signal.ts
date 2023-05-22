import { signal } from '@angular/core';
import { createSignalWithApi, defaultUpdaters, createUpdater } from './create-signal-with-api';

export function reactiveArraySignal<T>(config?: { initialValue?: T[] }) {
    const initialSignal = signal(config?.initialValue ?? []);
    return createSignalWithApi(initialSignal.asReadonly(), {
        ...defaultUpdaters(initialSignal),
        addItem: createUpdater((value: T) => initialSignal.set([...initialSignal(), value])),
    });
}
