/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { CategoryTableService } from './category-table.service';

describe('Service: CategoryList', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CategoryTableService]
		});
	});

	it('should ...', inject([CategoryTableService], (service: CategoryTableService) => {
		expect(service).toBeTruthy();
	}));
});
