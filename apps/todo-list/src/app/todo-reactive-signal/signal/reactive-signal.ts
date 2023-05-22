import { signal } from '@angular/core';
import { createSignalWithApi, defaultUpdaters } from './create-signal-with-api';

export function reactiveSignal<T>(config: { initialValue: T }) {
    const initialSignal = signal(config.initialValue);
    return createSignalWithApi(initialSignal.asReadonly(), defaultUpdaters(initialSignal));
}
