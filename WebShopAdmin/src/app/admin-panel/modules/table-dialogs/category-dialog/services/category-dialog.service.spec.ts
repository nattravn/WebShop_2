/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { CategoryDialogService } from './category-dialog.service';

describe('Service: CategoryDialog', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CategoryDialogService]
		});
	});

	it('should ...', inject([CategoryDialogService], (service: CategoryDialogService) => {
		expect(service).toBeTruthy();
	}));
});
