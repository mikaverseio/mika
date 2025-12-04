import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MikaTenantSwitcherComponent } from './mika-tenant-switcher.component';

describe('MikaTenantSwitcherComponent', () => {
  let component: MikaTenantSwitcherComponent;
  let fixture: ComponentFixture<MikaTenantSwitcherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MikaTenantSwitcherComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MikaTenantSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
