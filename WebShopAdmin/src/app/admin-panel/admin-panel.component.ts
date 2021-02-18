import { Component, OnInit } from '@angular/core';
import { CategoryStore } from '../admin-panel/stores/category.store';

import { Router } from '@angular/router';
import { AdminCategoryEnum } from './enums/AdminCategory.enum';
import { AuthService } from '../log-in/auth/services/auth.service';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Category } from './models/category.model';
import { RecordTableService } from './modules/database-tables/product-table/services/record-table.service';

@Component({
	selector: 'app-admin-panel',
	templateUrl: './admin-panel.component.html',
	styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

	public AdminCategoryEnum = AdminCategoryEnum;
	public categories$ = new Observable<Category[]>();

	constructor(
		public categoryStore: CategoryStore,
		public router: Router,
		public recordTableService: RecordTableService,
		private authService: AuthService
	) {
		this.categories$ = this.categoryStore.getCategories().pipe(shareReplay(1));
	}

	ngOnInit() {
	}

	loggaIn(){

	}

	logout() {
		this.authService.logout();
		this.router.navigateByUrl('/login');
	}

}
