import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MikaBulkActionToolbarComponent } from './mika-bulk-action-toolbar.component';

describe('MikaBulkActionToolbarComponent', () => {
  let component: MikaBulkActionToolbarComponent;
  let fixture: ComponentFixture<MikaBulkActionToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MikaBulkActionToolbarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MikaBulkActionToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
