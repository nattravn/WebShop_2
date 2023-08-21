import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, filter, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Category } from '../models/category.model';
import { environment } from 'src/environments/environment';
import { CategoryTable } from '../models/category-table.model';
import { ProductTable } from '@admin-panel/models/product-table.model';

@UntilDestroy()
@Injectable()
export class CategoryStore {
	public showCategories = false;

	private readonly rootURL = environment.baseUrl;

	constructor(private http: HttpClient) {}

	public getCategories(): Observable<Category[]> {
		return this.http.get<Category[]>(`${this.rootURL}/Category`).pipe(untilDestroyed(this));
	}

	public getPagedCategories(
		limit: number,
		page: number,
		key: string,
		order: string,
		keyWord: string,
	): Observable<CategoryTable> {
		return this.http
			.get<CategoryTable>(`${this.rootURL}/category/GetPagedCategories`, {
				params: {
					limit: limit.toString(),
					page: page.toString(),
					key: key,
					order: order,
					searchQuery: keyWord ? keyWord.toString() : '',
				},
			})
			.pipe(untilDestroyed(this));
	}

	public getCategory(categoryId): Observable<Category> {
		return this.http.get<Category>(`${this.rootURL}/Category/${categoryId}`).pipe(
			untilDestroyed(this),
			catchError((error) => {
				console.error(error);
				return of(null);
			}),
		);
	}

	public getCategoryByName(categoryName): Observable<Category> {
		return this.http.get<Category>(`${this.rootURL}/Category/categoryName/${categoryName}`).pipe(
			untilDestroyed(this),
			catchError((error) => {
				console.error(error);
				return of(null);
			}),
		);
	}

	public postCategory(category: Category) {
		return this.http.post(`${this.rootURL}/Category`, category);
	}

	public putCategory(category: Category) {
		return this.http.put(`${this.rootURL}/Category/${category.id}`, category);
	}

	public deletCategory(id: number) {
		return this.http.delete(`${this.rootURL}/Category/${id}`);
	}

	public getPagedProducts(
		route: string,
		limit: number,
		page: number,
		active: string,
		direction: string,
		keyWord: String,
	): Observable<ProductTable> {
		return this.getCategoryByName(route).pipe(
			filter((category) => !!category && category.implemented),
			switchMap(() =>
				this.http
					.get<ProductTable>(`${this.rootURL}/${route}/GetPagedProducts/`, {
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
