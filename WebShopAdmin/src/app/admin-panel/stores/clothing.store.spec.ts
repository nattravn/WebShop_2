import { TestBed } from '@angular/core/testing';

import { ClothingStore } from './clothing.store';

describe('clothingStore', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: ClothingStore = TestBed.get(ClothingStore);
		expect(service).toBeTruthy();
	});
});
