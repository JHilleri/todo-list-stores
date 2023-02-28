import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'tdl-field',
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    styles: [
        `
            :host {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldComponent {}
