import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { CategoryService, TodoService } from '@todo-lists/todo/data-access';
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
                    map((items) => todoActions.loadItemsCompleted({ items })),
                    catchError((error) => of(todoActions.loadItemsFailed({ error })))
                )
            )
        )
    );

    loadItemsError$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(todoActions.loadItemsFailed),
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
                    map((item) => todoActions.addCompleted({ item })),
                    catchError((error) => of(todoActions.addFailed({ error })))
                )
            )
        )
    );

    addTodoError$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(todoActions.addFailed),
                tap(({ error }) => {
                    console.error(error);
                })
            ),
        { dispatch: false }
    );

    updateTodo$ = createEffect(() =>
        this.actions$.pipe(
            ofType(todoActions.updateItem),
            mergeMap((param) =>
                this.todoService.updateTodo(param).pipe(
                    map((item) => todoActions.updateItemCompleted({ item })),
                    catchError((error) => of(todoActions.updateItemFailed({ error })))
                )
            )
        )
    );

    updateTodoError$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(todoActions.updateItemFailed),
                tap(({ error }) => {
                    console.error(error);
                })
            ),
        { dispatch: false }
    );

    completeAll$ = createEffect(() =>
        this.actions$.pipe(
            ofType(todoActions.completeAll),
            mergeMap(() =>
                this.todoService.updateAllTodos({ completed: true }).pipe(
                    map((items) => todoActions.completeAllCompleted({ items })),
                    catchError((error) => of(todoActions.completeAllFailed({ error })))
                )
            )
        )
    );

    completeAllError$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(todoActions.completeAllFailed),
                tap(({ error }) => {
                    console.error(error);
                })
            ),
        { dispatch: false }
    );

    uncompleteAll$ = createEffect(() =>
        this.actions$.pipe(
            ofType(todoActions.uncompleteAll),
            mergeMap(() =>
                this.todoService.updateAllTodos({ completed: false }).pipe(
                    map((items) => todoActions.uncompleteAllCompleted({ items })),
                    catchError((error) => of(todoActions.uncompleteAllFailed({ error })))
                )
            )
        )
    );

    uncompleteAllError$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(todoActions.uncompleteAllFailed),
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
                    map((categories) => todoActions.loadCategoriesCompleted({ categories })),
                    catchError((error) => of(todoActions.loadCategoriesFailed({ error })))
                )
            )
        )
    );

    loadCategoriesError$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(todoActions.loadCategoriesFailed),
                tap(({ error }) => {
                    console.error(error);
                })
            ),
        { dispatch: false }
    );
}
