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
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="bg-[#FFD100] text-black font-black text-2xl px-6 py-3 rounded-xl mb-6 inline-block animate-pulse">
          SEM PARAR
        </div>
        <p className="text-gray-400">Carregando sua oferta exclusiva...</p>
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
