import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { FeatherModule } from 'angular-feather';
import { Home, User } from 'angular-feather/icons';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { authInterceptor } from './views/pages/auth/auth.interceptor';
import { LOCALE_ID } from '@angular/core';

const icons = {
  Home,
  User,
};
const highlightOptions = {
  coreLibraryLoader: () => import('highlight.js/lib/core'),
  languages: {
    typescript: () => import('highlight.js/lib/languages/typescript'),
    scss: () => import('highlight.js/lib/languages/scss'),
    xml: () => import('highlight.js/lib/languages/xml')
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    importProvidersFrom(FeatherModule.pick(icons)),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })), 
    provideAnimationsAsync(),
    importProvidersFrom([SweetAlert2Module.forRoot(), HttpClientModule, NgModule, FormsModule, ReactiveFormsModule]), // ngx-sweetalert2: https://github.com/sweetalert2/ngx-sweetalert2
    provideHighlightOptions(highlightOptions), // ngx-highlightjs: https://github.com/murhafsousli/ngx-highlightjs
    { provide: LOCALE_ID, useValue: 'es' },
  ],
};
