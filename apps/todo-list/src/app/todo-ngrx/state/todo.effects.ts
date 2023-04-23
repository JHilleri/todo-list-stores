import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { CategoryService } from '../../category.service';
import { TodoService } from '../../todo.service';
import { todoActions } from './todo.actions';

@Injectable()
export class TodoEffectsService {
    private actions$ = inject(Actions);
    private todoService = inject(TodoService);
    private categoryService = inject(CategoryService);

    loadItems$ = createEffect(() =>
        this.actions$.pipe(
            ofType(todoActions.load),
            switchMap(() =>
                this.todoService.getTodos().pipe(
                    map((items) => todoActions.load_items_completed({ items })),
                    catchError((error) => of(todoActions.load_items_failed({ error })))
                )
            )
        )
    );

    loadItemsError$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(todoActions.load_items_failed),
                tap(({ error }) => {
                    console.error(error);
                })
            ),
        { dispatch: false }
    );

    addTodo$ = createEffect(() =>
        this.actions$.pipe(
            ofType(todoActions.add),
            mergeMap((action) =>
                this.todoService.createTodo(action.params).pipe(
                    map((item) => todoActions.add_completed({ item })),
                    catchError((error) => of(todoActions.add_failed({ error })))
                )
            )
        )
    );

    addTodoError$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(todoActions.add_failed),
                tap(({ error }) => {
                    console.error(error);
                })
            ),
        { dispatch: false }
    );

    updateTodo$ = createEffect(() =>
        this.actions$.pipe(
            ofType(todoActions.update_item),
            mergeMap(({ itemId, changes }) =>
                this.todoService.updateTodo(itemId, changes).pipe(
                    map((item) => todoActions.update_item_completed({ item })),
                    catchError((error) => of(todoActions.update_item_failed({ error })))
                )
            )
        )
    );

    updateTodoError$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(todoActions.update_item_failed),
                tap(({ error }) => {
                    console.error(error);
                })
            ),
        { dispatch: false }
    );

    completeAll$ = createEffect(() =>
        this.actions$.pipe(
            ofType(todoActions.complete_all),
            mergeMap(() =>
                this.todoService.updateAllTodos({ completed: true }).pipe(
                    map((items) => todoActions.complete_all_completed({ items })),
                    catchError((error) => of(todoActions.complete_all_failed({ error })))
                )
            )
        )
    );

    completeAllError$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(todoActions.complete_all_failed),
                tap(({ error }) => {
                    console.error(error);
                })
            ),
        { dispatch: false }
    );

    uncompleteAll$ = createEffect(() =>
        this.actions$.pipe(
            ofType(todoActions.uncomplete_all),
            mergeMap(() =>
                this.todoService.updateAllTodos({ completed: false }).pipe(
                    map((items) => todoActions.uncomplete_all_completed({ items })),
                    catchError((error) => of(todoActions.uncomplete_all_failed({ error })))
                )
            )
        )
    );

    uncompleteAllError$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(todoActions.uncomplete_all_failed),
                tap(({ error }) => {
                    console.error(error);
                })
            ),
        { dispatch: false }
    );

    loadCategories$ = createEffect(() =>
        this.actions$.pipe(
            ofType(todoActions.load),
            switchMap(() =>
                this.categoryService.getCategories().pipe(
                    map((categories) => todoActions.load_categories_completed({ categories })),
                    catchError((error) => of(todoActions.load_categories_failed({ error })))
                )
            )
        )
    );

    loadCategoriesError$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(todoActions.load_categories_failed),
                tap(({ error }) => {
                    console.error(error);
                })
            ),
        { dispatch: false }
    );
}
