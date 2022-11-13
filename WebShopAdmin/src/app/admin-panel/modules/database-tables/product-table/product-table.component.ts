import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { Observable, of, ReplaySubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { DialogFactoryService } from '../../table-dialogs/services/dialog-factory.service';
import { DialogService } from '../../table-dialogs/services/dialog.service';
import { environment } from 'src/environments/environment';
import { RecordDialogService } from '../../table-dialogs/record-dialog/services/record-dialog.service';
import { ProductTableService } from './services/product-table.service';
import { CategoryStore } from '../../../stores/category.store';
import { RecordStore } from '../../../stores/record.store';
import { Record } from '../../../models/record.model';
import { FormControl, FormGroup } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ModuleService } from '../../services/module-service.service';

@UntilDestroy()
@Component({
	selector: 'app-product-table',
	templateUrl: './product-table.component.html',
	styleUrls: ['./product-table.component.scss'],
	providers: [DialogFactoryService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductTableComponent implements OnInit, OnDestroy {
	displayedColumns: string[] = [
		'id',
		'title',
		'price',
		'categoryName',
		'imagePath',
		'actions'
	];

	public filterForm: FormGroup = new FormGroup({
		search: new FormControl('', []),
	});

	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	@ViewChild(RouterOutlet) outlet: RouterOutlet;

	dialogService: DialogService;
	userDialogTemplate: TemplateRef<any>;
	public imageRootPath = environment.baseUrl + '/Images/original/';

	routerEvent$: Observable<any>;
	activatedRouteEvent$: Observable<any> = this.activatedRoute.paramMap;

	private currentPageIndex = 1;

	private currentTableSize = this.productTableService.initPageLimit;

	constructor(
		private recordStore: RecordStore,
		private recordDialogService: RecordDialogService,
		private toastr: ToastrService,
		private categoryStore: CategoryStore,
		private dialogFactoryService: DialogFactoryService,
		public productTableService: ProductTableService,
		private router: Router,
		public activatedRoute: ActivatedRoute,
		private moduleService: ModuleService

	) { }
	ngOnDestroy(): void {

	}

	ngOnInit() {
		this.productTableService.dataSource.sort = this.sort;
		this.productTableService.dataSource.paginator = this.paginator;
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
    	this.productTableService.dataSource.filter = filterValue.trim().toLowerCase();
	}

	onSearchClear(){
		this.filterForm.reset();
		this.productTableService.dataSource.filter = "";
	}

	onDelete(row: any) {
		if (confirm('Are you sure to delete record id:' + row.id + ' ?')) {
			this.recordStore.deleteRecord(row).pipe(
				untilDestroyed(this),
				switchMap(() => {
					this.toastr.warning('Deleted successfully');
					return this.productTableService.refreshMatTable(row.categoryName,5,1);
				})
			).subscribe();
		}
	}

	onCreate(paramMap) {
		this.router.navigate(['adminpanel/tables/products/'+paramMap.get('product'), {outlets: {tablesOutlet: paramMap.get('product')}}],  { queryParams: { createNewProduct: true} });
	}

	public updateTable(paramMap: any, event?: PageEvent){
		this.currentPageIndex = event.pageIndex+1;
		this.currentTableSize = event.pageSize;
		this.productTableService.refreshMatTable(paramMap.get('product'), event.pageSize, event.pageIndex+1);
	}

	onEdit(row: Record, paramMap: any) {
		console.log("event: ", event)
		//this.recordDialogService.populateForm(row);
		this.moduleService.productData$.next({
			row: row,
			currentPageIndex: this.currentPageIndex,
			currentTableSize: this.currentTableSize
		})
		console.log("paramMap.get('product'): ", paramMap.get('product'))
		console.log("row: ", row)
		if(paramMap.get('product')){
			this.router.navigate(['adminpanel/tables/products/'+paramMap.get('product'), {outlets: {tablesOutlet: paramMap.get('product')}}], { queryParams: { createNewProduct: false} });
		}


		// this.dialogService = this.dialogFactoryService.open({
		// 	headerText: 'Header text',
		// 	category: {
		// 		id: 0,
		// 		name: 'record',
		// 		route: this.activatedRoute.snapshot.params['product']
		// 	},
		// 	createNew: false,
		// 	template: this.userDialogTemplate
		// });

		// this.dialog = this.dialogFactoryService.open({
		// 	headerText: 'Header text',
		// 	category: {
		// 		id: 0,
		// 		name: 'dfgfdg',
		// 		route: 'test'
		// 	},
		// 	createNew: false,
		// 	template: this.userDialogTemplate
		// });
	}
}
