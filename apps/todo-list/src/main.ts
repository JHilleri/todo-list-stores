import { bootstrapApplication } from '@angular/platform-browser';
import {
    provideRouter,
    withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {
    actionSanitizer,
    adaptReducer,
    stateSanitizer,
} from '@state-adapt/core';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
        provideStore({
            router: routerReducer,
            adapt: adaptReducer,
        }),
        provideEffects(),
        provideStoreDevtools({
            actionSanitizer,
            stateSanitizer,
        }),
        provideRouterStore(),
    ],
}).catch((err) => console.error(err));
