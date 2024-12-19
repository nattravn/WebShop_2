import { Pipe, PipeTransform } from '@angular/core';

import { Category } from '@admin-panel/models/category.model';
import { CategoryStore } from '@admin-panel/stores/category.store';
import { Observable } from 'rxjs';

@Pipe({
	name: 'category',
})
export class CategoryPipe implements PipeTransform {
	constructor(private categoryStore: CategoryStore) {}
	transform(categoryRoute: string): Observable<Category> {
		return this.categoryStore.getCategoryByName(categoryRoute);
	}
}
