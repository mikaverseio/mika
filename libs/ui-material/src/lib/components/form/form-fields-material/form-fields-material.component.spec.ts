import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormFieldsMaterialComponent } from './form-fields-material.component';

describe('FormFieldsMaterialComponent', () => {
  let component: FormFieldsMaterialComponent;
  let fixture: ComponentFixture<FormFieldsMaterialComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormFieldsMaterialComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldsMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
