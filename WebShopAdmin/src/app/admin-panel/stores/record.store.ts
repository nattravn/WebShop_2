import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from 'src/environments/environment';

import { ToastrService } from 'ngx-toastr';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ProductTable } from '@admin-panel/models/product-table.model';
import { RecordModel } from '@admin-panel/models/record.model';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class RecordStore {
	public readonly baseUrl = environment.baseUrl;

	public imageRootPath = `${this.baseUrl}/Images/original/default-image.png`;

	private recordsReplay: ReplaySubject<ProductTable> = new ReplaySubject<ProductTable>(1);

	private filterReplay: ReplaySubject<string> = new ReplaySubject<string>(1);

	private recordItemReplay: ReplaySubject<RecordModel> = new ReplaySubject<RecordModel>(1);

	constructor(
		private http: HttpClient,
		private toastr: ToastrService,
	) {
		this.filterReplay.next('');
		this.refreshList();
	}

	public postRecord(modelFormData: RecordModel, fileToUpload: File): Observable<RecordModel> {
		const formData: FormData = new FormData();

		formData.append('band', modelFormData.band);
		formData.append('album', modelFormData.album);
		formData.append('releaseDate', modelFormData.releaseDate.toDateString());
		formData.append('genre', modelFormData.genre);

		if (fileToUpload) {
			formData.append('image', fileToUpload, fileToUpload.name);
		}

		formData.append('imagePath', modelFormData.imagePath);
		formData.append('title', modelFormData.title);
		formData.append('price', JSON.stringify(modelFormData.price));
		formData.append('description', modelFormData.description);
		formData.append('categoryId', JSON.stringify(0));
		formData.append('subCategoryId', JSON.stringify(0));
		formData.append('editorUserId', modelFormData.editorUserId);
		formData.append('creatorUserId', modelFormData.creatorUserId);

		return this.http.post<RecordModel>(`${this.baseUrl}/Records`, formData).pipe(
			tap(() => {
				this.toastr.success('inserted successfully', 'EMP. Register');
			}),
		);
	}

	public putRecord(modelFormData: RecordModel, fileToUpload: File): Observable<RecordModel> {
		const formData: FormData = new FormData();
		formData.append('band', modelFormData.band);
		formData.append('id', JSON.stringify(modelFormData.id));
		formData.append('album', modelFormData.album);
		formData.append('releaseDate', modelFormData.releaseDate.toDateString());
		formData.append('genre', modelFormData.genre);
		if (fileToUpload != null) {
			formData.append('image', fileToUpload, fileToUpload.name);
		}

		formData.append('imagePath', modelFormData.imagePath);

		formData.append('description', modelFormData.description);
		formData.append('title', modelFormData.title);
		formData.append('price', JSON.stringify(modelFormData.price));
		formData.append('categoryId', JSON.stringify(modelFormData.categoryId));
		formData.append('subCategoryId', JSON.stringify(modelFormData.subCategoryId));
		formData.append('editorUserId', modelFormData.editorUserId);

		return this.http.put<RecordModel>(`${this.baseUrl}/Records/${modelFormData.id}`, formData).pipe(
			tap(() => {
				this.toastr.info('updated successfully', 'EMP. Register');
			}),
		);
	}

	public deleteRecord(row: any) {
		return this.http.delete(`${this.baseUrl}/${row.categoryName}/${row.id}`);
	}

	public getProducts(
		route: string,
		limit: number,
		page: number,
		active: string,
		direction: string,
		keyWord: String,
	): Observable<ProductTable> {
		return this.http
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
				tap((items) => this.recordsReplay.next(items)),
				catchError((error) => {
					console.error('Error: ', error);
					return of(null);
				}),
			);
	}

	public getRecord(id: number): Observable<RecordModel> {
		return this.http.get<RecordModel>(`${this.baseUrl}/Records/${id}`).pipe(
			tap((item) => this.recordItemReplay.next(item)),
			catchError((error) => {
				console.error('Error: ', error);
				return of(null);
			}),
		);
	}

	public getRecordsByKeyWord(keyWord: string) {
		const params: URLSearchParams = new URLSearchParams();
		params.set('band', keyWord);

		return this.http
			.get<RecordModel>(`${this.baseUrl}/Records/`, {
				params: {
					searchQuery: keyWord,
				},
			})
			.pipe(
				tap((item) => this.recordItemReplay.next(item)),
				catchError((error) => {
					console.error('Error: ', error);
					return of(null);
				}),
			);
	}

	public getRecordByUserName(userName: string): Observable<RecordModel[]> {
		return this.http.get<RecordModel[]>(`${this.baseUrl}/Records/username/${userName}`);
	}

	public refreshList(): Observable<RecordModel[]> {
		return this.http.get<RecordModel[]>(`${this.baseUrl}/Records`);
	}

	// private errorHandler(error) {
	// 	let errorMessage = '';
	// 	if (error.error instanceof ErrorEvent) {
	// 		// Get client-side error
	// 		errorMessage = error.error.message;
	// 	} else {
	// 		// Get server-side error
	// 		errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
	// 	}
	// 	console.log(errorMessage);
	// 	return throwError(errorMessage);
	// }
}
