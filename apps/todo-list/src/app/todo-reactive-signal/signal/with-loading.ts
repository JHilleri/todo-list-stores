import { createBooleanSignal } from './create-signal';

export function withLoading() {
    return <Base>(base: Base) => {
        const isLoading = createBooleanSignal(false);
        return Object.assign(base as any, {
            isLoading: isLoading,
        }) as Base & {
            isLoading: typeof isLoading;
        };
    };
}

export function withUpdating() {
    return <Base>(base: Base) => {
        const isUpdating = createBooleanSignal(false);
        return Object.assign(base as any, {
            isUpdating,
        }) as Base & {
            isUpdating: typeof isUpdating;
        };
    };
}
