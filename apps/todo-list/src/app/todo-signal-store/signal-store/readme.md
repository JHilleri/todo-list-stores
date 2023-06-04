```ts
const demoSignalFactory = createSignalFactory({
    count: numberSignalFactory,
    isLoading: booleanSignalFactory,
}).withAdditionalApi((set, update, mutate, get, api) => ({
    loadedValue: computed(() => (api.isLoading() ? undefined : api.count())),
}));

const demoSignal = demoSignalFactory({ count: 0, isLoading: false });

demoSignal.set({ count: 1, isLoading: true });
demoSignal.count.set(2);
demoSignal.isLoading.set(false);
demoSignal.loadedValue(); // 2
const isLoading$ = new Subject<boolean>();
demoSignal.isLoading.set.when(isLoading$);
```
