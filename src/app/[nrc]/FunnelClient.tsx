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
    question: 'Qual é o principal uso do seu veículo?',
    options: ['Trabalho diário', 'Viagens frequentes', 'Uso misto', 'Lazer e fins de semana'],
    reward: 'Adesão R$0',
  },
  {
    id: 2,
    question: 'Quantas vezes por semana você passa em pedágios?',
    options: ['1-3 vezes', '4-7 vezes', '8-15 vezes', 'Mais de 15 vezes'],
    reward: 'Envio Grátis',
  },
  {
    id: 3,
    question: 'Você costuma usar estacionamentos de shoppings?',
    options: ['Sempre', 'Frequentemente', 'Às vezes', 'Raramente'],
    reward: 'Cashback Ativo',
  },
  {
    id: 4,
    question: 'O que mais te incomoda nos pedágios?',
    options: ['Filas', 'Ter dinheiro trocado', 'Velocidade lenta', 'Todos os anteriores'],
    reward: '6 Meses Grátis',
  },
  {
    id: 5,
    question: 'Você já teve problemas com TAG de pedágio antes?',
    options: ['Nunca tive TAG', 'Sim, com outra empresa', 'Sim, com Sem Parar', 'Não, nunca tive problemas'],
    reward: '12 Meses Grátis',
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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-[#FFD100] text-black py-3 px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="font-black text-xl tracking-tight">SEM PARAR</div>
          <span className="text-xs bg-black text-[#FFD100] px-2 py-0.5 rounded font-bold">BLACK FRIDAY</span>
        </div>
        {step !== 'hero' && (
          <button onClick={() => setStep('hero')} className="text-sm font-bold hover:underline">
            ↺ Início
          </button>
        )}
      </header>

      {/* Hero Section */}
      {step === 'hero' && (
        <main className="px-4 py-8 max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="text-[#FFD100] text-sm font-bold mb-2 tracking-widest">OFERTA EXCLUSIVA PARA</div>
            <h1 className="text-3xl font-black mb-2">{lead.firstName.toUpperCase()}</h1>
            <p className="text-gray-400 text-sm">{lead.cidade}/{lead.estado}</p>
          </div>

          <div className="bg-gradient-to-b from-[#FFD100] to-[#FFA500] text-black rounded-2xl p-6 mb-6 text-center">
            <div className="text-xs font-bold tracking-widest mb-2">BLACK FRIDAY SEM PARAR</div>
            <h2 className="text-2xl font-black mb-2">ATÉ {monthsFree} MESES</h2>
            <h2 className="text-2xl font-black mb-4">DE MENSALIDADE GRÁTIS</h2>
            <div className="flex justify-center gap-4 text-sm font-bold">
              <span className="bg-black/20 px-3 py-1 rounded">+ ADESÃO R$0</span>
              <span className="bg-black/20 px-3 py-1 rounded">+ FRETE GRÁTIS</span>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4 mb-6">
            <div className="text-[#FFD100] text-xs font-bold mb-3 tracking-widest">SEU PERFIL SEM PARAR</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Veículos cadastrados:</span>
                <span className="font-bold">{lead.qtdVeiculos} veículo{lead.qtdVeiculos !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">TAGs ativas:</span>
                <span className="font-bold">{lead.tags.length} TAG{lead.tags.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Placas:</span>
                <span className="font-bold">{lead.placas.join(', ')}</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-xs text-gray-500 mb-2">QUIZ INTERATIVO • 30 SEGUNDOS</div>
            <p className="text-sm text-gray-300">Responda 5 perguntas e destrave sua oferta personalizada</p>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full bg-[#FFD100] text-black font-black py-4 rounded-xl text-lg hover:bg-[#FFE44D] transition-colors"
          >
            INICIAR E DESTRAVAR OFERTA →
          </button>

          <div className="mt-6 flex justify-center gap-6 text-xs text-gray-500">
            <span>🏷️ Adesão R$0</span>
            <span>🚚 Frete Grátis</span>
            <span>🔥 Até 12m Grátis</span>
          </div>
        </main>
      )}

      {/* Quiz Section */}
      {step === 'quiz' && (
        <main className="px-4 py-6 max-w-lg mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">PERGUNTA {currentQuestion + 1} DE {questions.length}</span>
              <span className="text-xs text-[#FFD100] font-bold">⚡ {Math.round(progress)}% DESTRAVADO</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FFD100] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {questions.map((q, i) => (
              <span
                key={q.id}
                className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${
                  i < currentQuestion
                    ? 'bg-[#FFD100] text-black font-bold'
                    : i === currentQuestion
                    ? 'bg-[#FFD100]/20 text-[#FFD100] border border-[#FFD100]'
                    : 'bg-zinc-800 text-gray-500'
                }`}
              >
                {i < currentQuestion ? '✓ ' : i === currentQuestion ? '' : '🔒 '}{q.reward}
              </span>
            ))}
          </div>

          <div className="bg-zinc-900 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">{questions[currentQuestion].question}</h2>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full text-left bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-[#FFD100] rounded-xl p-4 transition-all"
                >
                  <span className="text-[#FFD100] font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-500">
            Olá {lead.firstName}, suas respostas personalizam sua oferta
          </p>
        </main>
      )}

      {/* Gate Section */}
      {step === 'gate' && (
        <main className="px-4 py-8 max-w-lg mx-auto text-center">
          <div className="mb-8">
            <div className="text-[#FFD100] text-sm font-bold mb-2 tracking-widest">PERFIL IDENTIFICADO</div>
            <h1 className="text-2xl font-black mb-2">{lead.firstName.toUpperCase()}, SUA OFERTA</h1>
            <h1 className="text-2xl font-black">ESTÁ PRONTA!</h1>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 mb-6">
            <div className="text-6xl mb-4">{gateOpen ? '🟢' : '🔴'}</div>
            <div className="text-sm text-gray-400 mb-4">
              {gateOpen ? 'CANCELA ABERTA • OFERTA DESTRAVADA!' : 'CANCELA FECHADA • AGUARDANDO SINAL'}
            </div>

            <div className="relative h-4 bg-zinc-800 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-[#FFD100] to-[#00FF00] transition-all"
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
              className={`w-full py-6 rounded-xl font-black text-lg transition-all ${
                gateOpen
                  ? 'bg-green-500 text-white'
                  : isHolding
                  ? 'bg-[#FFD100] text-black scale-95'
                  : 'bg-[#FFD100] text-black hover:scale-105'
              }`}
            >
              {gateOpen ? '✓ OFERTA DESTRAVADA!' : isHolding ? `SEGURE... ${gateProgress}%` : '✋ SEGURE PARA DESTRAVAR'}
            </button>
          </div>

          <div className="flex justify-center gap-2 flex-wrap">
            {unlockedRewards.map((reward, i) => (
              <span key={i} className="text-xs bg-[#FFD100] text-black px-3 py-1 rounded-full font-bold">
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
            <div className="text-[#FFD100] text-xs font-bold tracking-widest mb-2">🎉 PARABÉNS, {lead.firstName.toUpperCase()}!</div>
            <h1 className="text-2xl font-black">SUA OFERTA EXCLUSIVA</h1>
          </div>

          <div className="bg-gradient-to-b from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-[#FFD100] mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs text-gray-500">PACOTE BLACK FRIDAY</div>
                <div className="text-lg font-black text-[#FFD100]">PLANO COMPLETO</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">AVALIAÇÃO</div>
                <div className="text-[#FFD100]">★★★★★ 4.9</div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                <span className="text-gray-400">{monthsFree}x mensalidades</span>
                <div className="text-right">
                  <span className="text-gray-500 line-through text-sm mr-2">R$ {(savingsPerMonth * monthsFree).toFixed(2)}</span>
                  <span className="text-green-400 font-bold">GRÁTIS</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                <span className="text-gray-400">Taxa de adesão</span>
                <div className="text-right">
                  <span className="text-gray-500 line-through text-sm mr-2">R$ 40,00</span>
                  <span className="text-green-400 font-bold">R$ 0,00</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                <span className="text-gray-400">Entrega</span>
                <div className="text-right">
                  <span className="text-gray-500 line-through text-sm mr-2">R$ 24,90</span>
                  <span className="text-green-400 font-bold">CORTESIA</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Cashback em postos</span>
                <span className="text-[#FFD100] font-bold">ATIVO</span>
              </div>
            </div>

            <div className="bg-black rounded-xl p-4 text-center mb-4">
              <div className="text-xs text-gray-500 mb-1">MENSALIDADE POR</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-500 line-through">R$ 34,90/mês</span>
                <span className="text-3xl font-black text-[#FFD100]">R$ 0,00</span>
                <span className="text-gray-500">/mês*</span>
              </div>
              <div className="text-xs text-green-400 mt-2">Economia de R$ {totalSavings.toFixed(2)}</div>
            </div>

            <button className="w-full bg-[#FFD100] text-black font-black py-4 rounded-xl text-lg hover:bg-[#FFE44D] transition-colors mb-3">
              🚀 ATIVAR MINHA OFERTA BLACK FRIDAY
            </button>

            <p className="text-xs text-gray-500 text-center">
              *Válido por {monthsFree} meses. Após, R$ 34,90/mês. Sem fidelidade.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4 mb-6">
            <div className="text-[#FFD100] text-xs font-bold mb-3 tracking-widest">ONDE SUA TAG FUNCIONA</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🛣️', title: '100% RODOVIAS', desc: 'Todas as praças do Brasil' },
                { icon: '🛒', title: 'SHOPPINGS', desc: 'Estacionamentos integrados' },
                { icon: '✈️', title: 'AEROPORTOS', desc: 'Estacionamentos e drive-thru' },
                { icon: '⛽', title: 'POSTOS', desc: 'Cashback em abastecimento' },
              ].map((item, i) => (
                <div key={i} className="bg-zinc-800 rounded-lg p-3">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-xs font-bold">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4 mb-6">
            <div className="text-xs text-gray-500 mb-2">CUPOM EXCLUSIVO</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-black text-[#FFD100] px-4 py-3 rounded-lg font-mono text-lg">
                BF-{lead.nrc}-VIP
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(`BF-${lead.nrc}-VIP`)}
                className="bg-[#FFD100] text-black px-4 py-3 rounded-lg font-bold hover:bg-[#FFE44D]"
              >
                Copiar
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-gray-600">
            <p>Oferta válida para o CPF/NRC #{lead.nrc}</p>
            <p>Sem Parar • Black Friday 2024</p>
          </div>
        </main>
      )}
    </div>
  );
}
