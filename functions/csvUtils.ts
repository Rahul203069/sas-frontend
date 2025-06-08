//@ts-nocheck
import Papa from 'papaparse';
import { CSVData, CSVColumn, MappedField, MappedData } from '../types/csv';

export const parseCSV = (file: File): Promise<CSVData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(results.errors);
          return;
        }

        const headers = results.data[0] as string[];
        const rows = results.data.slice(1) as string[][];
        
        // Filter out empty rows
        const filteredRows = rows.filter(row => 
          row.some(cell => cell.trim() !== '') && row.length === headers.length
        );
        
        resolve({
          headers,
          rows: filteredRows
        });
      },
      error: (error) => {
        reject(error);
      },
      header: false,
      skipEmptyLines: true
    });
  });
};

export const getColumnSamples = (csvData: CSVData, count: number = 3): CSVColumn[] => {
  return csvData.headers.map((header, index) => {
    // Get a sample of values from this column
    const sampleValues = csvData.rows
      .slice(0, count)
      .map(row => row[index])
      .filter(Boolean);
    
    const sample = sampleValues.length > 0 ? sampleValues[0] : '';
    
    return {
      header,
      index,
      sample
    };
  });
};

export const transformMappedDataToRecords = (
  csvData: CSVData,
  mappedFields: MappedField[]
): MappedData[] => {
  return csvData.rows.map(row => {
    const record: MappedData = {
      email: [],
      phone: []
    };

    mappedFields.forEach(mappedField => {
      if (mappedField.sourceColumns.length === 0) return;

      if (mappedField.allowMultiple) {
        // Fields like email and phone that can have multiple values
        mappedField.sourceColumns.forEach(column => {
          const value = row[column.index];
          if (value && value.trim()) {
            (record[mappedField.fieldName] as string[]).push(value.trim());
          }
        });
      } else {
        // Single value fields like name and address
        // We use the first mapped column
        const column = mappedField.sourceColumns[0];
        if (column) {
          record[mappedField.fieldName] = row[column.index];
        }
      }
    });

    return record;
  });
};

export const validateMappedData = (mappedData: MappedData[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check if there's at least one email for each record
  const missingEmailCount = mappedData.filter(record => record.email.length === 0).length;
  if (missingEmailCount > 0) {
    errors.push(`${missingEmailCount} records are missing email information.`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
