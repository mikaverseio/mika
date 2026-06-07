import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MikaAuthService, MikaContextService } from '@mikaverse/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'mika-login-material',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  template: `
    <div class="mika-login-wrapper">
      <mat-card class="mika-login-card">
        <mat-card-header>
          <mat-card-title>{{ context.settings()?.siteName || 'Mika' }}</mat-card-title>
          <mat-card-subtitle>Sign in to continue</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="login()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" autocomplete="username" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" autocomplete="current-password" />
            </mat-form-field>
            @if (error()) {
              <p class="mika-login-error">{{ error() }}</p>
            }
            <button mat-flat-button color="primary" type="submit" class="full-width" [disabled]="loading()">
              @if (loading()) { <mat-spinner diameter="20" /> } @else { Sign In }
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .mika-login-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #f5f5f5;
    }
    .mika-login-card { width: 360px; padding: 16px; }
    .full-width { width: 100%; display: block; margin-bottom: 12px; }
    .mika-login-error { color: red; font-size: 13px; }
  `],
})
export class LoginMaterialPage {
  context = inject(MikaContextService);
  private auth = inject(MikaAuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  async login() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    try {
      const app = this.context.getActiveApp()!;
      await this.auth.login(this.form.value as { email: string; password: string }, app);
      this.router.navigate(['/dashboard']);
    } catch {
      this.error.set('Invalid credentials. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
