import { NextRequest, NextResponse } from 'next/server';
import { mockStudents } from '@/lib/mockData';
import { Student } from '@/types';

// In-memory "database" simulation
let studentsDb = [...mockStudents];

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const classFilter = searchParams.get('class');
    const shiftFilter = searchParams.get('shift');

    let filteredStudents = [...studentsDb];

    if (search) {
      filteredStudents = filteredStudents.filter(student =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.enrollmentNumber.toLowerCase().includes(search.toLowerCase()) ||
        student.class.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (classFilter) {
      filteredStudents = filteredStudents.filter(student => student.class === classFilter);
    }

    if (shiftFilter) {
      filteredStudents = filteredStudents.filter(student => student.shift === shiftFilter);
    }

    return NextResponse.json({ 
      success: true, 
      data: filteredStudents,
      count: filteredStudents.length
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch students' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.enrollmentNumber || !body.class) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Check if enrollment number already exists
    const existingStudent = studentsDb.find(
      (student) => student.enrollmentNumber === body.enrollmentNumber
    );
    
    if (existingStudent) {
      return NextResponse.json({ 
        success: false, 
        error: 'Student with this enrollment number already exists' 
      }, { status: 409 });
    }

    // Create new student
    const newStudent: Student = {
      id: `STU${(studentsDb.length + 1).toString().padStart(4, '0')}`,
      ...body,
      status: body.status || 'active',
      dateOfJoining: body.dateOfJoining || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    studentsDb.push(newStudent);

    return NextResponse.json({ 
      success: true, 
      data: newStudent 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create student' 
    }, { status: 500 });
  }
}