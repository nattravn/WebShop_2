import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

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

	public defaultimageRootPath = environment.baseUrl + '/Images/original/default-image.png';

	public categories$ = new Observable<Category[]>();
	public category$ = new Observable<Category>();

	public form: UntypedFormGroup = new UntypedFormGroup({
		id: new UntypedFormControl(0),
		band: new UntypedFormControl('', Validators.required),
		album: new UntypedFormControl('', Validators.required),
		year: new UntypedFormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
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
		userId: new UntypedFormControl(null),
		categoryName: new UntypedFormControl(''),
		currentPageIndex: new UntypedFormControl(1),
		currentTableSize: new UntypedFormControl(1),
		lastUpdateTime: new UntypedFormControl(''),
	});

	constructor(
		public recordStore: RecordStore,
		public categoryStore: CategoryStore,
		public recordDialogService: RecordDialogService,
		public productTableService: ProductTableService,
		private userStore: UserStore,
		private activatedRoute: ActivatedRoute,
		private moduleService: ModuleService,
		private customDatePipe: CustomDatePipe) { }
	ngOnInit(): void {

		//this.paramMapProduct$ = this.activatedRoute.queryParams;

		this.populateForm$ = this.moduleService.productData$.pipe(
			untilDestroyed(this),
			switchMap(productData => {
				return this.activatedRoute.queryParams.pipe(
					filter(queryParams => !JSON.parse(queryParams.createNewProduct)),
					tap((x: any) => this.populateForm(productData.row, productData.currentPageIndex, productData.currentTableSize)),
				)
			}),
			shareReplay(1),
		);

		this.category$ = this.categoryStore.getCategory(1).pipe(
			untilDestroyed(this),
			tap(x => { console.log('x: ', x); }),
			shareReplay(1)
		);

		console.log('this.categories$: ', this.categories$);


	}
	/**
	 * On destroy
	 */
	ngOnDestroy(): void {}
	public onSubmit(form: any) {

		if (this.form.invalid) {
		return;
		}
		form.categoryName = 'Record';
		// Form data becomes null in observable so it needs to be cloned
		this.userStore.getUserProfile().pipe(
			untilDestroyed(this),
			switchMap(user => {
				//Set forms userId to in logged user

				form.userId = user.userId;

				//Create or update
				if (!form.id) {
					return this.recordStore.postRecord(form, this.fileToUpload);
				} else {
					return this.recordStore.putRecord(form, this.fileToUpload);
				}
			}),
			switchMap(x => {
				return this.productTableService.refreshMatTable(
					'records',
					form.currentTableSize,
					form.currentPageIndex
				);
			})
		).subscribe();
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

	populateForm(record: Record, currentPageIndex: number, currentTableSize: number) {
		console.log('record: ', record);
		this.form.get('id').setValue(record.id);
		this.form.get('band').setValue(record.album);
		this.form.get('album').setValue(record.band);
		this.form.get('year').setValue(record.year);
		this.form.get('genre').setValue(record.genre);
		this.form.get('description').setValue(record.description);
		this.form.get('title').setValue(record.title);
		this.form.get('price').setValue(record.price);
		this.form.get('categoryId').setValue(record.categoryId);
		this.form.get('subCategoryId').setValue(record.subCategoryId);
		this.form.get('imagePath').setValue(record.imagePath);
		this.form.get('currentPageIndex').setValue(currentPageIndex);
		this.form.get('currentTableSize').setValue(currentTableSize);

	
		this.form.get('lastUpdateTime').setValue( this.customDatePipe.transform(record.lastUpdatedTime));

		this.imgSrcReplay.next(this.imageRootPath + record.imagePath);

		this.category$ = this.categoryStore.getCategory(record.categoryId).pipe(
			untilDestroyed(this),
			shareReplay(1)
		);

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
