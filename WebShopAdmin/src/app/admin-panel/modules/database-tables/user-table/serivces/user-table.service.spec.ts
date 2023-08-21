/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserTableService } from './user-table.service';

describe('Service: UserTable', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserTableService]
    });
  });

  it('should ...', inject([UserTableService], (service: UserTableService) => {
    expect(service).toBeTruthy();
  }));
});
