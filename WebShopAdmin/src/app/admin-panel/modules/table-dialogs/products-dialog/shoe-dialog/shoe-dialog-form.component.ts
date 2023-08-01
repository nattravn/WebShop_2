import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { ShoeStore } from '@admin-panel/stores/shoe.store';
import { environment } from '@environments/environment';

@Component({
	selector: 'app-shoe',
	templateUrl: './shoe-dialog-form.component.html',
	styles: [],
})
export class ShoeDialogFormComponent {
	public defaultImage = `${environment.baseUrl}/Images/40/default-image.png`;
	private fileToUpload: File;

	constructor(
		public shoeStore: ShoeStore,
		private toastr: ToastrService,
		public dialogRef: MatDialogRef<ShoeDialogFormComponent>,
	) {}

	public onFileSelected(file: FileList) {
		this.fileToUpload = file.item(0);
		const inputNode: any = document.querySelector('#file');

		if (typeof FileReader !== 'undefined') {
			const reader = new FileReader();

			reader.onload = (event: any) => {
				this.shoeStore.imageRootPath = event.target.result;
				this.shoeStore.form.value.imagePath = inputNode.files[0].name;
			};

			reader.readAsDataURL(this.fileToUpload);
			// reader.readAsArrayBuffer(inputNode.files[0]);
		}
	}

	public onClear() {
		this.shoeStore.form.reset();
		this.shoeStore.initializeFormGroup();
	}

	public onSubmit() {
		if (!this.shoeStore.form.value.id) {
			this.insertShoe(this.shoeStore.form);
		} else {
			this.updateShoe(this.shoeStore.form);
		}
		this.shoeStore.form.reset();
		this.shoeStore.initializeFormGroup();
		this.dialogRef.close();
	}

	public onClose() {
		this.shoeStore.form.reset();
		this.shoeStore.initializeFormGroup();
		this.dialogRef.close();
	}

	public insertShoe(form: any) {
		this.shoeStore.postShoe(form.value, this.fileToUpload).subscribe(
			(res) => {
				this.toastr.success('inserted successfully', 'EMP. Register');
			},
			(err) => {
				console.log(err);
			},
		);
	}

	public updateShoe(form: any) {
		this.shoeStore.putShoe(form.value, this.fileToUpload).subscribe((res) => {
			this.toastr.info('updated successfully', 'EMP. Register');
		});
	}
}
