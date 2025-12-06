import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MikaSettingsGlobalPage } from './settings-global.page';

describe('SettingsGlobalPage', () => {
  let component: MikaSettingsGlobalPage;
  let fixture: ComponentFixture<MikaSettingsGlobalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MikaSettingsGlobalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
