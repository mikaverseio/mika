import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'mika-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submitted.emit(form?.value)">
      <p>Ionic form placeholder for "{{ config?.contentType || 'entity' }}".</p>
      <button type="submit">Submit</button>
    </form>
  `
})
export class MikaFormComponent {
  @Input() form!: FormGroup;
  @Input() config: any;
  @Output() submitted = new EventEmitter<any>();
}
