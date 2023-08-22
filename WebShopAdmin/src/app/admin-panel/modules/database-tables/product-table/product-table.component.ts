import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router, RouterOutlet } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Clothing } from '@admin-panel/models/clothing.model';
import { RecordModel } from '@admin-panel/models/record.model';
import { ModuleService } from '@admin-panel/modules/services/module-service.service';
import { RecordStore } from '@admin-panel/stores/record.store';
import { environment } from '@environments/environment';
import { DialogFactoryService } from '@table-dialogs/services/dialog-factory.service';

import { ProductTableService } from './services/product-table.service';
import { AdminCategoryRoutesEnum } from '@admin-panel/enums/adminCategoryRoutes.enum';
import { CategoryIdEnum } from '@admin-panel/enums/categoryId.enum';
import { BaseProduct } from '@admin-panel/models/base-product.model';
import { RecordUpdate } from '@admin-panel/models/record-update.model';
import { ClothingUpdate } from '@admin-panel/models/clothing-update.model';
import { ShoeUpdate } from '@admin-panel/models/shoe-update.model';
import { AdminCategoryNameEnum } from '@admin-panel/enums/adminCategoryNames.enum';
// import { RecordUpdate } from '@admin-panel/models/record-update.model';
// import { ClothingUpdate } from '@admin-panel/models/clothing-update.model';

export interface IFilterForm {
	search: FormControl<string>;
}

@UntilDestroy()
@Component({
	selector: 'app-product-table',
	templateUrl: './product-table.component.html',
	styleUrls: ['./product-table.component.scss'],
	providers: [DialogFactoryService],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTableComponent implements AfterViewInit, OnInit {
	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	@ViewChild(MatSort) sort: MatSort;

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	@ViewChild(MatPaginator) paginator: MatPaginator;

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	@ViewChild(RouterOutlet) outlet: RouterOutlet;

	public definedColumns: string[] = ['id', 'title', 'price', 'categoryName'];
	public columnsToDisplay: string[] = ['id', 'title', 'price', 'categoryName', 'imagePath', 'actions'];

	public filterForm = new FormGroup<IFilterForm>({
		search: new FormControl('', []),
	});

	public imageRootPath = `${environment.baseUrl}/Images/original/`;

	public routerEvent$: Observable<any>;

	public tableData$ = new Observable<{ items: MatTableDataSource<RecordModel | Clothing>; totalItems: number }>();

	public optionalColumnName = 'band';

	public active = 'title';

	public adminCategoryNameEnum: AdminCategoryNameEnum;

	private direction = 'asc';

	private userDialogTemplate: TemplateRef<any>;

	constructor(
		private recordStore: RecordStore,
		private toastr: ToastrService,
		private dialogFactoryService: DialogFactoryService,
		public productTableService: ProductTableService,
		private router: Router,
		public activatedRoute: ActivatedRoute,
		public moduleService: ModuleService,
	) {}
	ngOnInit(): void {
		switch (this.activatedRoute.snapshot.paramMap.get('product')) {
			case AdminCategoryRoutesEnum.records:
				this.active = 'band';
				this.definedColumns.splice(2, 0, 'band');
				this.columnsToDisplay.splice(2, 0, 'band');
				break;
			case AdminCategoryRoutesEnum.clothing:
				this.active = 'title';
				this.definedColumns.splice(2, 0, 'size');
				this.columnsToDisplay.splice(2, 0, 'size');
				break;
			default:
				break;
		}
	}

	ngAfterViewInit() {
		let eventUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);

		if (eventUrl.includes('tablesOutlet')) {
			eventUrl = eventUrl.slice(eventUrl.indexOf(':') + 1);
			eventUrl = eventUrl.substring(0, eventUrl.indexOf(')'));
		}

		// if modal is open, filter eventUrl
		this.refreshMatTable(this.activatedRoute.snapshot.paramMap.get('product'), 5, 1, this.active, this.direction, '');

		// console.log('this.sort: ', this.sort);
		// this.productTableService.dataSource.sort = this.sort;
		// this.productTableService.dataSource.paginator = this.paginator;
	}

	public sortData(filterForm: FormGroup, sort: Sort) {
		console.log('sort: ', sort);
		this.active = sort.active;
		this.direction = sort.direction;
		// this.paginator.firstPage();

		this.refreshMatTable(
			this.activatedRoute.snapshot.paramMap.get('product'),
			5,
			this.productTableService.currentPage,
			sort.active,
			sort.direction,
			filterForm.value['search'],
		);
	}

	public refreshMatTable(
		productString: string,
		pageLimit: number = null,
		page: number = null,
		active: string,
		direction: string,
		searchQuery: string,
	): void {
		this.productTableService.refreshMatTable(productString, pageLimit, page, active, direction, searchQuery, null);

		// this.tableData$ = this.recordStore.getProducts(productString,pageLimit,page,active,direction,searchQuery).pipe(
		// 	untilDestroyed(this),
		// 	switchMap(records => {
		// 		let dataSource = new MatTableDataSource<Record | Clothing>();

		// 		dataSource.data = records.items;
		// 		dataSource.sort = this.sort;
		// 		//dataSource.paginator = this.paginator;

		// 		return of({items: dataSource, totalItems: records.totalItems});
		// 	}),
		// 	shareReplay(1),
		// )

		// return this.tableData$;
	}

	public applyFilter(event: Event, dataSource: MatTableDataSource<RecordModel | Clothing>, filterForm: FormGroup) {
		// const filterValue = (event.target as HTMLInputElement).value;

		// const eventUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);

		// TODO remove firstPage() maybe
		this.paginator.firstPage();
		this.refreshMatTable(
			this.activatedRoute.snapshot.paramMap.get('product'),
			5,
			1,
			this.active,
			this.direction,
			filterForm.value['search'],
		);

		// this.tableData$ = this.recordStore.getRecordsByKeyWord(filterValue, '').pipe(
		// 	switchMap((content: (Record | Clothing)[]) => {
		// 		dataSource.data = content ? content : [];
		// 		dataSource.paginator = this.paginator;
		// 		dataSource.sort = this.sort;
		// 		return of({items: dataSource, totalItems: content.length});
		// 	}),
		// 	shareReplay(1)
		// )
	}

	public onSearchClear(dataSource: MatTableDataSource<RecordModel | Clothing>) {
		this.filterForm.reset();

		this.refreshMatTable(this.activatedRoute.snapshot.paramMap.get('product'), 5, 1, this.active, this.direction, '');
	}

	public onDelete(row: any) {
		if (confirm(`Are you sure to delete record id:${row.id} ?`)) {
			this.recordStore
				.deleteRecord(row)
				.pipe(
					untilDestroyed(this),
					switchMap(() => {
						this.toastr.warning('Deleted successfully');
						return this.productTableService.refreshMatTable(row.categoryName, 5, 1, this.active, this.direction, '', null);
					}),
				)
				.subscribe();
		}
	}

	public onCreate(paramMap: ParamMap) {
		const row = {
			categoryName: paramMap.get('product'),
			categoryId: CategoryIdEnum[paramMap.get('product')],
		} as BaseProduct;
		this.moduleService.broadcastProductData(row);

		this.router
			.navigate([`adminpanel/tables/products/${paramMap.get('product')}/modal`], {
				queryParams: { createNewProduct: true },
			})
			.then(() => {
				this.dialogFactoryService.open({
					headerText: 'Header text record',
					category: {
						id: 99,
						name: paramMap.get('product'),
						route: 'products',
					},
					createNew: true,
					template: this.userDialogTemplate,
				});
			});
	}

	public updateTable(paramMap: any, filterForm: FormGroup, event?: PageEvent) {
		this.productTableService.currentPage = event.pageIndex + 1;
		this.productTableService.totalPages = event.pageSize;

		this.refreshMatTable(
			paramMap.get('product'),
			event.pageSize,
			event.pageIndex + 1,
			this.active,
			this.direction,
			filterForm.value['search'],
		);
	}

	public onEdit(row: RecordUpdate | ClothingUpdate | ShoeUpdate, paramMap: ParamMap) {
		// let updateModel;
		console.log('paramMap: ', paramMap.get('product'));
		// this.moduleService.productData$.next({
		// 	row: row,
		// 	currentPage: this.productTableService.currentPage,
		// 	totalPages: this.productTableService.totalPages,
		// 	order: this.productTableService.order,
		// 	sortKey: this.productTableService.sortKey,
		// });

		this.moduleService.broadcastProductData(row);

		// switch (paramMap.products) {
		// 	case 'records':
		// 		updateModel = new RecordUpdate(row as RecordUpdate);

		// 		this.moduleService.productDataRecord$.next({
		// 			row: updateModel,
		// 			currentPage: this.productTableService.currentPage,
		// 			totalPages: this.productTableService.totalPages,
		// 			order: this.productTableService.order,
		// 			sortKey: this.productTableService.sortKey,
		// 		});

		// 		break;
		// 	case 'clothing':
		// 		this.moduleService.productDataClothing$.next({
		// 			row: updateModel,
		// 			currentPage: this.productTableService.currentPage,
		// 			totalPages: this.productTableService.totalPages,
		// 			order: this.productTableService.order,
		// 			sortKey: this.productTableService.sortKey,
		// 		});

		// 		updateModel = new ClothingUpdate(row as ClothingUpdate);
		// 		break;
		// 	default:
		// 		this.moduleService.productDataRecord$.next({
		// 			row: updateModel,
		// 			currentPage: this.productTableService.currentPage,
		// 			totalPages: this.productTableService.totalPages,
		// 			order: this.productTableService.order,
		// 			sortKey: this.productTableService.sortKey,
		// 		});
		// 		updateModel = new RecordUpdate(row as RecordUpdate);
		// 		break;
		// }

		if (paramMap.get('product')) {
			this.router
				.navigate([`adminpanel/tables/products/${paramMap.get('product')}/modal`], {
					queryParams: { createNewProduct: false },
				})
				.then(() => {
					this.dialogFactoryService.open({
						headerText: 'Header text record',
						category: {
							id: 99,
							name: paramMap.get('product'),
							route: 'products',
						},
						createNew: false,
						template: this.userDialogTemplate,
					});
				});
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
