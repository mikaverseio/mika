import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MikaSettingsPage } from './settings.page';

describe('SettingsPage', () => {
  let component: MikaSettingsPage;
  let fixture: ComponentFixture<MikaSettingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MikaSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
