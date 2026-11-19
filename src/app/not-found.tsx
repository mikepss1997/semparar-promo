import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0e0d0d] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <span className="text-white font-bold text-2xl">Sem Parar</span>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-8">
          <h1 className="text-white text-2xl font-bold mb-4">
            Link nao encontrado
          </h1>

          <p className="text-white/60 mb-8">
            Este link promocional nao existe ou ja expirou.
          </p>

          <a
            href="https://www.semparar.com.br"
            className="inline-block bg-[#D60B52] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#B20944] transition-colors"
          >
            Ir para semparar.com.br
          </a>
        </div>
      </div>
    </div>
  );
}
