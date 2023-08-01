import { Category } from '@admin-panel/models/category.model';
import { SubCategory } from '@admin-panel/models/sub-category.model';
import { Injectable } from '@angular/core';
import { FormControl, FormArray, FormGroup } from '@angular/forms';

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
	subCategoryId: FormControl<number>;
}

@Injectable()
export class CategoryDialogService {
	public form = new FormGroup<ICategoryDialogForm>({
		id: new FormControl(null),
		route: new FormControl(''),
		name: new FormControl(''),
		subCategories: new FormArray<FormGroup<ISubCategoryForm>>([]),
	});

	constructor() {}
	public get subCategoryArray() {
		return this.form.get('subCategories').value;
	}

	public addSubCategoryItem(item: SubCategory) {
		this.subCategoryArray.push(item);
	}

	public removeItem() {
		this.subCategoryArray.splice(this.subCategoryArray.length - 1);
	}

	public populateForm(category: Category) {
		this.form.get('id').setValue(category.id);
		this.form.get('route').setValue(category.route);
		this.form.get('name').setValue(category.name);

		this.form.get('subCategories').setValue([]);

		category?.subCategories?.forEach((subCategory) => {
			this.addSubCategoryItem({
				id: subCategory.id,
				name: subCategory.name,
				route: subCategory.route,
				subCategoryId: subCategory.subCategoryId,
			});
		});
	}
}
