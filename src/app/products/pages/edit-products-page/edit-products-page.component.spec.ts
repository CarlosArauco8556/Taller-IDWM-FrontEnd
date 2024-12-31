import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductsPageComponent } from './edit-products-page.component';

describe('EditProductsPageComponent', () => {
  let component: EditProductsPageComponent;
  let fixture: ComponentFixture<EditProductsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProductsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
