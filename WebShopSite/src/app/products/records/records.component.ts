import { Component, OnInit } from '@angular/core';
import { RecordStore } from '../../shared/stores/record.store';
import { ProductService } from '../services/product.service';

@Component({
    selector: 'app-records',
    templateUrl: './records.component.html',
    styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {

    public order = 'Band';

    config: any = {
        itemsPerPage: 5,
        currentPage: 1,
        totalItems: 0
    };

    constructor(
        public recordStore: RecordStore,
        public productService: ProductService ) { }

    ngOnInit() {
        this.recordStore.getRecords().subscribe();
    }

    pageChanged(event) {
        this.config.currentPage = event;
    }
}
