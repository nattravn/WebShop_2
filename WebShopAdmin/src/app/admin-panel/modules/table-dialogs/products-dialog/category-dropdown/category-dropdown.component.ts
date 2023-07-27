import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';

import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { DialogService } from 'src/app/admin-panel/modules/table-dialogs/services/dialog.service';
import { CategoryStore } from 'src/app/admin-panel/stores/category.store';
import { MatDialogRef } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../../category-dialog/category-dialog.component';
import { RecordStore } from '../../../../stores/record.store';
import { Category } from '../../../../models/category.model';
import { CategoryEnum } from '../../../../enums/category.enum';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AdminCategoryEnum } from '../../../../enums/AdminCategory.enum';


@Component({
	selector: 'app-category-dropdown',
	templateUrl: './category-dropdown.component.html',
	styleUrls: ['./category-dropdown.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryDropdownComponent implements OnInit {

	@Input() selectedCategory = '';

	@Output() selectCategory: EventEmitter<Category> = new EventEmitter<Category>();

	public categories$ = new Observable<Category[]>();

	public subCategoryForm: UntypedFormGroup = new UntypedFormGroup({
		subCategory: new UntypedFormControl(''),
	});

	public defaultCategory: AdminCategoryEnum = AdminCategoryEnum.Record;

	constructor(
		public recordService: RecordStore,
		private router: Router,
		public categoryStore: CategoryStore,
		private activatedRoute: ActivatedRoute,
		public dialogRef: MatDialogRef<CategoryDialogComponent>,
	) { }

	ngOnInit() {
		this.categories$ = this.categoryStore.getCategories().pipe(shareReplay(1));

		console.log('router: ', this.router);

		console.log('this.defaultCategory: ', this.activatedRoute.snapshot);

	}
}
