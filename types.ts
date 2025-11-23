export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  xp: number;
  level: number;
  avatarUrl?: string;
  age?: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: 'Present' | 'Late' | 'Absent';
  method: 'GPS' | 'Manual' | 'Auto';
  location?: string;
}

export interface LeaveRequest {
  id: string;
  type: 'Sick' | 'Vacation' | 'Personal';
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface SalaryRecord {
  month: string;
  base: number;
  bonus: number;
  deductions: number;
  net: number;
  status: 'Paid' | 'Processing';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}