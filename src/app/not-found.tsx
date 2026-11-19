import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-[#e6e6e6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4">
          <Image src="/logo.png" alt="Sem Parar" width={120} height={32} className="h-8 w-auto" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-[#0e0d0d] text-2xl font-bold mb-4">
            Link nao encontrado
          </h1>

          <p className="text-[#666] mb-8">
            Este link promocional nao existe ou ja expirou.
          </p>

          <a
            href="https://www.semparar.com.br"
            className="inline-block bg-[#d60b52] hover:bg-[#b20944] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Ir para semparar.com.br
          </a>
        </div>
      </main>

      <footer className="border-t border-[#e6e6e6]">
        <div className="max-w-[1200px] mx-auto px-4 py-4 text-center">
          <p className="text-[#999] text-xs">Sem Parar · DBTrans Internet Ltda.</p>
        </div>
      </footer>
    </div>
  );
}
