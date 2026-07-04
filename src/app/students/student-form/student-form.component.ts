// File: src/app/students/student-form/student-form.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {

  form!: FormGroup;
  isEditMode = false;
  saving = false;
  courses = ['B.Tech', 'MBA', 'BCA', 'MCA', 'B.Sc', 'M.Sc'];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<StudentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Student | null
  ) { }

  ngOnInit(): void {
    this.isEditMode = !!this.data;

    this.form = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      mobileNumber: [this.data?.mobileNumber || '', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      course: [this.data?.course || '', Validators.required],
      address: [this.data?.address || '', Validators.required],
      gender: [this.data?.gender || '', Validators.required],
      dob: [this.data?.dob || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formValue = { ...this.form.value };

    if (formValue.dob instanceof Date) {
      const d = formValue.dob;
      formValue.dob = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    if (this.isEditMode && this.data?.id) {
      this.studentService.updateStudent(this.data.id, formValue).subscribe({
        next: () => {
          this.saving = true;
          this.dialogRef.close(true);
        },
        error: () => {
          this.saving = false;
          this.snackBar.open('Update failed', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.studentService.addStudent(formValue).subscribe({
        next: () => {
          this.saving = true;
          this.dialogRef.close(true);
        },
        error: () => {
          this.saving = false;
          this.snackBar.open('Add failed', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}