import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { OpenDialogDirective } from './open-dialog.directive';
import { ReplaySubject, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { LetDirective } from '@rx-angular/template/let';

@Component({
    selector: 'tdl-dialog',
    standalone: true,
    imports: [LetDirective, OpenDialogDirective],
    template: `
        <dialog
            #dialog
            *rxLet="vm$; let isOpen"
            (close)="closed.next()"
            [tdlOpenDialog]="isOpen"
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
    protected open$ = new ReplaySubject<boolean>(1);

    @Input() set open(value: boolean) {
        this.open$.next(value);
    }

    @Output() closed = new Subject<void>();

    protected vm$ = this.open$.pipe(debounceTime(0), distinctUntilChanged());
}
