import { Injectable } from '@angular/core';
import { RecordStore } from '../stores/record.store';
import { ClothingStore } from '../stores/clothing.store';
import { ShoeStore } from '../stores/shoe.store';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  list;
  constructor(private recordService: RecordStore,
    private clothingStore: ClothingStore,
    private shoeStore: ShoeStore) {
    console.log('this.list ', this.list);
    // this.populate(0);
  }

  // populate(id: number){
  //   this.recordService.getRecords().subscribe(res => {
  //     this.list = res;
  //   })

  // }

  // populateShoes(){
  //   this.shoeStore.getShoe().then(res => {
  //     this.list = res;
  //   })
  // }

  // populateRecords(){
  //   this.recordService.getRecords().subscribe(res => {
  //     this.list = res;
  //   })
  // }

  // populateClothing(){
  //   this.clothingStore.getClothing().then(res => {
  //     this.list = res;
  //   })
  // }
}
