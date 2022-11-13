import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminPanelModule } from './admin-panel/admin-panel.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthComponent } from './log-in/auth/auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './guard/auth.interceptor';

@NgModule({
	declarations: [
		AppComponent,
		AuthComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
		AdminPanelModule,
		HttpClientModule,
		ToastrModule.forRoot({
			timeOut: 2000,
			positionClass: 'toast-top-right'
		}),
	],
	providers: [
		{
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
