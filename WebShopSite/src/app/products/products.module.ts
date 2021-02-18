import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RecordDetailsComponent } from './records/record-details/record-details.component';
import { ProductsRoutingModule } from './products.routing';
import { ProductFilterPipe } from '../pipe/product-filter.pipe';
import { RecordsComponent } from './records/records.component';
import { ClothingsComponent } from './clothings/clothings.component';
import { ClothingItemComponent } from './clothings/clothing-item/clothing-item.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
import { ShoesComponent } from './shoes/shoes.component';
import { OthersComponent } from './others/others.component';
import { ShoeItemComponent } from './shoes/shoe-item/shoe-item.component';
import { RecordItemComponent } from './records/record-item/record-item.component';
import { ShoeDetailsComponent } from './shoes/shoe-details/shoe-details.component';
import { ClothingDetailsComponent } from './clothings/clothing-details/clothing-details.component';


@NgModule({
    imports: [
        CommonModule,
        ProductsRoutingModule,
        NgxPaginationModule,
        OrderModule
    ],
    declarations: [
        ProductsComponent,
        RecordDetailsComponent,
        RecordsComponent,
        RecordItemComponent,
        ClothingsComponent,
        ClothingItemComponent,
        ProductFilterPipe,
        ShoesComponent,
        ShoeItemComponent,
        ShoeDetailsComponent,
        OthersComponent,
        ClothingDetailsComponent
    ]
})
export class ProductsModule { }
