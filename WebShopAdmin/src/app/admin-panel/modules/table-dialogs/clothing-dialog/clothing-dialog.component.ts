import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { ClothingStore } from '../../../stores/clothing.store';
import { ToastrService } from 'ngx-toastr';

import { UserStore } from '../../../stores/user.store';
import { environment } from 'src/environments/environment';
import { RecordDialogService } from '../record-dialog/services/record-dialog.service';
import { ModuleService } from '../../services/module-service.service';
import { catchError, filter, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { Observable, of, ReplaySubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { ProductTableService } from '../../database-tables/product-table/services/product-table.service';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
	selector: 'app-clothing-dialog',
	templateUrl: './clothing-dialog.component.html'
})
export class ClothingDialogComponent implements OnInit {
	public defaultImage = environment.baseUrl + '/Images/original/default-image.png';

	public imageRootPath = environment.baseUrl + '/Images/original/';
	public defaultimageRootPath = environment.baseUrl + '/Images/original/default-image.png';

	fileToUpload: File;

	public populateForm$ = new Observable<any>();

	public imgSrcReplay = new ReplaySubject<string>(1);
	public imgSrcReplay$ = this.imgSrcReplay.asObservable();

	public form: UntypedFormGroup = new UntypedFormGroup({
		id: new UntypedFormControl(null),
		title: new UntypedFormControl(''),
		price: new UntypedFormControl(''),
		size: new UntypedFormControl(''),
		imagePath: new UntypedFormControl('default-image.png'),
		description: new UntypedFormControl(''),
		category: new UntypedFormControl('Clothing'),
		categoryId: new UntypedFormControl(null),
		userId: new UntypedFormControl(null),
		// userName: new FormControl(''),
		subCategoryId: new UntypedFormControl(''),
		currentPageIndex: new UntypedFormControl(1),
		currentTableSize: new UntypedFormControl(1)
	});

	constructor(
		public clothingStore: ClothingStore,
		private toastr: ToastrService,
		public dialogRef: MatDialogRef<ClothingDialogComponent>,
		private userStore: UserStore,
		public recordDialogService: RecordDialogService,
		public moduleService: ModuleService,
		public productTableService: ProductTableService,
		private activatedRoute: ActivatedRoute,
	) { }

	ngOnInit() {


		this.populateForm$ = this.moduleService.productData$.pipe(
			untilDestroyed(this),
			switchMap(productData => {
				return this.activatedRoute.queryParams.pipe(
					filter(queryParams => !JSON.parse(queryParams.createNewProduct)),
					tap((x: any) => this.populateForm(productData.row, productData.currentPageIndex, productData.currentTableSize)),
				)
			}),
			shareReplay(1),
		)
	}

	populateForm(clothing: any, currentPageIndex: number, currentTableSize: number) {
		console.log("clothing: ", clothing)
		this.form.get('id').setValue(clothing.id);
		this.form.get('description').setValue(clothing.description);
		this.form.get('title').setValue(clothing.title);
		this.form.get('price').setValue(clothing.price);
		this.form.get('category').setValue(clothing.category);
		this.form.get('categoryId').setValue(clothing.categoryId);
		this.form.get('subCategoryId').setValue(clothing.subCategoryId);
		this.form.get('imagePath').setValue(clothing.imagePath);
		this.form.get('currentPageIndex').setValue(currentPageIndex);
		this.form.get('currentTableSize').setValue(currentTableSize);

		this.imgSrcReplay.next(this.imageRootPath + clothing.imagePath);

		//this.category$ = this.categoryStore.getCategory(record.categoryId).pipe(untilDestroyed(this), shareReplay(1));
	}

	// populateForm(clothing) {
	// 	this.form.setValue(clothing);
	// }

	initializeFormGroup() {
		this.form.setValue({
			id: null,
			title: '',
			price: '',
			size: '',
			imagePath: '',
			description: '',
			category: 'Clothing',
			userId: null,
			//userName: '',
			subCategory: ''
		});
	}

	onFileSelected(file: FileList) {
		this.fileToUpload = file.item(0);
		const inputNode: any = document.querySelector('#file');

		if (typeof FileReader !== 'undefined') {
			const reader = new FileReader();

			reader.onload = (event: any) => {
				this.imageRootPath = event.target.result;
				this.form.value.ImagePath =
					inputNode.files[0].name;
			};

			reader.readAsDataURL(this.fileToUpload);
		}
	}

	onClear() {
		this.form.reset();
		this.initializeFormGroup();
	}

	onSubmit(form: any) {
		//this.clothingStore.form.value.userName = this.userStore.currentUser.userName;

		// if (!this.form.value.id) {
		// 	this.insertClothing(this.form);
		// } else {
		// 	this.updateClothing(this.form);
		// }

		//this.clothingStore.initializeFormGroup();
		//this.dialogRef.close();

		console.log("form: ", form)

		this.form.get('category').setValue('Clothing');
		// Form data becomes null in observable so it needs to be cloned
		this.userStore.getUserProfile().pipe(
			untilDestroyed(this),
			switchMap(user => {
				//Set forms userId to in logged user
				form.userId = user.userId;

				//Create or update
				if (!this.form.get('id').value) {
					return this.clothingStore.postClothing(form, this.fileToUpload)
				} else {
					return this.clothingStore.putClothing(form, this.fileToUpload)
				}
			}),
			switchMap(x => {
				return this.productTableService.refreshMatTable(
					'clothings',
					form.currentTableSize,
					form.currentPageIndex
				);
			}),
			catchError(	error => {
				console.log("error: ", error)
				throw error;
			}),
		).subscribe(x => {
			console.log("x: ", x)
		});
	}

	onClose() {
		this.form.reset();
		this.initializeFormGroup();
		this.dialogRef.close();
	}

	insertClothing(form: any) {
		this.clothingStore.postClothing(form.value, this.fileToUpload)

	}

	updateClothing(form: any) {

		this.clothingStore.putClothing(form.value, this.fileToUpload)

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
