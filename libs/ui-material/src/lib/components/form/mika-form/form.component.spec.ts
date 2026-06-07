import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MikaFormComponent } from './form.component';

describe('FormComponent', () => {
  let component: MikaFormComponent;
  let fixture: ComponentFixture<MikaFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MikaFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MikaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
