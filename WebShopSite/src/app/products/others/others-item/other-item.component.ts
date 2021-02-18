import { Component, OnInit, Input } from '@angular/core';
import { RecordStore } from 'src/app/shared/stores/record.store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-other-item',
  templateUrl: './other-item.component.html',
  styleUrls: ['./other-item.component.css']
})
export class OtherItemComponent implements OnInit {

  @Input() record: any;
  public imageRootPath = environment.baseUrl + '/Images/40/';

  constructor() {}

  ngOnInit() {

  }
}
