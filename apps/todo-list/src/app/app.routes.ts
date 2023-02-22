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
    {
        path: 'ngrx-component-store',
        loadComponent: () =>
            import(
                './todo-ngrx-component-store/todo-ngrx-component-store.component'
            ).then((m) => m.TodoNgrxComponentStoreComponent),
        title: 'NgRx Component Store',
    },
    {
        path: 'state-adapt',
        loadComponent: () =>
            import('./todo-state-adapt/todo-state-adapt.component').then(
                (m) => m.TodoStateAdaptComponent
            ),
        title: 'State Adapt',
    },
    {
        path: 'rx-angular',
        loadComponent: () =>
            import('./todo-rx-angular/todo-rx-angular.component').then(
                (m) => m.TodoRxAngularComponent
            ),
        title: 'Rx Angular',
    },
];
