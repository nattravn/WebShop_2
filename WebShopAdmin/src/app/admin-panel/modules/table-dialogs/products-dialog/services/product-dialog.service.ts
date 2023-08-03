import { ClothingUpdate } from '@admin-panel/models/clothing-update.model';
import { ProductUpdate } from '@admin-panel/models/product-update.model';
import { RecordUpdate } from '@admin-panel/models/record-update.model';
import { ClothingStore } from '@admin-panel/stores/clothing.store';
import { RecordStore } from '@admin-panel/stores/record.store';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { shareReplay, startWith } from 'rxjs/operators';

export interface IProductForm {
	id: FormControl<number>;
	releaseDate: FormControl<Date>;
	description: FormControl<string>;
	imagePath: FormControl<string>;
	title: FormControl<string>;
	price: FormControl<number>;
	categoryId: FormControl<number>;
	subCategoryId: FormControl<number>;
	editorUserId: FormControl<string>;
	categoryName: FormControl<string>;
	currentPage: FormControl<number>;
	totalPages: FormControl<number>;
	lastUpdateTime: FormControl<Date>;
	order: FormControl<string>;
	sortKey: FormControl<string>;
}

export interface IRecordForm {
	band: FormControl<string>;
	album: FormControl<string>;
	genre: FormControl<string>;
}

export interface IClothingForm {
	size: FormControl<string>;
}

@Injectable()
export class ProductDialogService {
	// public productBaseForm = new FormGroup<IProductForm>({
	// 	id: new FormControl(0),
	// 	releaseDate: new FormControl(new Date(), [Validators.required]),
	// 	description: new FormControl('', Validators.required),
	// 	imagePath: new FormControl('default-image.png'),
	// 	title: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
	// 	price: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
	// 	categoryId: new FormControl(null),
	// 	subCategoryId: new FormControl(null),
	// 	editorUserId: new FormControl(null),
	// 	categoryName: new FormControl(''),
	// 	currentPage: new FormControl(1),
	// 	totalPages: new FormControl(1),
	// 	lastUpdateTime: new FormControl(new Date()),
	// 	order: new FormControl(''),
	// 	sortKey: new FormControl(''),
	// });

	public recordForm = new FormGroup<IRecordForm>({
		band: new FormControl('', Validators.required),
		album: new FormControl('', Validators.required),
		genre: new FormControl(''),
	});

	public clothingForm = new FormGroup<IClothingForm>({
		size: new FormControl('', Validators.required),
	});

	// public imgSrcReplay$ = new ReplaySubject<string>(1);

	constructor(
		private recordStore: RecordStore,
		private clothingStore: ClothingStore,
	) {}

	public populateForm(productUpdate: ProductUpdate<RecordUpdate | ClothingUpdate>) {
		if (productUpdate.row instanceof RecordUpdate) {
			this.recordForm.get('band').setValue(productUpdate.row.band);
			this.recordForm.get('album').setValue(productUpdate.row.album);
			this.recordForm.get('genre').setValue(productUpdate.row.genre);
		} else if (productUpdate.row instanceof ClothingUpdate) {
			this.clothingForm.get('size').setValue(productUpdate.row.size);
		}

		// this.imgSrcReplay.next(this.imageRootPath + productUpdate.row.imagePath);
	}

	public updateProduct(productUpdate: ProductUpdate<RecordUpdate | ClothingUpdate>, fileToUpload: File) {
		if (productUpdate.row instanceof RecordUpdate) {
			this.recordStore.putRecord(productUpdate.row as RecordUpdate, fileToUpload);
		} else if (productUpdate.row instanceof ClothingUpdate) {
			this.clothingStore.putClothing(productUpdate.row as ClothingUpdate, fileToUpload);
		}
	}

	public createProduct(productUpdate: ProductUpdate<RecordUpdate | ClothingUpdate>, fileToUpload: File) {
		if (productUpdate.row instanceof RecordUpdate) {
			this.recordStore.postRecord(productUpdate.row as RecordUpdate, fileToUpload);
		} else if (productUpdate.row instanceof ClothingUpdate) {
			this.clothingStore.postClothing(productUpdate.row as ClothingUpdate, fileToUpload);
		}
	}

	// public showPreview(file: File) {
	// 	if (!file) {
	// 		return;
	// 	}
	// 	const reader = new FileReader();
	// 	reader.onload = (e: any) => {
	// 		this.imgSrcReplay$.next(e.target.result);
	// 	};
	// 	reader.readAsDataURL(file);
	// 	this.form.get('imagePath').setValue(file.name);
	// 	// this.fileToUpload = file;
	// }

	/**
	 * Observable valuse of the form initiated with values
	 */
	public get recordFormValue$(): Observable<any> {
		return this.recordForm.valueChanges.pipe(startWith(this.recordForm.value), shareReplay(1));
	}
}
