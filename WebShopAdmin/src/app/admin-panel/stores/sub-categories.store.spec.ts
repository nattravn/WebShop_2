/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { SubCategoriesStore } from './sub-categories.store';

describe('Service: SubCategories', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubCategoriesStore]
    });
  });

  it('should ...', inject([SubCategoriesStore], (service: SubCategoriesStore) => {
    expect(service).toBeTruthy();
  }));
});
