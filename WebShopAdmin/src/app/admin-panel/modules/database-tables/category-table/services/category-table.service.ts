import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of } from 'rxjs';

import { Category } from '@admin-panel/models/category.model';
import { CategoryStore } from '@admin-panel/stores/category.store';
import { MatSort } from '@angular/material/sort';
import { shareReplay, switchMap } from 'rxjs/operators';
import { CategoryTable } from '@admin-panel/models/category-table.model';

@UntilDestroy()
@Injectable()
export class CategoryTableService {
	public tableData$ = new Observable<{ items: MatTableDataSource<Category>; totalItems: number }>();
	public dataSource = new MatTableDataSource<Category>();

	public initPageLimit = 5;

	public sortKey = 'name';

	public order = 'asc';

	public currentPage = 1;

	public totalPages = 5;

	constructor(private categoryStore: CategoryStore) {}

	public refreshMatTable(
		pageLimit: number = null,
		page: number = null,
		key: string,
		order: string,
		searchQuery: string,
		sort: MatSort | null,
	): Observable<{ items: MatTableDataSource<Category>; totalItems: number }> {
		this.tableData$ = this.categoryStore.getPagedCategories(pageLimit, page, key, order, searchQuery).pipe(
			untilDestroyed(this),
			switchMap((products: CategoryTable) => {
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
