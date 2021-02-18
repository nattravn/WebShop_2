import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginUser } from 'src/app/admin-panel/models/login-user.model';
import { UserStore } from 'src/app/admin-panel/stores/user.store';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	readonly baseUrl = environment.userApiUrl;

	isAdmin = false;
	constructor(
		private http: HttpClient,
		private userStore: UserStore,
		private router: Router) { }
	public signIn(formData: LoginUser): Observable<unknown> {
		//localStorage.setItem('ACCESS_TOKEN', "access_token");
		return this.http.post<unknown>(this.baseUrl + '/ApplicationUser/Login', formData);
	}
	public isLoggedIn(next: any) {
		if (localStorage.getItem('ACCESS_TOKEN') != null) {
			const roles = next.data['permittedRoles'] as Array<string>;
			if (roles) {
				if (this.userStore.roleMatch(roles)) {

					this.isAdmin = true;
					return true;
				} else {
					this.router.navigate(['/forbidden']);
					this.isAdmin = false;
					return false;
				}
			}
			return true;
		} else {
			this.router.navigate(['/user/login']);
			return false;
		}
	}
	public logout() {
		localStorage.removeItem('ACCESS_TOKEN');
	}
}
