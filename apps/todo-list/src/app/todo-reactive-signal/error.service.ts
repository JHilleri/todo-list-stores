import { Injectable, InjectionToken } from '@angular/core';
import { createEffect } from './signal';

export const ErrorService = new InjectionToken('ErrorService', {
    providedIn: 'root',
    factory: () => {
        const name = 'ErrorService';
        return {
            handleError: createEffect((error) => console.error(name, error)),
        };
    },
});

@Injectable({
    providedIn: 'root',
})
export class ErrorService2 {
    private name = 'ErrorService';
    public readonly handleError = createEffect((error) => console.error(this.name, error));
}

// type InjectedType<T> = T extends InjectionToken<infer U> ? U : never;
// class ErrorServiceMock implements InjectedType<typeof ErrorService> {
//     handleError = createEffect((error) => console.error('ErrorService', error));
// }

// ! not working as the private field name is required
// class ErrorService2Mock implements ErrorService2 {
//     handleError = createEffect((error) => console.error('ErrorService', error));
// }
