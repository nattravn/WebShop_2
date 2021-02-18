import { Injectable, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { ReplaySubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CategoryStore } from 'src/app/admin-panel/stores/category.store';
import { Category } from 'src/app/admin-panel/models/category.model';

@UntilDestroy()
@Injectable()
export class CategoryTableService implements OnDestroy {

	public tableData = new ReplaySubject<MatTableDataSource<Category>>(1);
	public dataSource = new MatTableDataSource<Category>();

	constructor(private categoryStore: CategoryStore) {
		this.refreshMatTable();
	}
	ngOnDestroy(): void { }

	refreshMatTable() {
		this.categoryStore.getCategories().pipe(
			untilDestroyed(this)
		).subscribe(items => {
			console.log('items: ', items);
			this.dataSource.data = items;
			this.tableData.next(this.dataSource);
		});
	}
}
