import { TestBed } from '@angular/core/testing';

import { PurchaseUserServiceService } from './purchase-user-service.service';

describe('PurchaseUserServiceService', () => {
  let service: PurchaseUserServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseUserServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
