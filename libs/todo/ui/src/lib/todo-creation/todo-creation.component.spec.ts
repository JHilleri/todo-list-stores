import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoCreationComponent } from './todo-creation.component';

describe('TodoCreationComponent', () => {
    let component: TodoCreationComponent;
    let fixture: ComponentFixture<TodoCreationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TodoCreationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TodoCreationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
