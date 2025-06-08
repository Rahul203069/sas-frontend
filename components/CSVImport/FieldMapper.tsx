//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Plus, X, ArrowRight, 
  HelpCircle, Check, GripHorizontal, Search
} from 'lucide-react';
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

const PREDEFINED_FIELDS: FieldDefinition[] = [
  {
    id: 'name',
    label: 'Full Name',  
    description: 'Person\'s full name',
    allowMultiple: false,
    required: false,
    icon: 'User'
  },
  {
    id: 'email',
    label: 'Email Address',
    description: 'Contact email address(es)',
    allowMultiple: true,
    required: true,
    icon: 'Mail'
  },
  {
    id: 'phone',
    label: 'Phone Number',
    description: 'Contact phone number(s)',
    allowMultiple: true,
    required: false,
    icon: 'Phone'
  },
  {
    id: 'address',
    label: 'Address',
    description: 'Physical address',
    allowMultiple: false,
    required: false,
    icon: 'MapPin'
  }
];

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'User': return <User className="w-4 h-4" />;
    case 'Mail': return <Mail className="w-4 h-4" />;
    case 'Phone': return <Phone className="w-4 h-4" />;
    case 'MapPin': return <MapPin className="w-4 h-4" />;
    default: return <HelpCircle className="w-4 h-4" />;
  }
};

// Draggable wrapper component
const DraggableColumn = ({ column }: { column: CSVColumn }) => {
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
const DroppableField = ({ field, mappedColumns, onUnmap, activeTooltip, setActiveTooltip }: {
  field: FieldDefinition;
  mappedColumns: CSVColumn[];
  onUnmap: (column: CSVColumn, fieldName: PredefinedField) => void;
  activeTooltip: string | null;
  setActiveTooltip: (id: string | null) => void;
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: field.id,
  });

  return (
    <div className="relative">
      <div 
        className="relative group flex items-center mb-2"
        onMouseEnter={() => setActiveTooltip(field.id)}
        onMouseLeave={() => setActiveTooltip(null)}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
            {getIconComponent(field.icon)}
          </div>
          <div>
            <h5 className="font-medium text-gray-800">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </h5>
          </div>
        </div>
        
        <HelpCircle 
          className="w-4 h-4 text-gray-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" 
        />
        
        {activeTooltip === field.id && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-full ml-2 top-0 z-10 w-48 bg-gray-800 text-white p-2 rounded text-xs shadow-lg"
          >
            {field.description}
            {field.allowMultiple && (
              <p className="mt-1 text-blue-300">Multiple fields allowed</p>
            )}
          </motion.div>
        )}
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
  // Initialize mapped fields once
  const [mappedFields, setMappedFields] = useState<MappedField[]>(() => 
    PREDEFINED_FIELDS.map(field => ({
      fieldName: field.id,
      sourceColumns: [],
      allowMultiple: field.allowMultiple
    }))
  );
  
  // Initialize unmapped columns
  const [unmappedColumns, setUnmappedColumns] = useState<CSVColumn[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
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

  // Auto-detect columns on initial load
  useEffect(() => {
    if (!autoDetectDone && columns.length > 0 && unmappedColumns.length > 0) {
      // Create fresh mapped fields structure
      const initialMappedFields = PREDEFINED_FIELDS.map(field => ({
        fieldName: field.id,
        sourceColumns: [],
        allowMultiple: field.allowMultiple
      }));
      
      const remainingColumns = [...unmappedColumns];
      
      // Simple heuristic matching for common CSV headers
      const patterns = {
        name: /name|full\s?name|contact|person/i,
        email: /email|e-mail|mail/i,
        phone: /phone|mobile|cell|tel/i,
        address: /address|location|street/i
      };
      
      Object.entries(patterns).forEach(([fieldName, pattern]) => {
        const matchingColumns = remainingColumns.filter(
          col => pattern.test(col.header.toLowerCase())
        );
        
        if (matchingColumns.length > 0) {
          const fieldIndex = initialMappedFields.findIndex(
            f => f.fieldName === fieldName
          );
          
          if (fieldIndex !== -1) {
            const allowMultiple = initialMappedFields[fieldIndex].allowMultiple;
            
            // For fields that don't allow multiple, just take the first match
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
      
      // Notify parent of initial mapping
      onFieldsMapped(initialMappedFields);
    }
  }, [columns, unmappedColumns, autoDetectDone, onFieldsMapped]);

  // Initialize columns when they change
  useEffect(() => {
    if (columns.length > 0 && !autoDetectDone) {
      setUnmappedColumns(columns);
    }
  }, [columns, autoDetectDone]);

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
    
    // Check if we can add more columns to this field
    if (!field.allowMultiple && field.sourceColumns.length > 0) {
      // Replace the existing column
      const updatedSourceColumns = [column];
      
      // Return the old column to unmapped list
      const oldColumn = field.sourceColumns[0];
      const updatedUnmappedColumns = [...unmappedColumns.filter(c => c.index !== column.index), oldColumn];
      
      // Update state
      const updatedMappedFields = [...mappedFields];
      updatedMappedFields[fieldIndex] = {
        ...field,
        sourceColumns: updatedSourceColumns
      };
      
      setMappedFields(updatedMappedFields);
      setUnmappedColumns(updatedUnmappedColumns);
      onFieldsMapped(updatedMappedFields);
    } else {
      // Add this column to the field
      const updatedSourceColumns = [...field.sourceColumns, column];
      
      // Remove the column from unmapped
      const newUnmappedColumns = unmappedColumns.filter(
        c => c.index !== column.index
      );
      
      // Update state
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
    
    // Remove this column from the field
    const updatedSourceColumns = field.sourceColumns.filter(
      c => c.index !== column.index
    );
    
    // Add the column back to unmapped (sorted by original index for consistency)
    const newUnmappedColumns = [...unmappedColumns, column].sort((a, b) => a.index - b.index);
    
    // Update state
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
  
  // Calculate completion percentage
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
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Available Columns */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
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

            {/* Search Bar */}
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
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
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
                
                {filteredUnmappedColumns.length === 0 && unmappedColumns.length === 0 && (
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
          
          {/* Mapping Direction Arrow */}
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
          
          {/* Target Fields */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-medium text-gray-700 mb-4">Your Contact Fields</h4>
            
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
                    activeTooltip={activeTooltip}
                    setActiveTooltip={setActiveTooltip}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>

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
