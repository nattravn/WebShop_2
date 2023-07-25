import { Component, Inject, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CategoryStore } from 'src/app/admin-panel/stores/category.store';
import { DialogData } from 'src/app/admin-panel/models/dialog-data.model';
import { AdminCategoryEnum } from '../../enums/AdminCategory.enum';
import { Category } from '../../models/category.model';
import { DialogFactoryService } from './services/dialog-factory.service';
import { DialogService } from './services/dialog.service';
import { TemplateRef } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { ActivatedRoute, ActivationStart, Router, RouterOutlet } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';

@UntilDestroy()
/**
 * A common component rendered as a Material dialog
 */
@Component({
	selector: 'app-dialog',
	styleUrls: ['./base-modal.component.css'],
	templateUrl: './base-modal.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseModalComponent implements OnInit {

	/**
	 * Initializes the component.
	 * @param dialogRef - A reference to the dialog opened.
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private dialogFactoryService: DialogFactoryService,
	) { }

	ngAfterContentChecked(): void {
		//this.cdr.detectChanges();
	}

	ngOnInit(): void {
		console.log('BaseModalModule loaded');
	}

}





