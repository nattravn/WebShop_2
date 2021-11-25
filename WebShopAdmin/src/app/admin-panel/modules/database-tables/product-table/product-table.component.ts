import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { EMPTY, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { DialogFactoryService } from '../../table-dialogs/services/dialog-factory.service';
import { DialogService } from '../../table-dialogs/services/dialog.service';
import { environment } from 'src/environments/environment';
import { Category } from '../../../models/category.model';
import { RecordDialogService } from '../../table-dialogs/record-dialog/services/record-dialog.service';
import { RecordTableService } from './services/record-table.service';
import { CategoryStore } from '../../../stores/category.store';
import { RecordStore } from '../../../stores/record.store';
import { Record } from '../../../models/record.model';
import { FormControl, FormGroup } from '@angular/forms';
import { first, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ActivatedRoute, ActivationStart, Router, RouterOutlet } from '@angular/router';

@UntilDestroy()
@Component({
	selector: 'app-product-table',
	templateUrl: './product-table.component.html',
	styleUrls: ['./product-table.component.scss'],
	providers: [DialogFactoryService],
	changeDetection: ChangeDetectionStrategy.Default
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

	constructor(
		private recordStore: RecordStore,
		private recordDialogService: RecordDialogService,
		private toastr: ToastrService,
		private categoryStore: CategoryStore,
		private dialogFactoryService: DialogFactoryService,
		public recordListService: RecordTableService,
		private router: Router,
		private activatedRoute: ActivatedRoute

	) { }
	ngOnDestroy(): void {

	}

	ngOnInit() {
		this.recordListService.dataSource.sort = this.sort;
		this.recordListService.dataSource.paginator = this.paginator;


		this.routerEvent$ = this.router.events.pipe(
			untilDestroyed(this),
			tap(e => {
				if (e instanceof ActivationStart && e.snapshot.outlet === "tablesOutlet"){
					console.log('deactivate');
					this.outlet.deactivate();
				}
			})
		);

	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
    	this.recordListService.dataSource.filter = filterValue.trim().toLowerCase();
	}

	onSearchClear(){
		this.filterForm.reset();
		this.recordListService.dataSource.filter = "";
	}

	onDelete(row: any) {
		if (confirm('Are you sure to delete record id:' + row.id + ' ?')) {
			this.recordStore.deleteRecord(row).pipe(
				untilDestroyed(this),
				switchMap(() => {
					this.toastr.warning('Deleted successfully');
					return this.recordListService.refreshMatTable(row.categoryName);
				})
			).subscribe();
		}
	}

	onCreate() {
		this.categoryStore.showCategories = true;
		this.recordDialogService.form.reset();
		this.recordDialogService.imgSrcReplay.next(this.imageRootPath + 'default-image.png');

		this.dialogService = this.dialogFactoryService.open({
			headerText: 'Header text',
			category: {
				id: 99,
				name: 'records',
				route: 'records'
			},
			createNew: true,
			template: this.userDialogTemplate
		});

		// Change the header of the dialog
		this.dialogService.setHeaderText('New header');

		// Change the content of the dialog
		this.dialogService.setTemplate(this.userDialogTemplate);
	}

	onEdit(row: Record) {
		this.recordDialogService.populateForm(row);

		this.activatedRoute.paramMap.pipe(
			untilDestroyed(this),
			tap( paramMap => {
				if(paramMap.get('product')){
					this.router.navigate(['adminpanel/tables/products/'+paramMap.get('product')+'/modal', {outlets: {tablesOutlet: paramMap.get('product')+'/modal'}}]);
				}
			})
		).subscribe();

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
