import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { RecordStore } from 'src/app/admin-panel/stores/record.store';
import { UserStore } from 'src/app/admin-panel/stores/user.store';
import { environment } from 'src/environments/environment';
import { CategoryStore } from 'src/app/admin-panel/stores/category.store';
import { RecordDialogService } from './services/record-dialog.service';
import { RecordTableService } from '../../database-tables/product-table/services/record-table.service';

@UntilDestroy()
@Component({
	selector: 'app-record-dialog',
	templateUrl: './record-dialog.component.html',
	styleUrls: ['./record-dialog.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordDialogComponent implements OnInit, OnDestroy {

	fileToUpload: File = null;

	constructor(
		public recordStore: RecordStore,
		public categoryStore: CategoryStore,
		public recordDialogService: RecordDialogService,
		public recordListService: RecordTableService,
		private userStore: UserStore) { }
	ngOnInit(): void { }
	ngOnDestroy(): void { }
	onSubmit() {
		this.recordDialogService.form.get('categoryName').setValue('Record');
		// Form data becomes null in observable so it needs to be cloned
		this.userStore.getUserProfile().pipe(
			untilDestroyed(this),
			switchMap(user => {
				//Set forms userId to in logged user
				this.recordDialogService.form.get('userId').setValue(user.userId);

				//Create or update
				if (!this.recordDialogService.form.get('id').value) {
					return this.recordStore.postRecord(this.recordDialogService.form.value, this.fileToUpload);
				} else {
					return this.recordStore.putRecord(this.recordDialogService.form.value, this.fileToUpload);
				}
			}),
		).subscribe(() => {
			this.recordListService.refreshMatTable('records');
			this.recordDialogService.form.reset();
			this.onClose();
		});
	}

	onClose() {
		//this.dialogRef.close();
	}

	showPreview(file: File) {
		if (!file) {
			return;
		}
		const reader = new FileReader();
		reader.onload = (e: any) => {
			this.recordDialogService.imgSrcReplay.next(e.target.result);
		};
		reader.readAsDataURL(file);
		this.recordDialogService.form.get('imagePath').setValue(file.name);
		this.fileToUpload = file;
	}
}
