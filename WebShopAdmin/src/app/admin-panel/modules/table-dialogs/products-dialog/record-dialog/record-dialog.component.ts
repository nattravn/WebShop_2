import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { filter, shareReplay, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { RecordStore } from 'src/app/admin-panel/stores/record.store';
import { UserStore } from 'src/app/admin-panel/stores/user.store';
import { environment } from 'src/environments/environment';
import { CategoryStore } from 'src/app/admin-panel/stores/category.store';
import { RecordDialogService } from './services/record-dialog.service';
import { ProductTableService } from '../../../database-tables/product-table/services/product-table.service';
import { ModuleService } from '../../../services/module-service.service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/admin-panel/models/category.model';
import { Record } from 'src/app/admin-panel/models/record.model';
import { ActivatedRoute } from '@angular/router';
import { CustomDatePipe } from 'src/app/admin-panel/pipe/custom.datepipe';
import { ProductUpdate } from 'src/app/admin-panel/models/product-update.model';
import { DialogData } from 'src/app/admin-panel/models/dialog-data.model';

@UntilDestroy()
@Component({
	selector: 'app-record-dialog',
	templateUrl: './record-dialog.component.html',
	styleUrls: ['./record-dialog.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
        CustomDatePipe
    ],
})
export class RecordDialogComponent implements OnInit, OnDestroy {

	fileToUpload: File = null;

	public populateForm$ = new Observable<any>();

	public imgSrcReplay = new ReplaySubject<string>(1);
	public imgSrcReplay$ = this.imgSrcReplay.asObservable();

	public imageRootPath = environment.baseUrl + '/Images/original/';

	public defaultimageRootPath = `${environment.baseUrl}/Images/original/default-image.png`;

	public categories$ = new Observable<Category[]>();
	public category$ = new Observable<Category>();

	public lastEditor$ = new Observable<Category>();

	public form: UntypedFormGroup = new UntypedFormGroup({
		id: new UntypedFormControl(0),
		band: new UntypedFormControl('', Validators.required),
		album: new UntypedFormControl('', Validators.required),
		releaseDate: new UntypedFormControl('', [Validators.required]),
		genre: new UntypedFormControl(''),
		description: new UntypedFormControl('', Validators.required),
		imagePath: new UntypedFormControl('default-image.png'),
		title: new UntypedFormControl('',[
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100)
        ]),
		price: new UntypedFormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
		categoryId: new UntypedFormControl(null),
		subCategoryId: new UntypedFormControl(null),
		editorUserId: new UntypedFormControl(null),
		categoryName: new UntypedFormControl(''),
		currentPage: new UntypedFormControl(1),
		totalPages: new UntypedFormControl(1),
		lastUpdateTime: new UntypedFormControl(''),
		order: new UntypedFormControl(''),
		sortKey: new UntypedFormControl(''),
	});

	constructor(
		public recordStore: RecordStore,
		public categoryStore: CategoryStore,
		public recordDialogService: RecordDialogService,
		public productTableService: ProductTableService,
		private userStore: UserStore,
		private activatedRoute: ActivatedRoute,
		private moduleService: ModuleService,
		private customDatePipe: CustomDatePipe,
		@Inject(MAT_DIALOG_DATA)
		public data: DialogData,
		) { }
	ngOnInit(): void {

		//this.paramMapProduct$ = this.activatedRoute.queryParams;

		this.populateForm$ = this.moduleService.productData$.pipe(
			untilDestroyed(this),
			filter(queryParams => !this.data.createNew),
			switchMap(productData => {
				this.populateForm(productData);
				return of(null);
			}),
			shareReplay(1),
		)

		this.category$ = this.categoryStore.getCategory(1).pipe(
			untilDestroyed(this),
			shareReplay(1)
		);



		console.log('this.categories$: ', this.categories$);


	}
	/**
	 * On destroy
	 */
	ngOnDestroy(): void {}



	public onSubmit(form: Record & ProductUpdate<Record>) {

		if (this.form.invalid) {
			return;
		}
		form.categoryName = 'Record';

		
		// Form data becomes null in observable so it needs to be cloned
		this.populateForm$ = this.userStore.getUserProfile().pipe(
			untilDestroyed(this),
			switchMap(user => {
				//Set forms userId to in logged user
				console.log('user: ', user)
				form.editorUserId = user.userId;

				const newRecord = new Record(this.form.value);

				console.log('newRecord: ', newRecord);
				//Create or update
				if (!form.id) {
					return this.recordStore.postRecord(newRecord, this.fileToUpload);
				} else {
					return this.recordStore.putRecord(newRecord, this.fileToUpload);
				}
			}),
			tap(updatedRecord => {
				let productUpdate = new ProductUpdate<Record>();

				productUpdate = {...form, row: updatedRecord}

				this.populateForm(productUpdate);

				return of(null);
			}),
			switchMap(x => {
				return this.productTableService.refreshMatTable(
					'records',
					form.totalPages,
					form.currentPage,
					form.sortKey,
					form.order,
					'',
					null
				)
			}),
			shareReplay(1),
		);
	}

	showPreview(file: File) {
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

	populateForm(productUpdate: ProductUpdate<Record>) {
		console.log('productUpdate: ', productUpdate);
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


		this.form.get('lastUpdateTime').setValue( this.customDatePipe.transform(productUpdate.row.lastUpdatedTime));

		this.imgSrcReplay.next(this.imageRootPath + productUpdate.row.imagePath);


		console.log('this.category$: ', this.category$);
	}

	onClear() {
		this.form.reset();
		this.imgSrcReplay.next(this.defaultimageRootPath);
	}

	/**
	 * Observable valuse of the form initiated with values
	 */
	 public get formValue$(): Observable<any> {
		return this.form.valueChanges.pipe(
			startWith(this.form.value),
			shareReplay(1),
		);
	}
}
