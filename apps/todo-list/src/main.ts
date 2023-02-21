import { bootstrapApplication } from '@angular/platform-browser';
import {
    provideRouter,
    withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
        provideStore(),
        provideEffects(),
        provideStoreDevtools({}),
        provideRouterStore(),
    ],
}).catch((err) => console.error(err));
