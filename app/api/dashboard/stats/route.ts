import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get today's start and end timestamps
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Use a transaction to ensure consistent connection handling
    const stats = await prisma.$transaction(async (tx) => {
      const [todayPrescriptions, todayMedicines, totalPrescriptions, totalMedicines] = await Promise.all([
        tx.prescription.count({
          where: {
            createdAt: {
              gte: today,
              lt: tomorrow
            }
          }
        }),
        tx.medicine.count({
          where: {
            createdAt: {
              gte: today,
              lt: tomorrow
            }
          }
        }),
        tx.prescription.count(),
        tx.medicine.count()
      ]);

      return {
        todayPrescriptions,
        todayMedicines,
        totalPrescriptions,
        totalMedicines
      };
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
} 