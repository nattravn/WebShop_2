import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Shoe } from 'src/app/shared/models/shoe.model';
import { ShoeStore } from 'src/app/shared/stores/shoe.store';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
    selector: 'app-shoe-item',
    templateUrl: './shoe-item.component.html',
    styleUrls: ['./shoe-item.component.css']
})
export class ShoeItemComponent implements OnInit {
    @Input() shoe: Shoe;
    order = 'Band';

    public showItemDetails = false;
    public imageRootPath = environment.baseUrl + '/Images/original/';
    constructor(public shoeStore: ShoeStore, public cartService: CartService) {}

    ngOnInit() {}
}
