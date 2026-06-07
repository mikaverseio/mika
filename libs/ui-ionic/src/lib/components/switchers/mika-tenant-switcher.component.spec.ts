import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MikaTenantSwitcherComponent } from './mika-tenant-switcher.component';

describe('MikaTenantSwitcherComponent', () => {
  let component: MikaTenantSwitcherComponent;
  let fixture: ComponentFixture<MikaTenantSwitcherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MikaTenantSwitcherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MikaTenantSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
