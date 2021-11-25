import { Injectable, OnDestroy } from '@angular/core';

import { ReplaySubject, of, Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatTableDataSource } from '@angular/material/table';

import { environment } from 'src/environments/environment';
import { RecordStore } from '../../../../stores/record.store';
import { Record } from '../../../../models/record.model';
import { filter, finalize, map, shareReplay, switchMap } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';

@UntilDestroy()
@Injectable()
export class RecordTableService implements OnDestroy {

	public tableData$ = new Observable<MatTableDataSource<Record>>();
	public dataSource = new MatTableDataSource<Record>();

	private eventUrl = '';

	constructor(
		private recordStore: RecordStore,
		private router: Router,
		private route: ActivatedRoute
	) {

		const eventUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);

		// this.route.data.subscribe(v => console.log('v: ', v))

		// this.route.queryParams.subscribe(v => console.log('v: ', v))
		// this.route.params.subscribe(v => console.log('v: ', v))
		// this.route.paramMap.subscribe(v => console.log('v: ', v))

		// this.route.events.pipe(
		// 	filter(event => event instanceof NavigationStart)
		// ).subscribe((event:NavigationStart) => {
		// 		console.log('event: ', event);
		// 	this.eventUrl = event.url.substring(event.url.lastIndexOf('/') + 1);
		// 	this.refreshMatTable();
		// });


		this.refreshMatTable(eventUrl);
	}

	ngOnDestroy(): void { }

	refreshMatTable(productString: string): Observable<MatTableDataSource<Record>> {

		return this.tableData$ = this.recordStore.getProducts(productString).pipe(
			switchMap(records => {
				this.dataSource.data = records;
				return of(this.dataSource);
			}),
			untilDestroyed(this),
			shareReplay(1),
		)
	}

}
