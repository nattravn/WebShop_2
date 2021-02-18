import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';


import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
    ],

    declarations: [
        SharedComponent,
    ],

    entryComponents: [],

    exports: [
        SharedComponent,
    ]

})
export class SharedModule {}
