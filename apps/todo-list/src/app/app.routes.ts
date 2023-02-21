import { Route } from '@angular/router';

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
    },
    {
        path: 'rxjs',
        loadComponent: () =>
            import('./todo-rxjs/todo-rxjs.component').then(
                (m) => m.TodoRxjsComponent
            ),
    },
];
