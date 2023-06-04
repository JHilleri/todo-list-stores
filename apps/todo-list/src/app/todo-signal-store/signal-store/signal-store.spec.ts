import { of } from 'rxjs';
import { createJoinSignalFactory } from './joinSignalFactory';
import { createBasicSignalFactory, numberSignalFactory } from './signal-factories';

describe('SignalStore', () => {
    it('should create an instance', () => {
        const testSignalFactory = createJoinSignalFactory({
            count: numberSignalFactory,
            isLoading: createBasicSignalFactory<boolean>(),
        });

        const testSignal = testSignalFactory({ count: 0, isLoading: true });

        expect(testSignal()).toStrictEqual({ count: 0, isLoading: true });
        expect(testSignal.count()).toBe(0);
        expect(testSignal.isLoading()).toBe(true);

        testSignal.count.set.when(of(1), { manualCleanup: true });
        expect(testSignal()).toStrictEqual({ count: 1, isLoading: true });

        testSignal.count.set(2);
        testSignal.isLoading.set(false);
        expect(testSignal()).toStrictEqual({ count: 2, isLoading: false });

        testSignal.count.reset();
        expect(testSignal()).toStrictEqual({ count: 0, isLoading: false });

        testSignal.count.increment();
        expect(testSignal()).toStrictEqual({ count: 1, isLoading: false });
        testSignal.set({ count: 1, isLoading: true });
    });
});
