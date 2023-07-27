import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { ProductUpdate } from '../../models/product-update.model';
import { Record } from '../../models/record.model';
import { ProductTableService } from '../database-tables/product-table/services/product-table.service';

@Injectable({
	providedIn: 'root'
})
export class ModuleService {

	public productData$ = new ReplaySubject<ProductUpdate<any>>(1);

	constructor(private productTableService: ProductTableService) { }

	public updateProductForm (row: Record) {
		this.productData$.next({
			row: row,
			currentPage: this.productTableService.currentPageIndex,
			totalPages: this.productTableService.currentTableSize,
			order: this.productTableService.order,
			sortKey: this.productTableService.sortKey
		})
	}

}
