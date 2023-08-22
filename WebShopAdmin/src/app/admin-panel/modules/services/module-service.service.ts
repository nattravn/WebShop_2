import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { ProductDialog } from '@admin-panel/models/product-dialog.model';
import { ClothingUpdate } from '@admin-panel/models/clothing-update.model';
import { RecordUpdate } from '@admin-panel/models/record-update.model';
import { BaseProduct } from '@admin-panel/models/base-product.model';
import { CategoryDialog } from '@admin-panel/models/category-dialog.model';
import { UsersDialog } from '@admin-panel/models/users-dialog.model';
import { ProductTableService } from '@database-tables/product-table/services/product-table.service';
import { ShoeUpdate } from '@admin-panel/models/shoe-update.model';

@Injectable()
export class ModuleService {
	public productData$ = new ReplaySubject<ProductDialog<RecordUpdate | ClothingUpdate | ShoeUpdate | BaseProduct>>(1);
	public categoryFormData$ = new ReplaySubject<CategoryDialog>(1);
	public userFormData$ = new ReplaySubject<UsersDialog>(1);
	public productDataRecord$ = new ReplaySubject<ProductDialog<RecordUpdate>>(1);
	public productDataClothing$ = new ReplaySubject<ProductDialog<ClothingUpdate>>(1);

	constructor(private productTableService: ProductTableService) {}

	public broadcastProductData(data: RecordUpdate | ClothingUpdate | ShoeUpdate | BaseProduct) {
		this.productData$.next({
			row: data,
			currentPage: this.productTableService.currentPage,
			totalPages: this.productTableService.totalPages,
			order: this.productTableService.order,
			sortKey: this.productTableService.sortKey,
		});
	}
}
