import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiI18n } from './ui-i18n';

describe('UiI18n', () => {
  let component: UiI18n;
  let fixture: ComponentFixture<UiI18n>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiI18n],
    }).compileComponents();

    fixture = TestBed.createComponent(UiI18n);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
