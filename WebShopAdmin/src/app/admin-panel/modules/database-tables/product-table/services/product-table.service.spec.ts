/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { ProductTableService } from './product-table.service';

describe('Service: RecordList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductTableService]
    });
  });

  it('should ...', inject([ProductTableService], (service: ProductTableService) => {
    expect(service).toBeTruthy();
  }));
});
