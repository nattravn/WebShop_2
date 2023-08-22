import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Shoe } from '../models/shoe.model';
import { environment } from 'src/environments/environment';
import { ShoeUpdate } from '@admin-panel/models/shoe-update.model';
import { ToastrService } from 'ngx-toastr';

export interface IShoeForm {
	id: FormControl<number>;
	title: FormControl<string>;
	price: FormControl<number>;
	image: FormControl<string>;
	imagePath: FormControl<string>;
	description: FormControl<string>;
	category: FormControl<string>;
	subCategory: FormControl<number>;
	userId: FormControl<string>;
}
@Injectable({
	providedIn: 'root',
})
export class ShoeStore {
	public imageRootPath = `${environment.baseUrl}/Images/original/`;

	public shoesReplay$: ReplaySubject<Shoe[]> = new ReplaySubject<Shoe[]>(1);

	public shoeItemReplay$: ReplaySubject<Shoe> = new ReplaySubject<Shoe>(1);

	public list: Shoe[];

	private readonly baseUrl = environment.baseUrl;

	constructor(
		private http: HttpClient,
		private toastr: ToastrService,
	) {}

	public getShoes(): Observable<Shoe[]> {
		return this.http.get<Shoe[]>(`${this.baseUrl}/shoes`).pipe(
			tap((items) => {
				this.shoesReplay$.next(items);
			}),
		);
	}

	public getShoe(id: number): Observable<Shoe> {
		return this.http.get<Shoe>(`${this.baseUrl}/shoes/${id}`).pipe(
			tap((item) => {
				this.shoeItemReplay$.next(item);
			}),
		);
	}

	public postShoe(modelFormData: ShoeUpdate, fileToUpload: File): Observable<ShoeUpdate> {
		const formData: FormData = new FormData();

		formData.append('title', modelFormData.title);
		formData.append('price', modelFormData.price.toString());
		formData.append('description', modelFormData.description);
		formData.append('image', fileToUpload, fileToUpload.name);
		formData.append('imagePath', modelFormData.imagePath);
		formData.append('category', modelFormData.categoryId.toString());
		formData.append('editorUserId', modelFormData.editorUserId);
		formData.append('creatorUserId', modelFormData.creatorUserId);
		formData.append('subCategory', modelFormData.subCategoryId.toString());

		formData.append('size', modelFormData.size);

		return this.http.post<ShoeUpdate>(`${this.baseUrl}/shoes`, formData).pipe(
			tap(() => {
				this.toastr.success('inserted successfully', 'EMP. Register');
			}),
		);
	}

	public putShoe(modelFormData: ShoeUpdate, fileToUpload: File): Observable<ShoeUpdate> {
		const formData: FormData = new FormData();
		const releaseDate = new Date(modelFormData.releaseDate);

		formData.append('title', modelFormData.title);
		formData.append('id', modelFormData.id.toString());
		formData.append('price', modelFormData.price.toString());
		formData.append('description', modelFormData.description);
		formData.append('releaseDate', releaseDate.toDateString());

		if (fileToUpload != null) {
			formData.append('image', fileToUpload, fileToUpload.name);
		}

		formData.append('imagePath', modelFormData.imagePath);
		formData.append('category', modelFormData.categoryId.toString());
		formData.append('userName', modelFormData.editorUserId);
		formData.append('categoryId', JSON.stringify(modelFormData.categoryId));
		formData.append('subCategoryId', JSON.stringify(modelFormData.subCategoryId));
		formData.append('editorUserId', modelFormData.editorUserId);

		formData.append('size', modelFormData.size);

		return this.http.put<ShoeUpdate>(`${this.baseUrl}/shoes/${modelFormData.id}`, formData).pipe(
			tap(() => {
				this.toastr.info('updated successfully', 'EMP. Register');
			}),
		);
	}

	public deleteShoe(id: number) {
		return this.http.delete(`${this.baseUrl}/shoes/${id}`);
	}

	public getShoeByUserName(userName: string): Observable<Shoe[]> {
		return this.http.get<Shoe[]>(`${this.baseUrl}/shoes/username/${userName}`);
	}

	public refreshList() {
		this.http
			.get(`${this.baseUrl}/shoes`)
			.toPromise()
			.then((res) => {
				this.list = res as Shoe[];
			});
	}
}
