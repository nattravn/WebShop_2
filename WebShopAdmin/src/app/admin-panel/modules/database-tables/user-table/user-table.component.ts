import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';

import { User } from '../../../models/user.model';
import { UserStore } from '../../../stores/user.store';
import { DialogFactoryService } from '../../table-dialogs/services/dialog-factory.service';
import { DialogService } from '../../table-dialogs/services/dialog.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-user-table',
	templateUrl: './user-table.component.html',
	styleUrls: ['./user-table.component.css'],
	providers: [DialogFactoryService]
})
export class UserTableComponent implements OnInit {
	displayedColumns: string[] = ['userName', 'email', 'actions', 'fullName'];
	dataSource = new MatTableDataSource<User>();
	searchKey = '';
	dialog2: DialogService;
	userDialogTemplate: TemplateRef<any>;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	private currentPageIndex = 1;

	private currentTableSize = 5;

	constructor(
		private userStore: UserStore,
		private toastr: ToastrService,
		private dialogFactoryService: DialogFactoryService,
		public activatedRoute: ActivatedRoute
	) {
		this.refreshMatTable('endpoint', 5, 1).subscribe();
	}

	ngOnInit() { }

	refreshMatTable(endpoint: string, pageSize: number, pageIndex: number) {
		return this.userStore.getUsers().pipe(
			map((user: User[]) => {
				this.dataSource.data = user;
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				return user;
			})
		)
	}

	onSearchClear() {
		this.searchKey = '';
		this.applyFilter('');
	}

	public updateTable(event?: PageEvent){
		this.currentPageIndex = event.pageIndex+1;
		this.currentTableSize = event.pageSize;

		// if(!filterForm.value['search']){
		// 	this.refreshMatTable('user', event.pageSize, event.pageIndex+1);
		// }
		
	}

	applyFilter(event: Event | string) {
		if(typeof event === "string"){
			this.dataSource.filter = event;
		} else {
			const filterValue = (event.target as HTMLInputElement).value;
			this.dataSource.filter = this.searchKey.trim().toLowerCase();
		}
			
		console.log("this.searchKey: ", this.searchKey);
		console.log("this.searchKey: ", this.searchKey);
		 
	}

	onDelete(row: any) {
		if (confirm('Are you sure to delete this record?')) {
			this.userStore.deleteUser(row.id).subscribe(res => {
				this.toastr.warning('Deleted successfully', 'EMP. Register');
				this.refreshMatTable('endpoint', 5, 1);
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

	onCreate() {
		this.userStore.formModel.reset();

		this.dialog2 = this.dialogFactoryService.open({
			headerText: 'Header text',
			category: {
				id: 99,
				name: 'User',
				route: 'user'
			},
			createNew: true,
			template: this.userDialogTemplate
		});
	}
}
