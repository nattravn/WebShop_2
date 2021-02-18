import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';


import { environment } from 'src/environments/environment';
import { MatDialogRef } from '@angular/material/dialog';
import { ShoeStore } from 'src/app/admin-panel/stores/shoe.store';
import { UserStore } from 'src/app/admin-panel/stores/user.store';

@Component({
	selector: 'app-shoe',
	templateUrl: './shoe-dialog-form.component.html',
	styles: []
})
export class ShoeDialogFormComponent implements OnInit {

	public defaultImage = environment.baseUrl + '/Images/40/default-image.png';
	fileToUpload: File;

	constructor(
		public shoeStore: ShoeStore,
		private toastr: ToastrService,
		public dialogRef: MatDialogRef<ShoeDialogFormComponent>,
		private userStore: UserStore) {
	}

	ngOnInit() {
	}

	onFileSelected(file: FileList) {
		this.fileToUpload = file.item(0);
		const inputNode: any = document.querySelector('#file');

		if (typeof (FileReader) !== 'undefined') {
			const reader = new FileReader();

			reader.onload = (event: any) => {
				console.log('event.target: ', event);
				console.log('inputNode.files[0]: ', inputNode.files[0]);
				this.shoeStore.imageRootPath = event.target.result;
				this.shoeStore.form.value.ImagePath = inputNode.files[0].name;

			};

			reader.readAsDataURL(this.fileToUpload);
			// reader.readAsArrayBuffer(inputNode.files[0]);
		}
	}

	onClear() {
		this.shoeStore.form.reset();
		this.shoeStore.initializeFormGroup();
	}

	onSubmit() {


		if (!this.shoeStore.form.value.id) {
			this.insertShoe(this.shoeStore.form);
		} else {
			this.updateShoe(this.shoeStore.form);
		}
		this.shoeStore.form.reset();
		this.shoeStore.initializeFormGroup();
		this.dialogRef.close();
	}

	onClose() {
		this.shoeStore.form.reset();
		this.shoeStore.initializeFormGroup();
		this.dialogRef.close();
	}

	insertShoe(form: any) {
		this.shoeStore.postShoe(form.value, this.fileToUpload).subscribe(res => {
			this.toastr.success('inserted successfully', 'EMP. Register');
		},
			err => {
				debugger;
				console.log(err);
			});
	}

	updateShoe(form: any) {
		console.log('form.value: ', form.value);
		this.shoeStore.putShoe(form.value, this.fileToUpload).subscribe(res => {
			this.toastr.info('updated successfully', 'EMP. Register');
		});
	}

}
