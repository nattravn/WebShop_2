import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';

import { UserDetailsPipe } from '@admin-panel/pipe/user-details.pipe';

import { BaseModalComponent } from './base-modal.component';
import { BaseModalRoutingModule } from './base-modal.routing';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { DialogComponent } from './dialog/dialog.component';
import { CategoryDropdownComponent } from './products-dialog/category-dropdown/category-dropdown.component';
import { ClothingDialogComponent } from './products-dialog/clothing-dialog/clothing-dialog.component';
import { ProductDialogsComponent } from './products-dialog/product-dialogs.component';
import { RecordDialogComponent } from './products-dialog/record-dialog/record-dialog.component';
import { ShoeDialogFormComponent } from './products-dialog/shoe-dialog/shoe-dialog-form.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { PipeModuleModule } from '@admin-panel/pipe/pipe-module.module';

@NgModule({
	// eslint-disable-next-line prettier/prettier
	imports: [
		CommonModule,
		MaterialModule,
		ReactiveFormsModule,
		BaseModalRoutingModule,
		PipeModuleModule,
	],
	declarations: [
		DialogComponent,
		BaseModalComponent,
		RecordDialogComponent,
		CategoryDropdownComponent,
		ClothingDialogComponent,
		ShoeDialogFormComponent,
		CategoryDialogComponent,
		UserDetailsPipe,
		ProductDialogsComponent,
		UserDialogComponent,
	],
	// eslint-disable-next-line prettier/prettier
	providers: [
		{ provide: MAT_DIALOG_DATA, useValue: {} },
		{ provide: MatDialogRef, useValue: {} },
	],
})
export class BaseModalModule {}
