import { User } from '@admin-panel/models/user.model';
import { UsersTable } from '@admin-panel/models/users-table.model';
import { UserStore } from '@admin-panel/stores/user.store';
import { Injectable } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';

@UntilDestroy()
@Injectable()
export class UserTableService {
	public tableData$ = new Observable<{ items: MatTableDataSource<User>; totalItems: number }>();

	public dataSource = new MatTableDataSource<User>();

	public initPageLimit = 5;

	public sortKey = 'band';

	public order = 'asc';

	public currentPage = 1;

	public totalPages = 5;
	constructor(private userStore: UserStore) {}

	public refreshMatTable(
		pageLimit: number = null,
		page: number = null,
		key: string,
		order: string,
		searchQuery: string,
		sort: MatSort | null,
	): Observable<{ items: MatTableDataSource<User>; totalItems: number }> {
		this.tableData$ = this.userStore.getPagedUsers('applicationUser', pageLimit, page, key, order, searchQuery).pipe(
			untilDestroyed(this),
			switchMap((users: UsersTable) => {
				this.dataSource.data = users.items;
				this.sortKey = key;
				this.order = order;
				if (sort) {
					this.dataSource.sort = sort;
				}

				return of({ items: this.dataSource, totalItems: users.totalItems });
			}),
			shareReplay(1),
		);

		return this.tableData$;
	}
}
