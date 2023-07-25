import { Component, Inject, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CategoryStore } from 'src/app/admin-panel/stores/category.store';
import { DialogData } from 'src/app/admin-panel/models/dialog-data.model';
import { AdminCategoryEnum } from '../../../enums/AdminCategory.enum';
import { Category } from '../../../models/category.model';
import { DialogFactoryService } from '../services/dialog-factory.service';
import { DialogService } from '../services/dialog.service';
import { TemplateRef } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { ActivatedRoute, ActivationStart, Router, RouterOutlet } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

@UntilDestroy()

@Component({
  selector: 'app-product-dialogs',
  templateUrl: './product-dialogs.component.html',
  styleUrls: ['./product-dialogs.component.scss']
})
export class ProductDialogsComponent implements OnInit {

	public categoryEnum = AdminCategoryEnum;

	public categoryChange$: BehaviorSubject<string> = new BehaviorSubject<string>('');

	//public dialogRef: MatDialogRef<RecordDialogComponent>

	dialogService: DialogService;

	private closedOnDestroy = false;

	userDialogTemplate: TemplateRef<any>;

	paramMapProduct$: Observable<any>;

	@ViewChild(RouterOutlet) outlet: RouterOutlet;

	@ViewChild('firstDialogTemplate') firstDialogTemplate: TemplateRef<ProductDialogsComponent>;

	routerEvent$: Observable<any>;

	/**
	 * Initializes the component.
	 * @param dialogRef - A reference to the dialog opened.
	 */
	constructor(
		private dialog: MatDialog,
		public categoryStore: CategoryStore,
		@Inject(MAT_DIALOG_DATA)
		public data: DialogData,
		private router: Router,
		private cdr: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private dialogFactoryService: DialogFactoryService,
	) { }

	ngAfterContentChecked(): void {
		//this.cdr.detectChanges();
	}

	ngOnInit(): void {
		console.log("ngOnInit BaseModalComponent", this.data);
		this.paramMapProduct$ = this.activatedRoute.queryParams;

		this.categoryChange$.next(this.data.category.name);

		this.activatedRoute.paramMap.subscribe(params => {
			console.log('params.get(product):', params.get('product'));
			//this.categoryChange.name=params.get('product');
			this.categoryChange$.next(this.data.category.name);
		});

		// Fired when route is changed
		// setTimeout(() => {
		// 	this.openDialog();
		// },);
	}

	public onDeactivate(event) {
		console.log('onDeactivate: ', event);

	}

	public selectedCataegory(event: Category){
		this.categoryChange$.next(event.name);
	}

	openDialog(){
		console.log("open dialog");
		this.dialogService = this.dialogFactoryService.open({
			headerText: 'Header text',
			category: {
				id: 0,
				name: 'record',
				route: this.activatedRoute.snapshot.params['product']
			},
			createNew: false,
			template: this.firstDialogTemplate
		});

		// const eventUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
	}

	onClose() {
		this.dialogService.close();

		// this.paramMapProduct$ = this.activatedRoute.paramMap.pipe(
		// 	untilDestroyed(this),
		// 	tap( paramMap => {
		// 		this.router.navigate(['adminpanel/tables/products/'+paramMap.get('product'), {outlets: {tablesOutlet: null}}]);
		// 	})
		// )
	}

	public ngOnDestroy(): void {
		// this.activatedRoute.paramMap.pipe(
		// 	untilDestroyed(this),
		// 	tap( paramMap => {
		// 		console.log('paramMap: ', paramMap);
		// 		this.router.navigate(['adminpanel/tables/products/'+paramMap.get('product')]);

		// 	})
		// ).subscribe();
		this.closedOnDestroy = true;
	}
}
