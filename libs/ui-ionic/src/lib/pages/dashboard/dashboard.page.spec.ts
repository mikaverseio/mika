import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MikaDashboardPage } from './dashboard.page';

describe('DashboardPage', () => {
  let component: MikaDashboardPage;
  let fixture: ComponentFixture<MikaDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MikaDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
