import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';

import { AdminCategoryEnum } from '@admin-panel/enums/adminCategory.enum';
import { Category } from '@admin-panel/models/category.model';
import { DialogData } from '@admin-panel/models/dialog-data.model';
import { CategoryStore } from '@admin-panel/stores/category.store';
import { DialogFactoryService } from '@table-dialogs/services/dialog-factory.service';
import { DialogService } from '@table-dialogs/services/dialog.service';

@UntilDestroy()
@Component({
	selector: 'app-product-dialogs',
	templateUrl: './product-dialogs.component.html',
	styleUrls: ['./product-dialogs.component.scss'],
})
export class ProductDialogsComponent implements OnInit, AfterViewInit {
	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	@ViewChild(RouterOutlet) outlet: RouterOutlet;

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	@ViewChild('firstDialogTemplate') firstDialogTemplate: TemplateRef<ProductDialogsComponent>;
	public categoryEnum = AdminCategoryEnum;

	public categoryChange$: BehaviorSubject<string> = new BehaviorSubject<string>('');

	// public dialogRef: MatDialogRef<RecordDialogComponent>

	public paramMapProduct$: Observable<any>;

	private dialogService: DialogService;

	/**
	 * Initializes the component.
	 * @param dialogRef - A reference to the dialog opened.
	 */
	constructor(
		public categoryStore: CategoryStore,
		@Inject(MAT_DIALOG_DATA)
		public data: DialogData,
		private router: Router,
		private cdr: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private dialogFactoryService: DialogFactoryService,
	) {}
	ngAfterViewInit(): void {
		this.categoryChange$.next(this.data.category.name);
		this.cdr.detectChanges();
	}

	ngOnInit(): void {
		this.paramMapProduct$ = this.activatedRoute.queryParams;

		// this.activatedRoute.paramMap.subscribe(params => {
		// 	console.log('params.get(product):', params.get('product'));
		// 	//this.categoryChange.name=params.get('product');
		// 	this.categoryChange$.next(this.data.category.name);
		// });

		// Fired when route is changed
		// setTimeout(() => {
		// 	this.openDialog();
		// },);
	}

	public onDeactivate(event) {
		console.log('onDeactivate: ', event);
	}

	public selectedCataegory(event: Category) {
		this.categoryChange$.next(event.name);
		this.router.navigate([`adminpanel/tables/products/${event.route}`], { queryParams: { createNewProduct: false } });
		this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
			// The queryParams will be undefined in next activeRouter snapshot :(
			this.router.navigate(['adminpanel/tables/products', event.route], { queryParams: { createNewProduct: false } }),
		);
	}

	public openDialog() {
		console.log('open dialog');
		this.dialogService = this.dialogFactoryService.open({
			headerText: 'Header text',
			category: {
				id: 0,
				name: 'record',
				route: this.activatedRoute.snapshot.params['product'],
			},
			createNew: false,
			template: this.firstDialogTemplate,
		});

		// const eventUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
	}

	public onClose() {
		this.dialogService.close();

		// this.paramMapProduct$ = this.activatedRoute.paramMap.pipe(
		// 	untilDestroyed(this),
		// 	tap( paramMap => {
		// 		this.router.navigate(['adminpanel/tables/products/'+paramMap.get('product'), {outlets: {tablesOutlet: null}}]);
		// 	})
		// )
	}
}
