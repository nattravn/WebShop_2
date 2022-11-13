import { Injectable, OnDestroy } from '@angular/core';

import { first, switchMap, tap } from 'rxjs/operators';

// Services
import { DialogService } from './dialog.service';
import { DialogData } from 'src/app/admin-panel/models/dialog-data.model';
import { DialogOptions } from 'src/app/admin-panel/models/dialog-options.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
// https://dev.to/codegram/playing-with-dialogs-and-ng-templates-8pf
@Injectable()
export class DialogFactoryService<T = undefined> implements OnDestroy{

	constructor(
		private dialog: MatDialog,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) { }
	ngOnDestroy(): void {}

	public open(
		dialogData: DialogData,
		options: DialogOptions = { width: 700, disableClose: false }
	): DialogService {
		const dialogRef = this.dialog.open<DialogComponent, DialogData>(
			DialogComponent,
			{
				...this.fetchOptions(options),
				hasBackdrop: true,
				data: dialogData
			}
		);

		dialogRef.afterClosed().pipe(
			untilDestroyed(this),
			switchMap(() => this.activatedRoute.paramMap.pipe(
				tap( paramMap => {
					console.log('afterClosed')
					this.router.navigate(['adminpanel/tables/products/'+paramMap.get('product'), {outlets: {tablesOutlet: null}}]);
				})
			))
		).subscribe(() => {
			console.log('cloooose');
		});


		return new DialogService(dialogRef, this.activatedRoute, this.router);
	}

	private fetchOptions({width,disableClose}: DialogOptions): Pick<MatDialogConfig<DialogData>,'width' | 'disableClose'> {
		return {
			width: `${width}px`,
			disableClose
		};
	}
}
