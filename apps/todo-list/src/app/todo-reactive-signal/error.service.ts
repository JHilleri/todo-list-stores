import { Injectable } from '@angular/core';
import { createEffect } from './reactive';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    private name = 'ErrorService';
    public readonly handleError = createEffect((error) => console.error(this.name, error));
}
