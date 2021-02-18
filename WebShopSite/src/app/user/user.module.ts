import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { MaterialModule } from '../material/material.module';
import { OrderModule } from 'ngx-order-pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoutes } from './user.routing';
import { LoginComponent } from './login/login.component';
import { CategoryStore } from '../shared/stores/category.store';
import { SharedModule } from '../shared/modules/shared/shared.module';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        OrderModule,
        UserRoutes,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [
        ProfileComponent,
        LoginComponent,
    ],
    providers: [
        CategoryStore
    ],
})
export class UserModule { }
