import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { adaptReducer } from '@state-adapt/core';

import { TodoStateAdaptComponent } from './todo-state-adapt.component';

describe('TodoStateAdaptComponent', () => {
    let component: TodoStateAdaptComponent;
    let fixture: ComponentFixture<TodoStateAdaptComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                TodoStateAdaptComponent,
                provideStore({ adapt: adaptReducer }),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TodoStateAdaptComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
