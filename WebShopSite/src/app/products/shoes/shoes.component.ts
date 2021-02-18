import { Component, OnInit } from '@angular/core';
import { ShoeStore } from 'src/app/shared/stores/shoe.store';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';
import { ProductService } from '../services/product.service';

@Component({
    selector: 'app-shoes',
    templateUrl: './shoes.component.html',
    styleUrls: ['./shoes.component.scss']
})
export class ShoesComponent implements OnInit {
    public order = 'Name';

    config: any = {
        itemsPerPage: 5,
        currentPage: 1,
        totalItems: 0
    };

    public imageRootPath = environment.baseUrl + '/Images/40/';

    /**
     * Constructor
     * @param shoeStore shoeStore
     * @param productService productService
     */
    constructor(
        public shoeStore: ShoeStore,
        public productService: ProductService
    ) {}

    ngOnInit() {
        this.shoeStore.getShoes().subscribe();
    }

    pageChanged(event) {
        this.config.currentPage = event;
    }
}
