export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center px-4">
        <div className="bg-[#FFD100] text-black font-black text-3xl px-6 py-3 rounded-xl mb-6 inline-block">
          SEM PARAR
        </div>
        <h1 className="text-2xl font-bold mb-4">Black Friday 2024</h1>
        <p className="text-gray-400 mb-8">
          Esta e uma pagina de promocao exclusiva.<br />
          Use seu link personalizado para acessar sua oferta.
        </p>
        <div className="bg-zinc-900 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-sm text-gray-500 mb-2">Formato do link:</p>
          <code className="text-[#FFD100] bg-black px-4 py-2 rounded block">
            /[seu-codigo-nrc]
          </code>
        </div>
      </div>
    </div>
  );
}
