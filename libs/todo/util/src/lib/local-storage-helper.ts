export class LocalStorageHelper<T> {
    constructor(public readonly key: string) {}

    set(date: T) {
        localStorage.setItem(this.key, JSON.stringify(date));
    }

    get(): T | null {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : null;
    }

    remove() {
        localStorage.removeItem(this.key);
    }
}
