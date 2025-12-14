import { NextRequest, NextResponse } from 'next/server';
import { mockAttendance } from '@/lib/mockData';
import { Attendance } from '@/types';

// In-memory "database" simulation
let attendanceDb = [...mockAttendance];

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const date = searchParams.get('date');
    const studentId = searchParams.get('studentId');

    let filteredAttendance = [...attendanceDb];

    if (search) {
      filteredAttendance = filteredAttendance.filter(record =>
        record.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
        record.studentId.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (date) {
      filteredAttendance = filteredAttendance.filter(record => record.date === date);
    }

    if (studentId) {
      filteredAttendance = filteredAttendance.filter(record => record.studentId === studentId);
    }

    // Populate student data if not already populated
    filteredAttendance = filteredAttendance.map(record => ({
      ...record,
      student: record.student || mockAttendance.find(a => a.id === record.id)?.student
    }));

    return NextResponse.json({ 
      success: true, 
      data: filteredAttendance,
      count: filteredAttendance.length
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch attendance' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.studentId || !body.date) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Check if attendance for this student and date already exists
    const existingAttendance = attendanceDb.find(
      (att) => att.studentId === body.studentId && att.date === body.date
    );
    
    if (existingAttendance) {
      return NextResponse.json({ 
        success: false, 
        error: 'Attendance for this student and date already exists' 
      }, { status: 409 });
    }

    // Create new attendance record
    const newAttendance: Attendance = {
      id: `ATT${(attendanceDb.length + 1).toString().padStart(4, '0')}`,
      ...body,
      createdAt: new Date().toISOString()
    };

    attendanceDb.push(newAttendance);

    return NextResponse.json({ 
      success: true, 
      data: newAttendance 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating attendance:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create attendance' 
    }, { status: 500 });
  }
}