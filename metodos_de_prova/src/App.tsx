import React, { useState, useEffect, useRef } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import mermaid from 'mermaid'; // Mermaid será carregado via CDN

// Extende a tipagem do Window para incluir 'katex' e 'mermaid'
declare global {
  interface Window {
    katex?: any;
    mermaid?: any;
  }
}

// Componente para renderizar expressões KaTeX
type KaTeXRendererProps = {
  math: string;
  displayMode?: boolean;
};

const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({ math, displayMode = false }) => {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    // Verifica se KaTeX está disponível globalmente
    if (window.katex) {
      try {
        window.katex.render(math, ref.current, {
          displayMode: displayMode,
          throwOnError: false, // Não lança erro, apenas mostra a mensagem de erro
        });
      } catch (e) {
        console.error("KaTeX rendering error:", e);
        // Exibe uma mensagem de erro no lugar da expressão
        if (ref.current) {
          const errorMsg = (e instanceof Error) ? e.message : String(e);
          ref.current.innerHTML = `<span style="color: red;">Erro de renderização matemática: ${errorMsg}</span>`;
        }
      }
    }
  }, [math, displayMode]); // Re-renderiza se a expressão matemática ou o modo de exibição mudar

  return <span ref={ref} />;
};


// Componente para renderizar diagramas Mermaid
type MermaidDiagramProps = {
  chart: string;
};

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const [svg, setSvg] = useState('');
  const [mermaidReady, setMermaidReady] = useState(false); // Novo estado para controlar o carregamento do Mermaid

  useEffect(() => {
    // Verifica se mermaid está disponível globalmente e inicializa se necessário
    if (window.mermaid && !mermaidReady) {
      // mermaid.initialize({ startOnLoad: true }); // Já inicializado no componente App
      setMermaidReady(true);
    }
  }, [mermaidReady]);

  useEffect(() => {
    // Renderiza o diagrama apenas se o chart e o mermaid estiverem prontos
    if (chart && mermaidReady) {
      window.mermaid.render('mermaid-svg', chart)
        .then(({ svg }: { svg: string }) => {
          setSvg(svg);
        })
        .catch((error: unknown) => {
          console.error("Mermaid rendering error:", error);
          setSvg('<p style="color: red;">Erro ao renderizar diagrama.</p>');
        });
    }
  }, [chart, mermaidReady]); // Re-renderiza se chart ou mermaidReady mudar

  return (
    <div className="flex justify-center items-center p-4 bg-gray-50 rounded-lg shadow-inner">
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} className="w-full h-auto max-w-full overflow-x-auto" />
      ) : (
        <p className="text-gray-500">Carregando diagrama...</p>
      )}
    </div>
  );
};

// Componente da Navbar
type NavbarProps = {
  setCurrentPage: (page: string) => void;
  currentPage: string;
};

const Navbar: React.FC<NavbarProps> = ({ setCurrentPage, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Início', id: 'home' },
    { name: 'Método Direto', id: 'direct' },
    { name: 'Contraexemplo', id: 'contraexample' },
    { name: 'Redução por Absurdo', id: 'absurd' },
    { name: 'Contrapositivo', id: 'contrapositive' },
    { name: 'Indução', id: 'induction' },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <h1 className="text-white text-2xl font-bold font-inter rounded-lg p-2">
          Métodos de Prova
        </h1>
        <button
          className="text-white md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
          </svg>
        </button>
        <div className={`w-full md:flex md:items-center md:w-auto ${isOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 mt-4 md:mt-0">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => { setCurrentPage(item.id); setIsOpen(false); }}
                  className={`block py-2 px-4 rounded-lg text-white font-medium hover:bg-blue-500 transition-colors duration-300
                    ${currentPage === item.id ? 'bg-blue-500 shadow-md' : ''}`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

// Componente para a Página Inicial
type HomePageProps = {
  setCurrentPage: (page: string) => void;
};

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl w-full text-center">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-6 font-inter">
        Bem-vindo aos Métodos de Prova Matemática
      </h2>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        Explore os principais métodos de prova matemática, essenciais para a disciplina de Algoritmos e Estrutura de Dados no seu mestrado.
        Cada seção oferece uma explicação detalhada, exemplos práticos e recursos visuais para facilitar o aprendizado.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Método Direto', id: 'direct', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
          { name: 'Contraexemplo', id: 'contraexample', icon: 'M6 18L18 6M6 6l12 12' },
          { name: 'Redução por Absurdo', id: 'absurd', icon: 'M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
          { name: 'Contrapositivo', id: 'contrapositive', icon: 'M14 5l7 7m0 0l-7 7m7-7H3' },
          { name: 'Indução', id: 'induction', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        ].map((method) => (
          <button
            key={method.id}
            onClick={() => setCurrentPage(method.id)}
            className="flex flex-col items-center p-6 bg-blue-100 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 group"
          >
            <svg className="w-12 h-12 text-blue-600 group-hover:text-purple-700 transition-colors duration-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={method.icon}></path>
            </svg>
            <span className="text-xl font-semibold text-gray-700 group-hover:text-blue-800 font-inter">{method.name}</span>
          </button>
        ))}
      </div>
      <p className="text-md text-gray-500 mt-10">
        Desenvolvido por Kleiton Ewerton para auxiliar nos estudos de mestrado.
      </p>
    </div>
  </div>
);

// Componente de layout para as páginas dos métodos
interface MethodPageLayoutProps {
  title: React.ReactNode;
  description: React.ReactNode;
  steps?: string[];
  examples?: {
    title: string;
    description: string;
    proof: string;
  }[];
  diagram?: string;
  image?: {
    src: string;
    alt: string;
    caption?: string;
  };
  extraContent?: React.ReactNode;
}

const MethodPageLayout: React.FC<MethodPageLayoutProps> = ({ title, description, steps, examples, diagram, image, extraContent }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6 lg:p-8 font-inter">
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-6 border-b-4 border-blue-500 pb-3">
        {title}
      </h2>
      <p className="text-lg text-gray-700 mb-8 leading-relaxed">
        {description}
      </p>

      {steps && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M17 16h.01"></path></svg>
            Passos:
          </h3>
          <ul className="list-disc list-inside space-y-3 text-gray-700 text-base sm:text-lg">
            {steps.map((step, index) => (
              <li key={index} className="pl-2">
                <span className="font-semibold text-blue-700">{step.split(':')[0]}:</span> {step.split(':')[1]}
              </li>
            ))}
          </ul>
        </div>
      )}

      {examples && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Exemplos:
          </h3>
          {examples.map((ex, index) => (
            <div key={index} className="bg-blue-50 p-5 rounded-lg shadow-inner mb-6 border border-blue-200">
              <p className="font-semibold text-blue-800 mb-2 text-lg">{ex.title}</p>
              <p className="text-gray-700 mb-3">{ex.description}</p>
              <div className="bg-gray-100 p-4 rounded-md text-sm sm:text-base overflow-x-auto">
                <pre className="whitespace-pre-wrap font-mono text-gray-800">{ex.proof}</pre>
              </div>
            </div>
          ))}
        </div>
      )}

      {diagram && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 3-3M6 6h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2z"></path></svg>
            Diagrama:
          </h3>
          <MermaidDiagram chart={diagram} />
          <p className="text-sm text-gray-600 mt-2 text-center">
            [Image of Diagrama do Fluxo do Método]
          </p>
        </div>
      )}

      {image && (
        <div className="mb-8 flex justify-center">
          <img src={image.src} alt={image.alt} className="max-w-full h-auto rounded-lg shadow-md border border-gray-200" />
          <p className="text-sm text-gray-600 mt-2 text-center">
            {image.caption}
          </p>
        </div>
      )}

      {extraContent && (
        <div className="mb-8">
          {extraContent}
        </div>
      )}
    </div>
  </div>
);

// Componentes para cada método
const DirectMethod = () => (
  <MethodPageLayout
    title="Método Direto"
    description={
      <>
        O <span className="font-bold">Método Direto</span> é a forma mais intuitiva de provar uma implicação <KaTeXRenderer math={'P(x) \\rightarrow Q(x)'} />. Ele segue uma linha lógica direta do início ao fim.
      </>
    }
    steps={[
      'Assuma: que a premissa P(x) é verdadeira.',
      'Demonstre: Utilizando essa suposição, junto com definições, axiomas e teoremas conhecidos, demonstre que a conclusão Q(x) também é verdadeira.',
    ]}
    examples={[
      {
        title: 'Exemplo 1: Se x é múltiplo de 4, então x é múltiplo de 2.',
        description: '',
        proof: `
Prova por Método Direto:
* Suponha que x é múltiplo de 4.
* Pela definição de múltiplo, isso significa que existe um inteiro m tal que x = 4m.
* Podemos reescrever x como x = 2 ⋅ (2m).
* Como m é um inteiro, 2m também é um inteiro. Seja k = 2m.
* Então, x = 2k, o que, pela definição, significa que x é múltiplo de 2.
* Assim, a implicação é provada.
        `,
      },
      {
        title: 'Exemplo 2: ∀m, n ∈ ℤ, se m+n é par, então m-n é par.',
        description: '',
        proof: `
Prova por Método Direto:
* Suponha que m e n são inteiros e que m+n é par.
* Pela definição de número par, existe um inteiro k tal que m+n = 2k.
* Nosso objetivo é mostrar que m-n é par.
* Podemos expressar m-n em termos de m+n:
    m-n = (m+n) - 2n
* Substituindo m+n = 2k:
    m-n = 2k - 2n
* Colocando 2 em evidência:
    m-n = 2(k-n)
* Como k e n são inteiros, a diferença k-n também é um inteiro. Seja j = k-n.
* Então, m-n = 2j, o que demonstra que m-n é par.
        `,
      },
    ]}
    diagram={`
graph TD
    A[Suponha P(x) é Verdadeiro] --> B{Usar Definições e Lógica}
    B --> C[Chegue a Q(x) é Verdadeiro]
    C --> D[P(x) -> Q(x) é Provado]
    `}
    image={{
      src: "https://placehold.co/600x300/ADD8E6/000000?text=Fluxo+do+Método+Direto",
      alt: "Representação visual do fluxo do método direto",
      caption: "Representação visual do fluxo do Método Direto."
    }}
  />
);

const ContraexampleMethod = () => (
  <MethodPageLayout
    title="Prova por Contraexemplo"
    description={
      <>
        A <span className="font-bold">Prova por Contraexemplo</span> é utilizada especificamente para <span className="font-bold">refutar</span> (negar a verdade de) uma afirmação universal da forma <KaTeXRenderer math={'\\forall x \\in D, P(x) \\rightarrow Q(x)'} />.
      </>
    }
    steps={[
      'Encontrar: Para provar que a afirmação universal é falsa, basta encontrar um único elemento x (um contraexemplo) no domínio D para o qual a premissa P(x) é verdadeira, mas a conclusão Q(x) é falsa.',
    ]}
    examples={[
      {
        title: 'Exemplo: ∀a, b ∈ ℝ, (a² = b²) → (a=b).',
        description: '',
        proof: `
Prova por Contraexemplo:
* Para refutar essa afirmação, precisamos encontrar valores para a e b onde a² = b² é verdadeiro, mas a=b é falso.
* Considere a = -1 e b = 1.
* Verificamos a premissa: a² = (-1)² = 1 e b² = (1)² = 1. Portanto, a² = b² é verdadeiro.
* Verificamos a conclusão: a = -1 e b = 1. Claramente, a ≠ b. Portanto, a=b é falso.
* Como encontramos um caso onde a premissa é verdadeira e a conclusão é falsa, a afirmação original é falsa.
        `,
      },
    ]}
    diagram={`
graph TD
    A[Afirmação: V x, P(x) -> Q(x)] --> B{Encontre um caso 'c'}
    B --> C{P(c) é Verdadeiro?}
    C -- Sim --> D{Q(c) é Falso?}
    D -- Sim --> E[Afirmação é Falsa (Contraexemplo Encontrado)]
    D -- Não --> F[Não é Contraexemplo]
    `}
    image={{
      src: "https://placehold.co/600x300/FFD700/000000?text=Contraexemplo",
      alt: "Representação visual de um contraexemplo",
      caption: "Um único contraexemplo é suficiente para refutar uma afirmação universal."
    }}
  />
);

const AbsurdMethod = () => (
  <MethodPageLayout
    title="Redução por Absurdo (Prova por Contradição)"
    description={
      <>
        O <span className="font-bold">Método de Redução por Absurdo</span>, também conhecido como Prova por Contradição, é uma técnica poderosa para provar uma implicação <KaTeXRenderer math={'P \\rightarrow Q'} />. Ele se baseia no princípio de que se a negação de uma afirmação leva a uma contradição lógica, então a afirmação original deve ser verdadeira.
        <br /><br />
        A equivalência lógica por trás deste método é que <KaTeXRenderer math={'(P \\rightarrow Q)'} /> é logicamente equivalente a <KaTeXRenderer math={'\\neg (P \\land \\neg Q)'} />. Em outras palavras, para provar <KaTeXRenderer math={'P \\rightarrow Q'} />, basta provar que a conjunção de <KaTeXRenderer math={'P'} /> com a negação de <KaTeXRenderer math={'Q'} /> (ou seja, <KaTeXRenderer math={'P \\land \\neg Q'} />) leva a uma contradição <KaTeXRenderer math={'(\\emptyset)'} />.
      </>
    }
    steps={[
      'Suponha: Para fins de contradição, que a afirmação que você quer provar é falsa. No caso de P → Q, isso significa supor que P é verdadeiro e Q é falso (ou seja, P ∧ ¬Q).',
      'Derive: A partir dessa suposição, utilize raciocínio lógico e definições para derivar uma contradição (por exemplo, chegar a uma afirmação que é sempre falsa, como R ∧ ¬R).',
      'Conclua: Como a suposição inicial levou a uma contradição, ela deve ser falsa. Portanto, a afirmação original (P → Q) deve ser verdadeira.',
    ]}
    examples={[
      {
        title: 'Exemplo: Se m e n são inteiros pares, então m+n é par.',
        description: '',
        proof: `
Prova por Redução por Absurdo:
* Suponha, por contradição, que m e n são inteiros pares, mas que m+n é ímpar.
* Pela definição de número par, se m é par, então m = 2k para algum inteiro k.
* Se n é par, então n = 2j para algum inteiro j.
* Pela nossa suposição por contradição, m+n é ímpar. Pela definição de número ímpar, existe um inteiro i tal que m+n = 2i+1.
* Agora, vamos substituir as expressões de m e n na equação de m+n:
    2k + 2j = 2i+1
* Colocando 2 em evidência no lado esquerdo:
    2(k+j) = 2i+1
* O lado esquerdo, 2(k+j), representa um número par (é um múltiplo de 2).
* O lado direito, 2i+1, representa um número ímpar.
* Chegamos à afirmação de que um número par é igual a um número ímpar (Par = Ímpar), o que é uma contradição lógica.
* Uma vez que nossa suposição (m e n são pares e m+n é ímpar) levou a uma contradição, essa suposição deve ser falsa.
* Portanto, se m e n são inteiros pares, então m+n é par.
        `,
      },
    ]}
    diagram={`
graph TD
    A[Objetivo: Provar P -> Q] --> B{Suponha P e ¬Q (Negação da Conclusão)}
    B --> C{Siga a Lógica}
    C --> D[Chegue a uma Contradição (Ex: R e ¬R)]
    D --> E[A Suposição (¬Q) é Falsa]
    E --> F[Conclua que P -> Q é Verdadeiro]
    `}
    image={{
      src: "https://placehold.co/600x300/FF6347/FFFFFF?text=Redução+por+Absurdo",
      alt: "Representação visual da redução por absurdo",
      caption: "A prova por absurdo busca uma contradição para validar a afirmação."
    }}
  />
);

const ContrapositiveMethod = () => (
  <MethodPageLayout
    title="Método Contrapositivo"
    description={
      <>
        O <span className="font-bold">Método Contrapositivo</span> é uma técnica de prova indireta que se baseia em uma equivalência lógica fundamental: uma implicação <KaTeXRenderer math={'P \\rightarrow Q'} /> é logicamente equivalente à sua contrapositiva <KaTeXRenderer math={'\\neg Q \\rightarrow \\neg P'} />. Provar a contrapositiva é o mesmo que provar a afirmação original.
        <br /><br />
        <span className="font-bold">Equivalência Lógica:</span>
        <KaTeXRenderer math={'(P \\rightarrow Q) \\iff (\\neg Q \\rightarrow \\neg P)'} displayMode={true} />
      </>
    }
    steps={[
      'Reescreva: a implicação original P → Q em sua forma contrapositiva: ¬Q → ¬P.',
      'Prove: a nova implicação ¬Q → ¬P usando um método direto. Se a contrapositiva for verdadeira, a afirmação original também será.',
    ]}
    examples={[
      {
        title: 'Exemplo: Se n² é par, então n é par.',
        description: '',
        proof: `
Prova por Método Contrapositivo:
* A afirmação original é: P(n): n² é par → Q(n): n é par.
* A contrapositiva é: ¬Q(n): n é ímpar → ¬P(n): n² é ímpar.
* Vamos provar a contrapositiva: Se n é ímpar, então n² é ímpar.
    * Suponha que n é ímpar.
    * Pela definição de número ímpar, existe um inteiro k tal que n = 2k+1.
    * Agora, vamos calcular n²:
        n² = (2k+1)²
        n² = (2k)² + 2(2k)(1) + 1²
        n² = 4k² + 4k + 1
    * Podemos fatorar 2 dos primeiros dois termos:
        n² = 2(2k² + 2k) + 1
    * Seja j = 2k² + 2k. Como k é um inteiro, 2k² + 2k também é um inteiro.
    * Então, n² = 2j + 1.
    * Pela definição de número ímpar, isso significa que n² é ímpar.
* Como provamos que "se n é ímpar, então n² é ímpar" (a contrapositiva), a afirmação original "se n² é par, então n é par" é verdadeira.
        `,
      },
    ]}
    diagram={`
graph TD
    A[Provar P -> Q] --> B{Equivalente a ¬Q -> ¬P}
    B --> C{Suponha ¬Q}
    C --> D{Use Método Direto}
    D --> E[Chegue a ¬P]
    E --> F[P -> Q é Provado]
    `}
    image={{
      src: "https://placehold.co/600x300/8A2BE2/FFFFFF?text=Contrapositivo",
      alt: "Representação visual do método contrapositivo",
      caption: "A contrapositiva oferece uma rota alternativa para a prova."
    }}
  />
);

const InductionMethod = () => (
  <MethodPageLayout
    title="Prova por Indução Matemática"
    description={
      <>
        A <span className="font-bold">Prova por Indução Matemática</span> é uma técnica fundamental usada para provar que uma propriedade <KaTeXRenderer math={'P(n)'} /> é verdadeira para <span className="font-bold">todos os números naturais</span> <KaTeXRenderer math={'n'} /> (ou para todos os inteiros a partir de um certo valor inicial). É particularmente importante em ciência da computação para analisar algoritmos e estruturas de dados.
        <br /><br />
        O princípio da Indução Matemática se baseia em dois passos:
      </>
    }
    steps={[
      'Passo Base (ou Caso Base): Prove que a propriedade P(n) é verdadeira para o valor inicial mais baixo (geralmente n=1 ou n=0, dependendo do contexto). Ou seja, prove que P(1) é verdadeiro.',
      'Passo Indutivo: Suponha que a propriedade P(k) é verdadeira para um inteiro arbitrário k ≥ valor inicial (esta é a Hipótese de Indução). Usando essa hipótese, prove que a propriedade P(k+1) também é verdadeira. Ou seja, prove que ∀k, P(k) → P(k+1) é verdadeiro.',
    ]}
    examples={[
      {
        title: 'Exemplo: ∀n ∈ ℕ, temos que n²+n+41 é ímpar.',
        description: '',
        proof: `
Prova por Indução:

1) Passo Base (para n=1):
* Precisamos verificar se a propriedade P(1) é verdadeira.
* Substituindo n=1 na expressão:
    1² + 1 + 41 = 1 + 1 + 41 = 43
* O número 43 é ímpar. Portanto, o Passo Base P(1) é verdadeiro.

2) Passo Indutivo:
* Hipótese de Indução: Suponha que P(k) é verdadeiro para algum inteiro k ∈ ℕ. Ou seja, suponha que k²+k+41 é ímpar.
* Tese Indutiva: Precisamos provar que P(k+1) é verdadeiro. Ou seja, precisamos provar que (k+1)²+(k+1)+41 é ímpar.
* Vamos expandir a expressão para P(k+1):
    (k+1)² + (k+1) + 41
    = (k² + 2k + 1) + (k+1) + 41
    = k² + k + 41 + 2k + 1 + 1
    = (k² + k + 41) + (2k + 2)
    = (k² + k + 41) + 2(k+1)
* Agora, vamos analisar a soma:
    * Pela Hipótese de Indução, sabemos que (k² + k + 41) é ímpar.
    * O termo 2(k+1) é um número par (pois é um múltiplo de 2).
* A soma de um número ímpar com um número par resulta sempre em um número ímpar.
    * (Ex: 3 (ímpar) + 4 (par) = 7 (ímpar))
* Portanto, (k+1)² + (k+1) + 41 é ímpar. Isso prova que P(k+1) é verdadeiro.

Conclusão:
Como ambos o Passo Base e o Passo Indutivo foram provados, pelo Princípio da Indução Matemática, a propriedade n²+n+41 é ímpar para todo n ∈ ℕ.
        `,
      },
    ]}
    diagram={`
graph TD
    A[Provar P(n) para todo n] --> B{Passo Base: Provar P(1)}
    B --> C{Passo Indutivo: Assumir P(k)}
    C --> D{Provar P(k+1)}
    D --> E[P(n) é Verdadeiro para todo n]
    `}
    image={{
      src: "https://placehold.co/600x300/4CAF50/FFFFFF?text=Indução+Matemática",
      alt: "Representação visual da indução matemática",
      caption: "A indução matemática é como uma fila de dominós: derrube o primeiro (passo base) e cada um derruba o próximo (passo indutivo)."
    }}
  />
);


// Componente Principal da Aplicação
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [katexLoaded, setKatexLoaded] = useState(false);
  const [mermaidLoaded, setMermaidLoaded] = useState(false);

  useEffect(() => {
    // Carrega o CSS do KaTeX
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(link);

    // Carrega o JS do KaTeX
    const scriptKatex = document.createElement('script');
    scriptKatex.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    scriptKatex.onload = () => {
      setKatexLoaded(true);
    };
    document.body.appendChild(scriptKatex);

    // Carrega o JS do Mermaid
    const scriptMermaid = document.createElement('script');
    scriptMermaid.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js';
    scriptMermaid.onload = () => {
      setMermaidLoaded(true);
      // Inicializa Mermaid após o carregamento
      if (window.mermaid) {
        window.mermaid.initialize({ startOnLoad: true });
      }
    };
    document.body.appendChild(scriptMermaid);


    // Limpeza ao desmontar o componente
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(scriptKatex);
      document.body.removeChild(scriptMermaid);
    };
  }, []); // Array de dependências vazio para rodar apenas uma vez

  const renderPage = () => {
    // Renderiza as páginas somente após o KaTeX estar carregado
    if (!katexLoaded) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p className="text-xl text-gray-700">Carregando recursos...</p>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'direct':
        return <DirectMethod />;
      case 'contraexample':
        return <ContraexampleMethod />;
      case 'absurd':
        return <AbsurdMethod />;
      case 'contrapositive':
        return <ContrapositiveMethod />;
      case 'induction':
        return <InductionMethod />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />
      {renderPage()}
    </div>
  );
};

export default App;
