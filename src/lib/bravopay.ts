const BRAVOPAY_API = process.env.BRAVOPAY_API_URL || 'https://api.bravopay.club';
const BRAVOPAY_TOKEN = process.env.BRAVOPAY_TOKEN || '';

interface PixRequest {
  amount: number;
  description: string;
  externalId: string;
  customer: {
    name: string;
    email: string;
    cpf: string;
  };
}

interface PixResponse {
  id: string;
  qrCode: string;
  qrCodeBase64: string;
  copyPaste: string;
  amount: number;
  status: string;
  expiresAt: string;
}

export async function createPixCharge(data: PixRequest): Promise<PixResponse> {
  const response = await fetch(`${BRAVOPAY_API}/v1/pix/charges`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BRAVOPAY_TOKEN}`,
    },
    body: JSON.stringify({
      amount: Math.round(data.amount * 100),
      description: data.description,
      external_id: data.externalId,
      customer: {
        name: data.customer.name,
        email: data.customer.email,
        document: data.customer.cpf.replace(/\D/g, ''),
      },
      expiration: 3600,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`BravoPay error: ${error}`);
  }

  const result = await response.json();

  return {
    id: result.id || result.txid,
    qrCode: result.qr_code || result.qrCode || result.location,
    qrCodeBase64: result.qr_code_base64 || result.qrCodeBase64 || result.imagemQrcode,
    copyPaste: result.copy_paste || result.copyPaste || result.pixCopiaECola || result.qr_code,
    amount: data.amount,
    status: result.status || 'pending',
    expiresAt: result.expires_at || result.expiresAt || new Date(Date.now() + 3600000).toISOString(),
  };
}

export async function checkPixStatus(chargeId: string): Promise<{ status: string; paidAt?: string }> {
  const response = await fetch(`${BRAVOPAY_API}/v1/pix/charges/${chargeId}`, {
    headers: {
      'Authorization': `Bearer ${BRAVOPAY_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to check payment status');
  }

  const result = await response.json();

  return {
    status: result.status,
    paidAt: result.paid_at || result.paidAt,
  };
}
