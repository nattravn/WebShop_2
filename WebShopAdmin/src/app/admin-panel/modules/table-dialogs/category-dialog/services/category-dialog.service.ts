import { Injectable, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';

import { Category } from '../../../../models/category.model';

@Injectable()
export class CategoryDialogService {

	public form: FormGroup = this._formBuilder.group({
		id: new FormControl(null),
		route: new FormControl(''),
		name: new FormControl(''),
		subCategories: this._formBuilder.array([]),
	});

	constructor(private _formBuilder: FormBuilder) { }
	public get subCategoryArray() {
		return this.form.get('subCategories') as FormArray;
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

		console.log('category: ', category);


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
