import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { TodoEffectsService } from './todo-ngrx/state/todo.effects';
import { todoFeature } from './todo-ngrx/state/todo.reducer';

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'imperative',
    },
    {
        path: 'imperative',
        loadComponent: () =>
            import('./todo-imperative/imperative.component').then(
                (m) => m.ImperativeComponent
            ),
        title: 'Imperative',
    },
    {
        path: 'rxjs',
        loadComponent: () =>
            import('./todo-rxjs/todo-rxjs.component').then(
                (m) => m.TodoRxjsComponent
            ),
        title: 'RxJS',
    },
    {
        path: 'ngrx',
        loadComponent: () =>
            import('./todo-ngrx/todo-ngrx.component').then(
                (m) => m.TodoNgrxComponent
            ),
        providers: [
            provideState(todoFeature),
            provideEffects(TodoEffectsService),
        ],
        title: 'NgRx',
    },
];
