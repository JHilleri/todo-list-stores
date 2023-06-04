import { Signal, signal, computed } from '@angular/core';
import { createUpdater } from './create-updater';

export type SignalApiFactory<T, API> = (initialValue: T, parent: { signal: () => T; set: (v: T) => void }) => API;
export function createJoinSignalFactory<Childs extends Record<string, SignalApiFactory<any, any>>>(
    childFactories: Childs
) {
    const childKeys = Object.keys(childFactories) as (keyof Childs)[];
    type Value = { [K in keyof Childs]: Childs[K] extends SignalApiFactory<infer V, any> ? V : never };
    type ReactiveSignal<Childs extends Record<string, SignalApiFactory<any, any>>> = {
        [K in keyof Childs]: Signal<Childs[K]> & ReturnType<Childs[K]>;
    };

    const factory = (initialValue: Value, parent?: { signal: () => Value; set: (v: Value) => void }) => {
        const newSignal = !parent ? signal(initialValue) : undefined;
        if (newSignal) {
            parent = {
                signal: newSignal,
                set: newSignal.set,
            };
        }
        const childValues = {} as ReactiveSignal<Childs>;
        for (const key of childKeys) {
            const selector = computed(() => parent!.signal()[key]);
            childValues[key] = Object.assign(
                selector,
                childFactories[key](initialValue[key], {
                    signal: selector,
                    set: (value: Value[typeof key]) => {
                        parent?.set({
                            ...parent.signal(),
                            [key]: value,
                        });
                    },
                })
            );
        }

        const result = Object.assign(parent!.signal, childValues) as Signal<{ [K in keyof Value]: Value[K] }> & {
            [K in keyof Childs]: Signal<Childs[K] extends SignalApiFactory<infer T, any> ? T : never> &
                ReturnType<Childs[K]>;
        };
        return Object.assign(result, {
            set: createUpdater(parent!.set),
            reset: createUpdater(() => parent!.set(initialValue)),
        });
    };

    return Object.assign(factory, {
        withAdditionalApi<AdditionalApi extends Record<string, any>>(additionalFactory: (store: ReturnType<typeof factory>) => AdditionalApi) {
            return (initialValue: Value, parent?: { signal: () => Value; set: (v: Value) => void }) => {
                const store = factory(initialValue, parent);
                return Object.assign(store, additionalFactory(store));
            }
        }
    });
}
