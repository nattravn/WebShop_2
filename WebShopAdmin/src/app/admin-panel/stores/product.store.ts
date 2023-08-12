import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';

import { ProductTable } from '@admin-panel/models/product-table.model';
import { environment } from '@environments/environment';
import { CategoryStore } from './category.store';
// Remove this store??
@UntilDestroy()
@Injectable()
export class ProductStore {
	public readonly baseUrl = environment.baseUrl;

	constructor(
		private http: HttpClient,
		private categoryStore: CategoryStore,
	) {}

	public getProducts(
		route: string,
		limit: number,
		page: number,
		active: string,
		direction: string,
		keyWord: String,
	): Observable<ProductTable> {
		return this.categoryStore.getCategoryByName(route).pipe(
			filter((category) => !!category && category.implemented),
			switchMap(() =>
				this.http
					.get<ProductTable>(`${this.baseUrl}/${route}/GetPagedProducts/`, {
						params: {
							limit: limit.toString(),
							page: page.toString(),
							key: active,
							order: direction,
							searchQuery: keyWord ? keyWord.toString() : '',
						},
					})
					.pipe(
						untilDestroyed(this),
						catchError((error) => {
							console.error('Error: ', error);
							return of(null);
						}),
					),
			),
		);
	}
}
