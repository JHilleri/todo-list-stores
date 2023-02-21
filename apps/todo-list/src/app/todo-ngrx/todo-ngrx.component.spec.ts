import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoNgrxComponent } from './todo-ngrx.component';

describe('TodoNgrxComponent', () => {
    let component: TodoNgrxComponent;
    let fixture: ComponentFixture<TodoNgrxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TodoNgrxComponent, ],
        }).compileComponents();

        fixture = TestBed.createComponent(TodoNgrxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
