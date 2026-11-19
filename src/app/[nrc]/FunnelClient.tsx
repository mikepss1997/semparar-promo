'use client';

import { useState } from 'react';

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
  const [copied, setCopied] = useState(false);

  const monthsFree = lead.qtdVeiculos >= 3 ? 12 : lead.qtdVeiculos >= 2 ? 9 : 6;
  const pricePerMonth = 2.40;
  const regularPrice = 49.90;

  const handleCopy = () => {
    navigator.clipboard.writeText(`BF${lead.nrc}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0e0d0d]">
      {/* Header */}
      <header className="bg-[#0e0d0d] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-white font-bold text-xl tracking-tight">Sem Parar</span>
            <span className="hidden sm:block text-white/40 text-sm">|</span>
            <span className="hidden sm:block text-white/60 text-sm">Oferta exclusiva</span>
          </div>
          <a href="https://www.semparar.com.br" target="_blank" rel="noopener" className="text-white/60 text-sm hover:text-white transition-colors">
            semparar.com.br
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0e0d0d] to-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20 text-center">
          <div className="inline-block bg-[#D60B52] text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
            BLACK FRIDAY 2024
          </div>

          <h1 className="text-white text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            Ola, {lead.firstName}
          </h1>

          <p className="text-white/60 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Preparamos uma oferta exclusiva baseada no seu perfil Sem Parar
          </p>

          <div className="bg-[#D60B52] rounded-2xl p-8 sm:p-12 max-w-xl mx-auto">
            <p className="text-white/80 text-sm mb-2 tracking-wide">PLANO COMPLETO POR</p>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-white text-5xl sm:text-7xl font-bold">R${pricePerMonth.toFixed(2).replace('.', ',')}</span>
              <span className="text-white/60 text-lg">/mes</span>
            </div>
            <p className="text-white/60 text-sm mb-6">por {monthsFree} meses</p>

            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="bg-white/20 text-white px-4 py-2 rounded-full">Adesao gratis</span>
              <span className="bg-white/20 text-white px-4 py-2 rounded-full">Frete gratis</span>
              <span className="bg-white/20 text-white px-4 py-2 rounded-full">Sem fidelidade</span>
            </div>
          </div>
        </div>
      </section>

      {/* Perfil do cliente */}
      <section className="bg-[#1a1a1a] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-white/40 text-xs font-semibold tracking-widest mb-6">SEU PERFIL</h2>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-[#0e0d0d] rounded-xl p-6">
              <p className="text-white/40 text-sm mb-1">Veiculos</p>
              <p className="text-white text-2xl font-semibold">{lead.qtdVeiculos}</p>
            </div>
            <div className="bg-[#0e0d0d] rounded-xl p-6">
              <p className="text-white/40 text-sm mb-1">TAGs ativas</p>
              <p className="text-white text-2xl font-semibold">{lead.tags.length}</p>
            </div>
            <div className="bg-[#0e0d0d] rounded-xl p-6">
              <p className="text-white/40 text-sm mb-1">Localizacao</p>
              <p className="text-white text-2xl font-semibold">{lead.cidade}/{lead.estado}</p>
            </div>
          </div>

          {lead.placas.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {lead.placas.map((placa, i) => (
                <span key={i} className="bg-[#0e0d0d] text-white/60 px-4 py-2 rounded-lg text-sm font-mono">
                  {placa}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detalhes da oferta */}
      <section className="bg-[#0e0d0d]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-white text-2xl font-bold mb-8">O que esta incluso</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-white/10">
              <div>
                <p className="text-white font-medium">Mensalidade</p>
                <p className="text-white/40 text-sm">Por {monthsFree} meses</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-sm line-through">R$ {regularPrice.toFixed(2).replace('.', ',')}/mes</p>
                <p className="text-[#D60B52] font-bold text-lg">R$ {pricePerMonth.toFixed(2).replace('.', ',')}/mes</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-white/10">
              <div>
                <p className="text-white font-medium">Taxa de adesao</p>
                <p className="text-white/40 text-sm">Ativacao da TAG</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-sm line-through">R$ 40,00</p>
                <p className="text-emerald-400 font-bold text-lg">Gratis</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-white/10">
              <div>
                <p className="text-white font-medium">Entrega</p>
                <p className="text-white/40 text-sm">Envio para seu endereco</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-sm line-through">R$ 24,90</p>
                <p className="text-emerald-400 font-bold text-lg">Gratis</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-white font-medium">Cobertura</p>
                <p className="text-white/40 text-sm">Pedagios, shoppings, postos</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-lg">100% Brasil</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cobertura */}
      <section className="bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-white text-2xl font-bold mb-8">Onde sua TAG funciona</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { title: 'Pedagios', desc: '100% das rodovias' },
              { title: 'Shoppings', desc: 'Estacionamentos' },
              { title: 'Postos', desc: 'Abastecimento' },
              { title: 'Drive-thrus', desc: 'Lanchonetes' },
            ].map((item, i) => (
              <div key={i} className="bg-[#0e0d0d] rounded-xl p-5 text-center">
                <p className="text-white font-semibold mb-1">{item.title}</p>
                <p className="text-white/40 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-[#0e0d0d]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-gradient-to-r from-[#D60B52] to-[#8D0736] rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-4">
              Ative sua oferta exclusiva
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Use o cupom abaixo no checkout para garantir {monthsFree} meses por R${pricePerMonth.toFixed(2).replace('.', ',')}/mes
            </p>

            <div className="bg-black/30 rounded-xl p-4 max-w-sm mx-auto mb-6">
              <p className="text-white/60 text-xs mb-2">Seu cupom exclusivo</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-white text-2xl font-mono font-bold tracking-wider">
                  BF{lead.nrc}
                </code>
                <button
                  onClick={handleCopy}
                  className="bg-white text-[#D60B52] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <a
              href={`https://www.semparar.com.br/para-voce/tag-de-pedagio?cupom=BF${lead.nrc}`}
              target="_blank"
              rel="noopener"
              className="inline-block bg-white text-[#D60B52] font-bold text-lg px-8 py-4 rounded-xl hover:bg-white/90 transition-colors"
            >
              Contratar agora
            </a>

            <p className="text-white/40 text-xs mt-6">
              Oferta valida ate 30/11/2024 · Codigo #{lead.nrc}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0e0d0d] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-white/40 text-sm mb-2">
            Sem Parar · CNPJ 10.558.633/0001-61
          </p>
          <p className="text-white/20 text-xs">
            Apos o periodo promocional, o valor de R$ {regularPrice.toFixed(2).replace('.', ',')}/mes volta a ser cobrado. Sem fidelidade.
          </p>
        </div>
      </footer>
    </div>
  );
}
