import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Shoe } from '../models/shoe.model';
import { environment } from 'src/environments/environment';
import { CategoryNameEnum } from '@admin-panel/enums/categoryName.enum';

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

	public form = new FormGroup<IShoeForm>({
		id: new FormControl(null),
		title: new FormControl(''),
		price: new FormControl(null),
		image: new FormControl(null),
		// userName: new FormControl(''),
		imagePath: new FormControl('default-image.png'),
		description: new FormControl(''),
		category: new FormControl(CategoryNameEnum.shoes),
		subCategory: new FormControl(null),
		userId: new FormControl(null),
	});

	private readonly baseUrl = environment.baseUrl;

	constructor(private http: HttpClient) {}

	public initializeFormGroup() {
		this.form.setValue({
			id: null,
			title: '',
			price: null,
			image: null,
			imagePath: '',
			description: '',
			category: CategoryNameEnum.shoes,
			subCategory: null,
			userId: null,
		});
	}

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

	public postShoe(modelFormData: Shoe, fileToUpload: File) {
		const formData: FormData = new FormData();

		formData.append('title', modelFormData.title);
		formData.append('price', modelFormData.price);
		formData.append('description', modelFormData.description);
		formData.append('image', fileToUpload, fileToUpload.name);
		formData.append('imagePath', modelFormData.imagePath);
		formData.append('category', modelFormData.categoryId.toString());
		formData.append('userName', modelFormData.userName);
		formData.append('subCategory', modelFormData.subCategoryId.toString());

		return this.http.post(`${this.baseUrl}/shoes`, formData);
	}

	public putShoe(modelFormData: Shoe, fileToUpload: File) {
		const formData: FormData = new FormData();

		formData.append('title', modelFormData.title);
		formData.append('id', modelFormData.id.toString());
		formData.append('price', modelFormData.price);
		formData.append('description', modelFormData.description);
		if (fileToUpload != null) {
			formData.append('image', fileToUpload, fileToUpload.name);
		}
		formData.append('imagePath', modelFormData.imagePath);
		formData.append('category', modelFormData.categoryId.toString());
		formData.append('userName', modelFormData.userName);
		formData.append('subCategory', modelFormData.subCategoryId.toString());

		return this.http.put(`${this.baseUrl}/shoes/${modelFormData.id}`, formData);
	}

	public populateForm(shoe) {
		this.form.setValue(shoe);
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
