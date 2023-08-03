import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable, ReplaySubject, of } from 'rxjs';

import { AdminCategoryEnum } from '@admin-panel/enums/adminCategory.enum';
import { Category } from '@admin-panel/models/category.model';
import { DialogData } from '@admin-panel/models/dialog-data.model';
import { CategoryStore } from '@admin-panel/stores/category.store';
import { DialogFactoryService } from '@table-dialogs/services/dialog-factory.service';
import { DialogService } from '@table-dialogs/services/dialog.service';
import { ProductDialogService } from './services/product-dialog.service';
import { ModuleService } from '@admin-panel/modules/services/module-service.service';
import { filter, shareReplay, switchMap, tap, startWith } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { ProductUpdate } from '@admin-panel/models/product-update.model';
import { CustomDatePipe } from '@admin-panel/pipe/custom.datepipe';
import { RecordModel } from '@admin-panel/models/record.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RecordStore } from '@admin-panel/stores/record.store';
import { UserStore } from '@admin-panel/stores/user.store';
import { ProductTableService } from '@database-tables/product-table/services/product-table.service';
import { Clothing } from '@admin-panel/models/clothing.model';
import { RecordUpdate } from '@admin-panel/models/record-update.model';

export interface IProductForm {
	id: FormControl<number>;
	releaseDate: FormControl<Date>;
	description: FormControl<string>;
	imagePath: FormControl<string>;
	title: FormControl<string>;
	price: FormControl<number>;
	categoryId: FormControl<number>;
	subCategoryId: FormControl<number>;
	editorUserId: FormControl<string>;
	categoryName: FormControl<string>;
	currentPage: FormControl<number>;
	totalPages: FormControl<number>;
	lastUpdateTime: FormControl<Date>;
	order: FormControl<string>;
	sortKey: FormControl<string>;
}

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

	public productBaseForm = new FormGroup<IProductForm>({
		id: new FormControl(0),
		releaseDate: new FormControl(new Date(), [Validators.required]),
		description: new FormControl('', Validators.required),
		imagePath: new FormControl('default-image.png'),
		title: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
		price: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
		categoryId: new FormControl(null),
		subCategoryId: new FormControl(null),
		editorUserId: new FormControl(null),
		categoryName: new FormControl(''),
		currentPage: new FormControl(1),
		totalPages: new FormControl(1),
		lastUpdateTime: new FormControl(new Date()),
		order: new FormControl(''),
		sortKey: new FormControl(''),
	});

	public imgSrcReplay$ = new ReplaySubject<string>(1);
	public categoryEnum = AdminCategoryEnum;

	public categoryChange$: BehaviorSubject<string> = new BehaviorSubject<string>('');

	public defaultimageRootPath = `${environment.baseUrl}/Images/original/default-image.png`;

	public imageRootPath = `${environment.baseUrl}/Images/original/`;

	// public dialogRef: MatDialogRef<RecordDialogComponent>

	public populateForm$ = new Observable<any>();

	public paramMapProduct$: Observable<any>;

	private dialogService: DialogService;

	private fileToUpload: File = null;

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
		public productDialogService: ProductDialogService,
		public moduleService: ModuleService,
		public customDatePipe: CustomDatePipe,
		public recordStore: RecordStore,
		public userStore: UserStore,
		public productTableService: ProductTableService,
	) {}
	ngAfterViewInit(): void {
		this.categoryChange$.next(this.data.category.name);
		this.cdr.detectChanges();
	}

	ngOnInit(): void {
		this.paramMapProduct$ = this.activatedRoute.queryParams;

		this.populateForm$ = this.moduleService.productData$.pipe(
			untilDestroyed(this),
			filter((queryParams) => !this.data.createNew),
			switchMap((productData) => {
				this.populateForm(productData);
				return of(productData);
			}),
			shareReplay(1),
		);

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

	public populateForm(productUpdate: ProductUpdate<RecordModel | Clothing>) {
		this.productBaseForm.get('id').setValue(productUpdate.row.id);
		this.productBaseForm.get('releaseDate').setValue(productUpdate.row.releaseDate);
		this.productBaseForm.get('description').setValue(productUpdate.row.description);
		this.productBaseForm.get('title').setValue(productUpdate.row.title);
		this.productBaseForm.get('price').setValue(productUpdate.row.price);
		this.productBaseForm.get('categoryId').setValue(productUpdate.row.categoryId);
		this.productBaseForm.get('subCategoryId').setValue(productUpdate.row.subCategoryId);
		this.productBaseForm.get('categoryName').setValue(productUpdate.row.categoryName);
		this.productBaseForm.get('imagePath').setValue(productUpdate.row.imagePath);
		this.productBaseForm.get('currentPage').setValue(productUpdate.currentPage);
		this.productBaseForm.get('totalPages').setValue(productUpdate.totalPages);
		this.productBaseForm.get('order').setValue(productUpdate.order);
		this.productBaseForm.get('sortKey').setValue(productUpdate.sortKey);
		this.productBaseForm.get('editorUserId').setValue(productUpdate.row.editorUserId);
		this.productBaseForm.get('lastUpdateTime').setValue(this.customDatePipe.transform(productUpdate.row.lastUpdatedTime));

		this.imgSrcReplay$.next(this.imageRootPath + productUpdate.row.imagePath);
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

	public onSubmit(form: ProductUpdate<RecordUpdate | Clothing>) {
		if (this.productBaseForm.invalid) {
			return;
		}
		form.row.categoryName = 'Record';

		// Form data becomes null in observable so it needs to be cloned
		this.populateForm$ = this.userStore.getUserProfile().pipe(
			untilDestroyed(this),
			switchMap((user) => {
				// Set forms userId to in logged user
				form.row.editorUserId = user.userId;

				const newRecord = new RecordModel(this.productBaseForm.value);

				// Create or update
				if (!form.row.id) {
					return this.recordStore.postRecord(newRecord, this.fileToUpload);
				} else {
					return this.recordStore.putRecord(newRecord, this.fileToUpload);
				}
			}),
			tap((updatedRecord) => {
				let productUpdate = new ProductUpdate<RecordModel>();

				productUpdate = { ...form, row: updatedRecord };

				this.populateForm(productUpdate);

				return of(null);
			}),
			switchMap((x) =>
				this.productTableService.refreshMatTable(
					'records',
					form.totalPages,
					form.currentPage,
					form.sortKey,
					form.order,
					'',
					null,
				),
			),
			shareReplay(1),
		);
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

	public onClear() {
		this.productBaseForm.reset();
		this.imgSrcReplay$.next(this.defaultimageRootPath);
	}

	public showPreview(file: File) {
		if (!file) {
			return;
		}
		const reader = new FileReader();
		reader.onload = (e: any) => {
			this.imgSrcReplay$.next(e.target.result);
		};
		reader.readAsDataURL(file);
		this.productBaseForm.get('imagePath').setValue(file.name);
		this.fileToUpload = file;
	}

	/**
	 * Observable valuse of the form initiated with values
	 */
	public get formValue$(): Observable<any> {
		return this.productBaseForm.valueChanges.pipe(startWith(this.productBaseForm.value), shareReplay(1));
	}
}
