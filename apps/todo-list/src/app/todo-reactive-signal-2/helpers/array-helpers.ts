export function addItem<T>() {
    return (state: T[], item: T) => {
        return [...state, item];
    };
}
