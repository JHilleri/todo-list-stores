import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoCardGridComponent } from './todo-card-grid.component';

describe('TodoCardGridComponent', () => {
    let component: TodoCardGridComponent;
    let fixture: ComponentFixture<TodoCardGridComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TodoCardGridComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TodoCardGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
