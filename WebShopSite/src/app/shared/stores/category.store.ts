import { Injectable, OnDestroy } from '@angular/core';
import { Category } from 'src/app/shared/models/category.model';
import { ReplaySubject, Observable, from, EMPTY, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, switchMap, catchError, map } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Injectable()
export class CategoryStore implements OnDestroy {
    private categoryReplay = new ReplaySubject<Category>(1);
    public categoryReplay$ = this.categoryReplay.asObservable();

    private categoriesReplay = new ReplaySubject<Category[]>(1);
    public categoriesReplay$ = this.categoriesReplay.asObservable();

    readonly rootURL = environment.baseUrl;
    showCategories = false;

    constructor(private http: HttpClient) {
        this.getCategories().subscribe();
    }
    ngOnDestroy(): void {}

    public getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.rootURL + '/Category').pipe(
            untilDestroyed(this),
            tap(items => this.categoriesReplay.next(items))
        );
    }

    public getCategory(categoryId): Observable<Category> {

        return this.http.get<Category>(this.rootURL + '/Category/' + categoryId).pipe(
            untilDestroyed(this),
            tap(item => this.categoryReplay.next(item)),
            catchError(error => {
                return of(null);
            })
        );
    }

    public postCategory(category: Category) {
        return this.http.post(this.rootURL + '/Category', category);
    }

    public putCategory(category: Category) {
        return this.http.put(this.rootURL + '/Category/' + category.id, category);
    }

    public deletCategory(id: number) {
        return this.http.delete(this.rootURL + '/Category/' + id);
    }

    public updateCategory(category: Category) {
        this.categoryReplay.next(category);
    }
}
