import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from '@admin-panel/models/user.model';
import { UserStore } from '@admin-panel/stores/user.store';
import { DialogFactoryService } from '@table-dialogs/services/dialog-factory.service';
import { UserDialogComponent } from '@table-dialogs/user-dialog/user-dialog.component';
import { ModuleService } from '@admin-panel/modules/services/module-service.service';
import { AdminCategoryRoutesEnum } from '@admin-panel/enums/adminCategoryRoutes.enum';
import { UserTableService } from './serivces/user-table.service';

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
		public moduleService: ModuleService,
		public userTableService: UserTableService,
	) {}
	ngOnInit(): void {
		this.userTableService.refreshMatTable(5, 1, this.active, this.direction, '', null);
	}

	public sortData(filterForm: FormGroup, sort: Sort) {
		this.active = sort.active;
		this.direction = sort.direction;

		if (!filterForm.value['search']) {
			this.userTableService.refreshMatTable(5, 1, sort.active, sort.direction, '', null);
		}
	}

	public onSearchClear(dataSource: MatTableDataSource<User>) {
		this.filterForm.reset();
		dataSource.filter = '';
		this.userTableService.refreshMatTable(5, 1, this.active, this.direction, '', null);
	}

	public updateTable(filterForm: FormGroup, event?: PageEvent) {
		this.userTableService.currentPage = event.pageIndex + 1;
		this.userTableService.totalPages = event.pageSize;

		this.userTableService.refreshMatTable(
			event.pageSize,
			event.pageIndex + 1,
			this.active,
			this.direction,
			filterForm.value['search'],
			null,
		);
	}

	public applyFilter(event: Event, dataSource: MatTableDataSource<User>) {
		const filterValue = (event.target as HTMLInputElement).value;

		// this.tableData$ = this.userStore.getUsersByKeyWord(filterValue, '').pipe(
		// 	switchMap((x: User[]) => {
		// 		dataSource.data = x ? x : [];
		// 		dataSource.paginator = this.paginator;
		// 		dataSource.sort = this.sort;
		// 		return of({ items: dataSource, totalItems: x.length });
		// 	}),
		// 	shareReplay(1),
		// );

		this.userTableService.refreshMatTable(5, 1, this.active, this.direction, filterValue, null);
	}

	public onDelete(row: any) {
		if (confirm('Are you sure to delete this record?')) {
			return this.userStore
				.deleteUser(row.id)
				.pipe(
					switchMap(() => {
						this.toastr.warning('Deleted successfully', 'EMP. Register');
						return this.userTableService.refreshMatTable(5, 1, this.active, this.direction, '', null);
					}),
				)
				.subscribe();
		}
	}

	public onEdit(row: any, paramMap: any) {
		this.moduleService.userFormData$.next({
			row: row,
			currentPage: this.userTableService.currentPage,
			totalPages: this.userTableService.totalPages,
			order: this.userTableService.order,
			sortKey: this.userTableService.sortKey,
		});

		// this.selectedCategory = row;

		this.router
			.navigate([`adminpanel/tables/users/${AdminCategoryRoutesEnum.user}/modal`], {
				queryParams: { createNewProduct: true },
			})
			.then(() => {
				this.dialogFactoryService.open({
					headerText: 'Header text record',
					category: {
						id: 99,
						name: paramMap.get('user'),
						route: 'user',
					},
					createNew: false,
					template: this.userDialogTemplate,
				});
			});
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

		this.router
			.navigate(['adminpanel/tables/users/user/modal'], {
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
}
