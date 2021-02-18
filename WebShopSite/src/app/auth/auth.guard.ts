import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserStore } from '../shared/stores/user.store';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  isAdmin = false;

  constructor(private router: Router, private userStore: UserStore) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      if (localStorage.getItem('token') != null) {
        const roles = next.data['permittedRoles'] as Array<string>;
        console.log('roles: '  , roles);
        if (roles) {
          if (this.userStore.roleMatch(roles)) {

            this.isAdmin = true;
            console.log('Hej this.isAdmin: ', this.isAdmin);
            return true;
          } else {
            this.router.navigate(['/forbidden']);

            this.isAdmin = false;
            console.log('Hej this.isAdmin: ', this.isAdmin);
            return false;
          }
        }
        console.log('canActivate');
        return true;
      } else {
        this.router.navigate(['/user/login']);
        return false;
      }
  }
}
