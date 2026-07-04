// File: src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService, DashboardStats } from '../services/student.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  stats: DashboardStats = {
    totalStudents: 0,
    totalCourses: 0,
    totalMale: 0,
    totalFemale: 0
  };

  loading = true;

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.studentService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goToStudents(): void {
    this.router.navigate(['/students']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}