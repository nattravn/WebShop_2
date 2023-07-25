import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DialogData } from 'src/app/admin-panel/models/dialog-data.model';

@Component({
	selector: 'app-user-dialog',
	templateUrl: './user-dialog.component.html',
	styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {

	public categoryChange$: BehaviorSubject<string> = new BehaviorSubject<string>('');

	constructor(
		private activatedRoute: ActivatedRoute,

	) { }

	ngOnInit() {
		// this.activatedRoute.paramMap.subscribe(params => {
		// 	console.log('params.get(product):', params.get('product'));
		// 	//this.categoryChange.name=params.get('product');
		// 	this.categoryChange$.next(this.data.category.name);
		// });
	}

}
