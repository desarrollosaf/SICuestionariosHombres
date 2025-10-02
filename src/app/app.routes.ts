import { Routes } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { authGuard } from './core/guards/auth.guard';
import { UserAccessGuard } from './views/pages/auth/user-access.guard';
import { RedirectComponent } from './views/pages/auth/redirect.component';
export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./views/pages/auth/auth.routes')},

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./views/pages/home/home.component').then((c) => c.HomeComponent)
  },

  {
    path: '',
    component: BaseComponent,
    canActivateChild: [authGuard],
    children: [
      { path: '',  component: RedirectComponent,
      },
      {
        path: 'citas',
        loadComponent: () => import('./views/pages/citas/citas.component').then(c => c.CitasComponent)
      },
      {
        path: 'reportes',
        canActivateChild: [UserAccessGuard],
        loadChildren: () => import('./views/pages/reportes/reportes.route')
      }
    ]
  },
  {
    path: 'error',
    loadComponent: () => import('./views/pages/error/error.component').then(c => c.ErrorComponent),
  },
  {
    path: 'error/:type',
    loadComponent: () => import('./views/pages/error/error.component').then(c => c.ErrorComponent)
  },
  { path: '**', redirectTo: 'error/404', pathMatch: 'full' }
];
