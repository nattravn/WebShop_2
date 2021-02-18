import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class ProductService {

    public categoryReplay$ = new ReplaySubject<string>(1);
    public subCategoryReplay$ = new ReplaySubject<number>(1);

    constructor() {}

    setSubCategory(subCategory: number, categoryName: string) {
        if (subCategory) {
            this.subCategoryReplay$.next(subCategory);
        } else {
            this.categoryReplay$.next(categoryName);
            // We always have pipe filters in the template which subscribing on this observable.
            // Therefor we need to broadcast subCategoryReplay with null.
            this.subCategoryReplay$.next(null);
        }
    }
}
