import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'tdl-button, [tdl-button]',
    standalone: true,
    imports: [],
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
    @Input() color: 'primary' | 'secondary' | undefined = undefined;

    @HostBinding('class')
    get hostClasses() {
        return this.color ? `tdl-button--${this.color}` : '';
    }
}
