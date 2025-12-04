import {
	Component, Input, OnInit, forwardRef, ChangeDetectionStrategy,
	AfterViewInit
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, of, from } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import {MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MikaFieldConfig } from '../interfaces/field/mika-field-config.interface';

@Component({
	selector: 'app-autocomplete-field',
	template: `
		<mat-form-field appearance="fill" style="width: 100%;">
			<mat-label>{{ field.label | translate }}</mat-label>
			<input
				matInput
				[formControl]="inputControl"
				[matAutocomplete]="auto"
				(blur)="onTouched()"

				[placeholder]="field.placeholder ?? '' | translate"
				autocomplete="off"
			/>
			<mat-autocomplete #auto="matAutocomplete" (optionSelected)="optionSelected($event.option.value)" [displayWith]="displayFn">
				<mat-option *ngFor="let option of filteredOptions$ | async" [value]="option">
					<span>{{ getDisplay(option) | translate }}</span>
					<!-- <mat-icon *ngIf="option.value === selectedValue" class="check-icon" style="float: end;">check</mat-icon> -->
				</mat-option>
			</mat-autocomplete>
		</mat-form-field>
	`,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		MatInputModule,
		MatAutocompleteModule,
		MatFormFieldModule,
		TranslatePipe,
		MatIconModule,
		AsyncPipe
	],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MikaAutocompleteFieldComponent),
			multi: true
		}
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MikaAutocompleteFieldComponent implements OnInit, ControlValueAccessor, AfterViewInit {
	@Input() field!: MikaFieldConfig;
	selectedValue: any;
	inputControl = new FormControl('');
	filteredOptions$!: Observable<any[]>;
	onChange: any = () => { };
	onTouched: any = () => { };

	ngOnInit() {
		this.filteredOptions$ = this.inputControl.valueChanges.pipe(
			debounceTime(300),
			startWith(''),
			map(value => value ?? ''),
			switchMap((value: string) => {
				const loader = this.field.loadOptions;
				if (loader) {
					return from(loader()).pipe(
						map(options => this.filterOptions(value, this.appendDefaultOption(options)))
					);
				}
				return of(this.filterOptions(value, this.appendDefaultOption(this.field.options ?? [])));
			})
		);

		// this.triggerInitialSearch();
	}

	ngAfterViewInit(): void { }

	async writeValue(value: any): Promise<void> {
		this.selectedValue = value;
		const loader = this.field.loadOptions;
		const options = loader ? await loader() : (this.field.options ?? []);
		this.field.options = options; // cache
		const displayValue = this.getDisplayFromOptions(value, options);
		this.inputControl.setValue(displayValue, { emitEvent: false });
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	optionSelected(option: any): void {
		if (!option) return;
		this.selectedValue = option.value ?? option;
		this.inputControl.setValue(this.getDisplay(option), { emitEvent: false });
		this.onChange(option.value ?? option);
		this.onTouched();
	}

	triggerInitialSearch(): void {
		const loader = this.field.loadOptions;
		if (loader) {
			this.filteredOptions$ = from(loader()).pipe(
				map(results => this.appendDefaultOption(results ?? []))
			);
		} else {
			this.filteredOptions$ = of(this.appendDefaultOption(this.field.options ?? []));
		}
	}

	private filterOptions(search: string, options: any[]): any[] {
		const term = (search ?? '').toLowerCase();
		return options.filter(opt => {
			const label = this.getDisplay(opt).toLowerCase();
			return label.includes(term);
		});
	}

	private getDisplayFromOptions(value: any, options?: any[]): string {
		if (!value) return '';
		const opts = options ?? this.field.options ?? [];
		const match = opts.find(opt => opt.value === value)
			|| (this.field.defaultOption?.value === value ? this.field.defaultOption : null);
		return match ? this.getDisplay(match) : (typeof value === 'string' ? value : '');
	}

	getDisplay(option: any): string {
		if (!option) return '';
		if (this.field.displayWith) return this.field.displayWith(option);
		if (option.isTranslatable) return option.label;
		return option.label ?? '';
	}

	private appendDefaultOption(options: any[]): any[] {
		if (this.field.defaultOption) {
			const exists = options.some(opt => opt.value === this.field.defaultOption?.value);
			if (!exists) {
				return [this.field.defaultOption, ...options];
			}
		}
		return options;
	}

	displayFn = (option: any): string => {
		return this.getDisplay(option);
	};
}
