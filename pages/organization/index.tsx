// Importe as dependências necessárias
import Link from 'next/link';

// Defina o componente Index
const Index = () => {
  return (
    <div className="bg-#101026 min-h-screen text-white">
      {/* Barra de navegação */}
      <nav className="bg-#101026 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/">
              <span className="mr-4 hover:#3fffa3">Home</span>
            </Link>
            <Link href="#vantagens">
              <span className="mr-4 hover:#3fffa3">Vantagens</span>
            </Link>
            <Link href="#download">
              <span className="mr-4 hover:#3fffa3">Download</span>
            </Link>
            <Link href="#cadastro">
              <span className="hover:#3fffa3">Cadastro</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Seção de Introdução */}
      <section className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Sistema de Atendimento para Bares e Restaurantes</h1>
          <p className="text-gray-400 mb-8">
            Facilitando o atendimento, desde a abertura da mesa até o fechamento da fatura.
          </p>
          {/* Botão para Download da Versão Web */}
          <Link href="#download">
            <span className="bg-#3fffa3 hover:bg-#3fffa3-dark rounded-lg px-6 py-2 mx-2">Baixe a Versão Web</span>
          </Link>
          {/* Botão para Cadastro de Empresas */}
          <Link href="#cadastro">
            <span className="bg-#3fffa3 hover:bg-#3fffa3-dark rounded-lg px-6 py-2 mx-2">Cadastro de Empresas</span>
          </Link>
        </div>
      </section>

      {/* Seção de Vantagens */}
      <section id="vantagens" className="bg-gray-800 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-#3fffa3 mb-6">Vantagens de Usar Nossa Solução</h2>
          <ul className="text-left">
            <li>Relatórios avançados com Machine Learning</li>
            <li>Usabilidade otimizada para uma experiência fluida</li>
            <li>Máxima segurança para dados sensíveis</li>
            {/* Adicione mais vantagens conforme necessário */}
          </ul>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-#101026 p-4 text-center">
        <p>Todos os direitos reservados &copy; 2023</p>
      </footer>
    </div>
  );
};

export default Index;
