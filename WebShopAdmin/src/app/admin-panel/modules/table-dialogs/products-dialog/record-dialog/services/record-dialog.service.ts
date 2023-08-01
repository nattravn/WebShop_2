import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable, ReplaySubject } from 'rxjs';

import { Category } from '@admin-panel/models/category.model';

@UntilDestroy()
@Injectable()
export class RecordDialogService {
	public imgSrcReplay = new ReplaySubject<string>(1);
	public imgSrcReplay$ = this.imgSrcReplay.asObservable();

	public imageRootPath = `${environment.baseUrl}/Images/original/`;

	public defaultimageRootPath = `${environment.baseUrl}/Images/original/default-image.png`;

	public category$ = new Observable<Category>();

	constructor() {}
}
