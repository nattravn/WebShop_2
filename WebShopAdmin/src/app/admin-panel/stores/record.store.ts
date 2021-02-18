import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';
import { tap, catchError } from 'rxjs/operators';
import { Observable, Subject, throwError, ReplaySubject, of } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Record } from '../models/record.model';
import { environment } from 'src/environments/environment';

@UntilDestroy()
@Injectable({
	providedIn: 'root'
})
export class RecordStore implements OnDestroy {
	activeRoute: Subject<boolean> = new Subject<boolean>();
	list: Record[];
	filter: string;
	readonly baseUrl = environment.baseUrl;
	public imageRootPath = this.baseUrl + '/Images/original/default-image.png';
	private recordsReplay: ReplaySubject<Record[]> = new ReplaySubject<Record[]>(1);
	public recordsReplay$: Observable<Record[]> = this.recordsReplay.asObservable();

	private recordItemReplay: ReplaySubject<Record> = new ReplaySubject<Record>(1);
	public recordItemReplay$: Observable<Record> = this.recordItemReplay.asObservable();

	private filterReplay: ReplaySubject<string> = new ReplaySubject<string>(1);
	public filterReplay$: Observable<string> = this.filterReplay.asObservable();

	constructor(private http: HttpClient, private toastr: ToastrService) {

		this.filterReplay.next('');
		this.refreshList();
	}
	ngOnDestroy(): void {
		throw new Error("Method not implemented.");
	}

	// initializeFormGroup() {
	//     this.form.setValue({
	//         id: null,
	//         album: '',
	//         band: '',
	//         title: '',
	//         year: '',
	//         genre: '',
	//         price: '',
	//         imagePath: '',
	//         description: '',
	//         categoryId: '',
	//         subCategoryId: '',
	//         userId: null,
	//         categoryName: 'Record'
	//     });
	// }

	postRecord(modelFormData: Record, fileToUpload: File): Observable<Object> {
		const formData: FormData = new FormData();

		formData.append('band', modelFormData.band);
		formData.append('album', modelFormData.album);
		formData.append('year', modelFormData.year);
		formData.append('genre', modelFormData.genre);
		formData.append('image', fileToUpload, fileToUpload.name);
		formData.append('imagePath', modelFormData.imagePath);
		formData.append('title', modelFormData.title);
		formData.append('price', modelFormData.price);
		formData.append('description', modelFormData.description);
		formData.append('categoryId', '0');
		formData.append('subCategoryId', '0');

		return this.http.post(this.baseUrl + '/Records', formData).pipe(tap(() => {
			this.toastr.success('inserted successfully', 'EMP. Register');
		}));
	}

	putRecord(modelFormData: any, fileToUpload: File): Observable<Object> {
		const formData: FormData = new FormData();
		formData.append('band', modelFormData.band);
		formData.append('id', JSON.stringify(modelFormData.id));
		formData.append('album', modelFormData.album);
		formData.append('year', modelFormData.year);
		formData.append('genre', modelFormData.genre);
		if (fileToUpload != null) {
			formData.append('image', fileToUpload, fileToUpload.name);
		}

		formData.append('imagePath', modelFormData.imagePath);

		formData.append('description', modelFormData.description);
		formData.append('title', modelFormData.title);
		formData.append('price', modelFormData.price);
		formData.append('categoryId', JSON.stringify(modelFormData.categoryId));
		formData.append('subCategoryId', JSON.stringify(modelFormData.subCategoryId));

		var body = {
			band: modelFormData.band,
			id: modelFormData.id,
			album: modelFormData.album,
			year: modelFormData.year
		};



		return this.http.put(this.baseUrl + '/Records/' + modelFormData.id, formData).pipe(tap(item => {
			this.toastr.info('updated successfully', 'EMP. Register');
		}));
	}

	deleteRecord(row: any) {
		console.log('row: ', row);
		return this.http.delete(this.baseUrl + '/' + row.categoryName + '/' + row.id);
	}

	getProducts(route: string): Observable<Record[]> {
		console.log('route: ', route);
		return this.http.get<Record[]>(this.baseUrl + '/'+route).pipe(
			untilDestroyed(this),
			tap(items => this.recordsReplay.next(items))
		);
	}

	getRecord(id: number): Observable<Record> {
		return this.http.get<Record>(this.baseUrl + '/Records/' + id).pipe(
			tap(item => this.recordItemReplay.next(item)),
			catchError(error => {
				return of(null);
			})
		);
	}

	getRecordByUserName(userName: string): Observable<Record[]> {
		return this.http.get<Record[]>(
			this.baseUrl + '/Records/username/' + userName
		);
	}

	refreshList(): Observable<Record[]> {
		return this.http.get<Record[]>(this.baseUrl + '/Records');
	}

	errorHandler(error) {
		let errorMessage = '';
		if (error.error instanceof ErrorEvent) {
			// Get client-side error
			errorMessage = error.error.message;
		} else {
			// Get server-side error
			errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
		}
		console.log(errorMessage);
		return throwError(errorMessage);
	}
}
