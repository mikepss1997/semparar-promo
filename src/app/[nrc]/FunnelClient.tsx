'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LeadData {
  nrc: number;
  nome: string;
  firstName: string;
  email: string;
  cidade: string;
  estado: string;
  placas: string[];
  tags: string[];
  planos: string[];
  qtdVeiculos: number;
  situacao: number;
}

export default function FunnelClient({ lead }: { lead: LeadData }) {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

  const promoPrice = 29.90;
  const regularPrice = 49.90;
  const monthsFree = lead.qtdVeiculos >= 3 ? 12 : lead.qtdVeiculos >= 2 ? 9 : 6;

  const handleCopy = () => {
    navigator.clipboard.writeText(`BFVIP${lead.nrc}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#e6e6e6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Image src="/logo.png" alt="Sem Parar" width={120} height={32} className="h-8 w-auto" />
          <div className="hidden sm:flex items-center gap-6 text-sm text-[#0e0d0d]">
            <span>Para voce</span>
            <span>Para empresas</span>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-[#f8f8f8] border-b border-[#e6e6e6]">
        <div className="max-w-[800px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${step >= 1 ? 'bg-[#d60b52] text-white' : 'bg-[#e6e6e6] text-[#999]'}`}>1</span>
              <span className={step >= 1 ? 'text-[#0e0d0d] font-medium' : 'text-[#999]'}>Sua oferta</span>
            </div>
            <div className="flex-1 h-[2px] bg-[#e6e6e6] mx-4">
              <div className={`h-full bg-[#d60b52] transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${step >= 2 ? 'bg-[#d60b52] text-white' : 'bg-[#e6e6e6] text-[#999]'}`}>2</span>
              <span className={step >= 2 ? 'text-[#0e0d0d] font-medium' : 'text-[#999]'}>Beneficios</span>
            </div>
            <div className="flex-1 h-[2px] bg-[#e6e6e6] mx-4">
              <div className={`h-full bg-[#d60b52] transition-all ${step >= 3 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${step >= 3 ? 'bg-[#d60b52] text-white' : 'bg-[#e6e6e6] text-[#999]'}`}>3</span>
              <span className={step >= 3 ? 'text-[#0e0d0d] font-medium' : 'text-[#999]'}>Finalizar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Oferta */}
      {step === 1 && (
        <main className="max-w-[800px] mx-auto px-4 py-8 sm:py-12">
          <div className="text-center mb-8">
            <span className="inline-block bg-[#d60b52] text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              BLACK FRIDAY
            </span>
            <h1 className="text-[#0e0d0d] text-2xl sm:text-[32px] font-bold leading-tight mb-3">
              Ola, {lead.firstName}!
            </h1>
            <p className="text-[#666] text-base sm:text-lg">
              Preparamos uma oferta exclusiva para voce
            </p>
          </div>

          {/* Card de oferta */}
          <div className="bg-white border border-[#e6e6e6] rounded-xl p-6 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <p className="text-[#999] text-sm mb-1">Plano Sem Parar</p>
                <h2 className="text-[#0e0d0d] text-xl font-bold mb-2">TAG de Pedagio + Estacionamentos</h2>
                <div className="flex items-center gap-3">
                  <span className="text-[#999] text-sm line-through">R$ {regularPrice.toFixed(2).replace('.', ',')}/mes</span>
                  <span className="bg-[#d60b52] text-white text-xs font-semibold px-2 py-0.5 rounded">-40%</span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[#999] text-xs mb-1">Por apenas</p>
                <p className="text-[#d60b52] text-4xl sm:text-5xl font-bold">
                  R$ {promoPrice.toFixed(2).replace('.', ',')}
                  <span className="text-lg font-normal text-[#666]">/mes</span>
                </p>
                <p className="text-[#666] text-sm mt-1">por {monthsFree} meses</p>
              </div>
            </div>
          </div>

          {/* Seu perfil */}
          <div className="bg-[#f8f8f8] rounded-xl p-6 mb-8">
            <p className="text-[#999] text-xs font-semibold tracking-wider mb-4">SEU PERFIL SEM PARAR</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[#0e0d0d] text-2xl font-bold">{lead.qtdVeiculos}</p>
                <p className="text-[#666] text-sm">Veiculo{lead.qtdVeiculos !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-[#0e0d0d] text-2xl font-bold">{lead.tags.length}</p>
                <p className="text-[#666] text-sm">TAG{lead.tags.length !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-[#0e0d0d] text-2xl font-bold">{lead.estado}</p>
                <p className="text-[#666] text-sm">Estado</p>
              </div>
            </div>
          </div>

          <button
            onClick={nextStep}
            className="w-full bg-[#d60b52] hover:bg-[#b20944] text-white font-semibold text-base py-4 rounded-xl transition-colors"
          >
            Continuar
          </button>
        </main>
      )}

      {/* Step 2: Beneficios */}
      {step === 2 && (
        <main className="max-w-[800px] mx-auto px-4 py-8 sm:py-12">
          <div className="text-center mb-8">
            <h1 className="text-[#0e0d0d] text-2xl sm:text-[32px] font-bold leading-tight mb-3">
              O que esta incluso
            </h1>
            <p className="text-[#666] text-base sm:text-lg">
              Tudo que voce precisa em um so lugar
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {[
              { title: 'Pedagios', desc: '100% das rodovias pedagiadas do Brasil', icon: '🛣️' },
              { title: 'Estacionamentos', desc: 'Shoppings, aeroportos e hospitais', icon: '🅿️' },
              { title: 'Drive-thrus', desc: "McDonald's, Burger King e mais", icon: '🍔' },
              { title: 'Postos de combustivel', desc: 'Pague com a TAG e acompanhe no app', icon: '⛽' },
              { title: 'Free Flow', desc: 'Passagem automatica sem cancela', icon: '🚗' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white border border-[#e6e6e6] rounded-xl p-5">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-[#0e0d0d] font-semibold">{item.title}</p>
                  <p className="text-[#666] text-sm">{item.desc}</p>
                </div>
                <span className="ml-auto text-[#d60b52]">✓</span>
              </div>
            ))}
          </div>

          <div className="bg-[#f8f8f8] rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#666] text-sm">Taxa de adesao</span>
              <div className="flex items-center gap-2">
                <span className="text-[#999] text-sm line-through">R$ 40,00</span>
                <span className="text-[#0e0d0d] font-semibold">Gratis</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#666] text-sm">Entrega</span>
              <div className="flex items-center gap-2">
                <span className="text-[#999] text-sm line-through">R$ 24,90</span>
                <span className="text-[#0e0d0d] font-semibold">Gratis</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666] text-sm">Fidelidade</span>
              <span className="text-[#0e0d0d] font-semibold">Sem fidelidade</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-white border border-[#e6e6e6] text-[#0e0d0d] font-semibold text-base py-4 rounded-xl hover:bg-[#f8f8f8] transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={nextStep}
              className="flex-1 bg-[#d60b52] hover:bg-[#b20944] text-white font-semibold text-base py-4 rounded-xl transition-colors"
            >
              Continuar
            </button>
          </div>
        </main>
      )}

      {/* Step 3: Finalizar */}
      {step === 3 && (
        <main className="max-w-[800px] mx-auto px-4 py-8 sm:py-12">
          <div className="text-center mb-8">
            <span className="inline-block text-4xl mb-4">🎉</span>
            <h1 className="text-[#0e0d0d] text-2xl sm:text-[32px] font-bold leading-tight mb-3">
              Sua oferta esta pronta!
            </h1>
            <p className="text-[#666] text-base sm:text-lg">
              Use o cupom abaixo para garantir o desconto
            </p>
          </div>

          {/* Resumo */}
          <div className="bg-white border border-[#e6e6e6] rounded-xl p-6 sm:p-8 mb-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#e6e6e6] mb-4">
              <span className="text-[#666]">Plano Sem Parar</span>
              <span className="text-[#0e0d0d] font-semibold">TAG Pedagio + Estacionamentos</span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-[#e6e6e6] mb-4">
              <span className="text-[#666]">Valor promocional</span>
              <span className="text-[#d60b52] font-bold text-xl">R$ {promoPrice.toFixed(2).replace('.', ',')}/mes</span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-[#e6e6e6] mb-4">
              <span className="text-[#666]">Periodo</span>
              <span className="text-[#0e0d0d] font-semibold">{monthsFree} meses</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666]">Economia total</span>
              <span className="text-[#0e0d0d] font-bold">R$ {((regularPrice - promoPrice) * monthsFree + 40 + 24.90).toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {/* Cupom */}
          <div className="bg-[#f8f8f8] rounded-xl p-6 mb-8">
            <p className="text-[#999] text-xs font-semibold tracking-wider mb-3">SEU CUPOM EXCLUSIVO</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white border-2 border-dashed border-[#d60b52] rounded-lg px-4 py-3">
                <code className="text-[#d60b52] text-xl sm:text-2xl font-bold tracking-wider">BFVIP{lead.nrc}</code>
              </div>
              <button
                onClick={handleCopy}
                className="bg-[#0e0d0d] hover:bg-[#333] text-white font-semibold px-5 py-3 rounded-lg transition-colors"
              >
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          <a
            href={`https://www.semparar.com.br/para-voce/tag-de-pedagio?utm_source=promo&utm_campaign=bf2024&cupom=BFVIP${lead.nrc}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#d60b52] hover:bg-[#b20944] text-white font-semibold text-base text-center py-4 rounded-xl transition-colors mb-4"
          >
            Contratar agora no site Sem Parar
          </a>

          <button
            onClick={() => setStep(1)}
            className="w-full text-[#666] text-sm hover:text-[#0e0d0d] transition-colors"
          >
            ← Voltar ao inicio
          </button>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-[#e6e6e6] mt-auto">
        <div className="max-w-[800px] mx-auto px-4 py-6 text-center">
          <Image src="/logo.png" alt="Sem Parar" width={80} height={24} className="h-6 w-auto mx-auto mb-4 opacity-50" />
          <p className="text-[#999] text-xs mb-2">
            DBTrans Internet Ltda. · CNPJ 10.558.633/0001-61
          </p>
          <p className="text-[#ccc] text-xs">
            Oferta valida ate 30/11/2024. Apos o periodo promocional, o valor de R$ {regularPrice.toFixed(2).replace('.', ',')}/mes sera cobrado. Cancele quando quiser.
          </p>
        </div>
      </footer>
    </div>
  );
}
