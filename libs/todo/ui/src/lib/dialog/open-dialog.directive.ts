import { Directive, ElementRef, HostListener, inject, Input } from '@angular/core';

@Directive({
    selector: '[tdlOpenDialog]',
    standalone: true,
})
export class OpenDialogDirective {
    element = inject<ElementRef<HTMLDialogElement>>(ElementRef);

    @Input('tdlOpenDialog') set open(value: boolean) {
        if (value) {
            this.element.nativeElement.showModal();
        } else {
            this.element.nativeElement.close();
        }
    }

    @Input() closeOnOutsideClick = true;

    @HostListener('click', ['$event.target']) onClick(target: HTMLElement) {
        if (target === this.element.nativeElement && this.closeOnOutsideClick) {
            this.element.nativeElement.close();
        }
    }
}
