import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductTableComponent } from './product-table/product-table.component';
import { UserTableComponent } from './user-table/user-table.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { CategoryTableRoutes } from './category-table.routing';
import { DatabaseTableContainerComponent } from './category-table-container.component';
import { RecordStore } from '../../stores/record.store';
import { RecordDialogService } from '../table-dialogs/record-dialog/services/record-dialog.service';
import { CategoryStore } from '../../stores/category.store';
import { DialogFactoryService } from '../table-dialogs/services/dialog-factory.service';
import { ProductTableService } from './product-table/services/product-table.service';
import { UserStore } from '../../stores/user.store';
import { ToastrService } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/guard/auth.interceptor';
import { CategoryTableComponent } from './category-table/category-table.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



@NgModule({
	imports: [
		CategoryTableRoutes,
		CommonModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		CdkTableModule,
		MatDialogModule
	],
	declarations: [
		DatabaseTableContainerComponent,
		CategoryTableComponent,
		ProductTableComponent,
		UserTableComponent,
	],
	exports: [
		DatabaseTableContainerComponent,
		CategoryTableComponent,
		ProductTableComponent,
		UserTableComponent,
	],
	providers: [
		RecordStore,
		UserStore,
		RecordDialogService,
		ToastrService,
		CategoryStore,
		DialogFactoryService,
	],

})
export class CategoryTablesModule { }
