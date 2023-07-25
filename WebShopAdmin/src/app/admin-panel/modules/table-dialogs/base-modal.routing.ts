import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseModalComponent } from './base-modal.component';

const routes: Routes = [
	{
		path: '',
		component: BaseModalComponent
	},
];

@NgModule(
	{
		imports: [RouterModule.forChild(routes)],
		exports: [RouterModule],
	},
)

export class BaseModalRoutingModule {}
