import { TemplateRef, Injectable, OnInit, Directive } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, ReplaySubject } from 'rxjs';

import { first, switchMap, tap } from 'rxjs/operators';
import { Category } from '../../../models/category.model';
import { DialogComponent } from '../dialog/dialog.component';

type DialogRef = MatDialogRef<DialogComponent>;

@UntilDestroy()
@Directive()
export class DialogService implements OnInit {
	opened$ = this.dialogRef.afterOpened().pipe(first());

	public categoryReplay$ = new ReplaySubject<Category>(1);

	constructor(
		private dialogRef: DialogRef,
		private activatedRoute: ActivatedRoute,
		private router: Router
	) { }
	ngOnInit(): void {

	}

	get context() {
		return this.dialogRef.componentInstance.data;
	}

	close(): void {
		this.dialogRef.close();
		//this.dialogRef.beforeClosed().subscribe(() => console.log('tjaaaa'));
	}

	setHeaderText(headerText: string): void {
		this.dialogRef.componentInstance.data.headerText = headerText;
	}

	setTemplate(template: TemplateRef<any>): void {
		this.dialogRef.componentInstance.data.template = template;
	}
}
