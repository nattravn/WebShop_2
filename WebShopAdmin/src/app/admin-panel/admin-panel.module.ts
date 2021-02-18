import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPanelComponent } from './admin-panel.component';
import { AdminRoutingModule } from './admin-panel.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

import { MatExpansionModule } from '@angular/material/expansion';
import { CdkTableModule } from '@angular/cdk/table';

import { RecordDialogService } from './modules/table-dialogs/record-dialog/services/record-dialog.service';
import { RecordTableService } from './modules/database-tables/product-table/services/record-table.service';
import { CategoryTableService } from './modules/database-tables/category-table/services/category-table.service';
import { CategoryDialogService } from './modules/table-dialogs/category-dialog/services/category-dialog.service';
import { CategoryDropdownComponent } from './modules/table-dialogs/category-dropdown/category-dropdown.component';
import { RecordDialogComponent } from './modules/table-dialogs/record-dialog/record-dialog.component';
import { ClothingDialogComponent } from './modules/table-dialogs/clothing-dialog/clothing-dialog.component';
import { CategoryDialogComponent } from './modules/table-dialogs/category-dialog/category-dialog.component';
import { ModalWrapperComponent } from './modules/table-dialogs/modal-wrapper.component';
import { CategoryStore } from './stores/category.store';
import { CategoryNamePipe } from './pipe/category-name.pipe';
import { ShoeDialogFormComponent } from './modules/table-dialogs/shoe-dialog/shoe-dialog-form.component';
import { CategoryTablesModule } from './modules/database-tables/database-table.module';

@NgModule({
	declarations: [
		AdminPanelComponent,
		CategoryNamePipe,
	],

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
		RecordTableService,
		CategoryTableService,
		CategoryDialogService,
		ModalWrapperComponent
	],

})

export class AdminPanelModule { }
