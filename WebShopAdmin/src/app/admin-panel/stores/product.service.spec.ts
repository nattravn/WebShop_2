/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProductStore } from './product.store';

describe('Service: Product', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ProductStore],
		});
	});

	it('should ...', inject([ProductStore], (service: ProductStore) => {
		expect(service).toBeTruthy();
	}));
});
