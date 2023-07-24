import { Injectable, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormArray, UntypedFormBuilder } from '@angular/forms';

import { Category } from '../../../../models/category.model';

@Injectable()
export class CategoryDialogService {

	public form: UntypedFormGroup = this._formBuilder.group({
		id: new UntypedFormControl(null),
		route: new UntypedFormControl(''),
		name: new UntypedFormControl(''),
		subCategories: this._formBuilder.array([]),
	});

	constructor(private _formBuilder: UntypedFormBuilder) { }
	public get subCategoryArray() {
		return this.form.get('subCategories') as UntypedFormArray;
	}

	addItem(item) {
		this.subCategoryArray.push(this._formBuilder.group(item));
	}

	removeItem() {
		this.subCategoryArray.removeAt(this.subCategoryArray.length - 1);
	}

	populateForm(category: Category) {
		this.form.get('id').setValue(category.id);
		this.form.get('route').setValue(category.route);
		this.form.get('name').setValue(category.name);

		this.subCategoryArray.clear();

		category?.subCategories?.forEach(subCategory => {
			this.addItem({
				'id': subCategory.id,
				'name': subCategory.name,
				'route': subCategory.route,
				'categoryId': subCategory.categoryId,
			});
		});


	}
}
