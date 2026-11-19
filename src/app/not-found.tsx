import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-2xl font-bold mb-4">Link não encontrado</h1>
        <p className="text-gray-400 mb-8">
          Este link promocional não existe ou expirou.<br />
          Verifique se você digitou o código corretamente.
        </p>
        <Link
          href="/"
          className="bg-[#FFD100] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#FFE44D] transition-colors inline-block"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
