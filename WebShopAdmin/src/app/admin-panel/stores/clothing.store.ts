import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Clothing } from '@admin-panel/models/clothing.model';
import { environment } from '@environments/environment';

@Injectable({
	providedIn: 'root',
})
export class ClothingStore {
	public imageRootPath = `${environment.baseUrl}/Images/original/`;

	public defaultimageRootPath = `${environment.baseUrl}/Images/original/default-image.png`;

	public list: Clothing[];

	private readonly baseUrl = environment.baseUrl;

	private clothingsReplay: ReplaySubject<Clothing[]> = new ReplaySubject<Clothing[]>(1);

	private clothingItemReplay: ReplaySubject<Clothing> = new ReplaySubject<Clothing>(1);

	constructor(
		private http: HttpClient,
		private toastr: ToastrService,
	) {}

	public getClothings(): Observable<Clothing[]> {
		return this.http.get<Clothing[]>(`${this.baseUrl}/Clothings`).pipe(
			tap((items) => {
				this.clothingsReplay.next(items);
			}),
		);
	}

	public getClothing(id: number): Observable<Clothing> {
		return this.http.get<Clothing>(`${this.baseUrl}/Clothings/${id}`).pipe(
			tap((item) => {
				this.clothingItemReplay.next(item);
			}),
		);
	}

	public postClothing(modelFormData: Clothing, fileToUpload: File): Observable<Clothing> {
		const formData: FormData = new FormData();
		const releaseDate = new Date(modelFormData.releaseDate);
		formData.append('title', modelFormData.title);
		formData.append('price', modelFormData.price.toString());
		formData.append('size', modelFormData.size);
		formData.append('description', modelFormData.description);
		formData.append('image', fileToUpload, fileToUpload.name);
		formData.append('imagePath', modelFormData.imagePath);
		formData.append('categoryName', modelFormData.categoryName.toString());
		formData.append('subCategory', modelFormData.subCategoryId.toString());
		formData.append('editorUserId', modelFormData.editorUserId);
		formData.append('creatorUserId', modelFormData.creatorUserId);
		formData.append('releaseDate', releaseDate.toDateString());

		return this.http.post<Clothing>(`${this.baseUrl}/Clothings`, formData);
	}

	public putClothing(modelFormData: Clothing, fileToUpload: File): Observable<Clothing> {
		const formData: FormData = new FormData();
		const releaseDate = new Date(modelFormData.releaseDate);

		formData.append('title', modelFormData.title);
		formData.append('id', modelFormData.id.toString());
		formData.append('price', modelFormData.price.toString());
		formData.append('size', modelFormData.size);
		formData.append('description', modelFormData.description);
		if (fileToUpload != null) {
			formData.append('image', fileToUpload, fileToUpload.name);
		}
		formData.append('releaseDate', releaseDate.toDateString());
		formData.append('imagePath', modelFormData.imagePath);
		formData.append('categoryName', modelFormData.categoryName.toString());
		formData.append('editorUserId', modelFormData.editorUserId.toString());
		formData.append('categoryId', JSON.stringify(modelFormData.categoryId));
		formData.append('subCategoryId', JSON.stringify(modelFormData.subCategoryId));
		formData.append('editorUserId', modelFormData.editorUserId);

		return this.http.put<Clothing>(`${this.baseUrl}/Clothings/${modelFormData.id}`, formData).pipe(
			tap(() => {
				this.toastr.info('updated successfully', `Clothing:  ${modelFormData.title}`);
			}),
		);
	}

	public deleteClothing(id: number) {
		return this.http.delete(`${this.baseUrl}/Clothings/${id}`);
	}

	public getClothingByUserName(userName: string): Observable<Clothing[]> {
		return this.http.get<Clothing[]>(`${this.baseUrl}/Clothings/username/${userName}`);
	}

	public refreshList() {
		this.http
			.get(`${this.baseUrl}/Clothings`)
			.toPromise()
			.then((res) => {
				this.list = res as Clothing[];
			});
	}
}
