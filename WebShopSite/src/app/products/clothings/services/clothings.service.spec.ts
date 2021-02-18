/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClothingsService } from './clothings.service';

describe('Service: Clothings', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClothingsService]
    });
  });

  it('should ...', inject([ClothingsService], (service: ClothingsService) => {
    expect(service).toBeTruthy();
  }));
});
