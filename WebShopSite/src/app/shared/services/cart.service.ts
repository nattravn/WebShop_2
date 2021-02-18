import { Injectable } from '@angular/core';
import { Record } from '../models/record.model';

interface cart {
    record: Record[];
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    cartList: cart = {
        record: [
            {
                id: 0,
                band: '',
                description: '',
                album: '',
                year: '',
                genre: '',
                image: null,
                imagePath: '',
                title: '',
                price: '',
                categoryId: null,
                subCategoryId: null,
                userId: null,
                categoryName: ''
            }
        ]
    };
    cartListSize = 0;
    constructor() {}

    addItemToCart(item) {
        this.cartList.record.push(item);
        this.cartListSize++;
    }
}
