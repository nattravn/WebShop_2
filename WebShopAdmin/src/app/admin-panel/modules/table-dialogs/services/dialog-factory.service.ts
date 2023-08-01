import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogData } from 'src/app/admin-panel/models/dialog-data.model';
import { DialogOptions } from 'src/app/admin-panel/models/dialog-options.model';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, tap } from 'rxjs/operators';

import { DialogComponent } from '../dialog/dialog.component';
// Services
import { DialogService } from './dialog.service';

@UntilDestroy()
// https://dev.to/codegram/playing-with-dialogs-and-ng-templates-8pf
@Injectable()
export class DialogFactoryService<T = undefined> {
	constructor(
		private dialog: MatDialog,
		private activatedRoute: ActivatedRoute,
		private _location: Location,
	) {}

	public open(dialogData: DialogData, options: DialogOptions = { width: 700, disableClose: false }): DialogService {
		const dialogRef = this.dialog.open<DialogComponent, DialogData>(DialogComponent, {
			...this.fetchOptions(options),
			hasBackdrop: true,
			data: dialogData,
		});

		dialogRef
			.afterClosed()
			.pipe(
				untilDestroyed(this),
				switchMap(() =>
					this.activatedRoute.paramMap.pipe(
						tap((paramMap) => {
							console.log('afterClosed', paramMap);
							// this.router.navigate(['adminpanel/tables/products/'+paramMap.get('product'), {outlets: {tablesOutlet: null}}]);
							this._location.back();
						}),
					),
				),
			)
			.subscribe(() => {
				console.log('cloooose');
			});

		return new DialogService(dialogRef);
	}

	private fetchOptions({ width, disableClose }: DialogOptions): Pick<MatDialogConfig<DialogData>, 'width' | 'disableClose'> {
		return {
			width: `${width}px`,
			disableClose,
		};
	}
}
