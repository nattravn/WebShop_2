import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ToastrService } from 'ngx-toastr';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AuthService } from './services/auth.service';

export interface ILoginUser {
	userName: FormControl<string>;
	password: FormControl<string>;
}
@UntilDestroy()
@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
	providers: [ToastrService],
})
export class AuthComponent {
	public authForm = new FormGroup<ILoginUser>({
		userName: new FormControl('', { nonNullable: true }),
		password: new FormControl('', { nonNullable: true }),
	});

	public isSubmitted = false;

	constructor(
		private authService: AuthService,
		private router: Router,
		private toastr: ToastrService,
	) {}

	public get formControls() {
		return this.authForm.controls;
	}

	public signIn() {
		this.isSubmitted = true;
		if (this.authForm.invalid) {
			return;
		}
		this.authService
			.signIn(this.authForm.getRawValue())
			.pipe(
				untilDestroyed(this),
				tap((res: any) => {
					localStorage.setItem('ACCESS_TOKEN', res.token);
					this.router.navigateByUrl('/adminpanel');
				}),
				catchError((err) => {
					if (err.status === 400) {
						this.toastr.error('Incorrect username or password.', 'Authentication failed.');
					} else {
						console.log(err);
					}
					return EMPTY;
				}),
			)
			.subscribe();
	}
}
