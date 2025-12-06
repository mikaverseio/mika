import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MikaAiGeneratorComponent } from './mika-ai-generator.component';

describe('DashboardPage', () => {
  let component: MikaAiGeneratorComponent;
  let fixture: ComponentFixture<MikaAiGeneratorComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MikaAiGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
