import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'tdl-loading',
    standalone: true,
    imports: [CommonModule],
    template: `
        Loading...
        <progress></progress>
    `,
    styles: [`
        :host {
            display: grid;
            place-items: center;
            gap: 1rem;
        }
    `],
})
export class LoadingComponent {}
