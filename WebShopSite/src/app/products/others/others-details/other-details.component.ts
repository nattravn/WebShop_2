import { Component, OnInit } from '@angular/core';
import { Record } from '../../../shared/models/record.model';
import { RecordStore } from 'src/app/shared/stores/record.store';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/shared/services/home.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-other-details',
    templateUrl: './other-details.component.html',
    styles: []
})
export class OtherDetailsComponent implements OnInit {

    public imageRootPath = environment.baseUrl + '/images/original/';

    constructor(private route: ActivatedRoute, private recordService: RecordStore, private homeService: HomeService) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.recordService.getRecord(params.recordId);
        });

    }
}
