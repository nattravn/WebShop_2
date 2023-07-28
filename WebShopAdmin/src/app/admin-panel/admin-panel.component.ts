import { Component, OnInit } from "@angular/core";
import { CategoryStore } from "../admin-panel/stores/category.store";

import { ActivatedRoute, Router } from "@angular/router";
import { AdminCategoryEnum } from "./enums/AdminCategory.enum";
import { AuthService } from "../log-in/auth/services/auth.service";
import { shareReplay } from "rxjs/operators";
import { Observable } from "rxjs";
import { Category } from "./models/category.model";
import { ProductTableService } from "./modules/database-tables/product-table/services/product-table.service";

@Component({
	selector: "app-admin-panel",
	templateUrl: "./admin-panel.component.html",
	styleUrls: ["./admin-panel.component.scss"],
})
export class AdminPanelComponent implements OnInit {
	public AdminCategoryEnum = AdminCategoryEnum;

	public categories$ = new Observable<Category[]>();

	constructor(
		public categoryStore: CategoryStore,
		public router: Router,
		public recordTableService: ProductTableService,
		private activatedRoute: ActivatedRoute,
		private authService: AuthService,
	) {
		this.categories$ = this.categoryStore.getCategories().pipe(shareReplay(1));
	}

	ngOnInit() {}

	loggaIn() {}

	categoryRoute(category) {
		console.log("change route");

		// Ta det i två svep, först reseta outlet sen navigera ny route, går inte att göra det i samma
		// setTimeout(()=>{
		// 	this.router.navigate(['adminpanel/tables/products/'+category.route, { outlets: { tablesOutlet: null }}], {replaceUrl:true});
		// });
		// https://stackoverflow.com/questions/40983055/how-to-reload-the-current-route-with-the-angular-2-router
		this.router
			.navigateByUrl("/", { skipLocationChange: true })
			.then(() => this.router.navigate(["adminpanel/tables/products", category.route]));

		//this.router.navigate(['adminpanel/tables/products/'+category.route+'/', repla }]);
		//this.router.navigate([ { outlets: { secondary: null } }]);

		//this.recordTableService.refreshMatTable(category.route,5,1,'band','asc','',null)
	}

	logout() {
		this.authService.logout();
		this.router.navigateByUrl("/login");
	}
}
