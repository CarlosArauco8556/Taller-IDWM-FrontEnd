import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductsPageComponent } from './add-products-page.component';

describe('AddProductsPageComponent', () => {
  let component: AddProductsPageComponent;
  let fixture: ComponentFixture<AddProductsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
