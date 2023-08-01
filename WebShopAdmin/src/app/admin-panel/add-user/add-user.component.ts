import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { UserStore } from '@admin-panel/stores/user.store';

@Component({
	selector: 'app-add-user',
	templateUrl: './add-user.component.html',
})
export class AddUserComponent {
	constructor(
		public userStore: UserStore,
		public dialogRef: MatDialogRef<AddUserComponent>,
		private toaster: ToastrService,
	) {}

	public onClear() {
		this.userStore.userForm.reset();
	}

	public onClose() {
		this.dialogRef.close();
	}

	public onSubmit() {
		this.userStore.register().subscribe(
			(res: any) => {
				if (res.succeeded) {
					this.userStore.userForm.reset();
					this.toaster.success('New user created!', 'Registartion successful');
				} else {
					res.errors.forEach((element) => {
						switch (element.code) {
							case 'DuplicateUserName':
								this.toaster.error('User is already taken', 'Register faild');
								// Username is already taken
								break;

							default:
								this.toaster.error(element.description, 'User is already taken');
								// Registartion faild
								break;
						}
					});
				}
			},
			(err) => {
				console.log(err);
			},
		);
	}
}
