import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MikaPrintExportModalComponent } from './mika-print-export-modal.component';

describe('MikaPrintExportModalComponent', () => {
  let component: MikaPrintExportModalComponent;
  let fixture: ComponentFixture<MikaPrintExportModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MikaPrintExportModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MikaPrintExportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
