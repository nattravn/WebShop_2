import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ShoeStore } from '@admin-panel/stores/shoe.store';
import { ProductDialogService } from '../services/product-dialog.service';
import { ModuleService } from '@admin-panel/modules/services/module-service.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, shareReplay, switchMap } from 'rxjs/operators';
import { ShoeUpdate } from '@admin-panel/models/shoe-update.model';
import { Observable, of } from 'rxjs';
import { DialogData } from '@admin-panel/models/dialog-data.model';

@UntilDestroy()
@Component({
	selector: 'app-shoe',
	templateUrl: './shoe-dialog-form.component.html',
	styles: [],
})
export class ShoeDialogFormComponent implements OnInit, OnDestroy {
	public populateForm$ = new Observable<ShoeUpdate>();
	constructor(
		public shoeStore: ShoeStore,
		public productDialogService: ProductDialogService,
		public dialogRef: MatDialogRef<ShoeDialogFormComponent>,
		private moduleService: ModuleService,
		@Inject(MAT_DIALOG_DATA)
		public data: DialogData,
	) {}

	ngOnDestroy() {
		this.productDialogService.shoeForm.reset();
	}

	ngOnInit(): void {
		this.populateForm$ = this.moduleService.productData$.pipe(
			untilDestroyed(this),
			filter(() => !this.data.createNew),
			switchMap((productData) => {
				this.populateForm(productData.row as ShoeUpdate);
				return of(productData.row as ShoeUpdate);
			}),
			shareReplay(1),
		);
	}

	private populateForm(productUpdate: ShoeUpdate) {
		this.productDialogService.shoeForm.get('size').setValue(productUpdate?.size);
	}
}
