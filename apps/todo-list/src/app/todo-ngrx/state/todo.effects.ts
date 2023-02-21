import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, OnInitEffects, ofType } from '@ngrx/effects';
import { getMockedTodoItems } from '@todo-lists/todo/util';
import { delay, map, switchMap } from 'rxjs';
import { todoActions } from './todo.actions';

@Injectable()
export class TodoEffectsService implements OnInitEffects {
    private actions$ = inject(Actions);

    loadItems$ = createEffect(() =>
        this.actions$.pipe(
            ofType(todoActions.load_items),
            switchMap(() => getMockedTodoItems().pipe(delay(2000))),
            map((items) => todoActions.loading_completed({ items }))
        )
    );

    ngrxOnInitEffects() {
        return todoActions.load_items();
    }
}
