import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CategoryDialogService } from './services/category-dialog.service';
import { UserStore } from '@admin-panel/stores/user.store';
import { CategoryTableService } from '@database-tables/category-table/services/category-table.service';
import { CategoryStore } from '@admin-panel/stores/category.store';
import { SubCategory } from '@admin-panel/models/sub-category.model';
import { Category } from '@admin-panel/models/category.model';

@UntilDestroy()
@Component({
	selector: 'app-category-dialog',
	templateUrl: 'category-dialog.component.html',
	styleUrls: ['category-dialog.component.scss'],
})
export class CategoryDialogComponent {
	constructor(
		public categoryDialogService: CategoryDialogService,
		private userStore: UserStore,
		private categoryStore: CategoryStore,
		private categoryListService: CategoryTableService,
		public dialogRef: MatDialogRef<CategoryDialogComponent>,
	) {}

	public onSubmit() {
		// Form data becomes null in observable so it needs to be cloned
		const clonedForm = Object.assign({}, this.categoryDialogService.form.value) as Category;

		this.userStore
			.getUserProfile()
			.pipe(
				untilDestroyed(this),
				switchMap((user) =>
					// clonedForm.userId = user.userId;
					this.categoryStore.getCategory(clonedForm.id),
				),
				switchMap(() => {
					clonedForm.name = 'Category';
					if (!clonedForm.id) {
						return this.categoryStore.postCategory(clonedForm);
					} else {
						return this.categoryStore.putCategory(clonedForm);
					}
				}),
			)
			.subscribe(() => {
				this.categoryListService.refreshMatTable();
				this.categoryDialogService.form.reset();
				this.dialogRef.close();
			});
	}

	public onClear() {
		this.categoryDialogService.form.reset();
	}

	public onClose() {
		this.dialogRef.close();
	}

	public addSubCategory() {
		const newSubCategory: SubCategory = {
			id: 0,
			name: '',
			route: '',
			subCategoryId: 0,
		};
		this.categoryDialogService.addSubCategoryItem(newSubCategory);
	}

	public removeSubCategory() {
		this.categoryDialogService.removeItem();
	}
}
