import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonItem, IonList, IonSpinner, IonText, IonTextarea, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { MikaContextService } from '../../../services';

const SIMULATED_AI_OUTPUT = `
export const NewEntityConfig: MikaEntityConfig = {
  contentType: 'products',
  endpoints: { base: 'products' },
  table: {
    columns: [
      { key: 'name', label: 'Product Name' },
      { key: 'stock', label: 'In Stock' }
    ],
  },
  form: {
    fields: [
      { key: 'name', type: 'text', label: 'Name' },
      { key: 'stock', type: 'number', label: 'Stock' }
    ]
  }
};
`.trim();

const INITIAL_OUTPUT_TEXT = `/*
 * Your generated TypeScript configuration will appear here.
 *
 * Describe the application you want to build in the text area
 * below and click "Generate Config".
 *
 * For example:
 * "An inventory tracker with products, stock count, and price."
 */`;

const SUGGESTIONS = [
	'A simple blog with posts and authors',
	'A task manager with due dates',
	'A recipe book with ingredients',
];


@Component({
	selector: 'mika-ai-generator',
	templateUrl: './mika-ai-generator.component.html',
	styleUrls: ['./mika-ai-generator.component.scss'],
	standalone: true,
	imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TranslatePipe, IonIcon, IonButton, IonSpinner, ReactiveFormsModule, IonTextarea, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonText, IonChip, IonList, IonItem]
})
export class MikaAiGeneratorComponent {
	userPrompt = signal('');
	apiKey = signal('');
	configOutput = signal<string>(INITIAL_OUTPUT_TEXT);
	isLoading = signal(false);
	registeredApps = signal(0);
	copyButtonText = signal('Copy');

	context = inject(MikaContextService);

	readonly SUGGESTIONS = SUGGESTIONS;
	readonly INITIAL_OUTPUT_TEXT = INITIAL_OUTPUT_TEXT;

	private apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;
    private maxRetries = 3;

	constructor() {

	}

	onInput(event: any): void {
		this.userPrompt.set(event.target.value || '');
	}

	useSuggestion(suggestion: string): void {
		this.userPrompt.set(suggestion);
	}

	generateConfig(): void {
		if (!this.userPrompt().trim() || this.isLoading()) {
			return;
		}

		this.isLoading.set(true);
		this.configOutput.set('');
		this.copyButtonText.set('Copy');

		setTimeout(() => {
			this.configOutput.set(SIMULATED_AI_OUTPUT);
			this.isLoading.set(false);
		}, 2000);
	}

	async copyOutput(): Promise<void> {
		if (!this.configOutput() || this.configOutput() === INITIAL_OUTPUT_TEXT) {
			return;
		}
		try {
			await navigator.clipboard.writeText(this.configOutput());
			this.copyButtonText.set('Copied!');
			setTimeout(() => this.copyButtonText.set('Copy'), 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
			this.copyButtonText.set('Error!');
			setTimeout(() => this.copyButtonText.set('Copy'), 2000);
		}
	}

	downloadOutput(): void {
		if (!this.configOutput() || this.configOutput() === INITIAL_OUTPUT_TEXT) {
			return;
		}
		const blob = new Blob([this.configOutput()], { type: 'text/typescript;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute('download', 'mika.config.ts');
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
}
