import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of } from 'rxjs';
import { filter, shareReplay, switchMap } from 'rxjs/operators';

import { DialogData } from '@admin-panel/models/dialog-data.model';
import { ModuleService } from '@admin-panel/modules/services/module-service.service';
import { CategoryStore } from '@admin-panel/stores/category.store';
import { RecordStore } from '@admin-panel/stores/record.store';
import { ProductTableService } from '@database-tables/product-table/services/product-table.service';

import { RecordDialogService } from './services/record-dialog.service';
import { ProductDialogService } from '../services/product-dialog.service';
import { RecordUpdate } from '@admin-panel/models/record-update.model';

@UntilDestroy()
@Component({
	selector: 'app-record-dialog',
	templateUrl: './record-dialog.component.html',
	styleUrls: ['./record-dialog.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordDialogComponent implements OnInit {
	public populateForm$ = new Observable<any>();

	constructor(
		public recordStore: RecordStore,
		public categoryStore: CategoryStore,
		public recordDialogService: RecordDialogService,
		public productTableService: ProductTableService,
		public productDialogService: ProductDialogService,
		// private userStore: UserStore,
		private moduleService: ModuleService,
		// private customDatePipe: CustomDatePipe,
		@Inject(MAT_DIALOG_DATA)
		public data: DialogData,
	) {}

	ngOnInit(): void {
		this.populateForm$ = this.moduleService.productData$.pipe(
			untilDestroyed(this),
			filter(() => !this.data.createNew),
			switchMap((productData) => {
				this.populateForm(productData.row as RecordUpdate);
				return of(null);
			}),
			shareReplay(1),
		);
	}

	private populateForm(productUpdate: RecordUpdate) {
		this.productDialogService.recordForm.get('band').setValue(productUpdate?.band);
		this.productDialogService.recordForm.get('album').setValue(productUpdate?.album);
	}
}
