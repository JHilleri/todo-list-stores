import { DOCUMENT } from '@angular/common';
import { Directive, inject, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[todoListsColorsLoader]',
    standalone: true,
})
export class ColorsLoaderDirective implements OnInit {
    private customCssStyleSheet = new CSSStyleSheet();
    private document = inject(DOCUMENT);

    @Input('todoListsColorsLoader')
    set styleSeetContent(styleSeetContent: string) {
        this.customCssStyleSheet.replaceSync(styleSeetContent);
    }

    ngOnInit() {
        this.document.adoptedStyleSheets = [this.customCssStyleSheet];
    }
}
