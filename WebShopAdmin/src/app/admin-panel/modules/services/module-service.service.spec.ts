/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ModuleService } from './module-service.service';

describe('Service: ModuleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModuleService]
    });
  });

  it('should ...', inject([ModuleService], (service: ModuleService) => {
    expect(service).toBeTruthy();
  }));
});
