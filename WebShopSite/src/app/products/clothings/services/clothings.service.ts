import { Injectable, OnDestroy } from '@angular/core';
import { ClothingStore } from 'src/app/shared/stores/clothing.store';
import { tap } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { Clothing } from 'src/app/shared/models/clothing.model';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Injectable()
export class ClothingsService implements OnDestroy {

    public clothingsReplay = new ReplaySubject<Clothing[]>(1);
    public clothingReplay = new ReplaySubject<Clothing>(1);

    /**
     * Constructor
     * @param clothingStore clothingStore
     */
    constructor(private clothingStore: ClothingStore) { }
    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }

    public getClothings() {
        this.clothingStore.getClothings().pipe(
            untilDestroyed(this),
            tap(items => this.clothingsReplay.next(items))
        ).subscribe();
    }

    public getClothing(clothingId: number) {
        this.clothingStore.getClothing(clothingId).pipe(
            untilDestroyed(this),
            tap(item => this.clothingReplay.next(item))
        ).subscribe();
    }
}
