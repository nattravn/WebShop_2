/* eslint-disable prettier/prettier */
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';

import { ToastrService } from 'ngx-toastr';

import { CategoryStore } from '@admin-panel/stores/category.store';
import { RecordStore } from '@admin-panel/stores/record.store';
import { UserStore } from '@admin-panel/stores/user.store';
import { DialogFactoryService } from '@table-dialogs/services/dialog-factory.service';

import { RecordDialogService } from '../table-dialogs/products-dialog/record-dialog/services/record-dialog.service';
import { CategoryTableComponent } from './category-table/category-table.component';
import { DatabaseTableContainerComponent } from './database-tables-container.component';
import { CategoryTableRoutes } from './database-tables.routing';
import { ProductTableComponent } from './product-table/product-table.component';
import { UserTableComponent } from './user-table/user-table.component';
import { ProductDialogService } from '@table-dialogs/products-dialog/services/product-dialog.service';
import { CustomDatePipe } from '@admin-panel/pipe/custom.datepipe';

@NgModule({
	imports: [
		CategoryTableRoutes,
		CommonModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		CdkTableModule,
		MatDialogModule,
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
		ProductDialogService,
		CustomDatePipe,
	],
})
export class DatabaseTablesModule {}
