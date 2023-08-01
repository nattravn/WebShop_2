import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { Category } from '@admin-panel/models/category.model';
import { DialogData } from '@admin-panel/models/dialog-data.model';
import { ProductUpdate } from '@admin-panel/models/product-update.model';
import { Record } from '@admin-panel/models/record.model';
import { ModuleService } from '@admin-panel/modules/services/module-service.service';
import { CustomDatePipe } from '@admin-panel/pipe/custom.datepipe';
import { CategoryStore } from '@admin-panel/stores/category.store';
import { RecordStore } from '@admin-panel/stores/record.store';
import { UserStore } from '@admin-panel/stores/user.store';
import { ProductTableService } from '@database-tables/product-table/services/product-table.service';
import { environment } from '@environments/environment';

import { RecordDialogService } from './services/record-dialog.service';

export interface IRecordForm {
	id: FormControl<number>;
	band: FormControl<string>;
	album: FormControl<string>;
	releaseDate: FormControl<Date>;
	genre: FormControl<string>;
	description: FormControl<string>;
	imagePath: FormControl<string>;
	title: FormControl<string>;
	price: FormControl<string>;
	categoryId: FormControl<number>;
	subCategoryId: FormControl<number>;
	editorUserId: FormControl<string>;
	categoryName: FormControl<string>;
	currentPage: FormControl<number>;
	totalPages: FormControl<number>;
	lastUpdateTime: FormControl<string>;
	order: FormControl<string>;
	sortKey: FormControl<string>;
}
@UntilDestroy()
@Component({
	selector: 'app-record-dialog',
	templateUrl: './record-dialog.component.html',
	styleUrls: ['./record-dialog.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [CustomDatePipe],
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

	public form = new FormGroup<IRecordForm>({
		id: new FormControl(0),
		band: new FormControl('', Validators.required),
		album: new FormControl('', Validators.required),
		releaseDate: new FormControl(new Date(), [Validators.required]),
		genre: new FormControl(''),
		description: new FormControl('', Validators.required),
		imagePath: new FormControl('default-image.png'),
		title: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
		price: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
		categoryId: new FormControl(null),
		subCategoryId: new FormControl(null),
		editorUserId: new FormControl(null),
		categoryName: new FormControl(''),
		currentPage: new FormControl(1),
		totalPages: new FormControl(1),
		lastUpdateTime: new FormControl(''),
		order: new FormControl(''),
		sortKey: new FormControl(''),
	});

	private fileToUpload: File = null;

	constructor(
		public recordStore: RecordStore,
		public categoryStore: CategoryStore,
		public recordDialogService: RecordDialogService,
		public productTableService: ProductTableService,
		private userStore: UserStore,
		private moduleService: ModuleService,
		private customDatePipe: CustomDatePipe,
		@Inject(MAT_DIALOG_DATA)
		public data: DialogData,
	) {}

	ngOnInit(): void {
		this.populateForm$ = this.moduleService.productData$.pipe(
			untilDestroyed(this),
			filter((queryParams) => !this.data.createNew),
			switchMap((productData) => {
				this.populateForm(productData);
				return of(null);
			}),
			shareReplay(1),
		);

		this.category$ = this.categoryStore.getCategory(1).pipe(untilDestroyed(this), shareReplay(1));
	}

	public onSubmit(form: Record & ProductUpdate<Record>) {
		if (this.form.invalid) {
			return;
		}
		form.categoryName = 'Record';

		// Form data becomes null in observable so it needs to be cloned
		this.populateForm$ = this.userStore.getUserProfile().pipe(
			untilDestroyed(this),
			switchMap((user) => {
				// Set forms userId to in logged user
				form.editorUserId = user.userId;

				const newRecord = new Record(this.form.value);

				// Create or update
				if (!form.id) {
					return this.recordStore.postRecord(newRecord, this.fileToUpload);
				} else {
					return this.recordStore.putRecord(newRecord, this.fileToUpload);
				}
			}),
			tap((updatedRecord) => {
				let productUpdate = new ProductUpdate<Record>();

				productUpdate = { ...form, row: updatedRecord };

				this.populateForm(productUpdate);

				return of(null);
			}),
			switchMap((x) =>
				this.productTableService.refreshMatTable(
					'records',
					form.totalPages,
					form.currentPage,
					form.sortKey,
					form.order,
					'',
					null,
				),
			),
			shareReplay(1),
		);
	}

	public showPreview(file: File) {
		if (!file) {
			return;
		}
		const reader = new FileReader();
		reader.onload = (e: any) => {
			this.imgSrcReplay.next(e.target.result);
		};
		reader.readAsDataURL(file);
		this.form.get('imagePath').setValue(file.name);
		this.fileToUpload = file;
	}

	public onClear() {
		this.form.reset();
		this.imgSrcReplay.next(this.defaultimageRootPath);
	}

	private populateForm(productUpdate: ProductUpdate<Record>) {
		this.form.get('id').setValue(productUpdate.row.id);
		this.form.get('band').setValue(productUpdate.row.band);
		this.form.get('album').setValue(productUpdate.row.album);
		this.form.get('releaseDate').setValue(productUpdate.row.releaseDate);
		this.form.get('genre').setValue(productUpdate.row.genre);
		this.form.get('description').setValue(productUpdate.row.description);
		this.form.get('title').setValue(productUpdate.row.title);
		this.form.get('price').setValue(productUpdate.row.price);
		this.form.get('categoryId').setValue(productUpdate.row.categoryId);
		this.form.get('subCategoryId').setValue(productUpdate.row.subCategoryId);
		this.form.get('imagePath').setValue(productUpdate.row.imagePath);
		this.form.get('currentPage').setValue(productUpdate.currentPage);
		this.form.get('totalPages').setValue(productUpdate.totalPages);
		this.form.get('order').setValue(productUpdate.order);
		this.form.get('sortKey').setValue(productUpdate.sortKey);
		this.form.get('editorUserId').setValue(productUpdate.row.editorUserId);

		this.form.get('lastUpdateTime').setValue(this.customDatePipe.transform(productUpdate.row.lastUpdatedTime));

		this.imgSrcReplay.next(this.imageRootPath + productUpdate.row.imagePath);
	}

	/**
	 * Observable valuse of the form initiated with values
	 */
	public get formValue$(): Observable<any> {
		return this.form.valueChanges.pipe(startWith(this.form.value), shareReplay(1));
	}
}
