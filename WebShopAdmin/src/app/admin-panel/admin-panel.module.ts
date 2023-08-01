import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';

import { MaterialModule } from '../material/material.module';
import { AdminPanelComponent } from './admin-panel.component';
import { AdminRoutingModule } from './admin-panel.routing';
import { CategoryTableService } from './modules/database-tables/category-table/services/category-table.service';
import { ProductTableService } from './modules/database-tables/product-table/services/product-table.service';
import { BaseModalComponent } from './modules/table-dialogs/base-modal.component';
import { CategoryDialogService } from './modules/table-dialogs/category-dialog/services/category-dialog.service';
import { RecordDialogService } from './modules/table-dialogs/products-dialog/record-dialog/services/record-dialog.service';
import { CategoryNamePipe } from './pipe/category-name.pipe';
import { CategoryStore } from './stores/category.store';
import { AddUserComponent } from './add-user/add-user.component';

@NgModule({
	declarations: [AdminPanelComponent, CategoryNamePipe, AddUserComponent],

	imports: [
		AdminRoutingModule,
		CommonModule,
		ReactiveFormsModule,
		MaterialModule,
		FormsModule,
		CdkTableModule,
		MatExpansionModule,
	],

	providers: [
		CategoryStore,
		RecordDialogService,
		ProductTableService,
		CategoryTableService,
		CategoryDialogService,
		BaseModalComponent,
	],
})
export class AdminPanelModule {}
