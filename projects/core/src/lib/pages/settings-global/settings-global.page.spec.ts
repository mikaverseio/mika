import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsGlobalPage } from './settings-global.page';

describe('SettingsGlobalPage', () => {
  let component: SettingsGlobalPage;
  let fixture: ComponentFixture<SettingsGlobalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsGlobalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
