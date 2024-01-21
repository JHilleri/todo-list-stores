import { DOCUMENT } from '@angular/common';
import { Directive, Renderer2, effect, inject, input } from '@angular/core';
import { Theme, THEMES, THEMES_CLASSES } from '@todo-lists/settings/utils';

@Directive({
    selector: '[todoListsThemeLoader]',
    standalone: true,
})
export class ThemeLoaderDirective {
    private renderer = inject(Renderer2);
    private document = inject(DOCUMENT);

    public todoListsThemeLoader = input<Theme>();

    constructor() {
        effect(() => {
            const theme = this.todoListsThemeLoader() ?? 'auto';

            const element = this.document.body;
            const classToApply = THEMES[theme];

            for (const previousThemeClass of THEMES_CLASSES) {
                this.renderer.removeClass(element, previousThemeClass);
            }

            if (classToApply) {
                this.renderer.addClass(element, classToApply);
            }
        });
    }
}
