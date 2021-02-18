/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { RecordTableService } from './record-table.service';

describe('Service: RecordList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecordTableService]
    });
  });

  it('should ...', inject([RecordTableService], (service: RecordTableService) => {
    expect(service).toBeTruthy();
  }));
});
