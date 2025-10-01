import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  return userService.getCurrentUser().pipe(
    map(user => {
      userService.setCurrentUser(user); 
      return true;
    }),
    catchError(() => {
      router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return of(false);
    })
  );
};