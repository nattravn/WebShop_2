import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AdminCategoryRoutesEnum } from '@admin-panel/enums/adminCategoryRoutes.enum';

import { DialogData } from 'src/app/admin-panel/models/dialog-data.model';
import { CategoryStore } from 'src/app/admin-panel/stores/category.store';

import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';

import { DialogService } from '../services/dialog.service';

@UntilDestroy()
@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	@ViewChild(RouterOutlet) outlet: RouterOutlet;

	public categoryEnum = AdminCategoryRoutesEnum;

	public dialogService: DialogService;

	public paramMapProduct$: Observable<any>;

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
		public router: Router,
		public activatedRoute: ActivatedRoute,
	) {}

	public onDeactivate(event) {
		console.log('onDeactivate: ', event);
	}

	public onClose() {
		this.dialogRef.close();
		// this.dialogService.close();

		// this.paramMapProduct$ = this.activatedRoute.paramMap.pipe(
		// 	take(1),
		// 	untilDestroyed(this),
		// 	tap( paramMap => {
		// 		this.router.navigate(['adminpanel/tables/products/'+paramMap.get('product')]);

		// 	})
		// )
	}
}
