import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';

import { User } from '../../../models/user.model';
import { UserStore } from '../../../stores/user.store';
import { DialogFactoryService } from '../../table-dialogs/services/dialog-factory.service';
import { DialogService } from '../../table-dialogs/services/dialog.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { PagedUsers } from 'src/app/admin-panel/models/paged-users.model';
import { UserDialogComponent } from '../../table-dialogs/user-dialog/user-dialog.component';

@Component({
	selector: 'app-user-table',
	templateUrl: './user-table.component.html',
	styleUrls: ['./user-table.component.css'],
	providers: [DialogFactoryService]
})
export class UserTableComponent implements OnInit {
	displayedColumns: string[] = ['userName', 'email', 'actions', 'fullName'];

	public tableData$ = new Observable<{items: MatTableDataSource<User>, totalItems: number}>();

	public filterForm: UntypedFormGroup = new UntypedFormGroup({
		search: new UntypedFormControl('', []),
	});
	
	dataSource = new MatTableDataSource<User>();
	
	searchKey = '';
	dialog2: DialogService;
	@ViewChild('userDialogTemplate') userDialogTemplate: TemplateRef<UserDialogComponent>;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	private currentPageIndex = 1;

	private currentTableSize = 5;

	private active = 'userName';

	private direction = 'asc';

	constructor(
		private userStore: UserStore,
		private toastr: ToastrService,
		private dialogFactoryService: DialogFactoryService,
		public activatedRoute: ActivatedRoute,
		public router: Router
	) {
		const eventUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
		this.refreshMatTable('applicationUser', 5, 1, this.active,this.direction);
	}

	ngOnInit() { }

	refreshMatTable(
		endpoint: string, 
		pageSize: number, 
		pageIndex: number,
		active: string,
		direction: string
	) {
		this.tableData$ = this.userStore.getPagedUsers(endpoint, pageSize, pageIndex, active, direction).pipe(
			switchMap((pagedUsers: PagedUsers) => {
				let dataSource = new MatTableDataSource<User>();
				dataSource.data = pagedUsers.items;
				dataSource.sort = this.sort;
				//dataSource.paginator = this.paginator;
				return of({items: dataSource, totalItems: pagedUsers.totalItems});
			}),
			shareReplay(1),
		)

		return this.tableData$;
	}

	sortData(filterForm: UntypedFormGroup, sort: Sort) {
		console.log('sort: ', sort);
		this.active = sort.active;
		this.direction = sort.direction;
		const eventUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);

		if(!filterForm.value['search']){
			this.refreshMatTable('ApplicationUser', 5, 1, sort.active, sort.direction);
		}
	}

	onSearchClear(dataSource : MatTableDataSource<User> ){
		this.filterForm.reset();
		dataSource.filter = "";
		const eventUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
		this.refreshMatTable('ApplicationUser', 5, 1, this.active, this.direction);
	}

	public updateTable(filterForm: UntypedFormGroup, event?: PageEvent){
		this.currentPageIndex = event.pageIndex+1;
		this.currentTableSize = event.pageSize;

		// Temporary solution. Remove if-state and do backend call here with search param
		if(!filterForm.value['search']){
			this.refreshMatTable('ApplicationUser', event.pageSize, event.pageIndex+1, this.active, this.direction);
		}
		
	}

	applyFilter(event: Event, dataSource : MatTableDataSource<User>) {
		const filterValue = (event.target as HTMLInputElement).value;

		this.tableData$ = this.userStore.getRecordsByKeyWord(filterValue, '').pipe(
			switchMap((x: User[]) => {

				dataSource.data = x ? x : [];
				dataSource.paginator = this.paginator;
				dataSource.sort = this.sort;
				return of({items: dataSource, totalItems: x.length});
			}),
			shareReplay(1)
		)
	}

	onDelete(row: any) {
		if (confirm('Are you sure to delete this record?')) {
			this.userStore.deleteUser(row.id).subscribe(res => {
				this.toastr.warning('Deleted successfully', 'EMP. Register');
				this.refreshMatTable('endpoint', 5, 1, this.active,this.direction);
			});
		}
	}

	onEdit(row: any, paramMap: any) {

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

	onCreate(paramMap: ParamMap) {
		this.userStore.formModel.reset();

		console.log('userDialogTemplate: ', this.userDialogTemplate);

		this.router.navigate(['adminpanel/tables/users/user', {outlets: {tablesOutlet: 'users'}}],  { queryParams: { createNewProduct: true} }).then(() => {
			this.dialogFactoryService.open({
				headerText: 'Header text user',
				category: {
					id: 99,
					name: 'users',
					route: 'user'
				},
				createNew: true,
				template: this.userDialogTemplate
			});
		})
	}
}
