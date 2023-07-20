import { Injectable, OnDestroy } from '@angular/core';

import { ReplaySubject, of, Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatTableDataSource } from '@angular/material/table';

import { environment } from 'src/environments/environment';
import { RecordStore } from '../../../../stores/record.store';
import { Record } from '../../../../models/record.model';
import { filter, finalize, map, shareReplay, switchMap } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Clothing } from 'src/app/admin-panel/models/clothing.model';

@UntilDestroy()
@Injectable()
export class ProductTableService implements OnDestroy {

	public tableData$ = new Observable<{items: MatTableDataSource<Record | Clothing>, totalItems: number}>();
	public dataSource = new MatTableDataSource<Record | Clothing>();

	private eventUrl = '';

	public initPageLimit = 5;

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


		//this.refreshMatTable(eventUrl,5,1);
	}

	ngOnDestroy(): void { }

	refreshMatTable(productString: string, pageLimit: number = null, page: number = null): Observable<{items: MatTableDataSource<Record | Clothing>, totalItems: number}> {
		this.tableData$ = this.recordStore.getProducts(productString,pageLimit,page,'band', 'asc').pipe(
			untilDestroyed(this),
			switchMap(records => {
				this.dataSource.data = records.items;


				console.log('records.Items: ', records);
				return of({items: this.dataSource, totalItems: records.totalItems});
			}),
			shareReplay(1),
		)

		return this.tableData$;
	}

}
