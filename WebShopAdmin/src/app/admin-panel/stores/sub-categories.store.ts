import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, ReplaySubject } from "rxjs";
import { tap } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { SubCategory } from "../models/sub-category.model";

@Injectable({
	providedIn: "root",
})
export class SubCategoriesStore {
	readonly baseUrl = environment.baseUrl;

	public subCategoryReplay$: ReplaySubject<SubCategory> = new ReplaySubject<SubCategory>(1);

	private subCategoriesReplay: ReplaySubject<SubCategory[]> = new ReplaySubject<SubCategory[]>(1);

	public subCategoriesReplay$: Observable<SubCategory[]> = this.subCategoriesReplay.asObservable();

	constructor(private http: HttpClient) {}

	public getSubCategories(categoryId: number): Observable<SubCategory[]> {
		return this.http.get<SubCategory[]>(`${this.baseUrl}/category/${categoryId}/subCategories`).pipe(
			tap((items) => {
				this.subCategoriesReplay.next(items);
			}),
		);
	}

	public getSubCategory(categoryId: number, subCategoryId: number): void {
		this.http.get<SubCategory>(`${this.baseUrl}/category/${categoryId}/subCategories/${subCategoryId}`).pipe(
			tap((subCategory) => {
				this.subCategoryReplay$.next(subCategory);
			}),
		);
	}
}
