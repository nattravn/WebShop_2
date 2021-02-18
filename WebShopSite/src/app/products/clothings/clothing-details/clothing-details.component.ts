import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Clothing } from 'src/app/shared/models/clothing.model';
import { ClothingStore } from 'src/app/shared/stores/clothing.store';
import { environment } from 'src/environments/environment';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-clothing-details',
    templateUrl: './clothing-details.component.html',
    styles: []
})
export class ClothingDetailsComponent implements OnInit, OnDestroy {

    clothing: Clothing;
    public imageRootPath = environment.baseUrl + '/images/original/';
    constructor(
        private route: ActivatedRoute,
        private clothingStore: ClothingStore
    ) {}

    ngOnInit() {
        this.route.params.pipe(
            untilDestroyed(this),
            switchMap(params => of(params)),
            switchMap(params => this.clothingStore.getClothing(params.clothingId))
        ).subscribe();
    }
    ngOnDestroy(): void {}
}
