import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-[#e6e6e6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4">
          <Image src="/logo.png" alt="Sem Parar" width={120} height={32} className="h-8 w-auto" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-block bg-[#d60b52] text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            BLACK FRIDAY 2024
          </div>

          <h1 className="text-[#0e0d0d] text-2xl font-bold mb-4">
            Pagina de oferta exclusiva
          </h1>

          <p className="text-[#666] mb-8">
            Esta pagina requer um link personalizado para acessar sua oferta.
          </p>

          <div className="bg-[#f8f8f8] rounded-xl p-6 mb-6">
            <p className="text-[#999] text-sm mb-2">Formato do link</p>
            <code className="text-[#d60b52] font-semibold">/seu-codigo</code>
          </div>

          <a
            href="https://www.semparar.com.br"
            className="text-[#666] text-sm hover:text-[#d60b52] transition-colors"
          >
            Ir para semparar.com.br →
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
