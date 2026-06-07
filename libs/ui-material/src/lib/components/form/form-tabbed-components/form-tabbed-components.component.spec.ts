import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormTabbedComponentsComponent } from './form-tabbed-components.component';

describe('FormTabbedComponentsComponent', () => {
  let component: FormTabbedComponentsComponent;
  let fixture: ComponentFixture<FormTabbedComponentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormTabbedComponentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormTabbedComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
