import { Updater } from './create-updater';
import { ContainerFactory } from './container-factory';
import { ApiFactoryParams } from './api-factory-params';

export function createReactive<T, C extends ContainerFactory<T, any>, API extends Record<string, Updater<any>>>(
    containerFactory: (initialValue: T) => C,
    apiFactory: (params: ApiFactoryParams<T>) => API
) {
    return (initialValue: T, actions?: (api: API) => void) => {
        const { getter, setter, valueContainer: value } = containerFactory(initialValue);

        actions?.(
            apiFactory({
                getter,
                setter,
                initialValue,
            })
        );

        return value as C['valueContainer'];
    };
}
