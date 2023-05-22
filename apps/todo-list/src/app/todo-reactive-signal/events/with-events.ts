import { Subject } from 'rxjs';

export function withEvents<T extends Record<string, Subject<any>>>(obj: T) {
    return <Base>(base: Base): Base & T => {
        return {
            ...base,
            ...obj,
        };
    };
}
