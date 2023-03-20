import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[tdlLogState]',
    standalone: true,
})
export class LogStateDirective {
    @Input('tdlLogState') set state(value: unknown) {
        console.log(`state '${this.name}'`, value);
    }

    @Input('tdlLogStateName') name = '';
}
