import { InjectionToken } from '@angular/core';
import { createEffect } from './signal-store/create-effect';

export const ErrorService = new InjectionToken('ErrorService', {
    providedIn: 'root',
    factory: () => {
        return {
            handleError: createEffect((error) => console.error(error)),
        };
    },
});
