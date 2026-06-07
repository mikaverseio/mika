import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MikaTableHeaderComponent } from './mika-table-header.component';

describe('MikaTableHeaderComponent', () => {
  let component: MikaTableHeaderComponent;
  let fixture: ComponentFixture<MikaTableHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MikaTableHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MikaTableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
