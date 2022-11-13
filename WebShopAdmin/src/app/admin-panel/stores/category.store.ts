import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap, switchMap, catchError, map } from 'rxjs/operators';
import { ReplaySubject, Observable, from, EMPTY, of } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Category } from '../models/category.model';
import { environment } from 'src/environments/environment';
import { PagedCategory } from '../models/paged-category.model';

@UntilDestroy()
@Injectable()
export class CategoryStore implements OnDestroy {

	readonly rootURL = environment.baseUrl;
	showCategories = false;

	constructor(private http: HttpClient) {}

	ngOnDestroy(): void { }

	public getCategories(): Observable<Category[]> {
		return this.http.get<Category[]>(this.rootURL + '/Category').pipe(
			untilDestroyed(this),
		);
	}

	getPagedCategories(limit: number, page: number): Observable<PagedCategory> {
		return this.http.get<PagedCategory>(`${this.rootURL}/category/GetPagedCategories?limit=${limit}&page=${page}`).pipe(
			untilDestroyed(this),
		);
	}

	public getCategory(categoryId): Observable<Category> {

		return this.http.get<Category>(this.rootURL + '/Category/' + categoryId).pipe(
			untilDestroyed(this),
			catchError(error => {
				return of(error);
			})
		);
	}

	public postCategory(category: Category) {
		return this.http.post(this.rootURL + '/Category', category);
	}

	public putCategory(category: Category) {
		return this.http.put(this.rootURL + '/Category/' + category.id, category);
	}

	public deletCategory(id: number) {
		return this.http.delete(this.rootURL + '/Category/' + id);
	}
}
