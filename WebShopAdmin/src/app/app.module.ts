import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { ToastrModule } from "ngx-toastr";

import { AdminPanelModule } from "@admin-panel/admin-panel.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthInterceptor } from "./guard/auth.interceptor";
import { AuthComponent } from "./log-in/auth/auth.component";

@NgModule({
	declarations: [AppComponent, AuthComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
		AdminPanelModule,
		HttpClientModule,
		ToastrModule.forRoot({
			timeOut: 2000,
			positionClass: "toast-top-right",
		}),
		FormsModule,
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
