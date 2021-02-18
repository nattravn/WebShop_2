import { Injectable, OnDestroy } from '@angular/core';

import { tap } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { ShoeStore } from 'src/app/shared/stores/shoe.store';
import { Shoe } from 'src/app/shared/models/Shoe.model';

@Injectable()
export class ShoeService implements OnDestroy {

    public shoesReplay = new ReplaySubject<Shoe[]>(1);
    public shoeReplay = new ReplaySubject<Shoe>(1);

    /**
     * Constructor
     * @param shoeStore shoeStore
     */
    constructor(private shoeStore: ShoeStore) { }
    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }

    public getshoes() {
        this.shoeStore.getShoes().pipe(
            untilDestroyed(this),
            tap(items => this.shoesReplay.next(items))
        ).subscribe();
    }

    public getShoe(shoeId: number) {
        this.shoeStore.getShoe(shoeId).pipe(
            untilDestroyed(this),
            tap(item => this.shoeReplay.next(item))
        ).subscribe();
    }
}
