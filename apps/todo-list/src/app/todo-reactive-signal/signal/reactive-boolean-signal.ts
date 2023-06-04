import { signal } from '@angular/core';
import { createSignalWithApi, defaultUpdaters } from './create-signal-with-api';
import { createUpdater } from "./create-updater";

export function reactiveBooleanSignal(config?: { initialValue?: boolean }) {
    const initialSignal = signal(config?.initialValue ?? false);
    return createSignalWithApi(initialSignal.asReadonly(), {
        ...defaultUpdaters(initialSignal),
        setTrue: createUpdater(() => initialSignal.set(true)),
        setFalse: createUpdater(() => initialSignal.set(false)),
        switch: createUpdater(() => initialSignal.update((value) => !value)),
    });
}
