import { NextRequest, NextResponse } from 'next/server';

// Mock data for reports
const mockReports = [
  { id: '1', name: 'Student Master Report', type: 'student_master', generatedAt: '2025-12-14', generatedBy: 'Admin', format: 'pdf' },
  { id: '2', name: 'Attendance Report', type: 'attendance', generatedAt: '2025-12-14', generatedBy: 'Teacher', format: 'excel' },
  { id: '3', name: 'Fee Collection Report', type: 'fees', generatedAt: '2025-12-13', generatedBy: 'Accountant', format: 'pdf' },
  { id: '4', name: 'Library Usage Report', type: 'library', generatedAt: '2025-12-12', generatedBy: 'Librarian', format: 'excel' },
  { id: '5', name: 'Expenses Report', type: 'expenses', generatedAt: '2025-12-11', generatedBy: 'Admin', format: 'pdf' },
];

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const typeFilter = searchParams.get('type');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    let filteredReports = [...mockReports];

    if (search) {
      filteredReports = filteredReports.filter(report =>
        report.name.toLowerCase().includes(search.toLowerCase()) ||
        report.generatedBy.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter && typeFilter !== 'all') {
      filteredReports = filteredReports.filter(report => report.type === typeFilter);
    }

    if (dateFrom) {
      filteredReports = filteredReports.filter(report => report.generatedAt >= dateFrom);
    }

    if (dateTo) {
      filteredReports = filteredReports.filter(report => report.generatedAt <= dateTo);
    }

    return NextResponse.json({ 
      success: true, 
      data: filteredReports,
      count: filteredReports.length
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch reports' 
    }, { status: 500 });
  }
}