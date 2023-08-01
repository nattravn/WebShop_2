import { TestBed } from '@angular/core/testing';

import { ShoeStore } from './shoe.store';

describe('shoeStore', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: ShoeStore = TestBed.get(ShoeStore);
		expect(service).toBeTruthy();
	});
});
