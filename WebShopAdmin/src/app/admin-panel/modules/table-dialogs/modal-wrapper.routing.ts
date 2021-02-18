import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModalWrapperComponent } from './modal-wrapper.component';
import { RecordDialogComponent } from './record-dialog/record-dialog.component';

const routes: Routes = [
	{
		path: '',
		component: ModalWrapperComponent,
	},
];

@NgModule(
	{
		imports: [RouterModule.forChild(routes)],
		exports: [RouterModule],
	},
)

export class ModalWrapperRoutingModule {}
