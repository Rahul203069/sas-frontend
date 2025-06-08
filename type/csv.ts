export interface CSVColumn {
  header: string;
  index: number;
  sample: string;
}

export interface MappedField {
  fieldName: string;
  sourceColumns: CSVColumn[];
  allowMultiple: boolean;
}

export interface CSVData {
  headers: string[];
  rows: string[][];
}

export interface MappedData {
  name?: string;
  email: string[];
  phone: string[];
  address?: string;
  [key: string]: any;
}

export type PredefinedField = 'name' | 'email' | 'phone' | 'address';

export interface FieldDefinition {
  id: PredefinedField;
  label: string;
  description: string;
  allowMultiple: boolean;
  required: boolean;
  icon: string;
}