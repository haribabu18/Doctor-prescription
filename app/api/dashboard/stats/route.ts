import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get today's start and end timestamps
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's prescriptions count
    const todayPrescriptions = await prisma.prescription.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    // Get today's medicines count
    const todayMedicines = await prisma.medicine.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    // Get total prescriptions count
    const totalPrescriptions = await prisma.prescription.count();

    // Get total medicines count
    const totalMedicines = await prisma.medicine.count();

    return NextResponse.json({
      todayPrescriptions,
      todayMedicines,
      totalPrescriptions,
      totalMedicines
    });
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
} 