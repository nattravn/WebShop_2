import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-record-item',
  templateUrl: './record-item.component.html',
  styleUrls: ['./record-item.component.css']
})
export class RecordItemComponent implements OnInit {

  @Input() record: any;
  public imageRootPath = environment.baseUrl + '/Images/original/';

  constructor(public cartService: CartService) {}

  ngOnInit() {

  }
}
