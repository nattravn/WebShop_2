import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecordsComponent } from './records/records.component';
import { ProductsComponent } from './products.component';
import { RecordDetailsComponent } from './records/record-details/record-details.component';
import { OthersComponent } from './others/others.component';
import { ShoesComponent } from './shoes/shoes.component';
import { ShoeDetailsComponent } from './shoes/shoe-details/shoe-details.component';
import { ClothingsComponent } from './clothings/clothings.component';
import { ClothingDetailsComponent } from './clothings/clothing-details/clothing-details.component';

const routes: Routes = [
    { path: '', component: ProductsComponent},
    { path: 'records/filter/:subCategoryId', component: RecordsComponent},
    { path: 'record/:recordId', component: RecordDetailsComponent},
    { path: 'records', component: RecordsComponent},
    { path: 'shoe/:shoeId', component: ShoeDetailsComponent},
    { path: 'shoes/filter/:subCategoryId', component: ShoesComponent},
    { path: 'shoes', component: ShoesComponent},
    { path: 'clothings/filter/:subCategoryId', component: ClothingsComponent},
    { path: 'clothing/:clothingId', component: ClothingDetailsComponent},
    { path: 'clothings', component: ClothingsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductsRoutingModule {}
