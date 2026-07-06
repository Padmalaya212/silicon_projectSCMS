// File: src/app/services/student.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalMale: number;
  totalFemale: number;
}

@Injectable({ providedIn: 'root' })
export class StudentService {

  private baseUrl = 'http://localhost:8080/students';
  private dashboardUrl = 'http://localhost:8080/dashboard';

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.dashboardUrl);
  }

  addStudent(student: Student) {
  return this.http.post(
    `${this.baseUrl}/addStudent`,
    student
  );
}

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/getStudentById/${id}`);
  }

  updateStudent(id: number, student: Student) {
  return this.http.put(
    `${this.baseUrl}/updateStudent/${id}`,
    student
  );
}

  deleteStudent(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  searchByName(name: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/search/${name}`);
  }
}