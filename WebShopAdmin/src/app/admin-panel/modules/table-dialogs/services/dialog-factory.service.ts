import { Injectable, OnDestroy } from '@angular/core';

import { first, tap } from 'rxjs/operators';

import { ModalWrapperComponent } from '../modal-wrapper.component';

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
				data: dialogData
			}
		);

		dialogRef.afterClosed().pipe(
			untilDestroyed(this),
			first(),
			tap(() => {

				this.router.navigate(['../', { outlets: { tablesOutlet: null } }]);
				//this.router.navigate([ { outlets: { tablesOutlet: null } }]);
				//this.router.navigateByUrl('adminpanel/tables/products/'+dialogData.category.route);
				//this.router.navigate(['adminpanel/tables/products/'+dialogData.category.route+'/modal',{ outlets: { tablesOutlet: null } }]);
				//this.router.navigate(['adminpanel/tables/products/'+dialogData.category.route]).then(() =>
				//this.router.navigate([".", { outlets: { tablesOutlet: null } }]));
				//this.activatedRoute.snapshot.routeConfig.children[0].path = "";
		})).subscribe();

		return new DialogService(dialogRef);
	}

	private fetchOptions({width,disableClose}: DialogOptions): Pick<MatDialogConfig<DialogData>,'width' | 'disableClose'> {
		return {
			width: `${width}px`,
			disableClose
		};
	}
}
