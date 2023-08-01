import { Component } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'app-user-dialog',
	templateUrl: './user-dialog.component.html',
	styleUrls: ['./user-dialog.component.css'],
})
export class UserDialogComponent {
	public categoryChange$: BehaviorSubject<string> = new BehaviorSubject<string>('');

	constructor() {}
}
