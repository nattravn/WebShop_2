import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, filter, shareReplay, startWith, switchMap } from 'rxjs/operators';

import { Clothing } from '@admin-panel/models/clothing.model';
import { DialogData } from '@admin-panel/models/dialog-data.model';
import { ProductUpdate } from '@admin-panel/models/product-update.model';
import { ModuleService } from '@admin-panel/modules/services/module-service.service';
import { ClothingStore } from '@admin-panel/stores/clothing.store';
import { UserStore } from '@admin-panel/stores/user.store';
import { ProductTableService } from '@database-tables/product-table/services/product-table.service';
import { environment } from '@environments/environment';
import { RecordDialogService } from '@table-dialogs/products-dialog/record-dialog/services/record-dialog.service';

export interface IClothingForm {
	id: FormControl<number>;
	title: FormControl<string>;
	price: FormControl<number>;
	size: FormControl<string>;
	imagePath: FormControl<string>;
	description: FormControl<string>;
	category: FormControl<string>;
	categoryId: FormControl<number>;
	userId: FormControl<string>;
	subCategoryId: FormControl<number>;
	currentPageIndex: FormControl<number>;
	currentTableSize: FormControl<number>;
}

@UntilDestroy()
@Component({
	selector: 'app-clothing-dialog',
	templateUrl: './clothing-dialog.component.html',
})
export class ClothingDialogComponent implements OnInit {
	public defaultImage = `${environment.baseUrl}/Images/original/default-image.png`;

	public imageRootPath = `${environment.baseUrl}/Images/original/`;

	public defaultimageRootPath = `${environment.baseUrl}/Images/original/default-image.png`;

	public fileToUpload: File;

	public populateForm$ = new Observable<any>();

	public imgSrcReplay = new ReplaySubject<string>(1);
	public imgSrcReplay$ = this.imgSrcReplay.asObservable();

	public form = new FormGroup<IClothingForm>({
		id: new FormControl(null),
		title: new FormControl(''),
		price: new FormControl(0),
		size: new FormControl(''),
		imagePath: new FormControl('default-image.png'),
		description: new FormControl(''),
		category: new FormControl('Clothing'),
		categoryId: new FormControl(null),
		userId: new FormControl(null),
		subCategoryId: new FormControl(null),
		currentPageIndex: new FormControl(1),
		currentTableSize: new FormControl(1),
	});

	constructor(
		public clothingStore: ClothingStore,
		public dialogRef: MatDialogRef<ClothingDialogComponent>,
		private userStore: UserStore,
		public recordDialogService: RecordDialogService,
		public moduleService: ModuleService,
		public productTableService: ProductTableService,
		@Inject(MAT_DIALOG_DATA)
		public data: DialogData,
	) {}

	ngOnInit() {
		this.populateForm$ = this.moduleService.productData$.pipe(
			untilDestroyed(this),
			filter((queryParams) => !this.data.createNew),
			switchMap((productData) => {
				this.populateForm(productData);
				return of(null);
			}),
			shareReplay(1),
		);
	}

	public populateForm(clothing: ProductUpdate<Clothing>) {
		this.form.get('id').setValue(clothing.row.id);
		this.form.get('description').setValue(clothing.row.description);
		this.form.get('title').setValue(clothing.row.title);
		this.form.get('price').setValue(clothing.row.price);
		this.form.get('categoryId').setValue(clothing.row.categoryId);
		this.form.get('subCategoryId').setValue(clothing.row.subCategoryId);
		this.form.get('imagePath').setValue(clothing.row.imagePath);
		this.form.get('currentPageIndex').setValue(clothing.currentPage);
		this.form.get('currentTableSize').setValue(clothing.totalPages);

		this.imgSrcReplay.next(this.imageRootPath + clothing.row.imagePath);
	}

	public onFileSelected(file: FileList) {
		this.fileToUpload = file.item(0);
		const inputNode: any = document.querySelector('#file');

		if (typeof FileReader !== 'undefined') {
			const reader = new FileReader();

			reader.onload = (event: any) => {
				this.imageRootPath = event.target.result;
				this.form.value.imagePath = inputNode.files[0].name;
			};

			reader.readAsDataURL(this.fileToUpload);
		}
	}

	public onClear() {
		this.form.reset();
		this.initializeFormGroup();
	}

	public onSubmit(form: Clothing & ProductUpdate<Clothing>) {
		this.form.get('category').setValue('Clothing');
		// Form data becomes null in observable so it needs to be cloned
		this.userStore
			.getUserProfile()
			.pipe(
				untilDestroyed(this),
				switchMap((user) => {
					// Set forms userId to in logged user
					form.editorUserId = user.userId;

					// Create or update
					if (!this.form.get('id').value) {
						return this.clothingStore.postClothing(form, this.fileToUpload);
					} else {
						return this.clothingStore.putClothing(form, this.fileToUpload);
					}
				}),
				switchMap((x) =>
					this.productTableService.refreshMatTable('clothings', form.totalPages, form.currentPage, 'band', 'asc', '', null),
				),
				catchError((error) => {
					console.log('error: ', error);
					throw error;
				}),
			)
			.subscribe((x) => {
				console.log('x: ', x);
			});
	}

	public onClose() {
		this.form.reset();
		this.initializeFormGroup();
		this.dialogRef.close();
	}

	public insertClothing(form: any) {
		this.clothingStore.postClothing(form.value, this.fileToUpload);
	}

	public updateClothing(form: any) {
		this.clothingStore.putClothing(form.value, this.fileToUpload);
	}

	private initializeFormGroup() {
		this.form.setValue({
			id: null,
			title: '',
			price: null,
			size: '',
			imagePath: '',
			description: '',
			category: 'Clothing',
			userId: null,
			subCategoryId: null,
			categoryId: 2,
			currentPageIndex: 1,
			currentTableSize: 1,
		});
	}

	/**
	 * Observable valuse of the form initiated with values
	 */
	public get formValue$(): Observable<any> {
		return this.form.valueChanges.pipe(startWith(this.form.value), shareReplay(1));
	}
}
