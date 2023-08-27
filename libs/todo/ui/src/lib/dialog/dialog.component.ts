import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { RxLet } from '@rx-angular/template/let';
import { Subject } from 'rxjs';
import { OpenDialogDirective } from './open-dialog.directive';

@Component({
    selector: 'tdl-dialog',
    standalone: true,
    imports: [RxLet, OpenDialogDirective],
    template: `
        <dialog
            #dialog
            (close)="closed.next()"
            [tdlOpenDialog]="open"
        >
            <div>
                <ng-content></ng-content>
            </div>
        </dialog>
    `,
    styles: [
        `
            dialog {
                padding: 0;
                border: none;
                background: none;
                resize: both;
            }
            div {
                height: 100%;
                width: 100%;
                border: 1px solid var(--border);
                border-radius: 0.5rem;
                padding: 1rem;
                background: var(--background);
                box-sizing: border-box;
            }
            dialog::backdrop {
                background-color: hwb(0 50% 50%/ 0.5);
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
    @Input() open = false;
    @Output() closed = new Subject<void>();
}
