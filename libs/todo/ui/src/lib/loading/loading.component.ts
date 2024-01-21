import { Component } from '@angular/core';


@Component({
    selector: 'tdl-loading',
    standalone: true,
    imports: [],
    template: `
        Loading ...
        <progress></progress>
    `,
    styles: [`
        :host {
            display: grid;
            place-items: center;
            align-content: center;
            gap: 1rem;
        }

        progress {
            accent-color: var(--primary);
        }
    `],
})
export class LoadingComponent {}
