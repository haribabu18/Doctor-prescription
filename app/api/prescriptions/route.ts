import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prescription, Medicine as PrescriptionMedicine, TestReport as PrescriptionTestReport } from '@/app/types/prescription';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// GET /api/prescriptions - Get all prescriptions
export async function GET() {
  try {
    const prescriptions = await prisma.prescription.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        medicines: true,
        testReports: true
      }
    });

    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error('Failed to fetch prescriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prescriptions' },
      { status: 500 }
    );
  }
}

// POST /api/prescriptions - Create a new prescription
export async function POST(request: Request) {
  try {
    const body = await request.json() as Prescription;
    console.log('Received prescription data:', JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.patientName || !body.age || !body.date) {
      return NextResponse.json(
        { error: 'Missing required fields: patientName, age, and date are required' },
        { status: 400 }
      );
    }

    try {
      const prescription = await prisma.prescription.create({
        data: {
          date: new Date(body.date).toISOString(),
          patientName: body.patientName,
          age: Number(body.age),
          phoneNumber: body.phoneNumber || null,
          courseDays: Number(body.courseDays),
          doctorNotes: body.doctorNotes || null,
          nextVisit: body.nextVisit ? new Date(body.nextVisit).toISOString() : null,
          vitalSigns: body.vitalSigns ? JSON.stringify(body.vitalSigns) : null,
          medicines: {
            create: body.medicines.map((medicine: PrescriptionMedicine) => ({
              name: medicine.name,
              morning: medicine.morning,
              afternoon: medicine.afternoon,
              evening: medicine.evening,
              night: medicine.night,
              quantity: medicine.quantity || 0
            }))
          },
          testReports: body.testReports && body.testReports.length > 0 ? {
            create: body.testReports.map((test: PrescriptionTestReport) => ({
              testName: test.testName,
              result: test.result,
              date: test.date ? new Date(test.date).toISOString() : null
            }))
          } : undefined
        }
      });

      return NextResponse.json(prescription);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.error('Database error:', error);
        return NextResponse.json(
          { 
            error: 'Database error',
            details: error.message,
            code: error.code
          },
          { status: 500 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Failed to create prescription:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create prescription',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 