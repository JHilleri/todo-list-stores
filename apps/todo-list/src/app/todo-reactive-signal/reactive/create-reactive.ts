import { Updater } from './create-updater';
import { ContainerFactory } from './container-factory';
import { ApiFactoryParams } from './api-factory-params';

export function createReactive<T, C, API extends Record<string, Updater<any>>>(
    containerFactory: (initialValue: T) => ContainerFactory<T, C>,
    apiFactory: (params: ApiFactoryParams<T>) => API
) {
    return (initialValue: T, actions?: (api: API) => void) => {
        const container = containerFactory(initialValue);

        actions?.(apiFactory(container));

        return container.valueContainer;
    };
}
