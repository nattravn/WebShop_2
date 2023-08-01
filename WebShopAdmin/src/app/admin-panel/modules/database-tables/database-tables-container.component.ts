import { Component } from '@angular/core';

@Component({
	selector: 'app-product-lists',
	templateUrl: './database-tables-container.component.html',
	styleUrls: ['./database-tables-container.component.css'],
})
export class DatabaseTableContainerComponent {
	constructor() {}

	public openModal() {
		// this.router.firstChild.paramMap.subscribe( paramMap => {
		// 	console.log('this.router: ', paramMap);
		// 	if(paramMap.get('product')){
		// 		this.route.navigate(['adminpanel/tables/products/'+paramMap.get('product'),{outlets: {tablesOutlet: 'modal'}}]);
		// 	}
		// 	else if(paramMap.get('user')){
		// 		this.route.navigate(['adminpanel/tables/users/'+paramMap.get('user'),{outlets: {tablesOutlet: 'modal'}}]);
		// 	}
		// 	else if(paramMap.get('category')){
		// 		this.route.navigate(['adminpanel/tables/categories/'+paramMap.get('category'),{outlets: {tablesOutlet: 'modal'}}]);
		// 	}
		// })
	}
}
