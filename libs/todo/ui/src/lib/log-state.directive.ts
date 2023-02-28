import { AfterViewChecked, Directive, Input } from '@angular/core';

@Directive({
    selector: '[tdlLogState]',
    standalone: true,
})
export class LogStateDirective implements AfterViewChecked{
    @Input('tdlLogState') set state(value: unknown) {
        console.log(`state '${this.name}'`, value);
    }

    @Input('tdlLogStateName') name = '';

    ngAfterViewChecked() {
        console.log(`component ${this.name} view checked`);
    }
}
