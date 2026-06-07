import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MikaHelpPage } from './help.page';

describe('HelpPage', () => {
  let component: MikaHelpPage;
  let fixture: ComponentFixture<MikaHelpPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MikaHelpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
