import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductTableComponent } from './product-table/product-table.component';
import { CategoryTableComponent } from './category-table/category-table.component';
import { UserTableComponent } from './user-table/user-table.component';
import { AdminCategoryEnum } from '../../enums/AdminCategory.enum';
import { DatabaseTableContainerComponent } from './database-table-container.component';

const routes: Routes = [
	{
		path: '',
		component: DatabaseTableContainerComponent,
		children: [
			{ 	path: 'products/:product',
				component: ProductTableComponent,
				children: [
					{
						path: 'modal',   //flytta till separata modal routes, inte child routes
						children:[{
							path: ':product/modal',
							outlet: 'tablesOutlet',
							loadChildren: () => import('../table-dialogs/modal-wrapper.module').then(m => m.ModalWrapperModule)
						}]
					}
				]
			},
			{ 	path: 'users/:'+AdminCategoryEnum.User,
				component: UserTableComponent,
				children: [
					{
						path: ':'+AdminCategoryEnum.User+'/modal',
						outlet: 'tablesOutlet',
						loadChildren: () => import('../table-dialogs/modal-wrapper.module').then(m => m.ModalWrapperModule)
					}
				]
			},
			{	path: 'categories/:'+AdminCategoryEnum.Category,
				component: CategoryTableComponent,
				children: [
					{
						path: 'modal',
						outlet: 'tablesOutlet',
						loadChildren: () => import('../table-dialogs/modal-wrapper.module').then(m => m.ModalWrapperModule)
					}
				]
			},
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class CategoryTableRoutes { }


