import { Directive, effect, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
    selector: '[tdlOpenDialog]',
    standalone: true,
})
export class OpenDialogDirective {
    element = inject<ElementRef<HTMLDialogElement>>(ElementRef);

    isOpen = input(false, {
        alias: 'tdlOpenDialog',
    });

    closeOnOutsideClick = input(true);

    constructor() {
        effect(() => {
            if (this.isOpen()) {
                this.element.nativeElement.showModal();
            } else {
                this.element.nativeElement.close();
            }
        });
    }

    @HostListener('click', ['$event.target']) onClick(target: HTMLElement) {
        if (target === this.element.nativeElement && this.closeOnOutsideClick()) {
            this.element.nativeElement.close();
        }
    }
}
