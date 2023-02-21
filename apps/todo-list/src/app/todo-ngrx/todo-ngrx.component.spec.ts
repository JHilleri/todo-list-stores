import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { TodoEffectsService } from './state/todo.effects';
import { todoFeature } from './state/todo.reducer';

import { TodoNgrxComponent } from './todo-ngrx.component';

describe('TodoNgrxComponent', () => {
    let component: TodoNgrxComponent;
    let fixture: ComponentFixture<TodoNgrxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TodoNgrxComponent],
            providers: [
                provideStore({}),
                provideState(todoFeature),
                provideEffects(TodoEffectsService),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TodoNgrxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
