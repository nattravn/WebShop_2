/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProductDialogService } from './product-dialog.service';

describe('Service: Product', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ProductDialogService],
		});
	});

	it('should ...', inject([ProductDialogService], (service: ProductDialogService) => {
		expect(service).toBeTruthy();
	}));
});
