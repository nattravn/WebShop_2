import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { ProductDialogsComponent } from './product-dialogs.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseModalRoutingModule } from './base-modal.routing';
import { BaseModalComponent } from './base-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogComponent } from './dialog/dialog.component';
import { CategoryDropdownComponent } from './products-dialog/category-dropdown/category-dropdown.component';

import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { CustomDatePipe } from '../../pipe/custom.datepipe';
import { RecordDialogComponent } from './products-dialog/record-dialog/record-dialog.component';
import { ClothingDialogComponent } from './products-dialog/clothing-dialog/clothing-dialog.component';
import { ShoeDialogFormComponent } from './products-dialog/shoe-dialog/shoe-dialog-form.component';
import { ProductDialogsComponent } from './products-dialog/product-dialogs.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@NgModule({
	imports: [
		CommonModule,
		MaterialModule,
		ReactiveFormsModule,
		BaseModalRoutingModule
	],
	declarations: [
		DialogComponent,
		BaseModalComponent,
		RecordDialogComponent,
		CategoryDropdownComponent,
		ClothingDialogComponent,
		ShoeDialogFormComponent,
		CategoryDialogComponent,
		CustomDatePipe,
		ProductDialogsComponent,
		UserDialogComponent
	],
	providers: [
		{ provide: MAT_DIALOG_DATA, useValue: {} },
		{ provide: MatDialogRef, useValue: {} },
	],

})
export class BaseModalModule { }
