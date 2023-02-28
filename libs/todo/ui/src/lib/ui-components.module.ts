import { NgModule } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { FieldComponent } from './field/field.component';
import { FiltersComponent } from './filters/filters.component';
import { LoadingComponent } from './loading/loading.component';
import { LogStateDirective } from './log-state.directive';
import { TodoCardGridComponent } from './todo-card-grid/todo-card-grid.component';
import { TodoCardComponent } from './todo-card/todo-card.component';
import { TodoCreationComponent } from './todo-creation/todo-creation.component';

@NgModule({
    imports: [
        ButtonComponent,
        FieldComponent,
        LoadingComponent,
        FiltersComponent,
        TodoCardComponent,
        TodoCardGridComponent,
        TodoCreationComponent,
        LogStateDirective,
    ],
    exports: [
        ButtonComponent,
        FieldComponent,
        LoadingComponent,
        FiltersComponent,
        TodoCardComponent,
        TodoCardGridComponent,
        TodoCreationComponent,
        LogStateDirective,
    ],
})
export class UiComponentsModule {}
