import { DOCUMENT } from '@angular/common';
import { Directive, Input, Renderer2, inject } from '@angular/core';
import { Theme, THEMES, THEMES_CLASSES } from '@todo-lists/settings/utils';

@Directive({
    selector: '[todoListsThemeLoader]',
    standalone: true,
})
export class ThemeLoaderDirective {
    private renderer = inject(Renderer2);
    private document = inject(DOCUMENT);

    @Input('todoListsThemeLoader')
    set theme(theme: Theme) {
        const element = this.document.body;
        const classToApply = THEMES[theme];

        for (const previousThemeClass of THEMES_CLASSES) {
            this.renderer.removeClass(element, previousThemeClass);
        }

        if (classToApply) {
            this.renderer.addClass(element, classToApply);
        }
    }
}
