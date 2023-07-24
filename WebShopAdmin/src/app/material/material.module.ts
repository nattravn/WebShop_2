import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
	imports: [
		CommonModule,
		MatToolbarModule,
		MatGridListModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatSelectModule,
		MatCheckboxModule,
		MatNativeDateModule,
		MatButtonModule,
		MatSnackBarModule,
		MatTableModule,
		MatIconModule,
		MatPaginatorModule,
		MatSortModule,
		MatDialogModule,
	],
	exports: [
		MatToolbarModule,
		MatGridListModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatCheckboxModule,
		MatNativeDateModule,
		MatButtonModule,
		MatSnackBarModule,
		MatTableModule,
		MatIconModule,
		MatPaginatorModule,
		MatSortModule,
		MatDialogModule,
		MatDatepickerModule
	],
	declarations: []
})
export class MaterialModule { }
