import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-product-lists',
	templateUrl: './database-table-container.component.html',
	styleUrls: ['./database-table-container.component.css'],

})
export class DatabaseTableContainerComponent {

	constructor(private route: Router,
		private router: ActivatedRoute ) {}

	opemModal(){

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
