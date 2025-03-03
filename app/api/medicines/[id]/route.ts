import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT /api/medicines/[id] - Update a medicine
export async function PUT(
  request: Request
) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json(
      { error: 'Medicine ID is required' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const medicine = await prisma.medicine.update({
      where: {
        id: id,
      },
      data: {
        name: body.name,
        description: body.description || null,
        dosageForm: body.dosageForm || null,
        strength: body.strength || null,
        manufacturer: body.manufacturer || null,
      },
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

// DELETE /api/medicines/[id] - Delete a medicine
export async function DELETE(
  request: Request
) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json(
      { error: 'Medicine ID is required' },
      { status: 400 }
    );
  }

  try {
    await prisma.medicine.delete({
      where: {
        id: id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete medicine:', error);
    return NextResponse.json(
      { error: 'Failed to delete medicine' },
      { status: 500 }
    );
  }
} 