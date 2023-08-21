import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminCategoryEnum } from '@admin-panel/enums/adminCategory.enum';

import { CategoryTableComponent } from './category-table/category-table.component';
import { DatabaseTableContainerComponent } from './database-tables-container.component';
import { ProductTableComponent } from './product-table/product-table.component';
import { UserTableComponent } from './user-table/user-table.component';

const routes: Routes = [
	{
		path: '',
		component: DatabaseTableContainerComponent,
		children: [
			{
				path: 'products/:product',
				component: ProductTableComponent,
				children: [
					{
						path: 'modal', // flytta till separata modal routes, inte child routes
						loadChildren: () => import('../table-dialogs/base-modal.module').then((m) => m.BaseModalModule),
					},
				],
			},
			// {
			// 	path: 'products',
			// 	component: ProductTableComponent,
			// 	children: [
			// 		{
			// 			path: '', // flytta till separata modal routes, inte child routes
			// 			outlet: 'tablesOutlet',
			// 			pathMatch: 'full',
			// 			loadChildren: () => import('../table-dialogs/base-modal.module').then((m) => m.BaseModalModule),
			// 		},
			// 	],
			// },
			{
				path: `users/:${AdminCategoryEnum.user}`,
				component: UserTableComponent,
				children: [
					{
						path: 'modal',
						// outlet: 'tablesOutlet',
						loadChildren: () => import('../table-dialogs/base-modal.module').then((m) => m.BaseModalModule),
					},
				],
			},
			{
				path: `categories/:${AdminCategoryEnum.category}`,
				component: CategoryTableComponent,
				children: [
					{
						path: 'modal',
						// outlet: 'tablesOutlet',
						loadChildren: () => import('../table-dialogs/base-modal.module').then((m) => m.BaseModalModule),
					},
				],
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CategoryTableRoutes {}
