import { DialogData } from '@admin-panel/models/dialog-data.model';
import { Role } from '@admin-panel/models/roles.model';
import { UserUpdate } from '@admin-panel/models/user-update.model';
import { UsersDialog } from '@admin-panel/models/users-dialog.model';
import { ModuleService } from '@admin-panel/modules/services/module-service.service';
import { UserStore } from '@admin-panel/stores/user.store';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserTableService } from '@database-tables/user-table/serivces/user-table.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, shareReplay, startWith, switchMap } from 'rxjs/operators';

export interface IUserDialogForm {
	currentPage: FormControl<number>;
	totalPages: FormControl<number>;
	order: FormControl<string>;
	sortKey: FormControl<string>;
	row: FormGroup<IUserDataForm>;
}

export interface IUserDataForm {
	userName: FormControl<string>;
	email: FormControl<string>;
	id: FormControl<string>;
	fullName: FormControl<string>;
	password: FormControl<string>;
	roleName: FormControl<string>;
}

@UntilDestroy()
@Component({
	selector: 'app-user-dialog',
	templateUrl: './user-dialog.component.html',
	styleUrls: ['./user-dialog.component.css'],
})
export class UserDialogComponent implements OnInit {
	public userForm = new FormGroup<IUserDialogForm>({
		currentPage: new FormControl(1),
		totalPages: new FormControl(1),
		order: new FormControl(''),
		sortKey: new FormControl(''),
		row: new FormGroup<IUserDataForm>({
			email: new FormControl(''),
			fullName: new FormControl(''),
			id: new FormControl(''),
			userName: new FormControl(''),
			password: new FormControl('', [Validators.required]),
			roleName: new FormControl(''),
		}),
	});

	public populateForm$ = new Observable<UsersDialog>();
	public roles$ = new Observable<Role>();

	constructor(
		public userStore: UserStore,
		@Inject(MAT_DIALOG_DATA)
		public data: DialogData,
		public userTableService: UserTableService,
		private moduleService: ModuleService,
	) {}

	ngOnInit(): void {
		this.roles$ = this.userStore.getRoles().pipe(untilDestroyed(this), shareReplay(1));

		this.populateForm$ = this.moduleService.userFormData$.pipe(
			untilDestroyed(this),
			delay(1), // otherwise lastUpdatedTime the pipes wont fire in template
			map((productData) => {
				this.populateForm(productData);
				return productData;
			}),
			shareReplay(1),
		);
	}

	/**
	 * Observable valuse of the form initiated with values
	 */
	public get formValue$(): Observable<any> {
		return this.userForm.valueChanges.pipe(startWith(this.userForm.value), shareReplay(1));
	}

	public onClear() {
		this.userForm.reset();
	}

	public onSubmit(form: UsersDialog): void {
		if (this.userForm.invalid) {
			console.error('Form invalid: ', this.userForm.invalid, form);
			return;
		}

		// Form data becomes null in observable so it needs to be cloned
		this.populateForm$ = of(form.row.id).pipe(
			switchMap(() => {
				// Create or update
				if (!form.row.id || this.data.createNew) {
					return this.userStore.createUser(form.row);
				} else {
					console.log('form: ', form);
					return this.userStore.updateUser(form.row);
				}
			}),
			map((updatedUser: UserUpdate) => {
				const productUpdate = new UsersDialog({ ...form, row: updatedUser });

				this.populateForm(productUpdate);

				return productUpdate;
			}),
			switchMap((productUpdate) =>
				this.userTableService
					.refreshMatTable(form.totalPages, form.currentPage, form.sortKey, form.order, '', null)
					.pipe(map(() => productUpdate)),
			),
			catchError((error) => {
				this.userForm.controls.row.controls.password.setErrors({ passwordMissMatch: true });
				console.error('error: ', error.error.message);
				return of(null);
			}),
			shareReplay(1),
		);
	}

	public populateForm(category: UsersDialog) {
		this.userForm.get('row').get('email').setValue(category.row.email);
		this.userForm.get('row').get('fullName').setValue(category.row.fullName);
		this.userForm.get('row').get('password').setValue('****');
		this.userForm.get('row').get('id').setValue(category.row.id);
		this.userForm.get('row').get('userName').setValue(category.row.userName);
		this.userForm.get('row').get('roleName').setValue(category.row.roleName);
		this.userForm.get('currentPage').setValue(category.currentPage);
		this.userForm.get('totalPages').setValue(category.totalPages);
		this.userForm.get('order').setValue(category.order);
		this.userForm.get('sortKey').setValue(category.sortKey);
	}
}
