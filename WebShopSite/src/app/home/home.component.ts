import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserStore } from '../shared/stores/user.store';
import { RecordStore } from '../shared/stores/record.store';
import { ClothingStore } from '../shared/stores/clothing.store';
import { ShoeStore } from '../shared/stores/shoe.store';
import { Record } from 'src/app/shared/models/record.model';
import { HomeService } from '../shared/services/home.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  userDetails;
  displayedColumns: string[] = ['ID', 'Title', 'Price', 'Category', 'ImagePath'];
  listData = new MatTableDataSource<Record>();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  searchKey: string;
  list;

  constructor(private router: Router,
              private userStore: UserStore,
              private recordStore: RecordStore,
              private clothingStore: ClothingStore,
              private shoeStore: ShoeStore,
              private homeService: HomeService) {

  }

  ngOnInit() {




    // this.homeService.populate(0);
  }

  // populate(){
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

  details(id: number) {
   // var myurl = `record/${id}`;
   // this.router.navigateByUrl(myurl);
  }

}
