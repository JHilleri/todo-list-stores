export function patchItemById<T extends { id: number }>(items: T[], id: number, patch: Partial<T>) {
    return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}
