export type ApiFactoryParams<T> = {
    getter: () => T;
    setter: (value: T) => void;
    initialValue: T;
};
