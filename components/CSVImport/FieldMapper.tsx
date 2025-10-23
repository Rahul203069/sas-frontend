//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Plus, X, ArrowRight, Car, Home, Square, Building, Calendar, Maximize,
  HelpCircle, Check, GripHorizontal, Search
} from 'lucide-react';
// Assuming CSVColumn is defined in this import and has 'sample' (string) and 'samples' (string[])
import { CSVColumn, MappedField, FieldDefinition, PredefinedField } from '../../type/csv'
import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

interface FieldMapperProps {
  columns: CSVColumn[];
  onFieldsMapped: (mappedFields: MappedField[]) => void;
}

// --- MODIFIED FIELDS (REQUIRED & OPTIONAL LABELS) ---
const PREDEFINED_FIELDS: FieldDefinition[] = [
  {
    id: 'name',
    label: 'Full Name (optional)', // <-- Updated
    description: 'Lead\'s full name. Used to personalize SMS messages.',
    allowMultiple: false,
    required: false, // <-- Updated
    icon: 'User'
  },
  {
    id: 'email',
    label: 'Email Address (optional)', // <-- Updated
    description: 'Lead\'s email. Used for backup communication or identity matching.',
    allowMultiple: true,
    required: false, // <-- Updated
    icon: 'Mail'
  },
  {
    id: 'phone',
    label: 'Phone Number', // <-- Updated
    description: 'Lead\'s phone number. Primary field for sending SMS.',
    allowMultiple: true,
    required: true, // <-- Updated
    icon: 'Phone'
  },
  {
    id: 'address',
    label: 'Address', // <-- Updated
    description: 'Full property address (street, city, state, zip). Required for RentCast API.',
    allowMultiple: false,
    required: true, // <-- Updated
    icon: 'MapPin'
  },
  {
    id: 'propertyZipCode',
    label: 'Property Zip Code (optional)', // <-- Updated
    description: 'Property ZIP or postal code. Used for RentCast API and for AI-powered SMS comparisons.',
    allowMultiple: false,
    required: false, // <-- Updated
    icon: 'MapPin'
  },
  {
    id: 'bedrooms',
    label: 'Bedrooms',
    description: 'Number of bedrooms. Required numeric field for RentCast API.',
    allowMultiple: false,
    required: true,
    icon: 'Home'
  },
  {
    id: 'bathrooms',
    label: 'Bathrooms',
    description: 'Number of bathrooms. Required numeric field for RentCast API.',
    allowMultiple: false,
    required: true,
    icon: 'Home'
  },
  {
    id: 'squareFootage',
    label: 'Square Footage',
    description: 'Total living area in square feet. Required for RentCast API.',
    allowMultiple: false,
    required: true,
    icon: 'Square'
  },
  {
    id: 'propertyType',
    label: 'Property Type',
    description: 'Property type (e.g., Single-Family, Condo, Multi-Family). Required for RentCast API.',
    allowMultiple: false,
    required: true,
    icon: 'Building'
  },
  {
    id: 'yearBuilt',
    label: 'Year Built (optional)', // <-- Updated
    description: 'Construction year. Recommended for better AVM accuracy.',
    allowMultiple: false,
    required: false,
    icon: 'Calendar'
  },
  {
    id: 'lotSize',
    label: 'Lot Size (optional)', // <-- Updated
    description: 'Total lot area in square feet. Recommended for better AVM accuracy.',
    allowMultiple: false,
    required: false,
    icon: 'Maximize'
  },
  {
    id: 'garageCount',
    label: 'Garage Count (optional)', // <-- Updated
    description: 'Number of garage/parking spaces. Recommended for better AVM accuracy.',
    allowMultiple: false,
    required: false,
    icon: 'Car'
  }
];
// --- END MODIFIED FIELDS ---

const getIconComponent = (iconName: string) => {
  // ... (getIconComponent content is unchanged)
  switch (iconName) {
    case 'User': return <User className="w-4 h-4" />;
    case 'Mail': return <Mail className="w-4 h-4" />;
    case 'Phone': return <Phone className="w-4 h-4" />;
    case 'MapPin': return <MapPin className="w-4 h-4" />;
    case 'Home': return <Home className="w-4 h-4" />;
    case 'Square': return <Square className="w-4 h-4" />;
    case 'Building': return <Building className="w-4 h-4" />;
    case 'Calendar': return <Calendar className="w-4 h-4" />;
    case 'Check': return <Check className="w-4 h-4" />;
    case 'Maximize': return <Maximize className="w-4 h-4" />;
    case 'Car': return <Car className="w-4 h-4" />;
    default: return <HelpCircle className="w-4 h-4" />;
  }
};

/**
 * Checks if a SINGLE string looks like a valid phone number.
 */
const isSinglePhoneSampleValid = (sample: string | undefined): boolean => {
  if (!sample) {
    return false;
  }
  const digits = sample.replace(/\D/g, '');
  const digitCount = digits.length;
  return digitCount === 10 || digitCount === 11 || digitCount === 12;
};

/**
 * Checks if a column is likely a phone number column by checking multiple samples.
 */
const isPhoneColumn = (column: CSVColumn): boolean => {
  if (Array.isArray(column.samples) && column.samples.length > 0) {
    return column.samples.some(isSinglePhoneSampleValid);
  }
  return isSinglePhoneSampleValid(column.sample);
};

// Simple regex to check for email-like pattern (something@something.something)
const EMAIL_REGEX = /\S+@\S+\.\S+/;

/**
 * Checks if a SINGLE string looks like a valid email.
 */
const isSingleEmailSampleValid = (sample: string | undefined): boolean => {
  if (!sample) {
    return false;
  }
  return EMAIL_REGEX.test(sample);
};

/**
 * Checks if a column is likely an email column by checking multiple samples.
 */
const isEmailColumn = (column: CSVColumn): boolean => {
  if (Array.isArray(column.samples) && column.samples.length > 0) {
    return column.samples.some(isSingleEmailSampleValid);
  }
  return isSingleEmailSampleValid(column.sample);
};

// Regex for common zip/postal formats (e.g., 12345, 123456, 12345-6789)
const ZIP_REGEX = /(^\d{5}$)|(^\d{6}$)|(^\d{5}-\d{4}$)/;

/**
 * NEW: Checks if a SINGLE string looks like a valid zip code.
 */
const isSingleZipSampleValid = (sample: string | undefined): boolean => {
  if (!sample) {
    return false;
  }
  // Trim whitespace just in case
  return ZIP_REGEX.test(sample.trim());
};

/**
 * NEW: Checks if a column is likely a zip code column by checking multiple samples.
 */
const isZipColumn = (column: CSVColumn): boolean => {
  if (Array.isArray(column.samples) && column.samples.length > 0) {
    return column.samples.some(isSingleZipSampleValid);
  }
  return isSingleZipSampleValid(column.sample);
};


/**
 * Checks if a SINGLE string looks like a valid garage *car count*.
 */
const isSingleGarageSampleValid = (sample: string | undefined): boolean => {
  if (!sample || sample.trim() === '') {
    return false; // Ignore empty strings
  }
  
  const trimmedSample = sample.trim();
  
  // Try to parse as a number.
  const num = Number(trimmedSample);

  // Check if it's a valid, non-negative integer
  if (isNaN(num) || !Number.isInteger(num) || num < 0) {
    return false;
  }

  // Criteria 1: Plausible car count (e.g., 0-10)
  const isCarCount = (num >= 0 && num <= 10);

  return isCarCount;
};

/**
 * Checks if a column is likely a garage *car count* column by checking multiple samples.
 */
const isGarageColumn = (column: CSVColumn): boolean => {
  const samplesToCheck = (Array.isArray(column.samples) && column.samples.length > 0)
    ? column.samples
    : [column.sample]; // Fallback to single sample if array is empty

  // Filter out empty/null values, as user said they can be empty
  const nonEmptySamples = samplesToCheck.filter(s => s && s.trim() !== '');

  // If all samples are empty, we can't validate.
  // Don't disqualify it; let the header match stand.
  if (nonEmptySamples.length === 0) {
    return true;
  }

  // Check if *at least one* non-empty sample looks like a valid garage *car count*
  return nonEmptySamples.some(isSingleGarageSampleValid);
};


// Draggable wrapper component
const DraggableColumn = ({ column }: { column: CSVColumn }) => {
  // ... (DraggableColumn content is unchanged)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `col-${column.index}`,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border ${isDragging ? 'border-blue-400 shadow-lg opacity-50' : 'border-gray-200'} rounded-md p-3 cursor-move hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center gap-2">
        <GripHorizontal className="w-4 h-4 text-gray-400" />
        <div>
          <h5 className="font-medium text-gray-800 mb-1">{column.header}</h5>
          <p className="text-xs text-gray-500 truncate max-w-[200px]">
            Sample: <span className="text-gray-700">{column.sample || 'N/A'}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Droppable wrapper component
const DroppableField = ({ field, mappedColumns, onUnmap }: {
  field: FieldDefinition;
  mappedColumns: CSVColumn[];
  onUnmap: (column: CSVColumn, fieldName: PredefinedField) => void;
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: field.id,
  });

  return (
    <div className="relative">
      <div className="relative flex items-start mb-2">
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 flex-shrink-0">
            {getIconComponent(field.icon)}
          </div>
          <div>
            <h5 className="font-medium text-gray-800">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </h5>
            <p className="text-xs text-gray-500 mt-1">
              {field.description}
            </p>
            {field.allowMultiple && (
              <p className="mt-1 text-xs text-blue-500">
                Multiple fields allowed
              </p>
            )}
          </div>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`pl-10 border-l-2 border-dashed min-h-[60px] ${mappedColumns.length > 0 ? 'border-blue-300' : 'border-gray-200'} ${isOver ? 'border-blue-500 bg-blue-50' : ''} transition-all duration-200`}
      >
        <AnimatePresence mode="popLayout">
          {mappedColumns.map((column) => (
            <motion.div
              key={`mapped-${field.id}-${column.index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-blue-50 border border-blue-200 rounded-md p-2 mb-2 flex justify-between items-center group"
            >
              <div className="flex items-center gap-2">
                <GripHorizontal className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-blue-700">{column.header}</p>
                  <p className="text-xs text-blue-500 truncate max-w-[180px]">
                    Sample: {column.sample || 'N/A'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onUnmap(column, field.id as PredefinedField)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove mapping"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {mappedColumns.length === 0 && (
          <div className={`py-3 px-3 border border-gray-200 border-dashed rounded-md bg-gray-50 text-sm text-gray-500 mb-2 transition-colors ${isOver ? 'border-blue-400 bg-blue-100' : ''}`}>
            Drop a column here
          </div>
        )}

        {field.allowMultiple && mappedColumns.length > 0 && (
          <div className="text-xs text-gray-500 mb-2 flex items-center">
            <Plus className="w-3 h-3 mr-1" />
            Drop more columns here
          </div>
        )}
      </div>
    </div>
  );
};

const FieldMapper: React.FC<FieldMapperProps> = ({ columns, onFieldsMapped }) => {
  // ... (State declarations are unchanged)
  const [mappedFields, setMappedFields] = useState<MappedField[]>(() =>
    PREDEFINED_FIELDS.map(field => ({
      fieldName: field.id,
      sourceColumns: [],
      allowMultiple: field.allowMultiple
    }))
  );
  const [unmappedColumns, setUnmappedColumns] = useState<CSVColumn[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [autoDetectDone, setAutoDetectDone] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter columns based on search term
  const filteredUnmappedColumns = unmappedColumns.filter(column =>
    column.header.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (column.sample && column.sample.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // This effect runs *only* when the columns prop changes.
  useEffect(() => {
    if (columns.length > 0) {
      setUnmappedColumns(columns);
      setAutoDetectDone(false);
    } else {
      setUnmappedColumns([]);
      setAutoDetectDone(true);
    }
  }, [columns]);

  // This effect runs when unmappedColumns changes *and* auto-detect hasn't run yet
  useEffect(() => {
    if (!autoDetectDone && unmappedColumns.length > 0) {
      // Create fresh mapped fields structure
      const initialMappedFields = PREDEFINED_FIELDS.map(field => ({
        fieldName: field.id,
        sourceColumns: [],
        allowMultiple: field.allowMultiple
      }));
      
      const remainingColumns = [...unmappedColumns];

      // ... (patterns object is unchanged)
      const patterns = {
        name: /name|full\s?name|contact|person/i,
        email: /email|e-mail|mail/i,
        phone: /phone|mobile|cell|tel/i,
        address: /address|location|street/i,
        propertyZipCode: /zip|postal|zip\s?code|postal\s?code/i,
        bedrooms: /bedrooms|beds|br|bed\s?count/i,
        bathrooms: /bathrooms|baths|ba|bath\s?count/i,
        squareFootage: /square\s?footage|sqft|sq\s?ft|size|area|living\s?area/i,
        propertyType: /property\s?type|type|home\s?type|building\s?type/i,
        yearBuilt: /year\s?built|yr\s?blt|built/i,
        lotSize: /lot\s?size|lot\s?sqft|lot\s?area/i,
        garageCount: /garage\s?count|garage|garage\s?spaces|cars/i
      };

      // Negative pattern to AVOID matching garage area fields to garage count
      const garageAreaPattern = /square|foot|sqft|area/i;


      Object.entries(patterns).forEach(([fieldName, pattern]) => {
        // First pass: Find columns matching the header pattern
        let matchingColumns = remainingColumns.filter(
          col => pattern.test(col.header.toLowerCase())
        );

        // ... (phone, email, zip logic is unchanged)
        if (fieldName === 'phone') {
          matchingColumns = matchingColumns.filter(isPhoneColumn);
        }
        if (fieldName === 'email') {
          matchingColumns = matchingColumns.filter(isEmailColumn);
        }
        if (fieldName === 'propertyZipCode') {
          matchingColumns = matchingColumns.filter(isZipColumn);
        }
        
        // ... (garageCount logic is unchanged)
        if (fieldName === 'garageCount') {
          // Second pass: Filter out headers that contain area-related words
          matchingColumns = matchingColumns.filter(
            col => !garageAreaPattern.test(col.header.toLowerCase())
          );
          
          // Third pass: Check samples for plausible car counts (0-10)
          matchingColumns = matchingColumns.filter(isGarageColumn);
        }

        if (matchingColumns.length > 0) {
          const fieldIndex = initialMappedFields.findIndex(
            f => f.fieldName === fieldName
          );

          if (fieldIndex !== -1) {
            const allowMultiple = initialMappedFields[fieldIndex].allowMultiple;
            const columnsToMap = allowMultiple
              ? matchingColumns
              : [matchingColumns[0]];

            initialMappedFields[fieldIndex].sourceColumns = columnsToMap;

            // Remove mapped columns from remaining columns
            columnsToMap.forEach(col => {
              const index = remainingColumns.findIndex(c => c.index === col.index);
              if (index !== -1) {
                remainingColumns.splice(index, 1);
              }
            });
          }
        }
      });

      setMappedFields(initialMappedFields);
      setUnmappedColumns(remainingColumns);
      setAutoDetectDone(true);

      onFieldsMapped(initialMappedFields);
    }
  }, [unmappedColumns, autoDetectDone, onFieldsMapped]);
  
  // ... (Drag/Drop Handlers and other logic is unchanged)

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    const columnId = active.id as string;
    const targetFieldId = over.id as string;

    const column = unmappedColumns.find(col => `col-${col.index}` === columnId);
    if (!column) return;

    handleColumnMap(column, targetFieldId as PredefinedField);
  };

  const handleColumnMap = (column: CSVColumn, fieldName: PredefinedField) => {
    const fieldIndex = mappedFields.findIndex(f => f.fieldName === fieldName);
    if (fieldIndex === -1) return;

    const field = mappedFields[fieldIndex];

    if (!field.allowMultiple && field.sourceColumns.length > 0) {
      const updatedSourceColumns = [column];
      const oldColumn = field.sourceColumns[0];
      const updatedUnmappedColumns = [...unmappedColumns.filter(c => c.index !== column.index), oldColumn];

      const updatedMappedFields = [...mappedFields];
      updatedMappedFields[fieldIndex] = {
        ...field,
        sourceColumns: updatedSourceColumns
      };

      setMappedFields(updatedMappedFields);
      setUnmappedColumns(updatedUnmappedColumns);
      onFieldsMapped(updatedMappedFields);
    } else {
      const updatedSourceColumns = [...field.sourceColumns, column];
      const newUnmappedColumns = unmappedColumns.filter(
        c => c.index !== column.index
      );

      const updatedMappedFields = [...mappedFields];
      updatedMappedFields[fieldIndex] = {
        ...field,
        sourceColumns: updatedSourceColumns
      };

      setMappedFields(updatedMappedFields);
      setUnmappedColumns(newUnmappedColumns);
      onFieldsMapped(updatedMappedFields);
    }
  };

  const handleColumnUnmap = (column: CSVColumn, fieldName: PredefinedField) => {
    const fieldIndex = mappedFields.findIndex(f => f.fieldName === fieldName);
    if (fieldIndex === -1) return;

    const field = mappedFields[fieldIndex];

    const updatedSourceColumns = field.sourceColumns.filter(
      c => c.index !== column.index
    );

    const newUnmappedColumns = [...unmappedColumns, column].sort((a, b) => a.index - b.index);

    const updatedMappedFields = [...mappedFields];
    updatedMappedFields[fieldIndex] = {
      ...field,
      sourceColumns: updatedSourceColumns
    };

    setMappedFields(updatedMappedFields);
    setUnmappedColumns(newUnmappedColumns);
    onFieldsMapped(updatedMappedFields);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // ... (Completion percentage logic is unchanged)
  // --- THIS WILL NOW AUTOMATICALLY RECALCULATE BASED ON THE NEW REQUIRED FIELDS ---
  const requiredFields = PREDEFINED_FIELDS.filter(field => field.required);
  const mappedRequiredFields = requiredFields.filter(field => {
    const mappedField = mappedFields.find(f => f.fieldName === field.id);
    return mappedField && mappedField.sourceColumns.length > 0;
  });

  const completionPercentage =
    requiredFields.length > 0
      ? Math.round((mappedRequiredFields.length / requiredFields.length) * 100)
      : 100;

  const activeColumn = unmappedColumns.find(
    col => `col-${col.index}` === activeDragId
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full"
      >
        {/* ... (Header/Progress bar is unchanged) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-900">Map Your Fields</h3>
            <div className="flex items-center">
              <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm text-gray-500">{completionPercentage}% Complete</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Drag columns from the left to map them to your fields on the right
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:items-stretch">
          {/* ... (Available Columns section is unchanged) */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex flex-col"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-700 flex items-center">
                <span>Available CSV Columns</span>
                <span className="ml-2 bg-gray-100 text-gray-600 text-xs py-1 px-2 rounded-full">
                  {filteredUnmappedColumns.length}
                </span>
              </h4>
            </div>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
              <AnimatePresence mode="popLayout">
                {filteredUnmappedColumns.map((column) => (
                  <motion.div
                    key={`col-${column.index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DraggableColumn column={column} />
                  </motion.div>
                ))}

                {unmappedColumns.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-gray-500"
                  >
                    All columns have been mapped
                    <Check className="w-5 h-5 mx-auto mt-2 text-green-500" />
                  </motion.div>
                )}

                {filteredUnmappedColumns.length === 0 && unmappedColumns.length > 0 && searchTerm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-gray-500"
                  >
                    <Search className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                    No columns match "{searchTerm}"
                    <button
                      onClick={clearSearch}
                      className="block mx-auto mt-2 text-blue-500 hover:text-blue-600 text-sm underline"
                    >
                      Clear search
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>

          {/* ... (Arrow section is unchanged) */}
          <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <ArrowRight className="w-6 h-6 text-blue-500" />
            </motion.div>
          </div>

          {/* ... (Target Fields section is unchanged) */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-medium text-gray-700 mb-4">Your Target Fields</h4>
            <div className="space-y-6">
              {PREDEFINED_FIELDS.map((field) => {
                const mappedField = mappedFields.find(f => f.fieldName === field.id);
                const mappedColumns = mappedField ? mappedField.sourceColumns : [];

                return (
                  <DroppableField
                    key={field.id}
                    field={field}
                    mappedColumns={mappedColumns}
                    onUnmap={handleColumnUnmap}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ... (DragOverlay is unchanged) */}
      <DragOverlay>
        {activeColumn ? (
          <motion.div
            initial={{ scale: 1.05 }}
            animate={{ scale: 1.05 }}
            className="bg-white border border-blue-400 shadow-lg rounded-md p-3 cursor-move"
          >
            <div className="flex items-center gap-2">
              <GripHorizontal className="w-4 h-4 text-gray-400" />
              <div>
                <h5 className="font-medium text-gray-800 mb-1">{activeColumn.header}</h5>
                <p className="text-xs text-gray-500 truncate max-w-[200px]">
                  Sample: <span className="text-gray-700">{activeColumn.sample || 'N/A'}</span>
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default FieldMapper;