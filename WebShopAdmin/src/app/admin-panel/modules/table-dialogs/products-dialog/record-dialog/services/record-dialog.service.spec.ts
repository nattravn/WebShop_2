/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { RecordDialogService } from './record-dialog.service';

describe('Service: Record', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [RecordDialogService],
		});
	});

	it('should ...', inject([RecordDialogService], (service: RecordDialogService) => {
		expect(service).toBeTruthy();
	}));
});
