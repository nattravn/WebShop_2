import { CategoryNameEnum } from '@admin-panel/enums/categoryName.enum';
import { BaseProduct } from '@admin-panel/models/base-product.model';
import { ClothingUpdate } from '@admin-panel/models/clothing-update.model';
import { Clothing } from '@admin-panel/models/clothing.model';
import { RecordUpdate } from '@admin-panel/models/record-update.model';
import { RecordModel } from '@admin-panel/models/record.model';
import { ShoeUpdate } from '@admin-panel/models/shoe-update.model';
import { Shoe } from '@admin-panel/models/shoe.model';
import { ModuleService } from '@admin-panel/modules/services/module-service.service';
import { ClothingStore } from '@admin-panel/stores/clothing.store';
import { RecordStore } from '@admin-panel/stores/record.store';
import { ShoeStore } from '@admin-panel/stores/shoe.store';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { shareReplay, startWith, switchMap } from 'rxjs/operators';

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
}

export interface IClothingForm {
	size: FormControl<string>;
}

export interface IShoeForm {
	size: FormControl<string>;
}

@Injectable()
export class ProductDialogService {
	public recordForm = new FormGroup<IRecordForm>({
		band: new FormControl('', Validators.required),
		album: new FormControl('', Validators.required),
	});

	public clothingForm = new FormGroup<IClothingForm>({
		size: new FormControl('', Validators.required),
	});

	public shoeForm = new FormGroup<IShoeForm>({
		size: new FormControl('', Validators.required),
	});

	// public imgSrcReplay$ = new ReplaySubject<string>(1);
	constructor(
		private recordStore: RecordStore,
		private clothingStore: ClothingStore,
		private shoeStore: ShoeStore,
		private moduleService: ModuleService,
	) {}

	public updateProduct(
		productUpdate: BaseProduct,
		fileToUpload: File,
		productForm: RecordModel | Clothing | Shoe,
	): Observable<RecordUpdate | ClothingUpdate | ShoeUpdate> {
		if (productUpdate.categoryName.toLocaleLowerCase() === CategoryNameEnum.records) {
			//
			const newRecord = new RecordUpdate({ ...productUpdate, ...productForm });
			return this.recordStore.putRecord(newRecord, fileToUpload);
		} else if (productUpdate.categoryName.toLocaleLowerCase() === CategoryNameEnum.clothings) {
			//
			const newClothing = new ClothingUpdate({ ...productUpdate, ...productForm });
			return this.clothingStore.putClothing(newClothing, fileToUpload);
		} else if (productUpdate.categoryName.toLocaleLowerCase() === CategoryNameEnum.shoes) {
			//
			const newShoe = new ShoeUpdate({ ...productUpdate, ...productForm });
			return this.shoeStore.putShoe(newShoe, fileToUpload);
		} else {
			console.error('error: no implemented category found', productUpdate);
			return EMPTY;
		}
	}

	public createProduct(
		productUpdate: BaseProduct,
		fileToUpload: File,
		productForm: RecordModel | Clothing | Shoe,
	): Observable<RecordUpdate | ClothingUpdate | ShoeUpdate> {
		if (productUpdate.categoryName.toLocaleLowerCase() === CategoryNameEnum.shoes) {
			productUpdate.categoryName = CategoryNameEnum.shoes;
			const newShoe = new ShoeUpdate({ ...productUpdate, ...productForm });
			return this.shoeStore.postShoe(newShoe, fileToUpload);
		} else if (productUpdate.categoryName.toLocaleLowerCase() === CategoryNameEnum.records) {
			//
			productUpdate.categoryName = CategoryNameEnum.records;
			const newRecord = new RecordUpdate({ ...productUpdate, ...productForm });
			return this.recordStore.postRecord(newRecord, fileToUpload);
		} else if (productUpdate.categoryName.toLocaleLowerCase() === CategoryNameEnum.clothings) {
			//
			productUpdate.categoryName = CategoryNameEnum.clothings;
			const newClothing = new ClothingUpdate({ ...productUpdate, ...productForm });
			return this.clothingStore.postClothing(newClothing, fileToUpload);
		} else {
			console.error('error: no implemented category found', productUpdate);
			return EMPTY;
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

	public get clothFormValue$(): Observable<any> {
		return this.clothingForm.valueChanges.pipe(startWith(this.clothingForm.value), shareReplay(1));
	}

	public get productFormValue$(): Observable<any> {
		return this.moduleService.productData$.pipe(
			switchMap((data) => {
				switch (data.row.categoryName.toLocaleLowerCase()) {
					case CategoryNameEnum.records:
						return this.recordForm.valueChanges.pipe(startWith(this.recordForm.value), shareReplay(1));
					case CategoryNameEnum.clothings:
						return this.clothingForm.valueChanges.pipe(startWith(this.clothingForm.value), shareReplay(1));
					case CategoryNameEnum.shoes:
						return this.shoeForm.valueChanges.pipe(startWith(this.shoeForm.value), shareReplay(1));
					default:
						break;
				}
			}),
		);
	}
}
