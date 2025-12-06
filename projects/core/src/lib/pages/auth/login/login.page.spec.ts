import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MikaLoginPage } from './login.page';


describe('LoginPage', () => {
  let component: MikaLoginPage;
  let fixture: ComponentFixture<MikaLoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MikaLoginPage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(MikaLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
