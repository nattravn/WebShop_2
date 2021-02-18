import { TemplateRef, Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';

import { first } from 'rxjs/operators';
import { Category } from '../../../models/category.model';
import { DialogComponent } from '../dialog/dialog.component';

type DialogRef = MatDialogRef<DialogComponent>;

export class DialogService {
	opened$ = this.dialogRef.afterOpened().pipe(first());

	public categoryReplay$ = new ReplaySubject<Category>(1);

	constructor(private dialogRef: DialogRef) { }

	get context() {
		return this.dialogRef.componentInstance.data;
	}

	close() {
		this.dialogRef.close();
	}

	setHeaderText(headerText: string): void {
		this.dialogRef.componentInstance.data.headerText = headerText;
	}

	setTemplate(template: TemplateRef<any>): void {
		this.dialogRef.componentInstance.data.template = template;
	}
}
