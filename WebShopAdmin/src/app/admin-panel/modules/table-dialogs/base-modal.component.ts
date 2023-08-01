import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
/**
 * A common component rendered as a Material dialog
 */
@Component({
	selector: 'app-dialog',
	styleUrls: ['./base-modal.component.css'],
	templateUrl: './base-modal.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseModalComponent implements OnInit {
	/**
	 * Initializes the component.
	 * @param dialogRef - A reference to the dialog opened.
	 */
	constructor() {}

	ngOnInit(): void {
		console.log('BaseModalModule loaded');
	}
}
