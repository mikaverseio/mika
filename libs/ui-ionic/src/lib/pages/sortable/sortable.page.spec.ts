import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MikaSortablePage } from './sortable.page';

describe('SortableComponent', () => {
  let component: MikaSortablePage;
  let fixture: ComponentFixture<MikaSortablePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MikaSortablePage],
    }).compileComponents();

    fixture = TestBed.createComponent(MikaSortablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
