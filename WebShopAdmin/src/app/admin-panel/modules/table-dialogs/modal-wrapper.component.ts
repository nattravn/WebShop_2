import { Component, Inject, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CategoryStore } from 'src/app/admin-panel/stores/category.store';
import { DialogData } from 'src/app/admin-panel/models/dialog-data.model';
import { AdminCategoryEnum } from '../../enums/AdminCategory.enum';
import { Category } from '../../models/category.model';
import { RecordDialogComponent } from './record-dialog/record-dialog.component';
import { DialogFactoryService } from './services/dialog-factory.service';
import { DialogService } from './services/dialog.service';
import { TemplateRef } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
/**
 * A common component rendered as a Material dialog
 */
@Component({
	selector: 'app-dialog',
	styleUrls: ['./modal-wrapper.component.css'],
	templateUrl: './modal-wrapper.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalWrapperComponent implements OnInit, OnDestroy{

	public categoryEnum = AdminCategoryEnum;

	public categoryChange: Category = new Category();

	public dialogRef: MatDialogRef<RecordDialogComponent>

	dialogService: DialogService;

	private closedOnDestroy = false;

	userDialogTemplate: TemplateRef<any>;
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
		private activatedRoute: ActivatedRoute,
		private dialogFactoryService: DialogFactoryService,
	) {

	}
	ngOnInit(): void {
		console.log('open dialog');
		this.openDialog();
		this.categoryChange.name="records";
		this.categoryStore.getCategories().subscribe();
	}

	public onDeactivate(event) {
		console.log('onDeactivate: ', event);

	}

	public selectedCataegory(event: Category){
		this.categoryChange = event;
	}

	openDialog(){
		console.log('modal:', this.activatedRoute.snapshot.params['product'] );
		this.dialogService = this.dialogFactoryService.open({
			headerText: 'Header text',
			category: {
				id: 0,
				name: 'record',
				route: this.activatedRoute.snapshot.params['product']
			},
			createNew: false,
			template: this.userDialogTemplate
		});

		const eventUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
		console.log('eventUrl: ', eventUrl);
		console.log('this.router: ', this.router);
		console.log('this.activatedRoute.snapshot: ', this.activatedRoute.snapshot.params['product']);
		console.log('this.activatedRoute.data: ', this.activatedRoute.data);
	}

	public ngOnDestroy(): void {
		this.closedOnDestroy = true;
		this.dialogService.close();
		console.log('close')
	  }
}





