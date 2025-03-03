import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MedicineCreateInput, MedicineUpdateInput } from '@/app/types/medicine';

// GET /api/medicines - Get all medicines or search by name
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  try {
    const medicines = await prisma.medicine.findMany({
      where: search ? {
        name: {
          contains: search.toLowerCase(),
        }
      } : undefined,
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(medicines);
  } catch (error) {
    console.error('Failed to fetch medicines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medicines' },
      { status: 500 }
    );
  }
}

// POST /api/medicines - Create a new medicine
export async function POST(request: Request) {
  try {
    const body: MedicineCreateInput = await request.json();

    const medicine = await prisma.medicine.create({
      data: {
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    return NextResponse.json(medicine);
  } catch (error) {
    console.error('Failed to create medicine:', error);
    return NextResponse.json(
      { error: 'Failed to create medicine' },
      { status: 500 }
    );
  }
}

// PUT /api/medicines - Update a medicine
export async function PUT(request: Request) {
  try {
    const body: MedicineUpdateInput = await request.json();
    const { id, ...data } = body;

    const medicine = await prisma.medicine.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      }
    });

    return NextResponse.json(medicine);
  } catch (error) {
    console.error('Failed to update medicine:', error);
    return NextResponse.json(
      { error: 'Failed to update medicine' },
      { status: 500 }
    );
  }
}

// DELETE /api/medicines?id={id} - Delete a medicine
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Medicine ID is required' },
      { status: 400 }
    );
  }

  try {
    await prisma.medicine.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete medicine:', error);
    return NextResponse.json(
      { error: 'Failed to delete medicine' },
      { status: 500 }
    );
  }
} 