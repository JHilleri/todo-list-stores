import { Signal, signal } from '@angular/core';
import { withUpdaters } from './with-reactions';

export function extendsSignal<T extends Signal<any>, R>(source: T, operator: (value: T) => R) {
    return operator(source);
}

export function createSignal<T>(initialValue: T) {
    return extendsSignal(
        signal<T>(initialValue),
        withUpdaters(({ set }) => ({
            set: (value: T) => set(value),
        }))
    );
}

export function createBooleanSignal(initialValue?: boolean) {
    return extendsSignal(
        signal(initialValue ?? false),
        withUpdaters(({ set }) => ({
            set,
            setTrue: () => set(true),
            setFalse: () => set(false),
        }))
    );
}

export function createArraySignal<T>(initialValue?: T[]) {
    return extendsSignal(
        createSignal(initialValue ?? []),
        withUpdaters((items) => ({
            push: (value: T) => items.set([...items(), value]),
        }))
    );
}

export function createCollectionSignal<T extends { id: string | number }>(initialValue?: T[]) {
    return extendsSignal(
        createArraySignal(initialValue),
        withUpdaters((items) => ({
            replaceItem: (item: T) => items.update((items) => items.map((it) => (it.id === item.id ? item : it))),
            removeItem: (id: T['id']) => items.update((items) => items.filter((it) => it.id !== id)),
        }))
    );
}
