export function patchItemById<T extends { id: string }>(items: T[], id: string, patch: Partial<T>) {
    return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}
