export default function Home() {
  return (
    <div className="min-h-screen bg-[#0E0D0D] text-white flex items-center justify-center">
      <div className="text-center px-4">
        <div className="bg-[#D60B52] text-white font-bold text-2xl px-6 py-3 rounded-xl mb-6 inline-block">
          SEM PARAR
        </div>
        <h1 className="text-2xl font-bold mb-4">Black Friday 2024</h1>
        <p className="text-gray-400 mb-8">
          Esta e uma pagina de promocao exclusiva.<br />
          Use seu link personalizado para acessar sua oferta.
        </p>
        <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-md mx-auto border border-gray-800">
          <p className="text-sm text-gray-500 mb-2">Formato do link:</p>
          <code className="text-[#D60B52] bg-[#0E0D0D] px-4 py-2 rounded block border border-gray-800">
            /[seu-codigo-nrc]
          </code>
        </div>
      </div>
    </div>
  );
}
