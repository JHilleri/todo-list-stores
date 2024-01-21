import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'tdl-filters',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
    public showCompleted = input(false);
    public filter = input('');

    @Output() public updateShowCompleted = new EventEmitter<boolean>();
    @Output() public updateFilter = new EventEmitter<string>();
}
