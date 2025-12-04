import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SortablePage } from './sortable.page';

describe('SortableComponent', () => {
  let component: SortablePage;
  let fixture: ComponentFixture<SortablePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SortablePage],
    }).compileComponents();

    fixture = TestBed.createComponent(SortablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
