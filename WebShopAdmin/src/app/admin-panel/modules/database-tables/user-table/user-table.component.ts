import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PagedUsers } from 'src/app/admin-panel/models/paged-users.model';

import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';

import { User } from '@admin-panel/models/user.model';
import { UserStore } from '@admin-panel/stores/user.store';
import { DialogFactoryService } from '@table-dialogs/services/dialog-factory.service';
import { UserDialogComponent } from '@table-dialogs/user-dialog/user-dialog.component';

export interface IFilterForm {
	search: FormControl<string>;
}
@Component({
	selector: 'app-user-table',
	templateUrl: './user-table.component.html',
	styleUrls: ['./user-table.component.css'],
	providers: [DialogFactoryService],
})
export class UserTableComponent implements OnInit {
	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	@ViewChild('userDialogTemplate') userDialogTemplate: TemplateRef<UserDialogComponent>;
	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	@ViewChild(MatSort) sort: MatSort;
	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	@ViewChild(MatPaginator) paginator: MatPaginator;
	public displayedColumns: string[] = ['userName', 'email', 'actions', 'fullName'];

	public tableData$ = new Observable<{
		items: MatTableDataSource<User>;
		totalItems: number;
	}>();

	public filterForm = new FormGroup<IFilterForm>({
		search: new FormControl('', []),
	});

	public dataSource = new MatTableDataSource<User>();

	public searchKey = '';

	// private currentPageIndex = 1;

	// private currentTableSize = 5;

	private active = 'userName';

	private direction = 'asc';

	constructor(
		private userStore: UserStore,
		private toastr: ToastrService,
		private dialogFactoryService: DialogFactoryService,
		public activatedRoute: ActivatedRoute,
		public router: Router,
	) {}
	ngOnInit(): void {
		this.refreshMatTable('applicationUser', 5, 1, this.active, this.direction);
	}

	public sortData(filterForm: FormGroup, sort: Sort) {
		this.active = sort.active;
		this.direction = sort.direction;

		if (!filterForm.value['search']) {
			this.refreshMatTable('ApplicationUser', 5, 1, sort.active, sort.direction);
		}
	}

	public onSearchClear(dataSource: MatTableDataSource<User>) {
		this.filterForm.reset();
		dataSource.filter = '';
		this.refreshMatTable('ApplicationUser', 5, 1, this.active, this.direction);
	}

	public updateTable(filterForm: FormGroup, event?: PageEvent) {
		// this.currentPageIndex = event.pageIndex + 1;
		// this.currentTableSize = event.pageSize;

		// Temporary solution. Remove if-state and do backend call here with search param
		if (!filterForm.get('search').value) {
			this.refreshMatTable('ApplicationUser', event.pageSize, event.pageIndex + 1, this.active, this.direction);
		}
	}

	public applyFilter(event: Event, dataSource: MatTableDataSource<User>) {
		const filterValue = (event.target as HTMLInputElement).value;

		this.tableData$ = this.userStore.getUsersByKeyWord(filterValue, '').pipe(
			switchMap((x: User[]) => {
				dataSource.data = x ? x : [];
				dataSource.paginator = this.paginator;
				dataSource.sort = this.sort;
				return of({ items: dataSource, totalItems: x.length });
			}),
			shareReplay(1),
		);
	}

	public onDelete(row: any) {
		if (confirm('Are you sure to delete this record?')) {
			this.userStore.deleteUser(row.id).subscribe(() => {
				this.toastr.warning('Deleted successfully', 'EMP. Register');
				this.refreshMatTable('endpoint', 5, 1, this.active, this.direction);
			});
		}
	}

	public onEdit(row: any, paramMap: any) {
		// this.recordDialogService.populateForm(row);
		// if(paramMap.get('product')){
		// 	this.router.navigate(['adminpanel/tables/products/'+paramMap.get('product'), {outlets: {tablesOutlet: paramMap.get('product')}}]);
		// }
		// console.log('row: ', row);
		// const dialogConfig = new MatDialogConfig();
		// dialogConfig.disableClose = false;
		// dialogConfig.autoFocus = true;
		// dialogConfig.width = '60%';
		// this.userStore.populateMenuForm(row);
		// this.dialog2 = this.dialogFactoryService.open({
		// 	headerText: 'Header text',
		// 	category: {
		// 		id: 99,
		// 		name: 'User',
		// 		route: 'user'
		// 	},
		// 	createNew: false,
		// 	template: this.userDialogTemplate
		// });
		// this.dialog
		//     .open(AddUserComponent, dialogConfig)
		//     .afterClosed()
		//     .subscribe(result => {
		//         this.refreshMatTable();
		//         this.router.navigateByUrl('/adminpanel');
		//     });
	}

	public onCreate(paramMap: ParamMap) {
		this.userStore.userForm.reset();

		console.log('userDialogTemplate: ', this.userDialogTemplate);

		this.router
			.navigate(['adminpanel/tables/users/user', { outlets: { tablesOutlet: 'users' } }], {
				queryParams: { createNewProduct: true },
			})
			.then(() => {
				this.dialogFactoryService.open({
					headerText: 'Header text user',
					category: {
						id: 99,
						name: 'users',
						route: 'user',
					},
					createNew: true,
					template: this.userDialogTemplate,
				});
			});
	}

	private refreshMatTable(endpoint: string, pageSize: number, pageIndex: number, active: string, direction: string) {
		this.tableData$ = this.userStore.getPagedUsers(endpoint, pageSize, pageIndex, active, direction).pipe(
			switchMap((pagedUsers: PagedUsers) => {
				const dataSource = new MatTableDataSource<User>();
				dataSource.data = pagedUsers.items;
				dataSource.sort = this.sort;
				// dataSource.paginator = this.paginator;
				return of({ items: dataSource, totalItems: pagedUsers.totalItems });
			}),
			shareReplay(1),
		);

		return this.tableData$;
	}
}
