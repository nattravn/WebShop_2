import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPanelComponent } from './admin-panel.component';
import { AdminRoutingModule } from './admin-panel.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

import { MatExpansionModule } from '@angular/material/expansion';
import { CdkTableModule } from '@angular/cdk/table';

import { ProductTableService } from './modules/database-tables/product-table/services/product-table.service';
import { CategoryTableService } from './modules/database-tables/category-table/services/category-table.service';
import { CategoryDialogService } from './modules/table-dialogs/category-dialog/services/category-dialog.service';
import { CategoryDropdownComponent } from './modules/table-dialogs/products-dialog/category-dropdown/category-dropdown.component';

import { CategoryDialogComponent } from './modules/table-dialogs/category-dialog/category-dialog.component';
import { BaseModalComponent } from './modules/table-dialogs/base-modal.component';
import { CategoryStore } from './stores/category.store';
import { CategoryNamePipe } from './pipe/category-name.pipe';

import { CategoryTablesModule } from './modules/database-tables/category-table.module';
import { RecordDialogService } from './modules/table-dialogs/products-dialog/record-dialog/services/record-dialog.service';

@NgModule({
  declarations: [AdminPanelComponent, CategoryNamePipe],

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
export class AdminPanelModule { }
