import { computed, signal } from '@angular/core';

describe('signal', () => {
    it('can read a value', () => {
        const value = signal(0);

        expect(value()).toBe(0);
    });

    it('can write a value', () => {
        const value = signal(0);

        value.set(1);
        expect(value()).toBe(1);
    });

    it('can be updated or mutated', () => {
        const value = signal({ a: 0, b: 1 });
        value.update((v) => ({ ...v, a: 1 }));
        expect(value()).toStrictEqual({ a: 1, b: 1 });

        value.mutate((v) => (v.a = 2));
        expect(value()).toStrictEqual({ a: 2, b: 1 });
    });

    it('can make a signal from a signal', () => {
        const value = signal(0);
        const isEven = computed(() => value() % 2 === 0);

        expect(isEven()).toBe(true);

        value.set(1);
        expect(isEven()).toBe(false);
    });

    it('only recompute when a dependency changes', () => {
        const value = signal(0);
        let timesComputed = 0;
        const isEven = computed(() => {
            timesComputed++;
            return value() % 2 === 0;
        });

        expect(timesComputed).toBe(0);

        isEven();
        expect(timesComputed).toBe(1);

        isEven();
        expect(timesComputed).toBe(1);

        value.set(1);
        isEven();
        expect(timesComputed).toBe(2);

        value.set(1);
        isEven();
        expect(timesComputed).toBe(2);
    });

    it('only recompute when used dependencies change', () => {
        const valueA = signal(0);
        const valueB = signal(1);
        const useValueA = signal(true);
        let timesComputed = 0;
        const result = computed(() => {
            timesComputed++;
            return useValueA() ? valueA() : valueB();
        });

        result();
        expect(timesComputed).toBe(1);
        expect(result()).toBe(0);

        valueB.set(2);
        result();
        expect(timesComputed).toBe(1);
        expect(result()).toBe(0);

        useValueA.set(false);
        result();
        expect(timesComputed).toBe(2);
        expect(result()).toBe(2);
    });
});
