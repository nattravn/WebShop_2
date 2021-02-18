/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ShoeService } from './shoe.service';

describe('Service: Shoe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShoeService]
    });
  });

  it('should ...', inject([ShoeService], (service: ShoeService) => {
    expect(service).toBeTruthy();
  }));
});
