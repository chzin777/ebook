import FormUse from './_components/Form'

export default function Home() {
  return (
    <main className="w-full bg-gradient-to-b from-[#000000] to-[#000] text-white">
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 py-24 overflow-hidden flex-col">
        {/* Imagem de fundo com blur */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://reflectivenw.com/wp-content/uploads/2024/07/Feature-how-to-start-a-window-cleaning-business.jpeg"
            alt="fundo"
            className="w-full h-full object-cover blur-sm scale-110 opacity-60"
          />
        </div>

        {/* Logo centralizada e visível */}
        <div className="relative z-10 mb-8">
          <img
            src="/images/logo.png"
            alt="Logo da R3 Suprimentos"
            className="w-40 sm:w-52 h-auto mx-auto"
          />
        </div>

        {/* Conteúdo por cima */}
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Desbloqueie seu eBook gratuito!
          </h1>
          <p className="text-xl sm:text-3xl">
            Aprenda tudo sobre os 3 erros mais comuns na limpeza profissional com nosso material exclusivo.
          </p>
        </div>

        <svg className="w-12 h-12 text-white animate-bounce mt-8 z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </section>



      <section className="px-6 py-24 bg-[#111] text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-6">O que você vai aprender</h2>
        <p className="max-w-2xl mx-auto text-2xl sm:text-xl leading-relaxed">
          Descubra os principais erros que comprometem a eficácia da limpeza profissional e como evitá-los no dia a dia.
          Aprenda a utilizar os produtos certos, na diluição correta, e implemente processos padronizados para garantir qualidade,
          segurança e resultados superiores em cada ambiente. Torne sua equipe mais eficiente e reduza retrabalhos com dicas práticas
          aplicáveis imediatamente.
        </p>
      </section>



      {/* Formulário no final */}
      <section className="px-6 py-24 bg-[#233261] text-white">
        <div className="max-w-4xl mx-auto">
          <FormUse />
        </div>
      </section>

      <footer className='bg-[#4a4a49] text-white text-center py-6 text-sm sm:text-texbase'>
        <p>© {new Date().getFullYear()} R3 Suprimentos. Todos os direitos reservados.</p>
      </footer>

    </main>
  )
}
