import { DOCUMENT } from '@angular/common';
import { Directive, effect, inject, input, OnInit } from '@angular/core';

@Directive({
    selector: '[todoListsColorsLoader]',
    standalone: true,
})
export class ColorsLoaderDirective implements OnInit {
    private customCssStyleSheet = new CSSStyleSheet();
    private document = inject(DOCUMENT);

    public todoListsColorsLoader = input<string>();

    constructor() {
        effect(() => {
            const styleSeetContent = this.todoListsColorsLoader();
            if (styleSeetContent) {
                this.customCssStyleSheet.replaceSync(styleSeetContent);
            }
        });
    }

    ngOnInit() {
        this.document.adoptedStyleSheets = [this.customCssStyleSheet];
    }
}
