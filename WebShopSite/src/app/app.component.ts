import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserStore } from './shared/stores/user.store';
import { CartService } from './shared/services/cart.service';
import { RecordStore } from './shared/stores/record.store';
import { CategoryStore } from './shared/stores/category.store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { switchMap } from 'rxjs/operators';
import { SubCategoriesStore } from './shared/stores/sub-categories.store';
import { Category } from './shared/models/category.model';
import { SubCategory } from './shared/models/sub-category.model';
import { ProductService } from './products/services/product.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {

    title = 'AngularAuth7';
    loginStatus = 'Log out';

    config: any;
    panelOpenState = false;

    show = true;
    constructor(
        private router: Router,
        private userStore: UserStore,
        public recordStore: RecordStore,
        private cartService: CartService,
        public categoryStore: CategoryStore,
        public subCategoriesStore: SubCategoriesStore,
        private productService: ProductService
    ) { }
    ngOnDestroy(): void { }

    ngOnInit() {
        this.categoryStore.getCategories().subscribe();
    }

    toggleBody() {
        this.show = !this.show;
    }

    onLogout() {
        localStorage.removeItem('token');
        this.router.navigate(['/user/login']);
        this.userStore.userStatus = 'Log in';
    }

    getState() {
        return this.show ? 'expanded' : 'collapsed';
    }

    public showSelectedProducts(category: Category, subCategory: SubCategory) {
        if (subCategory) {
            this.router.navigate(['./products/' + category.route  + '/filter/' +  subCategory.id], {replaceUrl: true});
            this.productService.setSubCategory(subCategory.id, category.name);
        } else {
            this.router.navigate(['./products/' + category.route], {replaceUrl: true});
            this.productService.setSubCategory(null, category.name);
        }
    }
}
