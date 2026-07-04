// File: src/app/login/login.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  onLogin(): void {
    if (!this.username || !this.password) {
      this.snackBar.open('Please enter username and password', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.authService.setLoggedIn();
          this.router.navigate(['/dashboard']);
        } else {
          this.snackBar.open(res.message, 'Close', { duration: 3000 });
        }
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Server error. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}