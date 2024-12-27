import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementProductsPageComponent } from './management-products-page.component';

describe('ManagementProductsPageComponent', () => {
  let component: ManagementProductsPageComponent;
  let fixture: ComponentFixture<ManagementProductsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementProductsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
