import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminCategoryEnum } from 'src/app/admin-panel/enums/AdminCategory.enum';
import { Category } from 'src/app/admin-panel/models/category.model';
import { DialogData } from 'src/app/admin-panel/models/dialog-data.model';
import { CategoryStore } from 'src/app/admin-panel/stores/category.store';

@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

	public categoryEnum = AdminCategoryEnum;

	public categoryChange: Category = new Category();

	/**
	 * Initializes the component.
	 *
	 * @param dialogRef - A reference to the dialog opened.
	 */
	constructor(
		public dialogRef: MatDialogRef<DialogComponent>,
		public categoryStore: CategoryStore,
		@Inject(MAT_DIALOG_DATA)
		public data: DialogData,
		public router: Router
	) {
		this.categoryChange.name="records";
		this.categoryStore.getCategories().subscribe();
	}

	public onDeactivate(event) {
		console.log('onDeactivate: ', event);

	}

	onClose() {
		console.log('close');
		this.dialogRef.close();
	}

	public selectedCataegory(event: Category){
		this.categoryChange = event;
	}
}
