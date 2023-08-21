import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of } from 'rxjs';
import { filter, shareReplay, startWith, switchMap } from 'rxjs/operators';

import { DialogData } from '@admin-panel/models/dialog-data.model';
import { ModuleService } from '@admin-panel/modules/services/module-service.service';
import { ClothingStore } from '@admin-panel/stores/clothing.store';
import { ProductTableService } from '@database-tables/product-table/services/product-table.service';
import { RecordDialogService } from '@table-dialogs/products-dialog/record-dialog/services/record-dialog.service';
import { ClothingUpdate } from '@admin-panel/models/clothing-update.model';
import { Category } from '@admin-panel/models/category.model';
import { CategoryStore } from '@admin-panel/stores/category.store';
import { ProductDialogService } from '../services/product-dialog.service';

export interface IClothingForm {
	size: FormControl<string>;
}

@UntilDestroy()
@Component({
	selector: 'app-clothing-dialog',
	templateUrl: './clothing-dialog.component.html',
})
export class ClothingDialogComponent implements OnInit {
	public populateForm$ = new Observable<any>();

	public form = new FormGroup<IClothingForm>({
		size: new FormControl(''),
	});

	public category$ = new Observable<Category>();

	constructor(
		public clothingStore: ClothingStore,
		public dialogRef: MatDialogRef<ClothingDialogComponent>,
		public recordDialogService: RecordDialogService,
		public moduleService: ModuleService,
		public productTableService: ProductTableService,
		@Inject(MAT_DIALOG_DATA)
		public data: DialogData,
		public categoryStore: CategoryStore,
		public productDialogService: ProductDialogService,
	) {}

	ngOnInit() {
		this.populateForm$ = this.moduleService.productData$.pipe(
			untilDestroyed(this),
			filter((queryParams) => !this.data.createNew),
			switchMap((productData) => {
				this.populateForm(productData.row as ClothingUpdate);
				return of(null);
			}),
			shareReplay(1),
		);
	}

	public populateForm(clothing: ClothingUpdate) {
		this.form.get('size').setValue(clothing.size);
	}

	/**
	 * Observable valuse of the form initiated with values
	 */
	public get formValue$(): Observable<any> {
		return this.form.valueChanges.pipe(startWith(this.form.value), shareReplay(1));
	}
}
