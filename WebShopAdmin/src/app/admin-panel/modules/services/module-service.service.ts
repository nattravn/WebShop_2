import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ModuleService {

	public productData$ = new ReplaySubject<any>(1);

	constructor() { }

}
