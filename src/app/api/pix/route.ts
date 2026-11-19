import { NextRequest, NextResponse } from 'next/server';
import { createPixCharge, checkPixStatus } from '@/lib/bravopay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { nrc, name, email, cpf, amount } = body;

    if (!nrc || !name || !email || !cpf || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const pix = await createPixCharge({
      amount,
      description: `Sem Parar - Black Friday #${nrc}`,
      externalId: `semparar-bf-${nrc}-${Date.now()}`,
      customer: {
        name,
        email,
        cpf,
      },
    });

    return NextResponse.json(pix);
  } catch (error) {
    console.error('PIX creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create PIX' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const chargeId = searchParams.get('id');

  if (!chargeId) {
    return NextResponse.json({ error: 'Missing charge ID' }, { status: 400 });
  }

  try {
    const status = await checkPixStatus(chargeId);
    return NextResponse.json(status);
  } catch (error) {
    console.error('PIX status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}
