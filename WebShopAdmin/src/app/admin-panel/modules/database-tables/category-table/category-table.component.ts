import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

import { Category } from '@admin-panel/models/category.model';
import { SubCategory } from '@admin-panel/models/sub-category.model';
import { CategoryStore } from '@admin-panel/stores/category.store';
import { CategoryDialogService } from '@table-dialogs/category-dialog/services/category-dialog.service';
import { DialogFactoryService } from '@table-dialogs/services/dialog-factory.service';

import { CategoryTableService } from './services/category-table.service';

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
export class CategoryTableComponent implements OnInit {
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

	constructor(
		private toastr: ToastrService,
		private dialogFactoryService: DialogFactoryService,
		public categoryListService: CategoryTableService,
		private categoryStore: CategoryStore,
		private cd: ChangeDetectorRef,
		private categoryDialogService: CategoryDialogService,
	) {}
	ngOnInit() {
		this.refreshMatTable();
	}

	public toggleRow(element: Category) {
		this.expandedElement = this.expandedElement === element ? null : element;
		this.cd.detectChanges();
		this.innerTables.forEach((table, index) => {
			(table.dataSource as MatTableDataSource<SubCategory>).sort = this.innerSort.toArray()[index];
		});
		// this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Address>).sort = this.innerSort.toArray()[index]);
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
				this.categoryListService.refreshMatTable();
			});
		}
	}

	public onCreate() {
		this.categoryStore.showCategories = true;

		this.categoryDialogService.populateForm(this.newCategory);

		const dialog = this.dialogFactoryService.open({
			headerText: 'Header text',
			category: {
				id: 0,
				name: 'category',
				route: 'category',
			},
			createNew: true,
			template: this.userDialogTemplate,
		});

		// Change the header of the dialog
		dialog.setHeaderText('New header');

		// Change the content of the dialog
		dialog.setTemplate(this.userDialogTemplate);
	}

	public onEdit(row: Category) {
		this.categoryDialogService.populateForm(row);

		this.selectedCategory = row;

		this.dialogFactoryService.open({
			headerText: 'Header text',
			category: {
				id: row.id,
				name: 'category',
				route: 'category',
			},
			createNew: false,
			template: this.userDialogTemplate,
		});
	}

	private refreshMatTable() {
		// async data from get function in service
		this.categoryListService.dataSource.sort = this.sort;
		this.categoryListService.dataSource.paginator = this.paginator;
		this.categoryListService.dataSource.filterPredicate = this.filterPredicate;
		this.categoryListService.refreshMatTable();
	}
}
