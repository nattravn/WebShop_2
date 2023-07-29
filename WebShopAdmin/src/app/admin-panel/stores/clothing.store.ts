import { Clothing } from "@admin/models/clothing.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ToastrService } from "ngx-toastr";
import { Observable, ReplaySubject } from "rxjs";
import { tap } from "rxjs/operators";

import { environment } from "@environments/environment";

@Injectable({
	providedIn: "root",
})
export class ClothingStore {
	readonly baseUrl = environment.baseUrl;

	public imageRootPath = `${environment.baseUrl}/Images/original/`;

	public defaultimageRootPath = `${environment.baseUrl}/Images/original/default-image.png`;

	list: Clothing[];

	private clothingsReplay: ReplaySubject<Clothing[]> = new ReplaySubject<Clothing[]>(1);

	private clothingItemReplay: ReplaySubject<Clothing> = new ReplaySubject<Clothing>(1);

	constructor(
		private http: HttpClient,
		private toastr: ToastrService,
	) {}

	getClothings(): Observable<Clothing[]> {
		return this.http.get<Clothing[]>(`${this.baseUrl}/Clothings`).pipe(
			tap((items) => {
				this.clothingsReplay.next(items);
			}),
		);
	}

	getClothing(id: number): Observable<Clothing> {
		return this.http.get<Clothing>(`${this.baseUrl}/Clothings/${id}`).pipe(
			tap((item) => {
				this.clothingItemReplay.next(item);
			}),
		);
	}

	postClothing(modelFormData: Clothing, fileToUpload: File) {
		const formData: FormData = new FormData();

		formData.append("title", modelFormData.title);
		formData.append("price", modelFormData.price.toString());
		formData.append("size", modelFormData.size);
		formData.append("description", modelFormData.description);
		formData.append("image", fileToUpload, fileToUpload.name);
		formData.append("imagePath", modelFormData.imagePath);
		formData.append("category", modelFormData.categoryId.toString());
		formData.append("userId", modelFormData.editorUserId.toString());
		formData.append("subCategory", modelFormData.subCategoryId.toString());
		formData.append("userName", modelFormData.userName);

		return this.http.post(`${this.baseUrl}/Clothings`, formData);
	}

	putClothing(modelFormData: Clothing, fileToUpload: File) {
		const formData: FormData = new FormData();
		console.log("modelFormData: ", modelFormData);
		formData.append("title", modelFormData.title);
		formData.append("id", modelFormData.id.toString());
		formData.append("price", modelFormData.price.toString());
		formData.append("size", modelFormData.size);
		formData.append("description", modelFormData.description);
		if (fileToUpload != null) {
			formData.append("Image", fileToUpload, fileToUpload.name);
		}
		formData.append("imagePath", modelFormData.imagePath);
		formData.append("category", modelFormData.categoryId.toString());
		formData.append("userId", modelFormData.editorUserId.toString());
		formData.append("subCategory", modelFormData.subCategoryId.toString());

		return this.http.put(`${this.baseUrl}/Clothings/${modelFormData.id}`, formData).pipe(
			tap(() => {
				this.toastr.info("updated successfully", `Clothing:  ${modelFormData.title}`);
			}),
		);
	}

	deleteClothing(id: number) {
		return this.http.delete(`${this.baseUrl}/Clothings/${id}`);
	}

	getClothingByUserName(userName: string): Observable<Clothing[]> {
		return this.http.get<Clothing[]>(`${this.baseUrl}/Clothings/username/${userName}`);
	}

	refreshList() {
		this.http
			.get(`${this.baseUrl}/Clothings`)
			.toPromise()
			.then((res) => {
				this.list = res as Clothing[];
			});
	}
}
