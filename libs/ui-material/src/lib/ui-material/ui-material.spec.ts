import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiMaterial } from './ui-material';

describe('UiMaterial', () => {
  let component: UiMaterial;
  let fixture: ComponentFixture<UiMaterial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiMaterial],
    }).compileComponents();

    fixture = TestBed.createComponent(UiMaterial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
