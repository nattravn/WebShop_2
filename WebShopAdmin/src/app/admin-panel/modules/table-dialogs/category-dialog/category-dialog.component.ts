import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';

import { switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CategoryDialogService } from './services/category-dialog.service';
import { UserStore } from 'src/app/admin-panel/stores/user.store';
import { CategoryTableService } from '../../database-tables/category-table/services/category-table.service';
import { CategoryStore } from '../../../stores/category.store';

@UntilDestroy()
@Component({
	selector: 'app-category-dialog',
	templateUrl: 'category-dialog.component.html',
	styleUrls: ['category-dialog.component.scss'],
	//providers: [ CategoryDialogService ]
})
export class CategoryDialogComponent implements OnInit, OnDestroy {
	constructor(
		public categoryDialogService: CategoryDialogService,
		private userStore: UserStore,
		private categoryStore: CategoryStore,
		private categoryListService: CategoryTableService,
		public dialogRef: MatDialogRef<CategoryDialogComponent>
	) { }
	ngOnDestroy(): void { }

	ngOnInit() {

	}

	onSubmit() {
		// Form data becomes null in observable so it needs to be cloned
		const clonedForm = Object.assign({}, this.categoryDialogService.form.value);

		this.userStore.getUserProfile().pipe(
			untilDestroyed(this),
			switchMap(user => {
				clonedForm.userId = user.userId;
				return this.categoryStore.getCategory(clonedForm.id);
			}),
			switchMap(() => {
				clonedForm.categoryName = 'Category';
				if (!clonedForm.id) {
					return this.categoryStore.postCategory(clonedForm);
				} else {
					return this.categoryStore.putCategory(clonedForm);
				}
			})
		).subscribe(() => {
			this.categoryListService.refreshMatTable();
			this.categoryDialogService.form.reset();
			this.dialogRef.close();
		});
	}

	onClear() {
		this.categoryDialogService.form.reset();
	}

	onClose() {
		this.dialogRef.close();
	}

	addSubCategory() {
		const newSubCategory = {
			'id': 0,
			'name': '',
			'route': '',
			'categoryId': 0,
		};
		this.categoryDialogService.addItem(newSubCategory);
	}

	removeSubCategory() {
		this.categoryDialogService.removeItem();
	}
}
