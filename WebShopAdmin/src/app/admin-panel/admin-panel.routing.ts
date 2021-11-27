import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { AuthGuard } from '../guard/auth.guard';

const routes: Routes = [
	{
		path: 'adminpanel',
		component: AdminPanelComponent,
		children: [
			{
				path: 'tables',
				loadChildren: () => import('./modules/database-tables/category-table.module').then(m => m.CategoryTablesModule)
			},
		],
		data : {permittedRoles: ['Admin']},
		canActivate: [AuthGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class AdminRoutingModule { }
