import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
    selector: 'app-clothing-item',
    templateUrl: './clothing-item.component.html',
    styleUrls: ['./clothing-item.component.css']
})
export class ClothingItemComponent implements OnInit {
    @Input() clothing: any;
    public imageRootPath = environment.baseUrl + '/images/original/';
    constructor(public cartService: CartService) {}

    ngOnInit() {}
}
