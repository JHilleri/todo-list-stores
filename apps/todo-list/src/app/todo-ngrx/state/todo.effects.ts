import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap } from 'rxjs';
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
            switchMap(() => this.todoService.getTodos()),
            map((items) => todoActions.load_items_completed({ items }))
        )
    );

    addTodo$ = createEffect(() =>
        this.actions$.pipe(
            ofType(todoActions.add),
            mergeMap((action) => this.todoService.createTodo(action.params)),
            map((item) => todoActions.add_completed({ item }))
        )
    );

    updateTodo$ = createEffect(() =>
        this.actions$.pipe(
            ofType(todoActions.update_item),
            mergeMap(({ itemId, changes }) => this.todoService.updateTodo(itemId, changes)),
            map((result) => todoActions.update_item_completed({ result }))
        )
    );

    completeAll$ = createEffect(() =>
        this.actions$.pipe(
            ofType(todoActions.complete_all),
            mergeMap(() => this.todoService.updateAllTodos({ completed: true })),
            map((items) => todoActions.complete_all_completed({ items }))
        )
    );

    uncompleteAll$ = createEffect(() =>
        this.actions$.pipe(
            ofType(todoActions.uncomplete_all),
            mergeMap(() => this.todoService.updateAllTodos({ completed: false })),
            map((items) => todoActions.uncomplete_all_completed({ items }))
        )
    );

    loadCategories$ = createEffect(() =>
        this.actions$.pipe(
            ofType(todoActions.load),
            switchMap(() => this.categoryService.getCategories()),
            map((categories) => todoActions.load_categories_completed({ categories }))
        )
    );
}
