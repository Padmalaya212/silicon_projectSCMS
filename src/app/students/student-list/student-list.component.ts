// File: src/app/students/student-list/student-list.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { StudentFormComponent } from '../student-form/student-form.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'mobileNumber', 'course', 'address', 'gender', 'dob', 'actions'];
  dataSource = new MatTableDataSource<Student>([]);
  loading = true;
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private studentService: StudentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load students', 'Close', { duration: 3000 });
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.trim();
    if (!term) {
      this.loadStudents();
      return;
    }
    this.studentService.searchByName(term).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: () => {
        this.snackBar.open('Search failed', 'Close', { duration: 3000 });
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadStudents();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Student added successfully', 'Close', { duration: 3000 });
        this.loadStudents();
      }
    });
  }

  openEditDialog(student: Student): void {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: '500px',
      data: student
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Student updated successfully', 'Close', { duration: 3000 });
        this.loadStudents();
      }
    });
  }

  deleteStudent(student: Student): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: `Delete student "${student.name}"? This cannot be undone.` }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.studentService.deleteStudent(student.id!).subscribe({
          next: () => {
            this.snackBar.open('Student deleted', 'Close', { duration: 3000 });
            this.loadStudents();
          },
          error: () => {
            this.snackBar.open('Delete failed', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}