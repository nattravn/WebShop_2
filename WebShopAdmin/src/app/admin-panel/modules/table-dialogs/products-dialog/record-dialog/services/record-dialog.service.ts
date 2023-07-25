import { Injectable, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RecordStore } from 'src/app/admin-panel/stores/record.store';
import { Record } from 'src/app/admin-panel/models/record.model';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryStore } from '../../../../../stores/category.store';
import { Category } from '../../../../../models/category.model';
import { shareReplay } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable()
export class RecordDialogService implements OnDestroy{


	public imgSrcReplay = new ReplaySubject<string>(1);
	public imgSrcReplay$ = this.imgSrcReplay.asObservable();

	public imageRootPath = environment.baseUrl + '/Images/original/';

	public defaultimageRootPath = environment.baseUrl + '/Images/original/default-image.png';

	public category$ = new Observable<Category>();

	constructor(private categoryStore: CategoryStore) {
		//this.form.reset();
	}

	ngOnDestroy(): void { }


}
