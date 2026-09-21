import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Auth } from '../../services/auth';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  details: RegisterRequest = { fullName: '', email: '', password: '', phoneNumber: '' };
  loading = false;

  constructor(
    private authService: Auth,
    private router: Router,
    @Inject(ToastrService) private toastr: ToastrService
  ) {}

  onSubmit(): void {
    if (!this.details.fullName || !this.details.email || !this.details.password) {
      this.toastr.warning('Please fill in all required fields.');
      return;
    }
    this.loading = true;
    this.authService.register(this.details).subscribe({
      next: () => {
        this.toastr.success('Account created! You are now logged in.');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message || 'Registration failed.');
      }
    });
  }
}