import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { ShoeStore } from '@admin-panel/stores/shoe.store';
import { ProductDialogService } from '../services/product-dialog.service';

@Component({
	selector: 'app-shoe',
	templateUrl: './shoe-dialog-form.component.html',
	styles: [],
})
export class ShoeDialogFormComponent {
	constructor(
		public shoeStore: ShoeStore,
		public productDialogService: ProductDialogService,
		public dialogRef: MatDialogRef<ShoeDialogFormComponent>,
	) {}

	public onClear() {
		this.productDialogService.shoeForm.reset();
	}
}
