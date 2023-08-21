import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { delay, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CategoryDialogService } from './services/category-dialog.service';
import { UserStore } from '@admin-panel/stores/user.store';
import { CategoryTableService } from '@database-tables/category-table/services/category-table.service';
import { CategoryStore } from '@admin-panel/stores/category.store';
import { SubCategory } from '@admin-panel/models/sub-category.model';
import { Observable } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ModuleService } from '@admin-panel/modules/services/module-service.service';
import { CategoryDialog } from '@admin-panel/models/category-dialog.model';

export interface ICategoryDialogForm {
	id: FormControl<number>;
	route: FormControl<string>;
	name: FormControl<string>;
	subCategories: FormArray<FormGroup<ISubCategoryForm>>;
}

export interface ISubCategoryForm {
	id: FormControl<number>;
	route: FormControl<string>;
	name: FormControl<string>;
	categoryId: FormControl<number>;
}

export interface ICategoryForm {
	currentPage: FormControl<number>;
	totalPages: FormControl<number>;
	order: FormControl<string>;
	sortKey: FormControl<string>;
	row: FormGroup<ICategoryDialogForm>;
}

@UntilDestroy()
@Component({
	selector: 'app-category-dialog',
	templateUrl: 'category-dialog.component.html',
	styleUrls: ['category-dialog.component.scss'],
})
export class CategoryDialogComponent implements OnInit {
	// public form = new FormGroup<ICategoryDialogForm>({
	// 	id: new FormControl(null),
	// 	route: new FormControl(''),
	// 	name: new FormControl(''),
	// 	subCategories: new FormArray<FormGroup<ISubCategoryForm>>([]),
	// });

	public form = new FormGroup<ICategoryForm>({
		currentPage: new FormControl(1),
		totalPages: new FormControl(1),
		order: new FormControl(''),
		sortKey: new FormControl(''),
		row: new FormGroup<ICategoryDialogForm>({
			id: new FormControl(0),
			name: new FormControl(''),
			route: new FormControl(''),
			subCategories: new FormArray<FormGroup<ISubCategoryForm>>([]),
		}),
	});

	public populateForm$ = new Observable<CategoryDialog>();

	constructor(
		public categoryDialogService: CategoryDialogService,
		private userStore: UserStore,
		private categoryStore: CategoryStore,
		private categoryListService: CategoryTableService,
		public dialogRef: MatDialogRef<CategoryDialogComponent>,
		private moduleService: ModuleService,
	) {}
	ngOnInit(): void {
		this.populateForm$ = this.moduleService.categoryFormData$.pipe(
			untilDestroyed(this),
			delay(1), // otherwise lastUpdatedTime the pipes wont fire in template
			map((productData) => {
				this.populateForm(productData);
				return productData;
			}),
			shareReplay(1),
		);
	}

	public onSubmit(form: CategoryDialog) {
		this.userStore
			.getUserProfile()
			.pipe(
				untilDestroyed(this),
				switchMap(() => {
					if (!form.row.id) {
						return this.categoryStore.postCategory(form.row);
					} else {
						return this.categoryStore.putCategory(form.row);
					}
				}),
			)
			.subscribe(() => {
				this.categoryListService.refreshMatTable(form.totalPages, form.currentPage, form.sortKey, form.order, '', null);
			});
	}

	public onClear() {
		this.form.reset();
	}

	public onClose() {
		this.dialogRef.close();
	}

	public addSubCategory() {
		const item = new SubCategory({
			id: 0,
			name: '',
			route: '',
			categoryId: 0,
		});
		this.addSubCategoryItem(item);
	}

	public removeSubCategory() {
		this.subCategoryArray.removeAt(this.subCategoryArray.length - 1);
	}

	public addSubCategoryItem(item: SubCategory) {
		const form = new FormGroup<ISubCategoryForm>({
			id: new FormControl(item.id),
			route: new FormControl(item.route),
			name: new FormControl(item.name),
			categoryId: new FormControl(item.categoryId),
		});
		this.subCategoryArray.push(form);
	}

	public populateForm(category: CategoryDialog) {
		this.form.get('row').get('id').setValue(category.row.id);
		this.form.get('row').get('route').setValue(category.row.route);
		this.form.get('row').get('name').setValue(category.row.name);
		this.form.get('currentPage').setValue(category.currentPage);
		this.form.get('totalPages').setValue(category.totalPages);
		this.form.get('order').setValue(category.order);
		this.form.get('sortKey').setValue(category.sortKey);

		category.row?.subCategories?.forEach((subCategory) => {
			this.addSubCategoryItem({
				id: subCategory.id,
				name: subCategory.name,
				route: subCategory.route,
				categoryId: subCategory.categoryId,
			});
		});
	}

	public get subCategoryArray() {
		return this.form.get('row').get('subCategories') as FormArray<FormGroup<ISubCategoryForm>>;
	}

	/**
	 * Observable values of the form initiated with values
	 */
	public get formValue$(): Observable<any> {
		return this.form.valueChanges.pipe(startWith(this.form.value), shareReplay(1));
	}
}
