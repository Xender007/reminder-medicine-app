import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // return authService.IsloggedIn().pipe(
  //   map(() => true),
  //   catchError(() => {
  //     router.navigate(['route-to-fallback-page']);
  //     return of(false);
  //   })
  // );

  if(authService.IsloggedIn())
  {
    return true;
  }
    router.navigate(['/login']);
    return false

};

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.IsloggedIn())
  {
    router.navigate(['/home']);
    return false;
  }
  
    return true;

};
