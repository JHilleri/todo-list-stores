import { Injectable } from '@angular/core';
import { createEffect } from './signal';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    public readonly effects = {
        handleError: createEffect(console.error),
    };
}
