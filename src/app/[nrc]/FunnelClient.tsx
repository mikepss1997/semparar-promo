'use client';

import { useState, useEffect, useRef } from 'react';

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

interface FunnelClientProps {
  lead: LeadData;
}

const questions = [
  {
    id: 1,
    question: 'Qual e o principal uso do seu veiculo?',
    options: ['Trabalho diario', 'Viagens frequentes', 'Uso misto', 'Lazer e fins de semana'],
    reward: 'Adesao R$0',
  },
  {
    id: 2,
    question: 'Quantas vezes por semana voce passa em pedagios?',
    options: ['1-3 vezes', '4-7 vezes', '8-15 vezes', 'Mais de 15 vezes'],
    reward: 'Envio Gratis',
  },
  {
    id: 3,
    question: 'Voce costuma usar estacionamentos de shoppings?',
    options: ['Sempre', 'Frequentemente', 'As vezes', 'Raramente'],
    reward: 'Cashback Ativo',
  },
  {
    id: 4,
    question: 'O que mais te incomoda nos pedagios?',
    options: ['Filas', 'Ter dinheiro trocado', 'Velocidade lenta', 'Todos os anteriores'],
    reward: '6 Meses Gratis',
  },
  {
    id: 5,
    question: 'Voce ja teve problemas com TAG de pedagio antes?',
    options: ['Nunca tive TAG', 'Sim, com outra empresa', 'Sim, com Sem Parar', 'Nao, nunca tive problemas'],
    reward: '12 Meses Gratis',
  },
];

export default function FunnelClient({ lead }: FunnelClientProps) {
  const [step, setStep] = useState<'hero' | 'quiz' | 'gate' | 'offer'>('hero');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [unlockedRewards, setUnlockedRewards] = useState<string[]>([]);
  const [gateProgress, setGateProgress] = useState(0);
  const [gateOpen, setGateOpen] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const holdInterval = useRef<NodeJS.Timeout | null>(null);

  const progress = step === 'quiz' ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  const handleStartQuiz = () => {
    setStep('quiz');
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    const reward = questions[currentQuestion].reward;
    setUnlockedRewards([...unlockedRewards, reward]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('gate');
    }
  };

  const startHold = () => {
    setIsHolding(true);
    holdInterval.current = setInterval(() => {
      setGateProgress((prev) => {
        if (prev >= 100) {
          if (holdInterval.current) clearInterval(holdInterval.current);
          setGateOpen(true);
          setTimeout(() => setStep('offer'), 1500);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
  };

  const endHold = () => {
    setIsHolding(false);
    if (holdInterval.current) {
      clearInterval(holdInterval.current);
    }
    if (gateProgress < 100) {
      setGateProgress(0);
    }
  };

  useEffect(() => {
    return () => {
      if (holdInterval.current) clearInterval(holdInterval.current);
    };
  }, []);

  const monthsFree = lead.qtdVeiculos >= 3 ? 12 : lead.qtdVeiculos >= 2 ? 9 : 6;
  const savingsPerMonth = 34.90;
  const totalSavings = savingsPerMonth * monthsFree + 40 + 24.90;

  return (
    <div className="min-h-screen bg-[#0E0D0D] text-white font-[system-ui]">
      {/* Header */}
      <header className="bg-[#D60B52] text-white py-3 px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 120 24" className="h-6 fill-white">
            <text x="0" y="18" className="font-bold text-lg">SEM PARAR</text>
          </svg>
          <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-semibold tracking-wide">BLACK FRIDAY</span>
        </div>
        {step !== 'hero' && (
          <button onClick={() => setStep('hero')} className="text-sm font-medium hover:underline">
            ← Inicio
          </button>
        )}
      </header>

      {/* Hero Section */}
      {step === 'hero' && (
        <main className="px-4 py-8 max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="text-[#D60B52] text-sm font-semibold mb-2 tracking-widest">OFERTA EXCLUSIVA PARA</div>
            <h1 className="text-3xl font-bold mb-2">{lead.firstName}</h1>
            <p className="text-gray-400 text-sm">{lead.cidade}/{lead.estado}</p>
          </div>

          <div className="bg-gradient-to-br from-[#D60B52] to-[#8D0736] text-white rounded-2xl p-6 mb-6 text-center shadow-lg shadow-[#D60B52]/20">
            <div className="text-xs font-semibold tracking-widest mb-2 opacity-80">BLACK FRIDAY SEM PARAR</div>
            <h2 className="text-2xl font-bold mb-1">ATE {monthsFree} MESES</h2>
            <h2 className="text-2xl font-bold mb-4">DE MENSALIDADE GRATIS</h2>
            <div className="flex justify-center gap-3 text-xs font-medium">
              <span className="bg-white/20 px-3 py-1.5 rounded-full">+ ADESAO R$0</span>
              <span className="bg-white/20 px-3 py-1.5 rounded-full">+ FRETE GRATIS</span>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-5 mb-6 border border-gray-800">
            <div className="text-[#D60B52] text-xs font-semibold mb-4 tracking-widest">SEU PERFIL SEM PARAR</div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Veiculos cadastrados</span>
                <span className="font-semibold">{lead.qtdVeiculos} veiculo{lead.qtdVeiculos !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">TAGs ativas</span>
                <span className="font-semibold">{lead.tags.length} TAG{lead.tags.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Placas</span>
                <span className="font-semibold text-right">{lead.placas.slice(0, 2).join(', ')}{lead.placas.length > 2 ? ` +${lead.placas.length - 2}` : ''}</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-[10px] text-gray-500 mb-2 tracking-widest">QUIZ INTERATIVO • 30 SEGUNDOS</div>
            <p className="text-sm text-gray-300">Responda 5 perguntas e destrave sua oferta personalizada</p>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full bg-[#D60B52] hover:bg-[#B20944] text-white font-semibold py-4 rounded-xl text-base transition-all shadow-lg shadow-[#D60B52]/30"
          >
            INICIAR E DESTRAVAR OFERTA →
          </button>

          <div className="mt-6 flex justify-center gap-4 text-[11px] text-gray-500">
            <span>🏷️ Adesao R$0</span>
            <span>🚚 Frete Gratis</span>
            <span>🔥 Ate 12m Gratis</span>
          </div>
        </main>
      )}

      {/* Quiz Section */}
      {step === 'quiz' && (
        <main className="px-4 py-6 max-w-lg mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">PERGUNTA {currentQuestion + 1} DE {questions.length}</span>
              <span className="text-xs text-[#D60B52] font-semibold">⚡ {Math.round(progress)}% DESTRAVADO</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D60B52] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {questions.map((q, i) => (
              <span
                key={q.id}
                className={`text-[10px] px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  i < currentQuestion
                    ? 'bg-[#D60B52] text-white font-medium'
                    : i === currentQuestion
                    ? 'bg-[#D60B52]/20 text-[#D60B52] border border-[#D60B52]'
                    : 'bg-gray-800 text-gray-500'
                }`}
              >
                {i < currentQuestion ? '✓ ' : i === currentQuestion ? '' : '🔒 '}{q.reward}
              </span>
            ))}
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6 border border-gray-800">
            <h2 className="text-lg font-semibold mb-6">{questions[currentQuestion].question}</h2>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full text-left bg-[#0E0D0D] hover:bg-[#D60B52]/10 border border-gray-700 hover:border-[#D60B52] rounded-xl p-4 transition-all"
                >
                  <span className="text-[#D60B52] font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-500">
            Ola {lead.firstName}, suas respostas personalizam sua oferta
          </p>
        </main>
      )}

      {/* Gate Section */}
      {step === 'gate' && (
        <main className="px-4 py-8 max-w-lg mx-auto text-center">
          <div className="mb-8">
            <div className="text-[#D60B52] text-sm font-semibold mb-2 tracking-widest">PERFIL IDENTIFICADO</div>
            <h1 className="text-2xl font-bold mb-1">{lead.firstName}, SUA OFERTA</h1>
            <h1 className="text-2xl font-bold">ESTA PRONTA!</h1>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6 border border-gray-800">
            <div className="text-6xl mb-4">{gateOpen ? '🟢' : '🔴'}</div>
            <div className="text-sm text-gray-400 mb-4">
              {gateOpen ? 'CANCELA ABERTA • OFERTA DESTRAVADA!' : 'CANCELA FECHADA • AGUARDANDO SINAL'}
            </div>

            <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-[#D60B52] to-[#24D696] transition-all"
                style={{ width: `${gateProgress}%` }}
              />
            </div>

            <button
              onMouseDown={startHold}
              onMouseUp={endHold}
              onMouseLeave={endHold}
              onTouchStart={startHold}
              onTouchEnd={endHold}
              disabled={gateOpen}
              className={`w-full py-5 rounded-xl font-semibold text-base transition-all ${
                gateOpen
                  ? 'bg-[#24D696] text-white'
                  : isHolding
                  ? 'bg-[#D60B52] text-white scale-[0.98]'
                  : 'bg-[#D60B52] text-white hover:bg-[#B20944] shadow-lg shadow-[#D60B52]/30'
              }`}
            >
              {gateOpen ? '✓ OFERTA DESTRAVADA!' : isHolding ? `SEGURE... ${gateProgress}%` : '✋ SEGURE PARA DESTRAVAR'}
            </button>
          </div>

          <div className="flex justify-center gap-2 flex-wrap">
            {unlockedRewards.map((reward, i) => (
              <span key={i} className="text-[10px] bg-[#D60B52] text-white px-3 py-1.5 rounded-full font-medium">
                ✓ {reward}
              </span>
            ))}
          </div>
        </main>
      )}

      {/* Offer Section */}
      {step === 'offer' && (
        <main className="px-4 py-6 max-w-lg mx-auto">
          <div className="text-center mb-6">
            <div className="text-[#D60B52] text-xs font-semibold tracking-widest mb-2">🎉 PARABENS, {lead.firstName.toUpperCase()}!</div>
            <h1 className="text-2xl font-bold">SUA OFERTA EXCLUSIVA</h1>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl p-6 border-2 border-[#D60B52] mb-6 shadow-lg shadow-[#D60B52]/10">
            <div className="flex justify-between items-start mb-5">
              <div>
                <div className="text-[10px] text-gray-500 tracking-wider">PACOTE BLACK FRIDAY</div>
                <div className="text-base font-bold text-[#D60B52]">PLANO COMPLETO</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-500">AVALIACAO</div>
                <div className="text-[#D60B52] text-sm">★★★★★ 4.9</div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2.5 border-b border-gray-800">
                <span className="text-gray-400 text-sm">{monthsFree}x mensalidades</span>
                <div className="text-right">
                  <span className="text-gray-600 line-through text-xs mr-2">R$ {(savingsPerMonth * monthsFree).toFixed(2)}</span>
                  <span className="text-[#24D696] font-semibold text-sm">GRATIS</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-gray-800">
                <span className="text-gray-400 text-sm">Taxa de adesao</span>
                <div className="text-right">
                  <span className="text-gray-600 line-through text-xs mr-2">R$ 40,00</span>
                  <span className="text-[#24D696] font-semibold text-sm">R$ 0,00</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-gray-800">
                <span className="text-gray-400 text-sm">Entrega</span>
                <div className="text-right">
                  <span className="text-gray-600 line-through text-xs mr-2">R$ 24,90</span>
                  <span className="text-[#24D696] font-semibold text-sm">CORTESIA</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-gray-400 text-sm">Cashback em postos</span>
                <span className="text-[#D60B52] font-semibold text-sm">ATIVO</span>
              </div>
            </div>

            <div className="bg-[#0E0D0D] rounded-xl p-4 text-center mb-5">
              <div className="text-[10px] text-gray-500 mb-1">MENSALIDADE POR</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-600 line-through text-sm">R$ 34,90/mes</span>
                <span className="text-3xl font-bold text-[#D60B52]">R$ 0,00</span>
                <span className="text-gray-500 text-sm">/mes*</span>
              </div>
              <div className="text-[11px] text-[#24D696] mt-2 font-medium">Economia de R$ {totalSavings.toFixed(2)}</div>
            </div>

            <button className="w-full bg-[#D60B52] hover:bg-[#B20944] text-white font-semibold py-4 rounded-xl text-sm transition-all shadow-lg shadow-[#D60B52]/30 mb-3">
              🚀 ATIVAR MINHA OFERTA BLACK FRIDAY
            </button>

            <p className="text-[10px] text-gray-500 text-center">
              *Valido por {monthsFree} meses. Apos, R$ 34,90/mes. Sem fidelidade.
            </p>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-5 mb-6 border border-gray-800">
            <div className="text-[#D60B52] text-[10px] font-semibold mb-4 tracking-widest">ONDE SUA TAG FUNCIONA</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🛣️', title: '100% RODOVIAS', desc: 'Todas as pracas do Brasil' },
                { icon: '🛒', title: 'SHOPPINGS', desc: 'Estacionamentos integrados' },
                { icon: '✈️', title: 'AEROPORTOS', desc: 'Estacionamentos e drive-thru' },
                { icon: '⛽', title: 'POSTOS', desc: 'Cashback em abastecimento' },
              ].map((item, i) => (
                <div key={i} className="bg-[#0E0D0D] rounded-lg p-3">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="text-[10px] font-semibold text-white">{item.title}</div>
                  <div className="text-[10px] text-gray-500">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-4 mb-6 border border-gray-800">
            <div className="text-[10px] text-gray-500 mb-2">CUPOM EXCLUSIVO</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-[#0E0D0D] text-[#D60B52] px-4 py-3 rounded-lg font-mono text-base border border-gray-800">
                BF-{lead.nrc}-VIP
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(`BF-${lead.nrc}-VIP`)}
                className="bg-[#D60B52] hover:bg-[#B20944] text-white px-4 py-3 rounded-lg font-semibold text-sm transition-all"
              >
                Copiar
              </button>
            </div>
          </div>

          <div className="text-center text-[10px] text-gray-600">
            <p>Oferta valida para o CPF/NRC #{lead.nrc}</p>
            <p className="mt-1">Sem Parar • Black Friday 2024</p>
          </div>
        </main>
      )}
    </div>
  );
}
