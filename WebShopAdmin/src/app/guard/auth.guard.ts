import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from '@app/log-in/auth/services/auth.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard  {
	constructor(private authService: AuthService) {}
	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		return this.authService.isLoggedIn(next);
	}
}
