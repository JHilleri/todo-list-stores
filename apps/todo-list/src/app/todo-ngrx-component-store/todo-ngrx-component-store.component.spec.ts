import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoNgrxComponentStoreComponent } from './todo-ngrx-component-store.component';

describe('TodoNgrxComponentStoreComponent', () => {
    let component: TodoNgrxComponentStoreComponent;
    let fixture: ComponentFixture<TodoNgrxComponentStoreComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TodoNgrxComponentStoreComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TodoNgrxComponentStoreComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
