import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { UserStore } from './shared/stores/user.store';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { SafePipe } from './pipe/pipe.component';
import { RecordStore } from './shared/stores/record.store';

import { HomeService } from './shared/services/home.service';
import { RecordsFilterPipe } from './records-filter.pipe';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';


const EXPANSION_PANEL_ANIMATION_TIMING = '500ms cubic-bezier(0.4,0.0,0.2,1)';

import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

import { ProductsModule } from './products/products.module';
import { CategoryStore } from './shared/stores/category.store';
import { SubCategoriesStore } from './shared/stores/sub-categories.store';
import { ProductService } from './products/services/product.service';


MatExpansionPanel['decorators'][0].args[0].animations = [
    trigger('bodyExpansion', [
        state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
        state('expanded', style({ height: '*', visibility: 'visible' })),
        transition('expanded <=> collapsed, void => collapsed',
            animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ])];


@NgModule({
    declarations: [
        AppComponent,
        UserComponent,
        HomeComponent,
        ForbiddenComponent,
        SafePipe,
        RecordsFilterPipe,
    ],
    imports: [
        BrowserModule,
        NgxPaginationModule,
        MaterialModule,
        AppRoutingModule,
        MatExpansionModule,
        ReactiveFormsModule,
        HttpClientModule,
        ProductsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            progressBar: true
        }),
        FormsModule,
        OrderModule,

    ],

    exports: [
        MaterialModule
    ],
    providers: [
        UserStore, {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        RecordStore,
        HomeService,
        ProductService,
        CategoryStore,
        SubCategoriesStore,
    ],
    bootstrap: [AppComponent],

})
export class AppModule { }
