import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImperativeComponent } from './imperative.component';

describe('TodoListComponent', () => {
    let component: ImperativeComponent;
    let fixture: ComponentFixture<ImperativeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImperativeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ImperativeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
