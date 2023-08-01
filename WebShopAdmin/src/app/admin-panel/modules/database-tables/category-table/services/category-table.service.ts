import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ReplaySubject } from 'rxjs';

import { Category } from '@admin-panel/models/category.model';
import { CategoryStore } from '@admin-panel/stores/category.store';

@UntilDestroy()
@Injectable()
export class CategoryTableService {
	public tableData = new ReplaySubject<MatTableDataSource<Category>>(1);
	public dataSource = new MatTableDataSource<Category>();

	constructor(private categoryStore: CategoryStore) {}

	public refreshMatTable() {
		this.categoryStore
			.getPagedCategories(5, 1)
			.pipe(untilDestroyed(this))
			.subscribe((items) => {
				this.dataSource.data = items.items;
				this.tableData.next(this.dataSource);
			});
	}
}
