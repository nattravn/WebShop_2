import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { ProductUpdate } from '@admin-panel/models/product-update.model';
import { ClothingUpdate } from '@admin-panel/models/clothing-update.model';
import { RecordUpdate } from '@admin-panel/models/record-update.model';
import { RecordModel } from '@admin-panel/models/record.model';
import { Clothing } from '@admin-panel/models/clothing.model';

@Injectable({
	providedIn: 'root',
})
export class ModuleService {
	public productData$ = new ReplaySubject<ProductUpdate<RecordModel | Clothing>>(1);
	public productDataRecord$ = new ReplaySubject<ProductUpdate<RecordUpdate>>(1);
	public productDataClothing$ = new ReplaySubject<ProductUpdate<ClothingUpdate>>(1);

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
