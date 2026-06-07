import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiIonic } from './ui-ionic';

describe('UiIonic', () => {
  let component: UiIonic;
  let fixture: ComponentFixture<UiIonic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiIonic],
    }).compileComponents();

    fixture = TestBed.createComponent(UiIonic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
