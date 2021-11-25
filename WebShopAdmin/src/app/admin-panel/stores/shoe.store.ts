import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Shoe } from '../models/shoe.model';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ShoeStore {

	readonly baseUrl = environment.baseUrl;
	public imageRootPath = environment.baseUrl + '/Images/original/';

	list: Shoe[];

	private shoesReplay: ReplaySubject<Shoe[]> = new ReplaySubject<Shoe[]>(1);
	public shoesReplay$: Observable<Shoe[]> = this.shoesReplay.asObservable();

	private shoeItemReplay: ReplaySubject<Shoe> = new ReplaySubject<Shoe>(1);
	public shoeItemReplay$: Observable<Shoe> = this.shoeItemReplay.asObservable();

	form: FormGroup = new FormGroup({
		id: new FormControl(null),
		title: new FormControl(''),
		price: new FormControl(''),
		image: new FormControl(null),
		//userName: new FormControl(''),
		imagePath: new FormControl('default-image.png'),
		description: new FormControl(''),
		category: new FormControl('Shoe'),
		subCategory: new FormControl(''),
		userId: new FormControl(null)
	});

	constructor(private http: HttpClient) { }

	initializeFormGroup() {
		this.form.setValue({
			id: null,
			title: '',
			price: '',
			image: null,
			// userName: '',
			imagePath: '',
			description: '',
			category: 'Shoe',
			subCategory: '',
			userId: null
		});
	}

	public getShoes(): Observable<Shoe[]> {
		return this.http.get<Shoe[]>(this.baseUrl + '/shoes').pipe(tap(items => {
			this.shoesReplay.next(items);
		}));
	}

	getShoe(id: number): Observable<Shoe> {
		return this.http.get<Shoe>(this.baseUrl + '/shoes/' + id).pipe(tap(item => {
			this.shoeItemReplay.next(item);
		}));
	}

	postShoe(modelFormData: Shoe, fileToUpload: File) {
		const formData: FormData = new FormData;

		formData.append('title', modelFormData.title);
		formData.append('price', modelFormData.price);
		formData.append('description', modelFormData.description);
		formData.append('image', fileToUpload, fileToUpload.name);
		formData.append('imagePath', modelFormData.imagePath);
		formData.append('category', modelFormData.categoryId.toString());
		formData.append('userName', modelFormData.userName);
		formData.append('subCategory', modelFormData.subCategoryId.toString());

		return this.http.post(this.baseUrl + '/shoes', formData);
	}

	putShoe(modelFormData: Shoe, fileToUpload: File) {
		const formData: FormData = new FormData;

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

		return this.http.put(this.baseUrl + '/shoes/' + modelFormData.id, formData);
	}

	populateForm(shoe) {
		this.form.setValue(shoe);
	}

	deleteShoe(id: number) {
		return this.http.delete(this.baseUrl + '/shoes/' + id);
	}

	getShoeByUserName(userName: string): Observable<Shoe[]> {
		return this.http.get<Shoe[]>(this.baseUrl + '/shoes/username/' + userName);
	}

	refreshList() {
		this.http.get(this.baseUrl + '/shoes').toPromise().then(res => {
			this.list = res as Shoe[];
		});
	}
}
