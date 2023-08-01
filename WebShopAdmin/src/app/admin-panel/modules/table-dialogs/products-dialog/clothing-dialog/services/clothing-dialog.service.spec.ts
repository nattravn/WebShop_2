/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { ClothingService } from './clothing-dialog.service';

describe('Service: Clothing', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ClothingService],
		});
	});

	it('should ...', inject([ClothingService], (service: ClothingService) => {
		expect(service).toBeTruthy();
	}));
});
