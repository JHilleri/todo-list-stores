type BasicCollectionItem = { id: string | number };

export function updateItem<T extends BasicCollectionItem>() {
    return (state: T[], item: T) => {
        return state.map((current) => (current.id === item.id ? item : current));
    };
}

export function removeItem<T extends BasicCollectionItem>() {
    return (state: T[], id: T['id']) => {
        return state.filter((it) => it.id !== id);
    };
}
