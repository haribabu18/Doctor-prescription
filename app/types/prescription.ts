export interface Medicine {
  name: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  night: boolean;
  quantity?: number;
}

export interface VitalSigns {
  pulse?: string;
  bloodPressure?: string;
  sugar?: string;
}

export interface TestReport {
  testName: string;
  result: string;
  date?: string;
}

export interface Prescription {
  id?: string;
  patientId?: string;
  date: string;
  patientName: string;
  age: number;
  phoneNumber?: string;
  address?: string;
  weight?: string;
  height?: string;
  vitalSigns?: VitalSigns;
  testReports?: TestReport[];
  medicines: Medicine[];
  courseDays?: number;
  doctorNotes?: string;
  nextVisit?: string;
  referredBy?: string;
  knownHistory?: string;
  chiefComplaints?: string;
  clinicalFindings?: string;
  notes?: string;
  procedures?: string;
  advice?: string;
} 