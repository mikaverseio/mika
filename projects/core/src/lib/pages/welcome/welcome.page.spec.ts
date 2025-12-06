import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MikaWelcomePage } from './welcome.page';

describe('DashboardPage', () => {
  let component: MikaWelcomePage;
  let fixture: ComponentFixture<MikaWelcomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MikaWelcomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
