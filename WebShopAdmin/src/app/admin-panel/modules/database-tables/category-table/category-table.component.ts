import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, QueryList, ViewChildren } from '@angular/core';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogFactoryService } from '../../table-dialogs/services/dialog-factory.service';
import { DialogService } from '../../table-dialogs/services/dialog.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Category } from 'src/app/admin-panel/models/category.model';
import { SubCategory } from 'src/app/admin-panel/models/sub-category.model';
import { SubCategoriesStore } from 'src/app/admin-panel/stores/sub-categories.store';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CategoryStore } from 'src/app/admin-panel/stores/category.store';
import { CategoryTableService } from './services/category-table.service';
import { CategoryDialogService } from '../../table-dialogs/category-dialog/services/category-dialog.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

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

	columnsToDisplay = ['id', 'name', 'route', 'actions'];
	innerDisplayedColumns = ['id', 'name', 'route', 'actions'];
	dataSource = new MatTableDataSource<Category>();

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	searchKey: string;
	userDialogTemplate: TemplateRef<any>;
	expandedRows$ = new BehaviorSubject<Number[]>([]);
	public itemsArray: Observable<any>;

	expandedElement: Category | null;

	tabelCategories: Category[] = [];

	public selectedCategory: Category;

	public newCategory: Category = {
		id: 0,
		name: '',
		route: '',
		subCategories: null
	};

	@ViewChild('outerSort', { static: true }) sort: MatSort;
	@ViewChildren('innerSort') innerSort: QueryList<MatSort>;
	@ViewChildren('innerTables') innerTables: QueryList<MatTable<SubCategory>>;

	constructor(
		private dialog: MatDialog,
		private toastr: ToastrService,
		private router: Router,
		private dialogFactoryService: DialogFactoryService,
		public categoryListService: CategoryTableService,
		private categoryStore: CategoryStore,
		private cd: ChangeDetectorRef,
		private categoryDialogService: CategoryDialogService,
		private subCategoriesStore: SubCategoriesStore
	) { }
	ngOnInit() {
		this.refreshMatTable();
	}
	refreshMatTable() {
		// async data from get function in service
		this.categoryListService.dataSource.sort = this.sort;
		this.categoryListService.dataSource.paginator = this.paginator;
		this.categoryListService.dataSource.filterPredicate = this.filterPredicate;
	}

	toggleRow(element: Category) {
		(this.expandedElement = this.expandedElement === element ? null : element);
		this.cd.detectChanges();
		this.innerTables.forEach((table, index) => {
			(table.dataSource as MatTableDataSource<SubCategory>).sort = this.innerSort.toArray()[index];
		}

		);
		//this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Address>).sort = this.innerSort.toArray()[index]);
	}


	toggleExpanded(row: Category) {
		const ids = this.expandedRows$.value;
		if (ids.indexOf(row.id) === -1) {
			const newIds = [...ids, row.id];
			this.expandedRows$.next(newIds);
		} else {
			const newIds = ids.filter((id => id !== row.id))
			this.expandedRows$.next(newIds);
		}
	}

	filterPredicate = (data, filter) => {
		return this.columnsToDisplay.some(ele => {
			return (
				ele !== 'actions' &&
				data[ele]
					.toString()
					.toLowerCase()
					.indexOf(filter) !== -1
			);
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
			this.categoryStore.deletCategory(row.id).subscribe(res => {
				this.toastr.warning('Deleted successfully', 'EMP. Register');
				this.categoryStore.getCategories();
				this.categoryListService.refreshMatTable();
			});
		}
	}

	onCreate() {
		this.categoryStore.showCategories = true;

		this.categoryDialogService.populateForm(this.newCategory);

		const dialog = this.dialogFactoryService.open({
			headerText: 'Header text',
			category: {
				id: 0,
				name: 'category',
				route: 'category'
			},
			createNew: true,
			template: this.userDialogTemplate
		});

		// Change the header of the dialog
		dialog.setHeaderText('New header');

		// Change the content of the dialog
		dialog.setTemplate(this.userDialogTemplate);
	}

	onEdit(row: Category) {

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
			template: this.userDialogTemplate
		});
	}
}
