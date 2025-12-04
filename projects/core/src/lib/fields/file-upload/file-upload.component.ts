import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonItem, IonIcon, IonText, IonImg, IonButton, IonLabel } from "@ionic/angular/standalone";
import { TranslatePipe } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { document, documentOutline, removeCircle } from 'ionicons/icons';
import { MikaAppService } from '../../services/engine/mika-app.service';

@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FileUploadComponent),
			multi: true,
		}
	],
	// changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IonLabel, IonButton, IonImg, IonText, IonIcon, TranslatePipe]
})
export class FileUploadComponent implements ControlValueAccessor {
	@Input() accept = 'image/*';
	@Input() label = 'Upload File';
	@ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

	isDragging = false;
	file: File | null = null;
	previewUrl: string | null = null;

	private onChange = (_: any) => { };
	private onTouched = () => { };

	constructor(
		private cdr: ChangeDetectorRef,
		private app: MikaAppService
	) {
		addIcons({ removeCircle, document, documentOutline })
	}

	writeValue(value: File | string | null): void {
		if (typeof value === 'string') {
			this.previewUrl = this.app.resolveMediaUrl(value);
			this.file = null;
		} else if (value instanceof File) {
			this.file = value;
			this.preview(value);
		} else {
			this.previewUrl = null;
			this.file = null;
		}
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	onDrop(event: DragEvent) {
		event.preventDefault();
		this.isDragging = false;
		const file = event.dataTransfer?.files?.[0];
		if (file) this.handleFile(file);
	}

	handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) this.handleFile(file);
	}

	handleFile(file: File) {
		this.file = file;
		this.preview(file);
		this.onChange(file);
		this.onTouched();
	}

	preview(file: File) {
		if (file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = () => {
				this.previewUrl = reader.result as string;
				this.cdr.detectChanges();
			}
			reader.readAsDataURL(file);
		} else {
			this.previewUrl = null;
		}
	}

	onDragOver(event: DragEvent) {
		event.preventDefault();
		this.isDragging = true;
	}

	onDragLeave(event: DragEvent) {
		event.preventDefault();
		this.isDragging = false;
	}

	removeFile() {
		this.file = null;
		this.previewUrl = null;
		this.onChange(null);
		this.onTouched();

		if (this.fileInputRef?.nativeElement) {
			this.fileInputRef.nativeElement.value = '';
		}
	}

	get fileIcon(): string {
		if (!this.file) return 'document-outline';
		if (this.file.type.startsWith('image/')) return '';
		if (this.file.type.startsWith('audio/')) return 'musical-notes-outline';
		if (this.file.type.startsWith('video/')) return 'videocam-outline';
		return 'document-outline';
	}

	get fileName(): string {
		if (this.file) return this.file.name;

		if (this.previewUrl) {
			try {
				const url = new URL(this.previewUrl);
				return url.pathname.split('/').pop() ?? this.previewUrl;
			} catch {
				return this.previewUrl.split('/').pop() ?? this.previewUrl;
			}
		}

		return '';
	}

	get isRemoteFile(): boolean {
		return typeof this.previewUrl === 'string' && this.previewUrl.startsWith('http');
	}

	openInNewTab() {
		if (this.isRemoteFile) {
			window.open(this.previewUrl!, '_blank');
		}
	}
}

