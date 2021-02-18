import { Component, OnInit } from '@angular/core';

import { ProductService } from './services/product.service';
import { CategoryEnum } from './enum/category.enum';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

    public CategoryEnum = CategoryEnum;
    constructor(
        public productService: ProductService
    ) {}

    ngOnInit() {}
}
