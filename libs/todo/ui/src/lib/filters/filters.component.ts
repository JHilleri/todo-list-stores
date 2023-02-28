import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'tdl-filters',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
    @Input() public showCompleted = false;
    @Input() public filter = '';

    @Output() public updateShowCompleted = new EventEmitter<boolean>();
    @Output() public updateFilter = new EventEmitter<string>();
}
