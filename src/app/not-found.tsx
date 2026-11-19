import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0E0D0D] text-white flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-2xl font-bold mb-4">Link nao encontrado</h1>
        <p className="text-gray-400 mb-8">
          Este link promocional nao existe ou expirou.<br />
          Verifique se voce digitou o codigo corretamente.
        </p>
        <Link
          href="/"
          className="bg-[#D60B52] hover:bg-[#B20944] text-white font-semibold px-6 py-3 rounded-xl transition-colors inline-block"
        >
          Voltar ao inicio
        </Link>
      </div>
    </div>
  );
}
