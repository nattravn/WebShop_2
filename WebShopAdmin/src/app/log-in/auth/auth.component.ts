import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@UntilDestroy()
@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
	providers: [ToastrService]
})
export class AuthComponent implements OnInit, OnDestroy {

	authForm: FormGroup;
	isSubmitted  =  false;

	constructor(
		private authService: AuthService,
		private router: Router,
		private formBuilder: FormBuilder,
		private toastr: ToastrService
	) { }
	ngOnDestroy(): void {}

	ngOnInit() {
		this.authForm = this.formBuilder.group({
			userName: ['', Validators.required],
			password: ['', Validators.required]
		});
	}

	signIn(){
		this.isSubmitted = true;
		if(this.authForm.invalid){
			return;
		}
		this.authService.signIn(this.authForm.value).pipe(
			untilDestroyed(this),
			tap((res: any) => {
				localStorage.setItem('ACCESS_TOKEN', res.token);
				this.router.navigateByUrl('/adminpanel');
			}),
			catchError(err => {
                if (err.status === 400) {
                    this.toastr.error('Incorrect username or password.', 'Authentication failed.');
                } else {
                    console.log(err);
				}
				return EMPTY;
            })
		).subscribe();

	}

	get formControls() { return this.authForm.controls; }

}
