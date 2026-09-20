import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth-service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
 
  loading = signal(false);
 
  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phoneNumber: ['']
  });
 
  get f() {
    return this.form.controls;
  }
 
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
 
    this.loading.set(true);
    this.authService.register(this.form.getRawValue() as any).subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false)
    });
  }
}
