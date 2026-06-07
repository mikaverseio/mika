import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MikaIntroComponent } from './mika-intro.component';

describe('MikaIntroComponent', () => {
  let component: MikaIntroComponent;
  let fixture: ComponentFixture<MikaIntroComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MikaIntroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MikaIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
