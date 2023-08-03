import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter, shareReplay, switchMap } from 'rxjs/operators';

import { Category } from '@admin-panel/models/category.model';
import { DialogData } from '@admin-panel/models/dialog-data.model';
import { ProductUpdate } from '@admin-panel/models/product-update.model';
import { RecordModel } from '@admin-panel/models/record.model';
import { ModuleService } from '@admin-panel/modules/services/module-service.service';
import { CategoryStore } from '@admin-panel/stores/category.store';
import { RecordStore } from '@admin-panel/stores/record.store';
import { ProductTableService } from '@database-tables/product-table/services/product-table.service';
import { environment } from '@environments/environment';

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

	public imgSrcReplay = new ReplaySubject<string>(1);

	public imgSrcReplay$ = this.imgSrcReplay.asObservable();

	public imageRootPath = `${environment.baseUrl}/Images/original/`;

	public defaultimageRootPath = `${environment.baseUrl}/Images/original/default-image.png`;

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
				console.log('productData: ', productData);
				this.populateForm(productData.row as RecordUpdate);
				return of(null);
			}),
			shareReplay(1),
		);

		this.category$ = this.categoryStore.getCategory(1).pipe(untilDestroyed(this), shareReplay(1));
	}

	public onSubmit(form: RecordModel & ProductUpdate<RecordModel>) {
		// if (this.form.invalid) {
		// 	return;
		// }
		// form.categoryName = 'Record';
		// // Form data becomes null in observable so it needs to be cloned
		// this.populateForm$ = this.userStore.getUserProfile().pipe(
		// 	untilDestroyed(this),
		// 	switchMap((user) => {
		// 		// Set forms userId to in logged user
		// 		form.editorUserId = user.userId;
		// 		const newRecord = new RecordModel(this.form.value);
		// 		// Create or update
		// 		if (!form.id) {
		// 			return this.recordStore.postRecord(newRecord, this.fileToUpload);
		// 		} else {
		// 			return this.recordStore.putRecord(newRecord, this.fileToUpload);
		// 		}
		// 	}),
		// 	tap((updatedRecord) => {
		// 		let productUpdate = new ProductUpdate<RecordModel>();
		// 		productUpdate = { ...form, row: updatedRecord };
		// 		this.populateForm(productUpdate);
		// 		return of(null);
		// 	}),
		// 	switchMap((x) =>
		// 		this.productTableService.refreshMatTable(
		// 			'records',
		// 			form.totalPages,
		// 			form.currentPage,
		// 			form.sortKey,
		// 			form.order,
		// 			'',
		// 			null,
		// 		),
		// 	),
		// 	shareReplay(1),
		// );
	}

	public showPreview(file: File) {
		// if (!file) {
		// 	return;
		// }
		// const reader = new FileReader();
		// reader.onload = (e: any) => {
		// 	this.imgSrcReplay.next(e.target.result);
		// };
		// reader.readAsDataURL(file);
		// this.form.get('imagePath').setValue(file.name);
		// this.fileToUpload = file;
	}

	public onClear() {
		this.productDialogService.recordForm.reset();
		this.imgSrcReplay.next(this.defaultimageRootPath);
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
