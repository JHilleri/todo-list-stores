export type ContainerFactory<T, C> = {
    getter: () => T;
    setter: (value: T) => void;
    valueContainer: C;
};
