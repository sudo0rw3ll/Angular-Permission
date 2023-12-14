import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    // Retrieve the expected roles for the route from the route's data property
    const expectedRoles = next.data['expectedRoles'] as string[];

    if (localStorage.getItem('jwtToken') && this.checkRole(expectedRoles)) {
      return true; // Allow access if authenticated and has the required role
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

  checkRole(expectedRoles: string[]): boolean {
    const roles = localStorage.getItem('roles');

    console.log(expectedRoles);
    return expectedRoles.some(role => roles?.includes(role));
  }
}
