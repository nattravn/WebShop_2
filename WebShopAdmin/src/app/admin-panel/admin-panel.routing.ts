import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/guard/auth.guard';
import { AdminPanelComponent } from './admin-panel.component';

const routes: Routes = [
	{
		path: 'adminpanel',
		component: AdminPanelComponent,
		children: [
			{
				path: 'tables',
				loadChildren: () => import('./modules/database-tables/database-tables.module').then((m) => m.DatabaseTablesModule),
			},
		],
		data: { permittedRoles: ['Admin'] },
		canActivate: [AuthGuard],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AdminRoutingModule {}
