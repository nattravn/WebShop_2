import { Component } from "@angular/core";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})

/**
 * Role Based Authorization
 * https://www.youtube.com/watch?v=MGCC2zTb0t4
 * User Registration
 * https://www.youtube.com/watch?v=9WVG-tXl7XA
 * Login and Logout
 * https://www.youtube.com/watch?v=s2zJ_g-iQvg
 * Database migration, connection strings
 * https://www.youtube.com/watch?v=AHqIrJ_PlPY
 */
export class AppComponent {
	public onVisibleChange($event: any) {
		throw new Error("Method not implemented.");
	}
	public onSelect($event: any) {
		throw new Error("Method not implemented.");
	}
	public onLeftClick() {
		throw new Error("Method not implemented.");
	}
	public title = "WebShopAdmin";
}
