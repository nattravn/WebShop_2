import { animate, state, style, transition, trigger } from '@angular/animations';
import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	OnInit,
	QueryList,
	TemplateRef,
	ViewChild,
	ViewChildren,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

import { Category } from '@admin-panel/models/category.model';
import { SubCategory } from '@admin-panel/models/sub-category.model';
import { CategoryStore } from '@admin-panel/stores/category.store';
import { DialogFactoryService } from '@table-dialogs/services/dialog-factory.service';

import { CategoryTableService } from './services/category-table.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AdminCategoryEnum } from '@admin-panel/enums/adminCategory.enum';
import { ModuleService } from '@admin-panel/modules/services/module-service.service';
import { FormControl, FormGroup } from '@angular/forms';

export interface IFilterForm {
	search: FormControl<string>;
}
@Component({
	selector: 'app-category-list',
	templateUrl: './category-table.component.html',
	styleUrls: ['./category-table.component.css'],
	providers: [DialogFactoryService],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})
export class CategoryTableComponent implements AfterViewInit, OnInit {
	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	@ViewChild('outerSort', { static: true }) sort: MatSort;

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	@ViewChildren('innerSort') innerSort: QueryList<MatSort>;

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	@ViewChildren('innerTables') innerTables: QueryList<MatTable<SubCategory>>;

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	public columnsToDisplay = ['id', 'name', 'route', 'actions'];
	public innerDisplayedColumns = ['id', 'name', 'route', 'actions'];

	public filterForm = new FormGroup<IFilterForm>({
		search: new FormControl('', []),
	});

	public dataSource = new MatTableDataSource<Category>();

	public searchKey: string;
	public userDialogTemplate: TemplateRef<any>;
	public expandedRows$ = new BehaviorSubject<Number[]>([]);
	public itemsArray: Observable<any>;

	public expandedElement: Category | null;

	public selectedCategory: Category;

	public newCategory: Category = {
		id: 0,
		name: '',
		route: '',
		subCategories: null,
	};

	public active = 'name';

	private direction = 'asc';

	constructor(
		private toastr: ToastrService,
		private dialogFactoryService: DialogFactoryService,
		public categoryTableService: CategoryTableService,
		private categoryStore: CategoryStore,
		private cd: ChangeDetectorRef,
		private router: Router,
		public activatedRouteEvent: ActivatedRoute,
		private moduleService: ModuleService,
	) {}
	ngAfterViewInit(): void {
		this.categoryTableService.refreshMatTable(5, 1, this.active, this.direction, '', null);
		this.cd.detectChanges();
		// throw new Error('Method not implemented.');
	}
	ngOnInit() {
		console.log('hi');
	}

	public toggleRow(element: Category) {
		this.expandedElement = this.expandedElement === element ? null : element;
		this.cd.detectChanges();
		this.innerTables.forEach((table, index) => {
			(table.dataSource as MatTableDataSource<SubCategory>).sort = this.innerSort.toArray()[index];
		});
		// this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Address>).sort = this.innerSort.toArray()[index]);
	}

	public sortData(filterForm: FormGroup, sort: Sort) {
		this.active = sort.active;
		this.direction = sort.direction;

		this.categoryTableService.refreshMatTable(
			5,
			this.categoryTableService.currentPage,
			sort.active,
			sort.direction,
			filterForm.value['search'],
			null,
		);
	}

	public toggleExpanded(row: Category) {
		const ids = this.expandedRows$.value;
		if (ids.indexOf(row.id) === -1) {
			const newIds = [...ids, row.id];
			this.expandedRows$.next(newIds);
		} else {
			const newIds = ids.filter((id) => id !== row.id);
			this.expandedRows$.next(newIds);
		}
	}

	public filterPredicate = (data, filter) =>
		this.columnsToDisplay.some((ele) => ele !== 'actions' && data[ele].toString().toLowerCase().indexOf(filter) !== -1);

	public onSearchClear() {
		this.searchKey = '';
		this.applyFilter();
	}

	public applyFilter() {
		this.dataSource.filter = this.searchKey.trim().toLowerCase();
	}

	public onDelete(row: any) {
		if (confirm('Are you sure to delete this record?')) {
			this.categoryStore.deletCategory(row.id).subscribe(() => {
				this.toastr.warning('Deleted successfully', 'EMP. Register');
				this.categoryStore.getCategories();
				return this.categoryTableService.refreshMatTable(5, 1, this.active, this.direction, '', null);
			});
		}
	}

	public updateTable(paramMap: any, filterForm: FormGroup, event?: PageEvent) {
		this.categoryTableService.currentPage = event.pageIndex + 1;
		this.categoryTableService.totalPages = event.pageSize;

		this.categoryTableService.refreshMatTable(
			event.pageSize,
			event.pageIndex + 1,
			this.active,
			this.direction,
			filterForm.value['search'],
			null,
		);
	}

	public onCreate(paramMap: ParamMap) {
		this.categoryStore.showCategories = true;

		this.moduleService.categoryFormData$.next({
			row: this.newCategory,
			currentPage: this.categoryTableService.currentPage,
			totalPages: this.categoryTableService.totalPages,
			order: this.categoryTableService.order,
			sortKey: this.categoryTableService.sortKey,
		});
		// this.categoryDialogService.populateForm(this.newCategory);

		// const dialog = this.dialogFactoryService.open({
		// 	headerText: 'Header text',
		// 	category: {
		// 		id: 0,
		// 		name: 'category',
		// 		route: 'category',
		// 	},
		// 	createNew: true,
		// 	template: this.userDialogTemplate,
		// });

		this.router
			.navigate([`adminpanel/tables/categories/${AdminCategoryEnum.category}/modal`], {
				queryParams: { createNewProduct: true },
			})
			.then(() => {
				this.dialogFactoryService.open({
					headerText: 'Header text record',
					category: {
						id: 99,
						name: paramMap.get('category'),
						route: 'category',
					},
					createNew: true,
					template: this.userDialogTemplate,
				});
			});
	}

	public onEdit(row: Category, paramMap: ParamMap) {
		// this.categoryDialogService.populateForm(row);
		this.moduleService.categoryFormData$.next({
			row: row,
			currentPage: this.categoryTableService.currentPage,
			totalPages: this.categoryTableService.totalPages,
			order: this.categoryTableService.order,
			sortKey: this.categoryTableService.sortKey,
		});

		this.selectedCategory = row;

		this.router
			.navigate([`adminpanel/tables/categories/${AdminCategoryEnum.category}/modal`], {
				queryParams: { createNewProduct: true },
			})
			.then(() => {
				this.dialogFactoryService.open({
					headerText: 'Header text record',
					category: {
						id: 99,
						name: paramMap.get('category'),
						route: 'category',
					},
					createNew: false,
					template: this.userDialogTemplate,
				});
			});
	}

	// private refreshMatTable() {
	// 	// async data from get function in service
	// 	this.categoryListService.dataSource.sort = this.sort;
	// 	this.categoryListService.dataSource.paginator = this.paginator;
	// 	this.categoryListService.dataSource.filterPredicate = this.filterPredicate;
	// 	this.categoryListService.refreshMatTable();
	// }
}
