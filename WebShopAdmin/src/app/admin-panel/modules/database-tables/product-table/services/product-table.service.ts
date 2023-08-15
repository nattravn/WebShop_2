import { Injectable } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';

import { Clothing } from '@admin-panel/models/clothing.model';
import { RecordModel } from '@admin-panel/models/record.model';
import { ProductTable } from '@admin-panel/models/product-table.model';
import { CategoryStore } from '@admin-panel/stores/category.store';

@UntilDestroy()
@Injectable()
export class ProductTableService {
	public tableData$ = new Observable<{ items: MatTableDataSource<RecordModel | Clothing>; totalItems: number }>();

	public dataSource = new MatTableDataSource<RecordModel | Clothing>();

	public initPageLimit = 5;

	public sortKey = 'band';

	public order = 'asc';

	public currentPage = 1;

	public totalPages = 5;

	// private eventUrl = '';

	constructor(private categoryStore: CategoryStore) {
		// const eventUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
		// this.route.data.subscribe(v => console.log('v: ', v))
		// this.route.queryParams.subscribe(v => console.log('v: ', v))
		// this.route.params.subscribe(v => console.log('v: ', v))
		// this.route.paramMap.subscribe(v => console.log('v: ', v))
		// this.route.events.pipe(
		// 	filter(event => event instanceof NavigationStart)
		// ).subscribe((event:NavigationStart) => {
		// 		console.log('event: ', event);
		// 	this.eventUrl = event.url.substring(event.url.lastIndexOf('/') + 1);
		// 	this.refreshMatTable();
		// });
		// this.refreshMatTable(eventUrl,5,1);
	}

	public refreshMatTable(
		productString: string,
		pageLimit: number = null,
		page: number = null,
		key: string,
		order: string,
		searchQuery: string,
		sort: MatSort | null,
	): Observable<{ items: MatTableDataSource<RecordModel | Clothing>; totalItems: number }> {
		this.tableData$ = this.categoryStore.getPagedProducts(productString, pageLimit, page, key, order, searchQuery).pipe(
			untilDestroyed(this),
			switchMap((products: ProductTable) => {
				this.dataSource.data = products.items;
				this.sortKey = key;
				this.order = order;
				if (sort) {
					this.dataSource.sort = sort;
				}

				return of({ items: this.dataSource, totalItems: products.totalItems });
			}),
			shareReplay(1),
		);

		return this.tableData$;
	}
}
