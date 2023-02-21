import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadComponent: () =>
            import('@todo-lists/todo-ngrx/todo-list-feature').then(
                (m) => m.TodoListComponent
            ),
    },
];
