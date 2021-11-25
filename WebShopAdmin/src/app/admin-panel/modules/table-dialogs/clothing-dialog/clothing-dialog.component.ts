import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { ClothingStore } from '../../../stores/clothing.store';
import { ToastrService } from 'ngx-toastr';

import { UserStore } from '../../../stores/user.store';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-clothing-dialog',
	templateUrl: './clothing-dialog.component.html'
})
export class ClothingDialogComponent implements OnInit {
	public defaultImage = environment.baseUrl + '/Images/original/default-image.png';

	fileToUpload: File;

	constructor(
		public clothingStore: ClothingStore,
		private toastr: ToastrService,
		public dialogRef: MatDialogRef<ClothingDialogComponent>,
		private userStore: UserStore
	) { }

	ngOnInit() {

	}

	onFileSelected(file: FileList) {
		this.fileToUpload = file.item(0);
		const inputNode: any = document.querySelector('#file');

		if (typeof FileReader !== 'undefined') {
			const reader = new FileReader();

			reader.onload = (event: any) => {
				this.clothingStore.imageRootPath = event.target.result;
				this.clothingStore.form.value.ImagePath =
					inputNode.files[0].name;
			};

			reader.readAsDataURL(this.fileToUpload);
		}
	}

	onClear() {
		this.clothingStore.form.reset();
		this.clothingStore.initializeFormGroup();
	}

	onSubmit() {
		//this.clothingStore.form.value.userName = this.userStore.currentUser.userName;

		if (!this.clothingStore.form.value.id) {
			this.insertClothing(this.clothingStore.form);
		} else {
			this.updateClothing(this.clothingStore.form);
		}
		this.clothingStore.form.reset();
		this.clothingStore.initializeFormGroup();
		this.dialogRef.close();
	}

	onClose() {
		this.clothingStore.form.reset();
		this.clothingStore.initializeFormGroup();
		this.dialogRef.close();
	}

	insertClothing(form: any) {
		this.clothingStore
			.postClothing(form.value, this.fileToUpload)
			.subscribe(
				res => {
					this.toastr.success(
						'inserted successfully',
						'EMP. Register'
					);
				},
				err => {
					debugger;
					console.log(err);
				}
			);
	}

	updateClothing(form: any) {

		this.clothingStore
			.putClothing(form.value, this.fileToUpload)
			.subscribe(res => {
				this.toastr.info('updated successfully', 'EMP. Register');
			});
	}
}
