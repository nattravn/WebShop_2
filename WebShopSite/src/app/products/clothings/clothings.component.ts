import { Component, OnInit } from '@angular/core';
import { ClothingStore } from 'src/app/shared/stores/clothing.store';
import { Clothing } from 'src/app/shared/models/clothing.model';
import { CartService } from '../../shared/services/cart.service';
import { environment } from 'src/environments/environment';

import { SubCategoriesStore } from 'src/app/shared/stores/sub-categories.store';
import { ProductService } from '../services/product.service';

@Component({
    selector: 'app-clothings',
    templateUrl: './clothings.component.html',
    styles: []
})
export class ClothingsComponent implements OnInit {

    public order = 'Band';

    config: any = {
        itemsPerPage: 5,
        currentPage: 1,
        totalItems: 0
    };

    public imageRootPath = environment.baseUrl + '/Images/40/';

    constructor(
        public clothingStore: ClothingStore,
        public productService: ProductService,
    ) { }

    ngOnInit() {
        this.clothingStore.getClothings().subscribe();
    }

    pageChanged(event) {
        this.config.currentPage = event;
    }
}
