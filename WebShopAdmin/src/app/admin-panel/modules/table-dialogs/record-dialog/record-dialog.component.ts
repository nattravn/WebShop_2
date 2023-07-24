import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { filter, shareReplay, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { RecordStore } from 'src/app/admin-panel/stores/record.store';
import { UserStore } from 'src/app/admin-panel/stores/user.store';
import { environment } from 'src/environments/environment';
import { CategoryStore } from 'src/app/admin-panel/stores/category.store';
import { RecordDialogService } from './services/record-dialog.service';
import { ProductTableService } from '../../database-tables/product-table/services/product-table.service';
import { ModuleService } from '../../services/module-service.service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/admin-panel/models/category.model';
import { Record } from 'src/app/admin-panel/models/record.model';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
	selector: 'app-record-dialog',
	templateUrl: './record-dialog.component.html',
	styleUrls: ['./record-dialog.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
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

	public form: FormGroup = new FormGroup({
		id: new FormControl(0),
		band: new FormControl('', Validators.required),
		album: new FormControl('', Validators.required),
		year: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
		genre: new FormControl(''),
		description: new FormControl('', Validators.required),
		imagePath: new FormControl('default-image.png'),
		title: new FormControl('',[
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20)
        ]),
		price: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
		categoryId: new FormControl(null),
		subCategoryId: new FormControl(null),
		userId: new FormControl(null),
		categoryName: new FormControl(''),
		currentPageIndex: new FormControl(1),
		currentTableSize: new FormControl(1),
	});

	constructor(
		public recordStore: RecordStore,
		public categoryStore: CategoryStore,
		public recordDialogService: RecordDialogService,
		public productTableService: ProductTableService,
		private userStore: UserStore,
		private activatedRoute: ActivatedRoute,
		private moduleService: ModuleService) { }
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
		console.log("form: ", form)
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
