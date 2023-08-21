import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { ProductDialog } from '@admin-panel/models/product-dialog.model';
import { ClothingUpdate } from '@admin-panel/models/clothing-update.model';
import { RecordUpdate } from '@admin-panel/models/record-update.model';
import { RecordModel } from '@admin-panel/models/record.model';
import { Clothing } from '@admin-panel/models/clothing.model';
import { BaseProduct } from '@admin-panel/models/base-product.model';
import { CategoryDialog } from '@admin-panel/models/category-dialog.model';
import { UsersDialog } from '@admin-panel/models/users-dialog.model';

@Injectable({
	providedIn: 'root',
})
export class ModuleService {
	public productData$ = new ReplaySubject<ProductDialog<RecordModel | Clothing | BaseProduct>>(1);
	public categoryFormData$ = new ReplaySubject<CategoryDialog>(1);
	public userFormData$ = new ReplaySubject<UsersDialog>(1);
	public productDataRecord$ = new ReplaySubject<ProductDialog<RecordUpdate>>(1);
	public productDataClothing$ = new ReplaySubject<ProductDialog<ClothingUpdate>>(1);

	constructor() {}

	// public updateProductForm(row: RecordModel) {
	// 	this.productData$.next({
	// 		row: row,
	// 		currentPage: this.productTableService.currentPageIndex,
	// 		totalPages: this.productTableService.currentTableSize,
	// 		order: this.productTableService.order,
	// 		sortKey: this.productTableService.sortKey,
	// 	});
	// }
}
