import { TestBed } from '@angular/core/testing';

import { RecordStore } from './record.store';

describe('RecordService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: RecordStore = TestBed.get(RecordStore);
		expect(service).toBeTruthy();
	});
});
