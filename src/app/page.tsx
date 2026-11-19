export default function Home() {
  return (
    <div className="min-h-screen bg-[#0e0d0d] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <span className="text-white font-bold text-2xl">Sem Parar</span>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-8 text-center">
          <div className="inline-block bg-[#D60B52] text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            BLACK FRIDAY 2024
          </div>

          <h1 className="text-white text-2xl font-bold mb-4">
            Pagina de oferta exclusiva
          </h1>

          <p className="text-white/60 mb-8">
            Esta pagina requer um link personalizado para acessar sua oferta.
          </p>

          <div className="bg-[#0e0d0d] rounded-xl p-4 mb-6">
            <p className="text-white/40 text-sm mb-2">Formato do link</p>
            <code className="text-[#D60B52] font-mono">/seu-codigo</code>
          </div>

          <a
            href="https://www.semparar.com.br"
            className="inline-block text-white/60 text-sm hover:text-white transition-colors"
          >
            Ir para semparar.com.br →
          </a>
        </div>
      </div>
    </div>
  );
}
