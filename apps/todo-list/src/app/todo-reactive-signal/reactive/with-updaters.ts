import { Updater, createUpdater } from './create-updater';
import { ApiFactoryParams } from './api-factory-params';

export function withUpdaters<T, API extends Record<string, (event: any) => T>>(factory?: (state: () => T) => API) {
    return ({ getter, setter, initialValue }: ApiFactoryParams<T>) => {
        const baseApi = {
            set: (value: T) => value,
            reset: () => initialValue,
            ...factory?.(getter),
        };

        const api = Object.entries(baseApi).reduce((acc, [key, action]) => {
            acc[key] = createUpdater((value: any) => setter(action(value)));
            return acc;
        }, {} as Record<string, Updater<unknown>>) as {
            set: Updater<T>;
            reset: Updater<void>;
        } & {
            [key in keyof API]: Updater<Parameters<API[key]>['0']>;
        };

        return api;
    };
}
