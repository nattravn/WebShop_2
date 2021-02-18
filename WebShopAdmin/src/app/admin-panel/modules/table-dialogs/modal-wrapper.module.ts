import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { ProductDialogsComponent } from './product-dialogs.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalWrapperRoutingModule } from './modal-wrapper.routing';
import { ModalWrapperComponent } from './modal-wrapper.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RecordDialogComponent } from './record-dialog/record-dialog.component';
import { DialogComponent } from './dialog/dialog.component';
import { CategoryDropdownComponent } from './category-dropdown/category-dropdown.component';
import { ClothingDialogComponent } from './clothing-dialog/clothing-dialog.component';
import { ShoeDialogFormComponent } from './shoe-dialog/shoe-dialog-form.component';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

@NgModule({
	imports: [
		CommonModule,
		MaterialModule,
		ReactiveFormsModule,
		ModalWrapperRoutingModule,
	],
	declarations: [
		ModalWrapperComponent,
		RecordDialogComponent,
		DialogComponent,
		CategoryDropdownComponent,
		ClothingDialogComponent,
		ShoeDialogFormComponent,
		CategoryDialogComponent,
	],
	providers: [
		{ provide: MAT_DIALOG_DATA, useValue: {} },
	],

})
export class ModalWrapperModule { }
