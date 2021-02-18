import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RecordStore } from '../../../shared/stores/record.store';
import { environment } from 'src/environments/environment';

import { switchMap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { of } from 'rxjs';

@Component({
    selector: 'app-record-details',
    templateUrl: './record-details.component.html',
})
export class RecordDetailsComponent implements OnInit, OnDestroy {

    public imageRootPath = environment.baseUrl + '/images/original/';
    constructor(
        private route: ActivatedRoute,
        private recordStore: RecordStore
    ) {}

    ngOnInit() {
        this.route.params.pipe(
            untilDestroyed(this),
            switchMap(params => of(params)),
            switchMap(params => this.recordStore.getRecord(params.recordId))
        ).subscribe();
    }

    ngOnDestroy(): void {}
}
