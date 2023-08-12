import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of } from 'rxjs';
import { filter, shareReplay, switchMap } from 'rxjs/operators';

import { Category } from '@admin-panel/models/category.model';
import { DialogData } from '@admin-panel/models/dialog-data.model';
import { ModuleService } from '@admin-panel/modules/services/module-service.service';
import { CategoryStore } from '@admin-panel/stores/category.store';
import { RecordStore } from '@admin-panel/stores/record.store';
import { ProductTableService } from '@database-tables/product-table/services/product-table.service';

import { RecordDialogService } from './services/record-dialog.service';
import { ProductDialogService } from '../services/product-dialog.service';
import { RecordUpdate } from '@admin-panel/models/record-update.model';

export interface IRecordForm {
	band: FormControl<string>;
	album: FormControl<string>;
	genre: FormControl<string>;
}
@UntilDestroy()
@Component({
	selector: 'app-record-dialog',
	templateUrl: './record-dialog.component.html',
	styleUrls: ['./record-dialog.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordDialogComponent implements OnInit {
	public populateForm$ = new Observable<any>();

	public categories$ = new Observable<Category[]>();

	public category$ = new Observable<Category>();

	public lastEditor$ = new Observable<Category>();

	// private fileToUpload: File = null;

	constructor(
		public recordStore: RecordStore,
		public categoryStore: CategoryStore,
		public recordDialogService: RecordDialogService,
		public productTableService: ProductTableService,
		public productDialogService: ProductDialogService,
		// private userStore: UserStore,
		private moduleService: ModuleService,
		// private customDatePipe: CustomDatePipe,
		@Inject(MAT_DIALOG_DATA)
		public data: DialogData,
	) {}

	ngOnInit(): void {
		this.populateForm$ = this.moduleService.productData$.pipe(
			untilDestroyed(this),
			filter((queryParams) => !this.data.createNew),
			switchMap((productData) => {
				this.populateForm(productData.row as RecordUpdate);
				return of(null);
			}),
			shareReplay(1),
		);

		this.category$ = this.categoryStore.getCategory(1).pipe(untilDestroyed(this), shareReplay(1));
	}

	public onClear() {
		this.productDialogService.recordForm.reset();
	}

	private populateForm(productUpdate: RecordUpdate) {
		this.productDialogService.recordForm.get('band').setValue(productUpdate?.band);
		this.productDialogService.recordForm.get('album').setValue(productUpdate?.album);
		this.productDialogService.recordForm.get('genre').setValue(productUpdate?.genre);

		// this.imgSrcReplay.next(this.imageRootPath + productUpdate.row.imagePath);
	}

	/**
	 * Observable values of the form initiated with values
	 */
	// public get formValue$(): Observable<any> {
	// 	return this.recordForm.valueChanges.pipe(startWith(this.recordForm.value), shareReplay(1));
	// }
}
