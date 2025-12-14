'use client';

import { useState } from 'react';
import { EnhancedLayout } from '@/components/layout/EnhancedLayout';
import { StudentTable } from '@/components/students/StudentTable';
import { StudentFilters } from '@/components/students/StudentFilters';
import { AddStudentModal } from '@/components/students/AddStudentModal';
import { ViewStudentModal } from '@/components/students/ViewStudentModal';
import { mockStudents } from '@/lib/mockData';
import { Student } from '@/types';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(mockStudents);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedShift, setSelectedShift] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterStudents(term, selectedClass, selectedShift);
  };

  const handleClassFilter = (classValue: string) => {
    setSelectedClass(classValue);
    filterStudents(searchTerm, classValue, selectedShift);
  };

  const handleShiftFilter = (shiftValue: string) => {
    setSelectedShift(shiftValue);
    filterStudents(searchTerm, selectedClass, shiftValue);
  };

  const filterStudents = (search: string, classFilter: string, shiftFilter: string) => {
    let filtered = students;

    if (search) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.enrollmentNumber.toLowerCase().includes(search.toLowerCase()) ||
        student.phone.includes(search)
      );
    }

    if (classFilter) {
      filtered = filtered.filter(student => student.class === classFilter);
    }

    if (shiftFilter) {
      filtered = filtered.filter(student => student.shift === shiftFilter);
    }

    setFilteredStudents(filtered);
  };

  const handleEditStudent = (student: Student) => {
    setCurrentStudent(student);
    setIsEditModalOpen(true);
  };

  const handleViewStudent = (student: Student) => {
    setCurrentStudent(student);
    setIsViewModalOpen(true);
  };

  const handleDeleteStudent = (student: Student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      // In a real app, this would call an API to delete the student
      alert(`Student ${student.name} deleted`);
      // Refresh the data or update the state to remove the student
    }
  };

  const classes = Array.from(new Set(students.map(s => s.class))).sort();
  const shifts = Array.from(new Set(students.map(s => s.shift)));

  return (
    <EnhancedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Students</h1>
            <p className="text-neutral-600 mt-1">
              Manage student records and information
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Student</span>
          </button>
        </div>

        {/* Filters */}
        <StudentFilters
          onSearch={handleSearch}
          onClassFilter={handleClassFilter}
          onShiftFilter={handleShiftFilter}
          classes={classes}
          shifts={shifts}
          selectedClass={selectedClass}
          selectedShift={selectedShift}
        />

        {/* Student Table */}
        <StudentTable
          students={filteredStudents}
          onEdit={handleEditStudent}
          onView={handleViewStudent}
          onDelete={handleDeleteStudent}
        />

        {/* Add Student Modal */}
        <AddStudentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />

        {/* Edit Student Modal */}
        <AddStudentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentStudent(null);
          }}
          initialData={currentStudent || undefined}
        />

        {/* View Student Modal */}
        <ViewStudentModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setCurrentStudent(null);
          }}
          student={currentStudent}
        />
      </div>
    </EnhancedLayout>
  );
}