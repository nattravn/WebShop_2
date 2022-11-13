import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';

import { User } from '../../../models/user.model';
import { UserStore } from '../../../stores/user.store';
import { DialogFactoryService } from '../../table-dialogs/services/dialog-factory.service';
import { DialogService } from '../../table-dialogs/services/dialog.service';
import { ActivatedRoute } from '@angular/router';

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
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	constructor(
		private userStore: UserStore,
		private toastr: ToastrService,
		private dialogFactoryService: DialogFactoryService,
		public activatedRoute: ActivatedRoute
	) {
		this.refreshMatTable();
	}

	ngOnInit() { }

	refreshMatTable() {
		this.userStore.getUsers().subscribe((user: User[]) => {

			this.dataSource.data = user;
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.dataSource.filterPredicate = (data, filter) => {
				return this.displayedColumns.some(ele => {
					return (
						ele !== 'actions' &&
						data[ele]
							.toString()
							.toLowerCase()
							.indexOf(filter) !== -1
					);
				});
			};
		});
	}

	onSearchClear() {
		this.searchKey = '';
		this.applyFilter();
	}

	applyFilter() {
		this.dataSource.filter = this.searchKey.trim().toLowerCase();
	}

	onDelete(row: any) {
		if (confirm('Are you sure to delete this record?')) {
			this.userStore.deleteUser(row.id).subscribe(res => {
				this.toastr.warning('Deleted successfully', 'EMP. Register');
				this.refreshMatTable();
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
