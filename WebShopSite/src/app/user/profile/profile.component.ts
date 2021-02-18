import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserStore } from '../../shared/stores/user.store';
import { CartService } from '../../shared/services/cart.service';
import { RecordStore } from '../../shared/stores/record.store';
import { ClothingStore } from '../../shared/stores/clothing.store';
import { Route, Router } from '@angular/router';

import { Record } from 'src/app/shared/models/record.model';
import { environment } from 'src/environments/environment';
import { CategoryStore } from 'src/app/shared/stores/category.store';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
    userItems: Record[] = [];
    userDialogTemplate: TemplateRef<any>;
    order = '';
    public imageRootPath = environment.baseUrl + '/Images/40/';

    constructor(
        public userStore: UserStore,
        private cartService: CartService,
        private recordService: RecordStore,
        private clothingStore: ClothingStore,

        private dialog: MatDialog,
        private router: Router,
        private categoryStore: CategoryStore
    ) {}

    ngOnInit() {}

    onCreate() {
        this.categoryStore.showCategories = true;
        this.recordService.imageRootPath =
            this.imageRootPath + 'default-image.png';
        this.clothingStore.imageRootPath =
            this.imageRootPath + 'default-image.png';

        this.clothingStore.initializeFormGroup();
    }
}
