import { Injectable, OnDestroy } from '@angular/core';

import { tap } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { RecordStore } from 'src/app/shared/stores/Record.store';
import { Record } from 'src/app/shared/models/Record.model';

@Injectable()
export class RecordService implements OnDestroy {

    public recordsReplay = new ReplaySubject<Record[]>(1);
    public recordReplay = new ReplaySubject<Record>(1);

    constructor(private recordStore: RecordStore) { }
    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }

    public getRecords() {
        this.recordStore.getRecords().pipe(
            untilDestroyed(this),
            tap(items => this.recordsReplay.next(items))
        ).subscribe();
    }

    public getRecord(recordId: number) {
        this.recordStore.getRecord(recordId).pipe(
            untilDestroyed(this),
            tap(item => this.recordReplay.next(item))
        ).subscribe();
    }
}
