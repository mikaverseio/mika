import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MikaContainerComponent } from './mika-container.component';

describe('MikaContainerComponent', () => {
  let component: MikaContainerComponent;
  let fixture: ComponentFixture<MikaContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MikaContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MikaContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
