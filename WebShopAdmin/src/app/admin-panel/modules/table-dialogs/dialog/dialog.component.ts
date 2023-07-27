import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, ActivationStart, Router, RouterOutlet } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AdminCategoryEnum } from 'src/app/admin-panel/enums/AdminCategory.enum';
import { Category } from 'src/app/admin-panel/models/category.model';
import { DialogData } from 'src/app/admin-panel/models/dialog-data.model';
import { CategoryStore } from 'src/app/admin-panel/stores/category.store';
import { DialogService } from '../services/dialog.service';

@UntilDestroy()
@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit{

	public categoryEnum = AdminCategoryEnum;


	@ViewChild(RouterOutlet) outlet: RouterOutlet;

	dialogService: DialogService;

	paramMapProduct$: Observable<any>;

	/**
	 * Initializes the component.
	 *
	 * @param dialogRef - A reference to the dialog opened.
	 */
	constructor(
		public dialogRef: MatDialogRef<DialogComponent>,
		public categoryStore: CategoryStore,
		@Inject(MAT_DIALOG_DATA)
		public data: DialogData,
		public router: Router,
		public activatedRoute: ActivatedRoute
	) { }

	ngOnInit(): void {
		console.log('data.template: ', this.data.category.name);
		console.log('this.activatedRoute: ', this.activatedRoute);

		this.activatedRoute.data.subscribe(data => {
			console.log('data: ', data)
		})

		this.activatedRoute.params.subscribe(params => {
			console.log('params: ', params)
		})

		this.activatedRoute.paramMap.subscribe(paramMap => {
			console.log('paramMap: ', paramMap)
		})
	}

	public onDeactivate(event) {
		console.log('onDeactivate: ', event);

	}

	ngOnDestroy(): void {

	}

	onClose() {
		this.dialogRef.close();

		console.log("this.activatedRoute: ", this.activatedRoute.snapshot)

		//this.dialogService.close();

		// this.paramMapProduct$ = this.activatedRoute.paramMap.pipe(
		// 	take(1),
		// 	untilDestroyed(this),
		// 	tap( paramMap => {
		// 		this.router.navigate(['adminpanel/tables/products/'+paramMap.get('product')]);

		// 	})
		// )
	}
}
