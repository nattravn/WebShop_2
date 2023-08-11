import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CategoryStore } from '@admin-panel/stores/category.store';

import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { AdminCategoryEnum } from '@admin-panel/enums/adminCategory.enum';
import { Category } from '@admin-panel/models/category.model';
import { RecordStore } from '@admin-panel/stores/record.store';
import { CategoryDialogComponent } from '@table-dialogs/category-dialog/category-dialog.component';

@Component({
	selector: 'app-category-dropdown',
	templateUrl: './category-dropdown.component.html',
	styleUrls: ['./category-dropdown.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDropdownComponent implements OnInit {
	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	@Input() selectedCategory = '';

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	@Output() selectCategory: EventEmitter<Category> = new EventEmitter<Category>();

	public categories$ = new Observable<Category[]>();

	public subCategoryForm = new FormGroup<any>({
		subCategory: new FormControl(''),
	});

	public defaultCategory: AdminCategoryEnum = AdminCategoryEnum.records;

	constructor(
		public recordService: RecordStore,
		public categoryStore: CategoryStore,
		public dialogRef: MatDialogRef<CategoryDialogComponent>,
	) {}

	ngOnInit() {
		this.categories$ = this.categoryStore.getCategories().pipe(shareReplay(1));
	}
}
