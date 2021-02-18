import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../shared/services/home.service';
import { RecordStore } from '../../shared/stores/record.store';
import { CartService } from '../../shared/services/cart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-other',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.css']
})
export class OthersComponent implements OnInit {
  order = 'Band';

  config: any = {
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0
  };

  constructor(private recordService: RecordStore) {
    // this.recordService.getRecords().subscribe(res => {

    //   this.config = {
    //     itemsPerPage: 5,
    //     currentPage: 1,
    //     totalItems: res.length
    //   };
    // });
  }

  ngOnInit() {

  }

  pageChanged(event) {
    this.config.currentPage = event;
  }
}
