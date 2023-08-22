/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { ShoeDialogFormService } from './shoe-dialog-form.service';

describe('Service: ShoeDialogForm', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ShoeDialogFormService],
		});
	});

	it('should ...', inject([ShoeDialogFormService], (service: ShoeDialogFormService) => {
		expect(service).toBeTruthy();
	}));
});
