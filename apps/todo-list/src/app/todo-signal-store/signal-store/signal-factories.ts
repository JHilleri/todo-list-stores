import { Signal } from "@angular/core";
import { createUpdater } from "./create-updater";
import { SignalApiFactory } from "./joinSignalFactory";

export function signalApiFactory<T, API>(
    factory: (initialValue: T, parent: { signal: Signal<T>; set: (v: T) => void }) => API
) {
    return factory as SignalApiFactory<T, API>;
}

export function createBasicSignalFactory<T>() {
    return signalApiFactory((initialValue: T, { set }) => ({
        set: createUpdater(set),
        reset: createUpdater(() => set(initialValue)),
    }));
}

export const numberSignalFactory = signalApiFactory((initial: number, { set }) => ({
    set: createUpdater(set),
    reset: createUpdater(() => set(initial)),
    increment: createUpdater(() => set(initial + 1)),
}));

export const booleanSignalFactory = signalApiFactory((initial: boolean, { set }) => ({
    set: createUpdater(set),
    reset: createUpdater(() => set(initial)),
    toggle: createUpdater(() => set(!initial)),
    setTrue: createUpdater(() => set(true)),
    setFalse: createUpdater(() => set(false)),
}));

export function createCollectionSignalFactory<T extends { id: string | number }>() {
    return signalApiFactory((initialValue: T[], { signal, set }) => ({
        set: createUpdater(set),
        reset: createUpdater(() => set(initialValue)),
        add: createUpdater((value: T) => set([...signal(), value])),
        remove: createUpdater((id: T['id']) => set(signal().filter((v) => v.id !== id))),
        update: createUpdater((value: T) =>
            set(
                signal().map((v) => {
                    if (v.id === value.id) {
                        return value;
                    }
                    return v;
                })
            )
        ),
    }));
}

export function createArraySignalFactory<T>() {
    return signalApiFactory((initialValue: T[], { signal, set }) => ({
        set: createUpdater(set),
        reset: createUpdater(() => set(initialValue)),
        add: createUpdater((value: T) => set([...signal(), value])),
        remove: createUpdater((value: T) => set(signal().filter((v) => v !== value))),
    }));
}
