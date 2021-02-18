import { Injectable, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RecordStore } from 'src/app/admin-panel/stores/record.store';
import { Record } from 'src/app/admin-panel/models/record.model';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryStore } from '../../../../stores/category.store';
import { Category } from '../../../../models/category.model';
import { shareReplay } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable()
export class RecordDialogService implements OnDestroy{
	public form: FormGroup = new FormGroup({
		id: new FormControl(0),
		band: new FormControl(''),
		album: new FormControl(''),
		year: new FormControl(''),
		genre: new FormControl(''),
		description: new FormControl('', Validators.required),
		imagePath: new FormControl('default-image.png'),
		title: new FormControl(''),
		price: new FormControl(''),
		categoryId: new FormControl(null),
		subCategoryId: new FormControl(null),
		userId: new FormControl(null),
		categoryName: new FormControl(''),
	});

	public imgSrcReplay = new ReplaySubject<string>(1);
	public imgSrcReplay$ = this.imgSrcReplay.asObservable();

	public imageRootPath = environment.baseUrl + '/Images/original/';

	public defaultimageRootPath = environment.baseUrl + '/Images/original/default-image.png';

	public category$ = new Observable<Category>();

	constructor(private categoryStore: CategoryStore) {
		this.form.reset();
	}

	ngOnDestroy(): void { }

	populateForm(record: Record) {
		this.form.get('id').setValue(record.id);
		this.form.get('band').setValue(record.album);
		this.form.get('album').setValue(record.band);
		this.form.get('year').setValue(record.year);
		this.form.get('genre').setValue(record.genre);
		this.form.get('description').setValue(record.description);
		this.form.get('title').setValue(record.title);
		this.form.get('price').setValue(record.price);
		this.form.get('categoryId').setValue(record.categoryId);
		this.form.get('subCategoryId').setValue(record.subCategoryId);
		this.form.get('imagePath').setValue(record.imagePath);

		this.imgSrcReplay.next(this.imageRootPath + record.imagePath);

		this.category$ = this.categoryStore.getCategory(record.categoryId).pipe(untilDestroyed(this), shareReplay(1));
	}

	onClear() {
		this.form.reset();
		this.imgSrcReplay.next(this.defaultimageRootPath);
	}
}
