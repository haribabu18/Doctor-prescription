export interface MedicineDB {
  id: string;
  name: string;
  description?: string;
  dosageForm?: string;  // e.g., tablet, syrup, etc.
  strength?: string;    // e.g., 500mg, 10ml, etc.
  manufacturer?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicineCreateInput {
  name: string;
  description?: string;
  dosageForm?: string;
  strength?: string;
  manufacturer?: string;
}

export interface MedicineUpdateInput extends Partial<MedicineCreateInput> {
  id: string;
} 