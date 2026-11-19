import { Suspense } from 'react';
import { connectToDatabase, Lead } from '@/lib/mongodb';
import { notFound } from 'next/navigation';
import FunnelClient from './FunnelClient';

export const instant = false;

interface PageProps {
  params: Promise<{ nrc: string }>;
}

async function getLead(nrc: number): Promise<Lead | null> {
  try {
    const { db } = await connectToDatabase();
    const lead = await db.collection('leads').findOne({ nrc }) as Lead | null;
    return lead;
  } catch (error) {
    console.error('Error fetching lead:', error);
    return null;
  }
}

async function LeadContent({ nrc }: { nrc: string }) {
  const nrcNum = parseInt(nrc, 10);

  if (isNaN(nrcNum)) {
    notFound();
  }

  const lead = await getLead(nrcNum);

  if (!lead) {
    notFound();
  }

  const placas = lead.placas?.split('|').filter(Boolean) || [];
  const tags = lead.tags?.split('|').filter(Boolean) || [];
  const planos = lead.planos?.split('|').filter(Boolean) || [];
  const firstName = lead.nome?.split(' ')[0] || 'Cliente';

  const leadData = {
    nrc: lead.nrc,
    nome: lead.nome,
    firstName,
    email: lead.email,
    cpf: lead.cpf || '',
    cidade: lead.end_cidade,
    estado: lead.end_estado,
    placas,
    tags,
    planos,
    qtdVeiculos: placas.length,
    situacao: lead.situacao_conta,
  };

  return <FunnelClient lead={leadData} />;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#e6e6e6] border-t-[#d60b52] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#666]">Carregando sua oferta...</p>
      </div>
    </div>
  );
}

export default async function PromoPage({ params }: PageProps) {
  const { nrc } = await params;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <LeadContent nrc={nrc} />
    </Suspense>
  );
}
