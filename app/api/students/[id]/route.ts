import { NextRequest, NextResponse } from 'next/server';
import { mockStudents } from '@/lib/mockData';
import { Student } from '@/types';

// In-memory "database" simulation
let studentsDb = [...mockStudents];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const student = studentsDb.find(s => s.id === id);

    if (!student) {
      return NextResponse.json({ 
        success: false, 
        error: 'Student not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: student 
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch student' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const studentIndex = studentsDb.findIndex(s => s.id === id);

    if (studentIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Student not found' 
      }, { status: 404 });
    }

    // Update student with new data
    studentsDb[studentIndex] = {
      ...studentsDb[studentIndex],
      ...body,
      id // Ensure ID doesn't change
    };

    return NextResponse.json({ 
      success: true, 
      data: studentsDb[studentIndex] 
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update student' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const studentIndex = studentsDb.findIndex(s => s.id === id);

    if (studentIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Student not found' 
      }, { status: 404 });
    }

    const deletedStudent = studentsDb.splice(studentIndex, 1)[0];

    return NextResponse.json({ 
      success: true, 
      message: 'Student deleted successfully',
      data: deletedStudent
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete student' 
    }, { status: 500 });
  }
}