import { Component, OnInit, OnDestroy } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';
import { Shoe } from '../../../shared/models/shoe.model';
import { ShoeStore } from '../../../shared/stores/shoe.store';
import { environment } from 'src/environments/environment';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-shoe-details',
    templateUrl: './shoe-details.component.html',
    styles: []
})
export class ShoeDetailsComponent implements OnInit, OnDestroy {

    public imageRootPath = environment.baseUrl + '/images/original/';
    constructor(
        private route: ActivatedRoute,
        public shoeStore: ShoeStore
    ) {}

    ngOnInit() {
        this.route.params.pipe(
            untilDestroyed(this),
            switchMap(params => of(params)),
            switchMap(params => this.shoeStore.getShoe(params.shoeId))
        ).subscribe();
    }

    ngOnDestroy() {}
}
