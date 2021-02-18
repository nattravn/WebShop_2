/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { RecordService } from './record.service';

describe('Service: Record', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecordService]
    });
  });

  it('should ...', inject([RecordService], (service: RecordService) => {
    expect(service).toBeTruthy();
  }));
});
