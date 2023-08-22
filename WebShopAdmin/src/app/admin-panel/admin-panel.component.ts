import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { AuthService } from '@app/log-in/auth/services/auth.service';
import { ProductTableService } from '@database-tables/product-table/services/product-table.service';

import { CategoryStore } from '../admin-panel/stores/category.store';
import { AdminCategoryRoutesEnum } from './enums/adminCategoryRoutes.enum';
import { Category } from './models/category.model';

@Component({
	selector: 'app-admin-panel',
	templateUrl: './admin-panel.component.html',
	styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent {
	public adminCategoryEnum = AdminCategoryRoutesEnum;

	public categories$ = new Observable<Category[]>();

	constructor(
		public categoryStore: CategoryStore,
		public router: Router,
		public recordTableService: ProductTableService,
		private authService: AuthService,
	) {
		this.categories$ = this.categoryStore.getCategories().pipe(shareReplay(1));
	}

	public categoryRoute(category) {
		console.log('change route');

		// Ta det i två svep, först reseta outlet sen navigera ny route, går inte att göra det i samma
		// setTimeout(()=>{
		// 	this.router.navigate(['adminpanel/tables/products/'+category.route, { outlets: { tablesOutlet: null }}], {replaceUrl:true});
		// });
		// https://stackoverflow.com/questions/40983055/how-to-reload-the-current-route-with-the-angular-2-router
		this.router
			.navigateByUrl('/', { skipLocationChange: true })
			.then(() => this.router.navigate(['adminpanel/tables/products', category.route]));

		// this.router.navigate(['adminpanel/tables/products/'+category.route+'/', repla }]);
		// this.router.navigate([ { outlets: { secondary: null } }]);

		// this.recordTableService.refreshMatTable(category.route,5,1,'band','asc','',null)
	}

	public logout() {
		this.authService.logout();
		this.router.navigateByUrl('/login');
	}
}
