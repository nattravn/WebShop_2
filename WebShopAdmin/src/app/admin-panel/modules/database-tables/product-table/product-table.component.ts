import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
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
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ModuleService } from '../../services/module-service.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { Clothing } from 'src/app/admin-panel/models/clothing.model';

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
		'band',
		'price',
		'categoryName',
		'imagePath',
		'actions'
	];

	public filterForm: FormGroup = new FormGroup({
		search: new FormControl('', []),
	});

	@ViewChild(MatSort) sort: MatSort
	
	@ViewChild(MatPaginator) paginator: MatPaginator;

	@ViewChild(RouterOutlet) outlet: RouterOutlet;

	dialogService: DialogService;
	userDialogTemplate: TemplateRef<any>;
	public imageRootPath = environment.baseUrl + '/Images/original/';

	routerEvent$: Observable<any>;
	activatedRouteEvent$: Observable<any> = this.activatedRoute.paramMap;

	private currentPageIndex = 1;

	private currentTableSize = 5;

	public tableData$ = new Observable<{items: MatTableDataSource<Record | Clothing>, totalItems: number}>();

	private searchFilter: string;

	private active = 'band';

	private direction = 'asc';


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

	ngAfterViewInit() {
		const eventUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
		
		console.log('eventUrl: ', eventUrl);
		this.refreshMatTable(eventUrl, 5, 1, this.active,this.direction);


		// console.log('this.sort: ', this.sort);
		// this.productTableService.dataSource.sort = this.sort;
		// this.productTableService.dataSource.paginator = this.paginator;
	}

	sortData(sort: Sort) {
		console.log('sort: ', sort);
		this.active = sort.active;
		this.direction = sort.direction;
		const eventUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
		this.refreshMatTable(eventUrl, 5, 1, sort.active, sort.direction);
	}

	refreshMatTable(
		productString: string, 
		pageLimit: number = null, 
		page: number = null,
		active: string,
		direction: string
	): Observable<{items: MatTableDataSource<Record | Clothing>, totalItems: number}> {
		this.tableData$ = this.recordStore.getProducts(productString,pageLimit,page,active,direction).pipe(
			untilDestroyed(this),
			switchMap(records => {
				let dataSource = new MatTableDataSource<Record | Clothing>();
				
				dataSource.data = records.items;
				dataSource.sort = this.sort;

				return of({items: dataSource, totalItems: records.totalItems});
			}),
			shareReplay(1),
		)

		return this.tableData$;
	}
	ngOnInit() {
		
	}

	applyFilter(event: Event, dataSource : MatTableDataSource<Record | Clothing>) {
		const filterValue = (event.target as HTMLInputElement).value;

		this.tableData$ = this.recordStore.getRecordsByKeyWord(filterValue, '').pipe(
			switchMap((content: (Record | Clothing)[]) => {

				dataSource.data = content ? content : [];
				dataSource.paginator = this.paginator;
				dataSource.sort = this.sort;
				return of({items: dataSource, totalItems: content.length});
			}),
			shareReplay(1)
		)
	}

	onSearchClear(dataSource : MatTableDataSource<Record | Clothing> ){
		this.filterForm.reset();
		dataSource.filter = "";
		const eventUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
		this.refreshMatTable(eventUrl, 5, 1, this.active, this.direction);
	}

	onDelete(row: any) {
		if (confirm('Are you sure to delete record id:' + row.id + ' ?')) {
			this.recordStore.deleteRecord(row).pipe(
				untilDestroyed(this),
				switchMap(() => {
					this.toastr.warning('Deleted successfully');
					return this.refreshMatTable(row.categoryName,5,1,this.active,this.direction);
				})
			).subscribe();
		}
	}

	onCreate(paramMap) {
		this.router.navigate(['adminpanel/tables/products/'+paramMap.get('product'), {outlets: {tablesOutlet: paramMap.get('product')}}],  { queryParams: { createNewProduct: true} });
	}

	public updateTable(paramMap: any, filterForm: FormGroup, event?: PageEvent){
		this.currentPageIndex = event.pageIndex+1;
		this.currentTableSize = event.pageSize;

		if(!filterForm.value['search']){
			this.refreshMatTable(paramMap.get('product'), event.pageSize, event.pageIndex+1, this.active, this.direction);
		}
		
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
