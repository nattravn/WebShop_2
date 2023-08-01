import { Directive, TemplateRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DialogComponent } from '@table-dialogs/dialog/dialog.component';

import { ReplaySubject } from 'rxjs';

import { Category } from '@admin-panel/models/category.model';

@UntilDestroy()
@Directive()
export class DialogService {
	public categoryReplay$ = new ReplaySubject<Category>(1);

	constructor(private dialogRef: MatDialogRef<DialogComponent>) {}

	get context() {
		return this.dialogRef.componentInstance.data;
	}

	public close(): void {
		this.dialogRef.close();
	}

	public setHeaderText(headerText: string): void {
		this.dialogRef.componentInstance.data.headerText = headerText;
	}

	public setTemplate(template: TemplateRef<any>): void {
		this.dialogRef.componentInstance.data.template = template;
	}
}
