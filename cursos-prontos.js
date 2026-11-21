/* ============================================================
   cursos-prontos.js — Catálogo de cursos já programados
   Formato compacto de cada módulo:
   "Título|fato 1|fato 2|fato 3|#exemplo opcional|termo~definição|..."
   ============================================================ */
window.TrilhaCursosProntos = (function () {
  "use strict";

  const CATEGORIAS = [
    { id: "todos", nome: "Todos", emoji: "✳️" },
    { id: "programacao", nome: "Programação", emoji: "💻" },
    { id: "robotica", nome: "Robótica", emoji: "🤖" },
    { id: "psicologia", nome: "Psicologia", emoji: "🧠" },
    { id: "ensino-medio", nome: "Ensino Médio", emoji: "🎒" },
    { id: "medicina", nome: "Medicina", emoji: "🩺" }
  ];

  const CONTEXTO = {
    programacao: "Na prática, esse conceito aparece em praticamente todo projeto de software.",
    robotica: "Esse conhecimento é aplicado diretamente em projetos com sensores, motores e controle.",
    psicologia: "Compreender isso ajuda a interpretar comportamentos e processos mentais no dia a dia.",
    "ensino-medio": "Esse conteúdo aparece com frequência em provas e também no cotidiano.",
    medicina: "Esse é um dos pilares da formação médica: entender o mecanismo para reconhecer o sinal clínico e agir com segurança."
  };

  const CURSOS = [
    /* ------------------------------ PROGRAMAÇÃO */
    { id: "logica", cat: "programacao", t: "Lógica de Programação", d: "A base para qualquer linguagem: pensar em passos, decisões e repetições.", e: "🧩", n: "iniciante", tempo: 20, mods: [
      "Algoritmos e fluxogramas|Um algoritmo é uma sequência finita de passos para resolver um problema.|Fluxogramas usam retângulos para ações e losangos para decisões.|Antes de escrever código, descreva a solução em linguagem natural.|#Exemplo: 1) ler dois números  2) somar  3) mostrar o resultado|algoritmo~Sequência ordenada de passos para resolver um problema|fluxograma~Diagrama que representa o fluxo de um algoritmo",
      "Variáveis e operadores|Variáveis armazenam valores que podem mudar durante a execução.|Operadores aritméticos calculam e operadores lógicos combinam condições.|Nomes descritivos tornam o código mais fácil de ler e manter.|#Exemplo: idade = 18; novaIdade = idade + 1|variável~Nome que referencia um valor armazenado|operador~Símbolo que realiza uma operação sobre valores",
      "Decisão e repetição|Estruturas condicionais escolhem um caminho conforme uma condição.|Laços repetem instruções enquanto uma condição for verdadeira.|Cuidado para evitar laços infinitos sem condição de parada.|#Exemplo: se nota maior que 6, mostrar aprovado|condicional~Estrutura que escolhe um caminho conforme uma condição|laço~Estrutura que repete instruções"
    ]},
    { id: "python", cat: "programacao", t: "Python do Zero", d: "Sintaxe simples, muita aplicação: automatize tarefas e crie seus primeiros programas.", e: "🐍", n: "iniciante", tempo: 20, mods: [
      "Variáveis e tipos|Python cria variáveis no momento da atribuição, sem declarar o tipo antes.|Tipos comuns incluem int, float, str e bool.|A função type revela o tipo de qualquer valor.|#Exemplo: nome = 'Ana'; idade = 18; altura = 1.65|variável~Nome que referencia um valor na memória|tipo~Categoria de dados como int, float ou str",
      "Listas e dicionários|Listas guardam sequências de valores e permitem acesso por índice.|Dicionários associam chaves a valores, como um mapa.|Métodos como append e get facilitam a manipulação dos dados.|#Exemplo: notas = [7, 8, 9]; aluno = {'nome': 'Ana'}|lista~Coleção ordenada de valores|dicionário~Coleção de pares chave e valor",
      "Funções e módulos|Funções organizam código reutilizável e recebem parâmetros.|O comando return devolve um resultado para quem chamou a função.|Módulos agrupam funções relacionadas em arquivos separados.|#Exemplo: def soma(a, b): return a + b|função~Bloco de código reutilizável com nome|parâmetro~Valor de entrada de uma função"
    ]},
    { id: "javascript", cat: "programacao", t: "JavaScript Moderno", d: "A linguagem da web: interatividade, DOM, eventos e código assíncrono.", e: "🟨", n: "iniciante", tempo: 20, mods: [
      "Fundamentos da linguagem|JavaScript possui tipos primitivos como number, string e boolean.|const declara constantes e let declara variáveis que podem mudar.|Funções podem ser anônimas e armazenadas em variáveis.|#Exemplo: const saudacao = () => console.log('Olá')|const~Declaração de um valor que não será reatribuído|função~Bloco de código que executa uma tarefa",
      "DOM e eventos|O DOM representa a página como uma árvore de elementos que o código pode alterar.|addEventListener registra uma função para reagir a ações do usuário.|querySelector encontra elementos usando seletores CSS.|#Exemplo: botao.addEventListener('click', mostrar)|DOM~Modelo de objetos da página HTML|evento~Ação do usuário ou do navegador",
      "Assincronia e APIs|Promises representam resultados que chegarão no futuro.|async e await tornam código assíncrono mais legível.|fetch consulta APIs e retorna os dados em JSON.|#Exemplo: const dados = await fetch(url).then(r => r.json())|promise~Objeto que representa um resultado futuro|fetch~Função para fazer requisições HTTP"
    ]},
    { id: "htmlcss", cat: "programacao", t: "HTML e CSS na Prática", d: "Estruture páginas semânticas e crie layouts bonitos e responsivos.", e: "🌐", n: "iniciante", tempo: 20, mods: [
      "Estrutura semântica HTML|HTML define a estrutura do conteúdo por meio de elementos e atributos.|Tags como header, main e article dão significado às partes da página.|Formulários usam label e input para coletar dados do usuário.|#Exemplo: <main><h1>Título</h1><p>Texto</p></main>|elemento~Parte de uma página definida por uma tag|semântica~Uso de marcas que expressam significado",
      "CSS e o box model|CSS controla aparência e posicionamento dos elementos.|O box model considera conteúdo, padding, borda e margin.|Flexbox organiza itens em linhas ou colunas com facilidade.|#Exemplo: .caixa { padding: 16px; border: 1px solid; }|CSS~Linguagem de estilos para páginas web|box model~Modelo de caixa usado no layout CSS",
      "Layout responsivo|Media queries aplicam estilos conforme o tamanho da tela.|Unidades relativas como rem e % ajudam a adaptar o layout.|Imagens fluidas usam max-width para não estourar o contêiner.|#Exemplo: @media (max-width: 600px) { .menu { display: none; } }|media query~Regra CSS condicionada a características do dispositivo|responsividade~Capacidade de se adaptar a diferentes telas"
    ]},
    { id: "algoritmos", cat: "programacao", t: "Algoritmos e Estruturas de Dados", d: "Complexidade, listas, pilhas, filas, ordenação e busca — o coração da ciência da computação.", e: "🧮", n: "intermediario", tempo: 30, mods: [
      "Análise de complexidade|A notação Big O descreve como o tempo de execução cresce com a entrada.|Algoritmos O(1) são constantes e O(n) crescem linearmente.|Complexidade considera o pior caso na maior parte das análises.|#Exemplo: acessar um índice é O(1); percorrer uma lista é O(n)|Big O~Notação que descreve o crescimento do custo de um algoritmo|complexidade~Medida de tempo ou espaço necessário",
      "Pilhas, filas e listas|Pilhas seguem a ordem LIFO: o último a entrar é o primeiro a sair.|Filas seguem FIFO: o primeiro a entrar é o primeiro a sair.|Listas ligadas armazenam nós com referência para o próximo elemento.|#Exemplo: pilha.push(1); pilha.pop() remove o último|pilha~Estrutura LIFO de inserção e remoção|fila~Estrutura FIFO de inserção e remoção",
      "Ordenação e busca|Bubble sort compara pares vizinhos e troca quando necessário.|Busca binária exige dados ordenados e divide o intervalo ao meio.|Quick sort usa um pivô e particiona os demais valores.|#Exemplo: busca binária em [1,3,5,7] encontra 7 em poucos passos|ordenação~Organização de elementos em uma ordem específica|busca binária~Busca que divide o intervalo ao meio"
    ]},
    { id: "sql", cat: "programacao", t: "SQL e Bancos de Dados", d: "Modele tabelas, faça consultas poderosas e entenda transações e índices.", e: "🗄️", n: "iniciante", tempo: 20, mods: [
      "Modelagem relacional|Tabelas representam entidades e colunas representam atributos.|Chave primária identifica cada linha de forma única.|Chave estrangeira cria relacionamento entre tabelas.|#Exemplo: alunos(id, nome, curso_id) e cursos(id, nome)|tabela~Conjunto de linhas e colunas em um banco relacional|chave primária~Coluna que identifica unicamente cada registro",
      "SELECT e JOIN|SELECT escolhe colunas e WHERE filtra linhas conforme condições.|JOIN combina registros de tabelas relacionadas.|GROUP BY agrupa resultados e HAVING filtra grupos.|#Exemplo: SELECT nome FROM alunos WHERE curso_id = 2|JOIN~Operação que combina linhas de tabelas|GROUP BY~Cláusula que agrupa resultados",
      "Índices e transações|Índices aceleram consultas, mas tornam inserções mais lentas.|Transações garantem atomicidade: tudo acontece ou nada acontece.|O comando COMMIT confirma e ROLLBACK desfaz alterações.|#Exemplo: BEGIN; UPDATE contas SET saldo = saldo - 100; COMMIT;|índice~Estrutura que acelera a localização de registros|transação~Conjunto de operações tratadas como uma unidade"
    ]},
    { id: "java", cat: "programacao", t: "Java e Orientação a Objetos", d: "Classes, objetos, herança, polimorfismo e as coleções mais usadas.", e: "☕", n: "intermediario", tempo: 30, mods: [
      "Classes e objetos|Classe é um molde e objeto é uma instância criada a partir dele.|Atributos guardam estado e métodos descrevem comportamentos.|O construtor inicializa um objeto no momento da criação.|#Exemplo: Produto p = new Produto('Café', 12.5);|classe~Modelo que define atributos e métodos|objeto~Instância de uma classe",
      "Herança e polimorfismo|Herança permite reutilizar campos e métodos de uma superclasse.|A palavra super acessa membros da classe pai.|Polimorfismo permite tratar objetos diferentes pela mesma interface.|#Exemplo: class Cachorro extends Animal { }|herança~Mecanismo de reutilização entre classes|polimorfismo~Mesma interface com comportamentos diferentes",
      "Coleções e exceções|ArrayList armazena elementos em uma lista redimensionável.|HashMap associa chaves a valores com acesso rápido.|try e catch tratam erros sem interromper o programa.|#Exemplo: try { lista.get(10); } catch (Exception e) { }|ArrayList~Lista redimensionável da biblioteca Java|exceção~Situação de erro tratada em tempo de execução"
    ]},
    { id: "cpp", cat: "programacao", t: "C e C++ Essenciais", d: "Memória, ponteiros, estruturas e os primeiros passos com a STL.", e: "⚙️", n: "intermediario", tempo: 30, mods: [
      "Fundamentos e memória|C exige declaração explícita de tipos e gerenciamento manual de memória.|Variáveis locais ficam na pilha e alocações dinâmicas no heap.|A função malloc reserva memória e free a libera.|#Exemplo: int *p = (int*) malloc(sizeof(int));|heap~Região de memória para alocação dinâmica|malloc~Função que reserva memória em C",
      "Ponteiros e referências|Ponteiro é uma variável que guarda um endereço de memória.|O operador & obtém o endereço e * acessa o valor apontado.|Referências em C++ são aliases para uma variável existente.|#Exemplo: int x = 5; int *p = &x;|ponteiro~Variável que armazena um endereço de memória|referência~Alias para outro objeto em C++",
      "Estruturas e STL|Struct agrupa dados relacionados em um mesmo tipo.|A STL oferece containers como vector, map e string.|Iteradores percorrem elementos de containers sem expor detalhes internos.|#Exemplo: vector<int> v = {1, 2, 3};|struct~Tipo que agrupa campos relacionados|STL~Biblioteca padrão de templates do C++"
    ]},
    { id: "backend", cat: "programacao", t: "Back-end e APIs REST", d: "HTTP, rotas, persistência, autenticação e publicação de serviços.", e: "🖥️", n: "intermediario", tempo: 30, mods: [
      "HTTP e rotas|HTTP é o protocolo de comunicação entre cliente e servidor.|Métodos comuns incluem GET, POST, PUT e DELETE.|Códigos 2xx indicam sucesso e 4xx indicam erro do cliente.|#Exemplo: GET /usuarios retorna a lista de usuários|HTTP~Protocolo de transferência de hipertexto|rota~Endereço que mapeia uma URL a uma função",
      "Persistência de dados|O servidor grava dados em banco relacional ou não relacional.|ORMs convertem objetos da aplicação em registros do banco.|Migrations versionam mudanças no esquema do banco.|#Exemplo: user = User.create(nome='Ana')|ORM~Ferramenta que mapeia objetos para tabelas|migration~Arquivo que versiona alterações no banco",
      "Autenticação e deploy|Tokens JWT permitem autenticar requisições sem manter sessão no servidor.|Variáveis de ambiente guardam segredos fora do código.|Deploy publica a aplicação em um servidor ou plataforma de nuvem.|#Exemplo: Authorization: Bearer <token>|JWT~Token usado para autenticação stateless|deploy~Processo de publicar uma aplicação"
    ]},
    { id: "git", cat: "programacao", t: "Git e GitHub na Prática", d: "Versionamento, branches, merge e pull requests sem medo de quebrar o projeto.", e: "🌿", n: "iniciante", tempo: 20, mods: [
      "Repositórios e commits|Git registra versões de arquivos em um repositório distribuído.|Commit é um ponto de salvamento com mensagem descritiva.|git status mostra o estado atual dos arquivos.|#Exemplo: git add . e git commit -m 'adiciona login'|commit~Registro de uma alteração no histórico|repositório~Pasta monitorada pelo Git",
      "Branches e merge|Branch é uma linha independente de desenvolvimento.|git checkout cria ou troca de branch.|Merge integra mudanças de uma branch em outra.|#Exemplo: git checkout -b feature/login|branch~Linha de desenvolvimento paralela|merge~Integração de mudanças entre branches",
      "Pull requests e colaboração|Pull request propõe mudanças para revisão antes do merge.|Code review ajuda a encontrar erros e compartilhar conhecimento.|Conflitos surgem quando duas branches alteram a mesma linha.|#Exemplo: abra um PR de feature/login para main|pull request~Pedido de integração revisável|conflito~Divergência que precisa ser resolvida manualmente"
    ]},
    { id: "machinelearning", cat: "programacao", t: "Machine Learning Aplicado", d: "Aprendizado supervisionado, treino de modelos e avaliação de resultados.", e: "📊", n: "intermediario", tempo: 30, mods: [
      "Aprendizado supervisionado|Modelos aprendem a partir de exemplos com entrada e saída conhecidas.|Regressão prevê valores numéricos e classificação prevê categorias.|O conjunto de dados é dividido em treino e teste.|#Exemplo: prever preço de imóvel a partir de área e localização|regressão~Tarefa de prever valores contínuos|classificação~Tarefa de prever categorias",
      "Treinamento de modelos|Treinar é ajustar os parâmetros do modelo para reduzir o erro.|A função de perda mede o quanto o modelo erra.|Gradiente descendente atualiza parâmetros na direção que reduz a perda.|#Exemplo: perda = diferença entre previsão e valor real|perda~Medida do erro do modelo|gradiente descendente~Método de otimização de parâmetros",
      "Avaliação e overfitting|Acurácia mede acertos, mas pode enganar em classes desbalanceadas.|Matriz de confusão mostra falsos positivos e falsos negativos.|Overfitting ocorre quando o modelo memoriza o treino e falha no teste.|#Exemplo: acurácia de 95% pode ser ruim se 95% das amostras são da mesma classe|overfitting~Modelo que memoriza o treino e generaliza mal|matriz de confusão~Tabela com resultados de classificação"
    ]},
    { id: "seguranca", cat: "programacao", t: "Cibersegurança Essencial", d: "Ataques comuns, proteção de dados e boas práticas para sistemas seguros.", e: "🔐", n: "iniciante", tempo: 20, mods: [
      "Os pilares da segurança|Confidencialidade impede acesso não autorizado à informação.|Integridade garante que os dados não foram alterados indevidamente.|Disponibilidade mantém o sistema acessível quando necessário.|#Exemplo: criptografar senhas protege a confidencialidade|confidencialidade~Informação acessível só por quem deve ver|integridade~Dados corretos e não alterados",
      "Ataques mais comuns|Phishing engana o usuário para roubar credenciais.|SQL injection insere comandos maliciosos em consultas ao banco.|Força bruta tenta muitas senhas até encontrar a correta.|#Exemplo: formulário sem validação permite SQL injection|phishing~Golpe que falsifica comunicações para roubar dados|injection~Inserção de código malicioso em uma entrada",
      "Boas práticas|Use senhas longas e únicas com gerenciador de senhas.|Autenticação em dois fatores adiciona uma camada de proteção.|Atualizações corrigem vulnerabilidades conhecidas.|#Exemplo: ative 2FA em todos os serviços importantes|2FA~Autenticação que exige um segundo fator|vulnerabilidade~Falha de segurança explorável"
    ]},
    { id: "devops", cat: "programacao", t: "DevOps e Cloud", d: "Containers, integração contínua, entrega contínua e monitoramento de aplicações.", e: "☁️", n: "intermediario", tempo: 30, mods: [
      "Containers com Docker|Container empacota aplicação e dependências em uma unidade leve.|Image é o modelo imutável usado para criar containers.|Dockerfile descreve os passos para gerar uma imagem.|#Exemplo: FROM node:20; COPY . .; CMD npm start|container~Ambiente isolado para executar uma aplicação|Dockerfile~Arquivo que define a construção de uma imagem",
      "CI e CD|Integração contínua executa testes automáticos a cada alteração.|Entrega contínua prepara versões prontas para publicação.|Pipelines descrevem as etapas automáticas do processo.|#Exemplo: push no GitHub executa testes e build|CI~Prática de integrar e testar mudanças continuamente|pipeline~Sequência automática de etapas",
      "Monitoramento e escala|Métricas acompanham uso de CPU, memória e latência.|Logs registram eventos importantes para investigar falhas.|Escalar horizontalmente significa adicionar mais instâncias.|#Exemplo: alerta se latência passar de 500 ms|métrica~Medição numérica do comportamento do sistema|escalabilidade~Capacidade de crescer sem perder desempenho"
    ]},
    { id: "mobile", cat: "programacao", t: "Desenvolvimento Mobile", d: "Crie aplicativos para iOS e Android com Flutter e React Native.", e: "📱", n: "intermediario", tempo: 30, mods: [
      "Fundamentos de apps mobile|Apps mobile organizam telas em rotas e navegação.|Widgets são os blocos de construção da interface no Flutter.|React Native reusa componentes React para gerar apps nativos.|#Exemplo: MaterialApp com home: HomePage()|widget~Elemento que compõe a interface|rota~Caminho de navegação entre telas",
      "Estado e navegação|Estado representa os dados que mudam e atualizam a tela.|setState notifica o framework sobre mudanças no Flutter.|Navegadores de pilha permitem voltar à tela anterior.|#Exemplo: setState(() => contador++)|estado~Dados que influenciam a interface|navegação~Movimentação entre telas do app",
      "Publicação nas lojas|O app precisa de ícones, versão e permissões declaradas.|Build de release gera o pacote APK ou IPA.|Google Play e App Store revisam o app antes da publicação.|#Exemplo: flutter build apk --release|build~Processo de gerar o pacote instalável|release~Versão final pronta para publicação"
    ]},
    { id: "typescript", cat: "programacao", t: "TypeScript", d: "Tipagem estática, interfaces, generics e segurança para projetos JavaScript.", e: "🔷", n: "intermediario", tempo: 30, mods: [
      "Tipos e inferência|TypeScript adiciona tipos ao JavaScript e verifica erros antes da execução.|O compilador infere tipos quando não há anotação explícita.|Tipos união permitem representar mais de uma possibilidade.|#Exemplo: let id: number ou string = 10|tipagem~Verificação dos tipos de dados no código|inferência~Capacidade do compilador deduzir o tipo",
      "Interfaces e classes|Interface descreve a forma de um objeto sem gerar código em JavaScript.|Classes podem implementar interfaces para garantir os membros exigidos.|Propriedades opcionais usam o símbolo de interrogação.|#Exemplo: interface User com nome e idade opcional|interface~Contrato que descreve a estrutura de um objeto|propriedade opcional~Campo que pode não existir",
      "Generics e configuração|Generics preservam tipos em funções e estruturas reutilizáveis.|O arquivo tsconfig define opções de compilação como target e strict.|O modo strict ajuda a encontrar erros comuns.|#Exemplo: function primeiro com tipo generico retorna o primeiro elemento|generic~Tipo parametrizado que mantém a informação de tipo|tsconfig~Arquivo de configuração do TypeScript"
    ]},
    { id: "react", cat: "programacao", t: "React", d: "Componentes, props, estado, hooks e composição de interfaces modernas.", e: "⚛️", n: "intermediario", tempo: 30, mods: [
      "Componentes e props|Componentes são funções que retornam elementos da interface.|Props são dados passados de um componente pai para o filho.|Componentes podem ser compostos para formar telas complexas.|#Exemplo: o componente Saudacao recebe o nome como prop|componente~Unidade reutilizável da interface|props~Dados recebidos por um componente",
      "Estado e eventos|Estado representa dados que mudam e causam nova renderização.|useState guarda um valor local no componente.|Eventos usam funções para reagir às ações do usuário.|#Exemplo: contador começa em zero e aumenta com um clique|estado~Dado que altera a renderização|useState~Hook que adiciona estado local",
      "Hooks e efeitos|useEffect executa efeitos colaterais após a renderização.|A lista de dependências controla quando o efeito roda novamente.|useMemo evita recálculos caros em cada renderização.|#Exemplo: carregar dados uma vez quando o componente monta|useEffect~Hook para efeitos colaterais|dependência~Valor que dispara a execução de um efeito"
    ]},
    { id: "node", cat: "programacao", t: "Node.js e Express", d: "Servidores JavaScript, rotas, middleware e organização de uma API.", e: "🟩", n: "intermediario", tempo: 30, mods: [
      "Runtime e módulos|Node.js executa JavaScript fora do navegador usando o motor V8.|Módulos permitem dividir o código em arquivos reutilizáveis.|O arquivo package.json registra dependências e scripts do projeto.|#Exemplo: importar o módulo de sistema de arquivos para ler um texto|runtime~Ambiente que executa o código|módulo~Arquivo com funcionalidade reutilizável",
      "Rotas e middleware|Express simplifica a criação de servidores HTTP com rotas.|Middleware processa a requisição antes de chegar ao handler final.|Parâmetros de rota capturam valores dinâmicos da URL.|#Exemplo: a rota usuarios por id busca um registro|rota~Endereço associado a uma função|middleware~Função que processa requisições",
      "Organização da API|Controllers recebem requisições e services concentram as regras de negócio.|Validação evita dados inválidos entrarem na aplicação.|Tratamento de erros centraliza respostas consistentes.|#Exemplo: validar se o campo email tem formato correto|controller~Camada que coordena requisições|validação~Verificação dos dados de entrada"
    ]},
    { id: "testes", cat: "programacao", t: "Testes Automatizados", d: "Testes unitários, de integração, mocks e cobertura para código confiável.", e: "✅", n: "intermediario", tempo: 30, mods: [
      "Testes unitários|Teste unitário verifica uma pequena parte do código de forma isolada.|A estrutura arrange, act, assert organiza o teste.|Expectativas comparam o resultado obtido com o esperado.|#Exemplo: verificar que a soma de dois e três resulta em cinco|teste unitário~Verificação de uma unidade isolada|expectativa~Comparação entre resultado real e esperado",
      "Integração e mocks|Testes de integração verificam a cooperação entre módulos.|Mocks substituem dependências externas durante o teste.|Stubs fornecem respostas controladas para funções chamadas.|#Exemplo: simular uma chamada de API com resposta fixa|mock~Substituto controlado de uma dependência|integração~Verificação da interação entre partes",
      "Cobertura e pipeline|Cobertura mede quais linhas foram executadas pelos testes.|Alta cobertura não garante ausência de bugs, mas ajuda a encontrar lacunas.|Testes automatizados rodam na integração contínua.|#Exemplo: o pipeline falha quando um teste quebra|cobertura~Proporção de código exercitado pelos testes|pipeline~Sequência automática de etapas"
    ]},
    { id: "fund-robotica", cat: "robotica", t: "Fundamentos da Robótica", d: "O que é um robô, como ele percebe, decide e age no mundo físico.", e: "🤖", n: "iniciante", tempo: 20, mods: [
      "O que é um robô|Robô é uma máquina programável capaz de executar tarefas automaticamente.|A estrutura física é chamada de corpo e o cérebro digital é o controlador.|Robôs podem ser fixos, móveis, aéreos ou submarinos.|#Exemplo: braço industrial repete o mesmo movimento com precisão|robô~Máquina programável que interage com o ambiente|controlador~Sistema computacional que comanda o robô",
      "Percepção, decisão e ação|Sensores coletam informações do ambiente e do próprio robô.|O controlador processa esses dados e decide a ação adequada.|Atuadores convertem sinais de controle em movimento.|#Exemplo: sensor vê obstáculo, controlador decide desviar, motor gira|sensor~Dispositivo que mede uma grandeza física|atuador~Dispositivo que produz ação no mundo",
      "Classificação dos robôs|Robôs industriais operam em linhas de produção com alta repetitividade.|Robôs de serviço ajudam em tarefas domésticas, médicas ou de exploração.|Robôs autônomos tomam decisões sem intervenção humana constante.|#Exemplo: aspirador robô mapeia a casa e evita obstáculos|robô industrial~Robô usado em manufatura|autonomia~Capacidade de agir sem controle humano direto"
    ]},
    { id: "sensores", cat: "robotica", t: "Sensores e Atuadores", d: "Como robôs enxergam o mundo e como transformam decisões em movimento.", e: "👁️", n: "iniciante", tempo: 20, mods: [
      "Tipos de sensores|Sensores de proximidade detectam obstáculos sem contato.|Sensores infravermelhos medem distância usando luz.|Encoders medem a rotação de motores e permitem controlar posição.|#Exemplo: ultrassom mede distância pelo tempo de retorno do som|sensor~Dispositivo que converte uma grandeza em sinal|encoder~Sensor que mede rotação ou deslocamento",
      "Atuadores e motores|Motores DC giram continuamente e são baratos e simples.|Servomotores controlam posição angular com precisão.|Motores de passo avançam em passos fixos, úteis para posicionamento.|#Exemplo: servo de 180 graus posiciona um braço|servomotor~Motor com controle de posição angular|motor de passo~Motor que avança em incrementos definidos",
      "Leitura e calibração|Sinais analógicos variam continuamente e digitais assumem poucos estados.|Calibrar corrige desvios e melhora a precisão das medições.|Filtragem reduz ruído em leituras instáveis.|#Exemplo: média de 10 leituras suaviza o sensor|calibração~Ajuste para melhorar a precisão|ruído~Variação indesejada na medição"
    ]},
    { id: "arduino", cat: "robotica", t: "Arduino e Eletrônica", d: "Sua primeira placa: pinos, LEDs, motores e código que ganha vida.", e: "🔌", n: "iniciante", tempo: 20, mods: [
      "A placa Arduino|Arduino é uma placa com microcontrolador e pinos de entrada e saída.|Pinos digitais leem estados ligado e desligado.|Pinos analógicos leem valores em uma faixa contínua.|#Exemplo: digitalWrite(13, HIGH) acende o LED integrado|Arduino~Placa de prototipação com microcontrolador|pino digital~Pino que lê ou escreve nível alto ou baixo",
      "Circuitos básicos|LED precisa de resistor para limitar a corrente.|Lei de Ohm relaciona tensão, corrente e resistência.|Protoboard permite montar circuitos sem solda.|#Exemplo: resistor de 220 ohms protege um LED comum|resistor~Componente que limita a passagem de corrente|protoboard~Placa para montar circuitos temporários",
      "Programando a placa|setup executa uma vez e loop repete continuamente.|PWM simula saída analógica controlando a intensidade do sinal.|Bibliotecas facilitam o uso de sensores e módulos.|#Exemplo: analogWrite(9, 128) deixa o LED no meio da intensidade|PWM~Modulação por largura de pulso|loop~Função que se repete indefinidamente"
    ]},
    { id: "embarcados", cat: "robotica", t: "Sistemas Embarcados e Raspberry Pi", d: "Computadores pequenos, tempo real, GPIO e comunicação entre dispositivos.", e: "🧷", n: "intermediario", tempo: 30, mods: [
      "Microcontroladores e SOC|Microcontrolador integra CPU, memória e periféricos em um chip.|Raspberry Pi é um computador completo com sistema operacional.|Sistemas embarcados dedicam-se a uma função específica.|#Exemplo: Raspberry Pi rodando Python para controlar sensores|microcontrolador~Chip com processador e periféricos integrados|embarcado~Sistema dedicado a uma tarefa específica",
      "GPIO e comunicação|GPIO permite ler e controlar pinos físicos da placa.|I2C usa dois fios para conectar vários dispositivos.|SPI é mais rápido, mas usa mais fios que I2C.|#Exemplo: sensor I2C no endereço 0x76 mede pressão|GPIO~Pinos de entrada e saída de propósito geral|I2C~Protocolo de comunicação serial com dois fios",
      "Tempo real e confiabilidade|Sistemas de tempo real exigem resposta dentro de prazos definidos.|Interrupções tratam eventos urgentes sem esperar o loop principal.|Watchdog reinicia o sistema se ele travar.|#Exemplo: interrupção ao detectar botão pressionado|tempo real~Resposta previsível dentro de um prazo|watchdog~Mecanismo que reinicia sistemas travados"
    ]},
    { id: "ros", cat: "robotica", t: "ROS — Robot Operating System", d: "Nós, tópicos, mensagens e as ferramentas padrão da robótica de software.", e: "🧰", n: "intermediario", tempo: 30, mods: [
      "Arquitetura de nós|ROS organiza o software em nós que se comunicam entre si.|Nós são processos independentes com responsabilidades específicas.|O roscore fornece serviços de registro e comunicação.|#Exemplo: nó da câmera publica imagens para o nó de visão|nó~Processo que executa uma parte da funcionalidade|roscore~Serviço central de comunicação do ROS",
      "Tópicos e mensagens|Tópicos são canais de comunicação publicados e assinados por nós.|Mensagens definem a estrutura dos dados enviados.|Publicadores enviam dados e assinantes os recebem.|#Exemplo: /cmd_vel controla a velocidade do robô|tópico~Canal nomeado de comunicação|mensagem~Estrutura de dados trocada entre nós",
      "Ferramentas e simulação|rviz visualiza dados de sensores e o modelo do robô.|Gazebo simula física e sensores em um ambiente virtual.|TF mantém as transformações entre sistemas de coordenadas.|#Exemplo: simular o robô antes de testar no mundo real|rviz~Ferramenta de visualização do ROS|TF~Sistema de transformações entre frames"
    ]},
    { id: "cinematica", cat: "robotica", t: "Cinemática e Dinâmica", d: "Movimento de braços robóticos, juntas, graus de liberdade e forças.", e: "📐", n: "avancado", tempo: 30, mods: [
      "Graus de liberdade|Grau de liberdade é um eixo independente de movimento.|Braços industriais costumam ter seis graus de liberdade.|Juntas rotacionais e prismáticas são as mais comuns.|#Exemplo: robô com 6 eixos alcança quase qualquer posição|grau de liberdade~Eixo independente de movimento|junta~Articulação que permite movimento entre elos",
      "Cinemática direta e inversa|Cinemática direta calcula a posição da garra a partir dos ângulos das juntas.|Cinemática inversa descobre os ângulos necessários para alcançar um ponto.|A cinemática inversa pode ter várias soluções ou nenhuma.|#Exemplo: calcular ângulos para levar a garra até uma peça|cinemática direta~Cálculo da posição final a partir das juntas|cinemática inversa~Cálculo das juntas a partir da posição desejada",
      "Dinâmica e forças|Dinâmica estuda forças e torques que produzem o movimento.|Inércia e gravidade influenciam o esforço dos motores.|Modelos dinâmicos melhoram o controle de movimentos rápidos.|#Exemplo: torque extra necessário para levantar um objeto|torque~Momento de força que gira uma junta|dinâmica~Estudo das forças no movimento"
    ]},
    { id: "controle", cat: "robotica", t: "Controle e PID", d: "Malhas de controle, erro, ganhos e o algoritmo PID usado em todo lugar.", e: "🎛️", n: "intermediario", tempo: 30, mods: [
      "Malhas de controle|Controlador compara o valor desejado com a medição real.|A diferença entre eles é chamada de erro.|Malha fechada usa a medição para corrigir a ação.|#Exemplo: manter velocidade de 1 m/s apesar de ladeiras|erro~Diferença entre referência e valor medido|malha fechada~Controle que usa realimentação",
      "O algoritmo PID|P tem ação proporcional ao erro atual.|I acumula erros passados e elimina erro em regime permanente.|D reage à taxa de variação do erro e reduz oscilações.|#Exemplo: PID = Kp*erro + Ki*soma + Kd*derivada|PID~Controlador proporcional integral derivativo|ganho~Peso aplicado a cada termo do PID",
      "Sintonia de ganhos|Ganho muito alto causa oscilação e instabilidade.|Ganho muito baixo deixa a resposta lenta.|Métodos como Ziegler-Nichols ajudam a encontrar ganhos iniciais.|#Exemplo: aumentar Kp até oscilar, depois reduzir|sintonia~Ajuste dos parâmetros do controlador|instabilidade~Resposta que oscila sem convergir"
    ]},
    { id: "visao", cat: "robotica", t: "Visão Computacional para Robôs", d: "Imagens, detecção de objetos, calibração de câmera e percepção 3D.", e: "📷", n: "intermediario", tempo: 30, mods: [
      "Processamento de imagens|Imagens digitais são matrizes de pixels com valores de cor.|Conversão para escala de cinza simplifica o processamento.|Limiarização separa objetos do fundo por intensidade.|#Exemplo: detectar uma linha preta em fundo branco|pixel~Menor unidade de uma imagem digital|limiarização~Transformação que separa regiões por intensidade",
      "Detecção e reconhecimento|Detecção localiza objetos e reconhecimento identifica o que é.|Filtros como Canny realçam bordas na imagem.|Modelos de visão aprendem padrões a partir de exemplos rotulados.|#Exemplo: reconhecer um semáforo e sua cor|detecção~Localização de objetos na imagem|borda~Mudança bruta de intensidade na imagem",
      "Visão 3D e calibração|Calibração corrige distorção e relaciona pixels com o mundo real.|Estereoscópia usa duas câmeras para estimar profundidade.|Nuvens de pontos representam superfícies em 3D.|#Exemplo: câmera estereoscópica mede distância por parallax|calibração~Ajuste dos parâmetros intrínsecos da câmera|nuvem de pontos~Conjunto de coordenadas 3D amostradas"
    ]},
    { id: "industrial", cat: "robotica", t: "Robótica Industrial", d: "Braços manipuladores, cells de manufatura, segurança e programação de trajetórias.", e: "🏭", n: "intermediario", tempo: 30, mods: [
      "Braços manipuladores|Robôs industriais repetem tarefas com alta precisão e velocidade.|End effector é a ferramenta na ponta do braço.|Carga útil é o peso máximo que o robô consegue manusear.|#Exemplo: braço soldando peças em uma linha de produção|end effector~Ferramenta acoplada ao fim do braço|carga útil~Massa máxima suportada pelo robô",
      "Programação de trajetórias|Trajetória define o caminho que a garra percorre no espaço.|Pontos de ensino são registrados manualmente pelo operador.|Movimentos podem ser ponto a ponto ou contínuos.|#Exemplo: mover de A para B passando por um ponto intermediário|trajetória~Caminho de movimento do efetuador|ponto de ensino~Posição registrada para reprodução",
      "Segurança em células robóticas|Áreas de trabalho são isoladas por grades e sensores.|Parada de emergência interrompe o movimento imediatamente.|Normas definem distâncias e comportamentos seguros.|#Exemplo: sensor de presença reduz a velocidade do braço|parada de emergência~Mecanismo de interrupção imediata|célula robótica~Área de trabalho com robô e dispositivos de segurança"
    ]},
    { id: "moveis", cat: "robotica", t: "Robôs Móveis e SLAM", d: "Locomoção, mapeamento, localização e navegação autônoma em ambientes desconhecidos.", e: "🧭", n: "avancado", tempo: 30, mods: [
      "Plataformas móveis|Robôs diferencias usam duas rodas motorizadas para girar e avançar.|Rodas omnidirecionais permitem movimento lateral.|Odometria estima posição integrando giros das rodas.|#Exemplo: girar uma roda mais que a outra faz o robô curvar|odometria~Estimativa de posição pelo movimento das rodas|roda diferencial~Par de rodas independentes usado para locomoção",
      "SLAM e mapeamento|SLAM constrói um mapa enquanto o robô se localiza nele.|Sensores LiDAR e câmeras fornecem informações do ambiente.|Mapas de ocupação dividem o espaço em células livres e ocupadas.|#Exemplo: aspirador robô mapeia a casa enquanto limpa|SLAM~Localização e mapeamento simultâneos|mapa de ocupação~Representação de áreas livres e obstruídas",
      "Planejamento de navegação|Planejador global encontra rota no mapa conhecido.|Planejador local desvia de obstáculos em tempo real.|A* é um algoritmo clássico de busca de caminho.|#Exemplo: ir da sala até a cozinha evitando um cadeirão|planejamento~Cálculo do caminho até o destino|obstáculo~Região que o robô não pode atravessar"
    ]},
    { id: "drones", cat: "robotica", t: "Drones e Veículos Autônomos", d: "Voo, estabilização, sensores e os desafios de veículos que se dirigem sozinhos.", e: "🛸", n: "intermediario", tempo: 30, mods: [
      "Fundamentos de voo|Quadricópteros usam quatro hélices para gerar sustentação.|Diferenciar a rotação das hélices controla inclinação e direção.|IMU mede aceleração e velocidade angular para estabilizar o voo.|#Exemplo: reduzir rotação de um lado faz o drone inclinar|IMU~Unidade de medição inercial|sustentação~Força que contrabalanceia o peso",
      "Controle de voo|Controlador de voo combina sensores e algoritmos de estabilização.|Modos assistidos ajudam o piloto a manter altitude e posição.|GPS permite navegação e retorno automático ao ponto inicial.|#Exemplo: modo altitude hold mantém a altura constante|controlador de voo~Computador que estabiliza a aeronave|GPS~Sistema de posicionamento por satélite",
      "Veículos autônomos|Carros autônomos combinam câmeras, radar e LiDAR.|Percepção identifica faixas, veículos e pedestres.|Planejador de trajetória define velocidade e direção seguras.|#Exemplo: frear automaticamente ao detectar pedestre|radar~Sensor que mede distância por ondas eletromagnéticas|percepção~Interpretação dos dados dos sensores"
    ]},
    { id: "etica-robotica", cat: "robotica", t: "Ética e Segurança em Robótica", d: "Responsabilidade, vieses, privacidade e impacto social da automação.", e: "⚖️", n: "iniciante", tempo: 20, mods: [
      "Responsabilidade e automação|Automação substitui tarefas, mas também cria novos postos de trabalho.|É preciso definir quem responde por danos causados por um sistema autônomo.|Transparência ajuda a entender decisões automatizadas.|#Exemplo: acidente com carro autônomo exige investigação de responsabilidade|automação~Execução de tarefas por máquinas|responsabilidade~Obrigação de responder por consequências",
      "Vieses e privacidade|Sistemas aprendem com dados e podem reproduzir vieses existentes.|Robôs com câmeras coletam imagens sensíveis de pessoas.|Consentimento e anonimização reduzem riscos à privacidade.|#Exemplo: reconhecimento facial com erros diferentes por grupo|viés~Desvio sistemático em dados ou decisões|privacidade~Controle sobre o uso de dados pessoais",
      "Segurança e regulação|Testes em simulação reduzem riscos antes de usar o robô no mundo real.|Normas técnicas definem requisitos de segurança para máquinas.|Robótica assistiva deve respeitar dignidade e autonomia do usuário.|#Exemplo: exoesqueleto que responde à intenção do paciente|regulação~Conjunto de regras que orientam o setor|segurança~Proteção contra danos acidentais"
    ]},
    { id: "prototipacao", cat: "robotica", t: "Prototipação e Impressão 3D", d: "Do desenho CAD à peça impressa: itere rápido e teste ideias mecânicas.", e: "🖨️", n: "iniciante", tempo: 20, mods: [
      "Modelagem CAD|Modelos 3D são criados com formas geométricas e restrições.|Peças impressas precisam considerar espessura de parede e tolerâncias.|Formatos como STL e STEP são usados para trocar modelos.|#Exemplo: desenhar suporte para sensor em CAD|CAD~Projeto auxiliado por computador|tolerância~Margem de erro aceitável em uma peça",
      "Impressão 3D|FDM deposita filamento camada por camada para formar a peça.|Resina fotopolimerizada permite detalhes finos, mas exige cuidado.|Suportes sustentam áreas suspensas durante a impressão.|#Exemplo: imprimir engrenagem com PLA|impressão 3D~Fabricação aditiva de objetos físicos|filamento~Material consumível usado na impressão FDM",
      "Teste e iteração|Protótipos rápidos permitem testar encaixes antes da peça final.|Medições comparam o modelo digital com a peça produzida.|Iterar corrigindo pequenos erros melhora o resultado final.|#Exemplo: ajustar furo de 5 para 5.3 mm após teste|protótipo~Versão inicial usada para testar uma ideia|iteração~Ciclo de melhoria sucessiva"
    ]},

    /* ------------------------------ PSICOLOGIA */
    { id: "intro-psico", cat: "psicologia", t: "Introdução à Psicologia", d: "A ciência do comportamento, suas correntes e áreas de atuação.", e: "🧠", n: "iniciante", tempo: 20, mods: [
      "Correntes e história|A psicologia é a ciência que estuda o comportamento e os processos mentais.|Wilhelm Wundt fundou o primeiro laboratório de psicologia experimental em 1879.|Behaviorismo, psicanálise e cognitivismo oferecem explicações diferentes.|#Exemplo: behaviorismo foca comportamento observável e psicanálise foca o inconsciente|psicologia~Ciência que estuda comportamento e processos mentais|behaviorismo~Corrente que estuda o comportamento observável",
      "Áreas de atuação|Psicologia clínica atende pessoas em sofrimento emocional.|Psicologia educacional investiga como as pessoas aprendem.|Psicologia organizacional estuda o comportamento no trabalho.|#Exemplo: psicólogo escolar apoia estudantes com dificuldades|psicologia clínica~Área voltada ao atendimento terapêutico|psicologia organizacional~Área que estuda pessoas nas organizações",
      "Método científico|Hipóteses são testadas com métodos sistemáticos e dados observáveis.|Experimentos permitem testar relações de causa e efeito.|A ética exige consentimento e proteção dos participantes.|#Exemplo: testar se o sono afeta o desempenho em uma prova|hipótese~Suposição testável sobre um fenômeno|experimento~Procedimento controlado para testar hipóteses"
    ]},
    { id: "neuro", cat: "psicologia", t: "Neurociência do Comportamento", d: "Neuronas, sinapses, áreas do cérebro e neuroplasticidade.", e: "⚡", n: "intermediario", tempo: 30, mods: [
      "Neuronas e sinapses|Neuronas são células que transmitem sinais elétricos e químicos.|Sinapses são as conexões por onde os sinais passam entre neuronas.|A mielina acelera a condução do sinal ao longo do axônio.|#Exemplo: um reflexo rápido depende de vias mielinizadas|neurona~Célula nervosa que transmite informações|sinapse~Conexão entre neuronas",
      "Cérebro e funções|O córtex cerebral processa linguagem, memória e movimento.|O hipocampo é essencial para formar novas memórias.|A amígdala participa do processamento de emoções como o medo.|#Exemplo: lesão no hipocampo prejudica novas lembranças|hipocampo~Estrutura envolvida na formação de memórias|amígdala~Estrutura ligada a emoções como o medo",
      "Neuroplasticidade|O cérebro consegue reorganizar conexões em resposta à experiência.|A aprendizagem fortalece sinapses usadas com frequência.|A reabilitação explora a plasticidade após lesões.|#Exemplo: praticar piano altera representações no córtex|neuroplasticidade~Capacidade do cérebro de se reorganizar|córtex~Camada externa do cérebro com funções avançadas"
    ]},
    { id: "memoria", cat: "psicologia", t: "Aprendizagem e Memória", d: "Como registramos, guardamos e recuperamos informações — e como estudar melhor.", e: "📝", n: "iniciante", tempo: 20, mods: [
      "Codificação e armazenamento|A memória sensorial retém informações por poucos segundos.|A memória de trabalho mantém e manipula dados por curto prazo.|A memória de longo prazo pode durar anos.|#Exemplo: repetir um telefone até discar usa a memória de trabalho|memória sensorial~Registro breve de estímulos|memória de trabalho~Sistema de curto prazo para manipular dados",
      "Aprendizagem e reforço|A repetição espaçada melhora a retenção ao longo do tempo.|A recuperação ativa fortalece mais do que apenas reler.|Reforço positivo aumenta a chance de um comportamento se repetir.|#Exemplo: fazer questões sem olhar a resposta|repetição espaçada~Revisão distribuída ao longo do tempo|reforço~Consequência que aumenta a frequência de um comportamento",
      "Esquecimento e consolidação|A interferência ocorre quando uma informação atrapalha outra.|A consolidação estabiliza memórias durante o sono.|Dicas de recuperação ajudam a acessar lembranças.|#Exemplo: dormir depois de estudar ajuda a fixar o conteúdo|consolidação~Processo de estabilizar memórias|interferência~Influência de uma informação sobre outra"
    ]},
    { id: "desenvolvimento", cat: "psicologia", t: "Desenvolvimento Humano", d: "Piaget, Erikson e Vygotsky explicando como crescemos e aprendemos.", e: "🌱", n: "intermediario", tempo: 30, mods: [
      "Piaget e o desenvolvimento cognitivo|Piaget propôs os estágios sensório-motor, pré-operacional, operações concretas e formais.|A criança constrói conhecimento pela interação com o mundo.|A teoria destaca maturação e experiência.|#Exemplo: conservação de volume compreendida por volta dos 7 anos|assimilação~Integração de nova informação em esquemas existentes|acomodação~Ajuste dos esquemas para lidar com novas informações",
      "Erikson e a identidade|Erikson descreveu crises psicossociais ao longo da vida.|A adolescência é marcada pelo conflito identidade versus confusão.|Cada crise resolvida fortalece uma virtude.|#Exemplo: o adolescente explora valores e papéis sociais|identidade~Sentimento de continuidade do eu|crise psicossocial~Conflito de desenvolvimento entre duas tendências",
      "Vygotsky e o contexto social|Vygotsky destacou o papel da cultura e da linguagem.|A zona de desenvolvimento proximal separa o que se faz sozinho e com ajuda.|Andaimagem é o apoio dado por alguém mais experiente.|#Exemplo: o professor ajuda até o aluno resolver sozinho|zona de desenvolvimento proximal~Distância entre o desempenho atual e o potencial|andaimagem~Apoio temporário no aprendizado"
    ]},
    { id: "personalidade", cat: "psicologia", t: "Personalidade e Diferenças Individuais", d: "Big Five, teorias clássicas e avaliação ética da personalidade.", e: "🎭", n: "intermediario", tempo: 30, mods: [
      "Os cinco grandes fatores|O Big Five reúne abertura, conscienciosidade, extroversão, amabilidade e neuroticismo.|Traços são relativamente estáveis ao longo do tempo.|Cada fator varia em um contínuo entre baixo e alto.|#Exemplo: alta conscienciosidade costuma favorecer organização|Big Five~Modelo de cinco fatores de personalidade|traço~Característica relativamente estável da pessoa",
      "Abordagens teóricas|Freud enfatizou impulsos inconscientes e conflitos internos.|Rogers destacou a tendência de autorrealização.|Bandura propôs que ambiente e pessoa se influenciam mutuamente.|#Exemplo: a abordagem de Rogers valoriza a aceitação incondicional|autorrealização~Tendência a desenvolver o próprio potencial|determinismo recíproco~Influência mútua entre pessoa e ambiente",
      "Avaliação da personalidade|Testes de auto-relato são comuns, mas podem sofrer viés de resposta.|Inventários como o NEO medem os cinco fatores.|A avaliação deve respeitar princípios éticos e sigilo.|#Exemplo: responder de forma socialmente desejável distorce o resultado|inventário~Questionário padronizado de avaliação|viés de resposta~Tendência a responder de forma distorcida"
    ]},
    { id: "social", cat: "psicologia", t: "Psicologia Social", d: "Conformidade, atitudes, preconceito e relações entre grupos.", e: "👥", n: "intermediario", tempo: 30, mods: [
      "Conformidade e obediência|Conformidade é mudar o comportamento para se ajustar ao grupo.|Experimentos mostraram que pessoas podem seguir a maioria mesmo em erro.|Obediência à autoridade pode levar a ações contrárias aos valores pessoais.|#Exemplo: os experimentos de Asch mostram a influência do grupo|conformidade~Ajuste ao comportamento do grupo|obediência~Submissão a uma figura de autoridade",
      "Atitudes e persuasão|Atitudes têm componentes cognitivo, afetivo e comportamental.|A persuasão depende da fonte, da mensagem e da audiência.|A dissonância cognitiva surge quando crenças e ações conflitam.|#Exemplo: fumar e saber que faz mal gera desconforto|dissonância cognitiva~Conflito entre crenças e comportamentos|persuasão~Processo de mudar uma atitude",
      "Relações entre grupos|Preconceito é uma atitude negativa baseada em generalização.|Estereótipos são crenças simplificadas sobre grupos.|O contato entre grupos pode reduzir o preconceito em certas condições.|#Exemplo: projetos conjuntos melhoram a relação entre grupos|preconceito~Atitude negativa prévia sobre um grupo|estereótipo~Crença generalizada sobre um grupo"
    ]},
    { id: "cognitiva", cat: "psicologia", t: "Psicologia Cognitiva", d: "Atenção, pensamento, decisões, linguagem e vieses mentais.", e: "💡", n: "intermediario", tempo: 30, mods: [
      "Atenção e percepção|A atenção seleciona informações prioritárias entre muitos estímulos.|A percepção organiza e interpreta informações dos sentidos.|A atenção seletiva pode ignorar estímulos relevantes.|#Exemplo: não perceber alguém chamando enquanto lê|atenção seletiva~Foco em um estímulo ignorando outros|percepção~Interpretação dos estímulos sensoriais",
      "Pensamento e decisões|O raciocínio dedutivo parte de premissas gerais para conclusões.|Heurísticas são atalhos mentais que economizam esforço.|Vieses cognitivos podem distorcer julgamentos.|#Exemplo: a disponibilidade leva a superestimar eventos lembrados|heurística~Atalho mental para tomar decisões|viés cognitivo~Desvio sistemático no pensamento",
      "Linguagem e conceitos|A linguagem permite representar e comunicar ideias abstratas.|Conceitos agrupam objetos com características comuns.|A categoria protótipo influencia como classificamos exemplos.|#Exemplo: um pardal é visto como mais típico que um pinguim|conceito~Categoria mental de objetos ou ideias|linguagem~Sistema de símbolos para comunicação"
    ]},
    { id: "emocoes", cat: "psicologia", t: "Emoções e Sentimentos", d: "O que são emoções, como expressamos e como regularizamos.", e: "💫", n: "iniciante", tempo: 20, mods: [
      "O que são emoções|Emoções envolvem respostas fisiológicas, cognitivas e comportamentais.|A teoria de James-Lange vê a emoção como resposta a mudanças corporais.|A teoria de Schachter-Singer destaca a interpretação da ativação.|#Exemplo: coração acelerado interpretado como nervosismo|emoção~Resposta complexa a um estímulo significativo|ativação~Estado de preparação do organismo",
      "Expressão e regulação|Expressões faciais são em parte universais, mas têm regras culturais.|A regulação emocional modifica a intensidade ou a duração da emoção.|A reavaliação cognitiva costuma ser mais eficaz que a supressão.|#Exemplo: reinterpretar uma crítica como oportunidade|regulação emocional~Processo de influenciar as próprias emoções|reavaliação~Mudança de interpretação de uma situação",
      "Humor e bem-estar|Humor é um estado emocional difuso e duradouro.|Emoções positivas ampliam o pensamento e favorecem a criatividade.|O equilíbrio emocional está ligado à saúde mental e às relações.|#Exemplo: sentir-se bem melhora a disposição para estudar|humor~Estado emocional de base|bem-estar~Estado de satisfação e saúde"
    ]},
    { id: "motivacao", cat: "psicologia", t: "Motivação e Metas", d: "Por que agimos? Necessidades, expectativas e motivação intrínseca.", e: "🔥", n: "iniciante", tempo: 20, mods: [
      "Motivos e necessidades|Maslow propôs uma hierarquia das necessidades humanas.|Necessidades fisiológicas vêm antes das de autorrealização.|Herzberg separou fatores de higiene e motivadores no trabalho.|#Exemplo: salário evita insatisfação, reconhecimento motiva|motivação~Processo que direciona e sustenta o comportamento|necessidade~Estado de carência que impulsiona a ação",
      "Teorias cognitivas|A teoria da expectativa relaciona esforço, desempenho e recompensa.|Metas específicas e desafiadoras melhoram o desempenho.|Autoeficácia é a crença na própria capacidade de executar uma tarefa.|#Exemplo: acreditar que consegue estudar aumenta o esforço|autoeficácia~Crença sobre a própria capacidade|expectativa~Previsão sobre o resultado de um esforço",
      "Motivação intrínseca e extrínseca|A motivação intrínseca vem do interesse pela própria atividade.|Recompensas externas podem deslocar o interesse interno.|Autonomia e competência favorecem uma motivação sustentável.|#Exemplo: estudar por curiosidade em vez de apenas pela nota|motivação intrínseca~Interesse gerado pela própria tarefa|recompensa~Consequência externa que reforça o comportamento"
    ]},
    { id: "percepcao", cat: "psicologia", t: "Percepção e Atenção", d: "Como organizamos estímulos, ilusões e percepção social.", e: "👁️", n: "intermediario", tempo: 30, mods: [
      "Processos perceptivos|A percepção envolve detecção, organização e interpretação de estímulos.|As leis da Gestalt explicam como agrupamos elementos visuais.|A constância perceptiva mantém a percepção estável apesar de mudanças na imagem.|#Exemplo: ver uma porta inclinada como retângulo|Gestalt~Abordagem que estuda a organização da percepção|constância perceptiva~Estabilidade na percepção de objetos",
      "Ilusões e atenção|Ilusões óticas revelam atalhos e limitações do sistema visual.|Mudanças de atenção podem fazer objetos passarem despercebidos.|Expectativas influenciam o que percebemos.|#Exemplo: a ilusão de Müller-Lyer engana o comprimento de linhas|ilusão~Percepção que diverge da realidade física|expectativa~Influência do conhecimento prévio na percepção",
      "Percepção social|Formamos impressões de pessoas a partir de poucos traços.|O efeito de primazia dá mais peso às primeiras informações.|Atribuições causais explicam por que agimos de certa forma.|#Exemplo: o primeiro contato influencia a impressão geral|efeito de primazia~Peso maior dado às primeiras informações|atribuição~Explicação da causa de um comportamento"
    ]},
    { id: "psicopatologia", cat: "psicologia", t: "Psicopatologia", d: "Transtornos mentais, diagnóstico, causas e tratamentos.", e: "🩺", n: "intermediario", tempo: 30, mods: [
      "Conceitos básicos|Transtorno mental envolve padrões persistentes que causam sofrimento ou prejuízo.|O diagnóstico exige avaliação clínica cuidadosa.|Categorias como DSM e CID padronizam critérios.|#Exemplo: tristeza intensa e persistente pode indicar depressão|diagnóstico~Identificação de um quadro clínico|transtorno~Padrão de sintomas com prejuízo funcional",
      "Transtornos comuns|A depressão envolve tristeza persistente e perda de interesse.|Transtornos de ansiedade envolvem medo excessivo e preocupação.|O transtorno bipolar alterna episódios de mania e depressão.|#Exemplo: episódios de euforia intensa e gasto impulsivo|depressão~Transtorno com tristeza e perda de interesse|ansiedade~Preocupação excessiva e medo antecipatório",
      "Causas e tratamento|Fatores genéticos, biológicos e sociais interagem nos transtornos.|Tratamentos podem combinar psicoterapia e medicação.|O estigma dificulta a busca por ajuda.|#Exemplo: combinar terapia cognitiva com acompanhamento médico|estigma~Preconceito contra pessoas com transtorno|psicoterapia~Tratamento psicológico estruturado"
    ]},
    { id: "terapias", cat: "psicologia", t: "Terapias Psicológicas", d: "TCC, terapias humanistas, familiares e a relação terapêutica.", e: "🤝", n: "intermediario", tempo: 30, mods: [
      "Terapia cognitivo-comportamental|A TCC relaciona pensamentos, emoções e comportamentos.|Identificar distorções cognitivas ajuda a mudar reações.|As técnicas incluem reestruturação e exposição gradual.|#Exemplo: trocar o pensamento vou falhar por posso tentar|TCC~Terapia que trabalha pensamentos e comportamentos|distorção cognitiva~Padrão de pensamento distorcido",
      "Abordagens complementares|A terapia humanista valoriza aceitação e autoconhecimento.|A terapia familiar trabalha padrões de relação entre membros.|A terapia comportamental foca aprendizagem e reforço.|#Exemplo: famílias melhoram a comunicação em terapia|terapia humanista~Abordagem centrada no crescimento pessoal|terapia familiar~Trabalho com o sistema familiar",
      "Relação terapêutica|A aliança terapêutica é um dos maiores preditores de resultado.|Empatia e escuta ativa favorecem a mudança.|Limites éticos protegem o paciente e o profissional.|#Exemplo: ouvir sem julgar antes de sugerir mudanças|aliança terapêutica~Relação de confiança entre terapeuta e paciente|empatia~Compreensão do estado do outro"
    ]},
    { id: "trabalho-psico", cat: "psicologia", t: "Psicologia do Trabalho", d: "Clima, liderança, seleção, treinamento e bem-estar organizacional.", e: "💼", n: "iniciante", tempo: 20, mods: [
      "Comportamento organizacional|O clima organizacional influencia satisfação e produtividade.|A liderança afeta o engajamento e a comunicação da equipe.|A cultura organizacional define valores e normas compartilhadas.|#Exemplo: feedback frequente melhora o clima da equipe|clima organizacional~Percepção compartilhada do ambiente de trabalho|liderança~Processo de influenciar e guiar pessoas",
      "Seleção e treinamento|Entrevistas estruturadas tendem a ser mais justas e preditivas.|Treinamento desenvolve competências necessárias à função.|A avaliação de desempenho deve ser clara e contínua.|#Exemplo: fazer a mesma pergunta para todos os candidatos|entrevista estruturada~Entrevista com perguntas padronizadas|competência~Conjunto de conhecimentos e habilidades",
      "Bem-estar no trabalho|Estresse ocupacional surge quando exigências superam recursos.|Burnout envolve exaustão, cinismo e redução de eficácia.|O equilíbrio entre vida e trabalho protege a saúde mental.|#Exemplo: pausas e limites claros reduzem o estresse|burnout~Síndrome de exaustão relacionada ao trabalho|estresse ocupacional~Tensão causada por demandas do trabalho"
    ]},
    { id: "psico-educacional", cat: "psicologia", t: "Psicologia Educacional", d: "Aprendizagem significativa, dificuldades escolares e papel do professor.", e: "🎓", n: "iniciante", tempo: 20, mods: [
      "Aprendizagem em sala|A aprendizagem significativa conecta novos conhecimentos aos prévios.|Motivação e atenção influenciam o rendimento escolar.|O feedback formativo acompanha o processo e orienta melhorias.|#Exemplo: relacionar fração com pizza facilita a compreensão|aprendizagem significativa~Conexão entre conhecimentos|feedback formativo~Devolutiva que orienta o aprendizado",
      "Dificuldades escolares|A dislexia afeta a leitura e a escrita apesar de inteligência adequada.|O TDAH envolve dificuldades de atenção e impulso.|Dificuldades podem ter causas múltiplas e exigem avaliação cuidadosa.|#Exemplo: apoio pedagógico e ajustes favorecem o aluno|dislexia~Dificuldade específica de leitura|TDAH~Transtorno com desatenção e hiperatividade",
      "Papel do professor|As expectativas do professor podem influenciar o desempenho dos alunos.|Estratégias variadas atendem diferentes ritmos.|Uma relação positiva favorece engajamento e comportamento.|#Exemplo: elogiar o esforço em vez de apenas o acerto|expectativa~Crença sobre o desempenho do aluno|engajamento~Envolvimento do estudante com a aprendizagem"
    ]},
    { id: "pesquisa-psico", cat: "psicologia", t: "Pesquisa Científica em Psicologia", d: "Desenho de estudo, coleta de dados, estatística e ética na pesquisa.", e: "🔬", n: "intermediario", tempo: 30, mods: [
      "Desenho de pesquisa|A variável independente é manipulada e a dependente é medida.|O grupo controle serve de comparação com o grupo experimental.|A amostragem define como os participantes são selecionados.|#Exemplo: testar o sono com um grupo de 8h e outro de 4h|variável dependente~Resultado medido no experimento|grupo controle~Grupo que não recebe a intervenção",
      "Coleta de dados|Questionários e entrevistas coletam relatos e opiniões.|A observação sistemática registra comportamentos em contexto.|Escalas padronizadas medem construtos como personalidade.|#Exemplo: escala de 1 a 5 para medir satisfação|escala~Instrumento de medição com pontos ordenados|observação~Registro estruturado de comportamentos",
      "Análise e ética|A estatística descritiva resume os dados e a inferencial testa hipóteses.|Significância estatística indica a probabilidade do resultado.|Consentimento informado e sigilo são obrigatórios.|#Exemplo: comparar médias com um teste t|significância~Probabilidade de o resultado não ser acaso|consentimento informado~Aceite esclarecido do participante"
    ]},
    { id: "etica-psico", cat: "psicologia", t: "Ética em Psicologia", d: "Beneficência, sigilo, responsabilidade e limites da atuação profissional.", e: "⚖️", n: "iniciante", tempo: 20, mods: [
      "Princípios éticos|A beneficência busca o bem-estar do paciente.|A não maleficência evita causar dano.|A autonomia respeita a decisão informada da pessoa.|#Exemplo: explicar os riscos antes de iniciar a terapia|beneficência~Princípio de promover o bem-estar|autonomia~Direito de decidir sobre si mesmo",
      "Sigilo e confidencialidade|As informações da terapia são sigilosas, com exceções legais.|O profissional deve esclarecer os limites do sigilo desde o início.|Compartilhar dados exige autorização, salvo risco iminente.|#Exemplo: risco de vida pode justificar intervenção|sigilo~Proteção das informações do paciente|confidencialidade~Dever de não divulgar informações",
      "Responsabilidade profissional|É preciso atuar dentro da própria competência técnica.|Fraude e exploração são condutas vedadas.|Supervisão e formação contínua melhoram a prática.|#Exemplo: encaminhar um caso complexo a um especialista|competência~Área em que o profissional está habilitado|supervisão~Acompanhamento de casos por profissional experiente"
    ]},

    /* ------------------------------ ENSINO MÉDIO */
    { id: "algebra", cat: "ensino-medio", t: "Matemática — Álgebra", d: "Equações, polinômios, fatoração e sistemas para o ensino médio.", e: "➗", n: "iniciante", tempo: 20, mods: [
      "Equações e inequações|Equação é uma igualdade com incógnitas.|Para resolver, aplicamos operações inversas nos dois lados.|Inequações usam sinais de maior e menor e podem trocar o sinal ao multiplicar por negativo.|#Exemplo: 2x + 4 = 10 leva a x = 3|equação~Igualdade com valores desconhecidos|incógnita~Valor que se quer descobrir",
      "Polinômios e fatoração|Polinômio é uma soma de termos com potências da variável.|Fatorar escreve o polinômio como produto de fatores.|Produtos notáveis aceleram cálculos frequentes.|#Exemplo: x² - 9 = (x - 3)(x + 3)|polinômio~Expressão algébrica com vários termos|fatoração~Escrita de uma expressão como produto",
      "Sistemas de equações|Sistema é um conjunto de equações com as mesmas incógnitas.|Os métodos de substituição e adição encontram a solução.|O sistema pode ter uma, nenhuma ou infinitas soluções.|#Exemplo: x + y = 10 e x - y = 2 leva a x = 6|sistema~Conjunto de equações resolvidas em conjunto|substituição~Método que isola uma variável"
    ]},
    { id: "geometria", cat: "ensino-medio", t: "Matemática — Geometria", d: "Ângulos, polígonos, áreas e o teorema de Pitágoras.", e: "📐", n: "iniciante", tempo: 20, mods: [
      "Ângulos e retas|Ângulos complementares somam 90 graus e suplementares somam 180.|Retas paralelas cortadas por uma transversal formam ângulos correspondentes iguais.|A soma dos ângulos internos de um triângulo é 180 graus.|#Exemplo: triângulo com 60 e 50 graus tem 70 no terceiro|ângulo~Abertura entre duas semirretas|paralelas~Retas que nunca se encontram",
      "Polígonos e áreas|A área do retângulo é base vezes altura.|A área do triângulo é base vezes altura dividido por dois.|O perímetro é a soma dos lados da figura.|#Exemplo: retângulo 5 por 3 tem área 15|área~Medida da superfície ocupada|perímetro~Soma dos comprimentos dos lados",
      "Teorema de Pitágoras|No triângulo retângulo, a hipotenusa ao quadrado é a soma dos catetos ao quadrado.|Catetos são os lados que formam o ângulo reto.|O teorema permite calcular distâncias indiretas.|#Exemplo: catetos 3 e 4 dão hipotenusa 5|Pitágoras~Relação entre os lados do triângulo retângulo|hipotenusa~Maior lado do triângulo retângulo"
    ]},
    { id: "funcoes", cat: "ensino-medio", t: "Matemática — Funções", d: "Domínio, imagem, função linear e função quadrática.", e: "📈", n: "intermediario", tempo: 30, mods: [
      "Conceito de função|Função associa a cada elemento do domínio um único elemento do contradomínio.|Domínio são as entradas possíveis e imagem são os valores assumidos.|O gráfico mostra a relação no plano cartesiano.|#Exemplo: f(x) = 2x associa cada x ao seu dobro|domínio~Conjunto das entradas possíveis|imagem~Conjunto dos valores de saída",
      "Função do primeiro grau|Função linear tem a forma f(x) = ax + b.|O coeficiente a é a inclinação da reta.|O zero da função é o valor de x em que f(x) = 0.|#Exemplo: f(x) = 3x - 6 cruza o eixo em x = 2|função linear~Função cujo gráfico é uma reta|inclinação~Medida da inclinação da reta",
      "Função quadrática|Função quadrática tem a forma ax² + bx + c.|O gráfico é uma parábola com vértice.|A concavidade depende do sinal de a.|#Exemplo: f(x) = x² - 4 tem vértice em (0, -4)|parábola~Gráfico de uma função quadrática|vértice~Ponto de máximo ou mínimo da parábola"
    ]},
    { id: "trigonometria", cat: "ensino-medio", t: "Matemática — Trigonometria", d: "Radianos, seno, cosseno, tangente e círculo unitário.", e: "🔺", n: "intermediario", tempo: 30, mods: [
      "Ângulos e radianos|Radianos medem ângulos pelo comprimento do arco dividido pelo raio.|Uma volta completa equivale a 2π radianos ou 360 graus.|Graus e radianos são convertidos por proporção.|#Exemplo: 180 graus equivalem a π radianos|radiano~Unidade de medida angular baseada no raio|constante π~Relação entre circunferência e diâmetro",
      "Seno, cosseno e tangente|No triângulo retângulo, seno é cateto oposto sobre hipotenusa.|Cosseno é cateto adjacente sobre hipotenusa.|Tangente é cateto oposto sobre adjacente.|#Exemplo: o seno de 30 graus vale 1/2|seno~Razão entre cateto oposto e hipotenusa|cosseno~Razão entre cateto adjacente e hipotenusa",
      "Círculo trigonométrico|O círculo unitário tem raio 1 e centro na origem.|As coordenadas de um ponto dão o cosseno e o seno do ângulo.|Os sinais variam conforme o quadrante.|#Exemplo: no primeiro quadrante seno e cosseno são positivos|círculo unitário~Círculo de raio 1 usado na trigonometria|quadrante~Uma das quatro regiões do plano"
    ]},
    { id: "estatistica", cat: "ensino-medio", t: "Matemática — Estatística e Probabilidade", d: "Médias, dispersão e chances de eventos no cotidiano.", e: "📊", n: "iniciante", tempo: 20, mods: [
      "Medidas de tendência central|A média é a soma dos valores dividida pela quantidade.|A mediana é o valor central após ordenar os dados.|A moda é o valor mais frequente na amostra.|#Exemplo: dados 2, 3, 3, 7 têm mediana 3|média~Valor obtido pela soma dividida pela quantidade|mediana~Valor central de uma sequência ordenada",
      "Medidas de dispersão|Amplitude é a diferença entre o maior e o menor valor.|Variância mede o desvio médio quadrático em relação à média.|Desvio padrão é a raiz da variância.|#Exemplo: desvio padrão alto indica dados espalhados|variância~Medida do espalhamento dos dados|desvio padrão~Raiz da variância",
      "Probabilidade|A probabilidade varia de 0 a 1 e mede a chance de um evento.|Eventos independentes não influenciam a ocorrência um do outro.|Probabilidade condicional considera que outro evento já ocorreu.|#Exemplo: lançar uma moeda justa dá 1/2 para cara|probabilidade~Medida da chance de um evento|evento~Resultado possível de um experimento"
    ]},
    { id: "calculo", cat: "ensino-medio", t: "Matemática — Noções de Cálculo", d: "Limites, derivadas e integrais de forma introdutória.", e: "∫", n: "avancado", tempo: 30, mods: [
      "Limites|Limite descreve o comportamento da função quando x se aproxima de um valor.|Limites laterais podem diferir e impedir o limite geral.|Continuidade exige limite igual ao valor da função.|#Exemplo: limite de (x²-1)/(x-1) quando x tende a 1 é 2|limite~Valor aproximado de uma função|continuidade~Função sem saltos no ponto",
      "Derivadas|Derivada mede a taxa instantânea de variação.|A derivada é a inclinação da reta tangente ao gráfico.|Pela regra da potência, a derivada de x elevado a n é n x elevado a n-1.|#Exemplo: a derivada de x² é 2x|derivada~Taxa instantânea de variação|reta tangente~Reta que toca o gráfico em um ponto",
      "Integrais|A integral define a área sob a curva em um intervalo.|Integrar é a operação inversa de derivar.|A integral definida usa limites superior e inferior.|#Exemplo: a integral de x de 0 a 2 é 2|integral~Operação que acumula quantidades|área sob a curva~Região entre o gráfico e o eixo"
    ]},
    { id: "fisica-mecanica", cat: "ensino-medio", t: "Física — Mecânica", d: "Movimento, leis de Newton, energia e trabalho.", e: "🍎", n: "iniciante", tempo: 20, mods: [
      "Movimento e velocidade|Posição indica onde o corpo está em determinado instante.|Velocidade média é deslocamento dividido pelo tempo.|Aceleração é a variação da velocidade com o tempo.|#Exemplo: percorrer 100 m em 10 s dá 10 m/s|velocidade~Variação da posição com o tempo|aceleração~Variação da velocidade com o tempo",
      "Leis de Newton|Pela primeira lei, o corpo mantém seu estado sem força resultante.|Pela segunda lei, força resultante é massa vezes aceleração.|Pela terceira lei, toda ação tem reação de mesmo módulo e sentido oposto.|#Exemplo: empurrar a parede faz a parede empurrar de volta|força~Interação que pode alterar o movimento|inércia~Resistência à mudança de movimento",
      "Energia e trabalho|Trabalho é força aplicada no sentido do deslocamento.|Energia cinética depende da massa e da velocidade ao quadrado.|Energia potencial gravitacional depende da altura.|#Exemplo: objeto em queda converte potencial em cinética|energia~Capacidade de realizar trabalho|trabalho~Transferência de energia por força"
    ]},
    { id: "fisica-eletro", cat: "ensino-medio", t: "Física — Eletromagnetismo", d: "Cargas, circuitos, magnetismo e indução eletromagnética.", e: "⚡", n: "intermediario", tempo: 30, mods: [
      "Carga e campo elétrico|Cargas positivas e negativas se atraem e iguais se repelem.|A lei de Coulomb quantifica a força entre cargas.|Campo elétrico é a força por unidade de carga.|#Exemplo: o elétron é atraído pelo próton|carga elétrica~Propriedade que gera força eletromagnética|campo elétrico~Região de influência de uma carga",
      "Corrente e circuitos|Corrente elétrica é o fluxo ordenado de cargas.|Tensão é a diferença de potencial que move as cargas.|Resistência opõe-se à passagem da corrente.|#Exemplo: pela lei de Ohm, U = R i|corrente~Fluxo de carga por unidade de tempo|tensão~Diferença de potencial elétrico",
      "Magnetismo e indução|Ímãs têm polos norte e sul e criam campo magnético.|Corrente elétrica gera campo magnético ao redor do condutor.|Indução eletromagnética gera corrente pela variação de fluxo magnético.|#Exemplo: gerador transforma movimento em corrente|indução~Geração de corrente por variação de fluxo|fluxo magnético~Quantidade de campo magnético que atravessa uma área"
    ]},
    { id: "quimica-materia", cat: "ensino-medio", t: "Química — Estrutura da Matéria", d: "Átomo, tabela periódica e ligações químicas.", e: "⚗️", n: "iniciante", tempo: 20, mods: [
      "Estrutura do átomo|Átomo tem núcleo com prótons e nêutrons e elétrons em camadas.|Número atômico indica a quantidade de prótons.|Isótopos têm o mesmo número atômico e diferentes números de massa.|#Exemplo: carbono-12 e carbono-14 são isótopos|próton~Partícula positiva no núcleo|isótopo~Átomo do mesmo elemento com massas diferentes",
      "Tabela periódica|Elementos são organizados por número atômico crescente.|Famílias agrupam elementos com propriedades semelhantes.|Períodos indicam o número de camadas eletrônicas.|#Exemplo: metais alcalinos são muito reativos|família~Coluna da tabela periódica|período~Linha da tabela periódica",
      "Ligações químicas|Ligação iônica envolve transferência de elétrons.|Ligação covalente envolve compartilhamento de elétrons.|Ligação metálica explica a condutividade dos metais.|#Exemplo: NaCl é formado por ligação iônica|ligação iônica~Transferência de elétrons entre átomos|ligação covalente~Compartilhamento de elétrons"
    ]},
    { id: "quimica-reacoes", cat: "ensino-medio", t: "Química — Reações", d: "Balanceamento, tipos de reação, cinética e equilíbrio.", e: "🧪", n: "intermediario", tempo: 30, mods: [
      "Equações químicas|Reação química transforma reagentes em produtos.|Equação balanceada respeita a conservação da massa.|Coeficientes ajustam a quantidade de cada substância.|#Exemplo: 2H2 + O2 forma 2H2O|reagente~Substância consumida na reação|produto~Substância formada na reação",
      "Tipos de reação|Síntese forma um produto a partir de vários reagentes.|Decomposição separa um composto em substâncias mais simples.|Substituição envolve troca de íons entre compostos.|#Exemplo: decomposição da água gera hidrogênio e oxigênio|síntese~Reação que forma um composto|decomposição~Reação que quebra um composto",
      "Cinética e equilíbrio|Velocidade da reação depende de concentração, temperatura e catalisador.|Catalisador reduz a energia de ativação sem ser consumido.|Equilíbrio ocorre quando reações direta e inversa têm a mesma velocidade.|#Exemplo: catalisador acelera a decomposição do peróxido|catalisador~Substância que acelera uma reação|equilíbrio~Igualdade entre reação direta e inversa"
    ]},
    { id: "bio-celulas", cat: "ensino-medio", t: "Biologia — Células", d: "Estrutura celular, membrana, transporte e metabolismo.", e: "🔬", n: "iniciante", tempo: 20, mods: [
      "Célula e seus componentes|Célula é a unidade básica dos seres vivos.|Núcleo guarda o material genético nas células eucarióticas.|Mitocôndria produz energia pela respiração celular.|#Exemplo: célula animal possui centríolos|célula~Unidade estrutural dos seres vivos|mitocôndria~Organela que produz energia",
      "Membrana e transporte|Membrana plasmática controla a entrada e saída de substâncias.|Difusão é o movimento do meio mais concentrado para o menos concentrado.|Osmose é a difusão da água por membrana semipermeável.|#Exemplo: célula em água pura pode inchar|osmose~Movimento de água por membrana|difusão~Movimento de partículas por gradiente",
      "Metabolismo celular|Fotossíntese produz glicose usando luz nos cloroplastos.|Respiração celular libera energia da glicose na mitocôndria.|ATP é a moeda energética da célula.|#Exemplo: sem luz, a planta reduz a fotossíntese|ATP~Molécula que armazena energia|fotossíntese~Produção de alimento usando luz"
    ]},
    { id: "bio-genetica", cat: "ensino-medio", t: "Biologia — Genética", d: "DNA, genes, divisão celular, herança e mutações.", e: "🧬", n: "intermediario", tempo: 30, mods: [
      "DNA e genes|DNA carrega as informações genéticas em uma sequência de bases.|Gene é um segmento de DNA que codifica uma característica.|Cromossomos são estruturas que organizam o DNA.|#Exemplo: ser humano tem 46 cromossomos|DNA~Molécula que guarda informação genética|gene~Segmento de DNA com informação hereditária",
      "Mitose e meiose|Mitose gera duas células filhas geneticamente iguais.|Meiose reduz pela metade o número de cromossomos e gera gametas.|A permutação aumenta a variabilidade genética na meiose.|#Exemplo: meiose produz espermatozoides e óvulos|mitose~Divisão que mantém o número de cromossomos|meiose~Divisão que forma gametas",
      "Herança e mutação|Leis de Mendel explicam a transmissão de caracteres dominantes e recessivos.|Genótipo é a constituição genética e fenótipo é a característica observável.|Mutação é uma alteração na sequência do DNA.|#Exemplo: olhos castanhos podem ser dominantes sobre azuis|genótipo~Conjunto de genes de um indivíduo|fenótipo~Característica visível do indivíduo"
    ]},
    { id: "bio-ecologia", cat: "ensino-medio", t: "Biologia — Ecologia", d: "Ecossistemas, cadeias alimentares, ciclos e impactos ambientais.", e: "🌿", n: "iniciante", tempo: 20, mods: [
      "Ecossistemas|Ecossistema reúne seres vivos e ambiente físico em interação.|Produtores produzem alimento e consumidores dependem deles.|Decompositores reciclam nutrientes.|#Exemplo: planta, coelho e fungo em uma cadeia|ecossistema~Conjunto de seres vivos e ambiente|cadeia alimentar~Sequência de quem come quem",
      "Ciclos e fluxo de energia|Energia flui dos produtores aos consumidores e se dissipa como calor.|Ciclos da água e do carbono reciclam elementos essenciais.|A fotossíntese é a principal entrada de energia nas cadeias.|#Exemplo: queima de combustíveis altera o ciclo do carbono|ciclo do carbono~Circulação do carbono no planeta|fluxo de energia~Passagem de energia entre níveis tróficos",
      "Impactos ambientais|Ações humanas podem causar perda de biodiversidade.|Poluição e mudanças climáticas afetam ecossistemas.|Conservação busca proteger espécies e habitats.|#Exemplo: reflorestamento ajuda a recuperar áreas degradadas|biodiversidade~Variedade de vida em um ambiente|conservação~Proteção de ecossistemas e espécies"
    ]},
    { id: "historia-brasil", cat: "ensino-medio", t: "História do Brasil", d: "Da colonização à redemocratização, os marcos da história brasileira.", e: "🇧🇷", n: "iniciante", tempo: 20, mods: [
      "Colonização e independência|Brasil foi colonizado por Portugal a partir de 1500.|A economia colonial baseou-se na exploração e no trabalho escravizado.|A independência foi proclamada em 1822 por Dom Pedro.|#Exemplo: o ciclo do açúcar marcou o nordeste colonial|colonização~Processo de ocupação e domínio de um território|independência~Ato de tornar-se independente",
      "República e Getúlio|A Proclamação da República ocorreu em 1889.|Getúlio Vargas governou durante o Estado Novo, de 1937 a 1945.|O populismo marcou sua atuação política.|#Exemplo: a CLT foi criada no governo Vargas|república~Forma de governo com chefe eleito|Estado Novo~Regime autoritário de Vargas",
      "Ditadura e redemocratização|O golpe de 1964 instalou a ditadura militar.|O AI-5 intensificou a repressão em 1968.|A Constituição de 1988 consolidou a redemocratização.|#Exemplo: eleições diretas voltaram em 1989|ditadura~Regime autoritário militar|Constituição~Lei fundamental do país"
    ]},
    { id: "geografia-geral", cat: "ensino-medio", t: "Geografia Geral", d: "Latitude, longitude, clima, relevo, população e urbanização.", e: "🌎", n: "iniciante", tempo: 20, mods: [
      "Conceitos básicos|Geografia estuda o espaço e as relações entre sociedade e natureza.|Latitude mede a distância angular em relação à linha do equador.|Longitude mede a distância angular em relação ao meridiano de Greenwich.|#Exemplo: Brasil está entre 5 graus norte e 34 graus sul|latitude~Distância angular ao equador|longitude~Distância angular a Greenwich",
      "Clima e relevo|Clima depende de latitude, altitude, relevo e correntes marítimas.|Montanhas e planícies são formas de relevo comuns.|A altitude reduz a temperatura média de uma região.|#Exemplo: cidades de serra são mais frias|clima~Padrão de tempo atmosférico de uma região|altitude~Altura em relação ao nível do mar",
      "População e urbanização|Taxas de natalidade e mortalidade influenciam o crescimento populacional.|Urbanização é o aumento da população nas cidades.|Migração envolve deslocamento de pessoas entre regiões.|#Exemplo: grandes cidades concentram serviços e empregos|urbanização~Crescimento das áreas urbanas|migração~Deslocamento de pessoas entre lugares"
    ]},
    { id: "portugues-gramatica", cat: "ensino-medio", t: "Português — Gramática", d: "Classes de palavras, sujeito e predicado, concordância e regência.", e: "📖", n: "iniciante", tempo: 20, mods: [
      "Classes de palavras|Substantivo nomeia seres, coisas e lugares.|Verbo indica ação, estado ou fenômeno.|Adjetivo caracteriza o substantivo.|#Exemplo: casa amarela tem substantivo e adjetivo|substantivo~Palavra que nomeia seres e coisas|verbo~Palavra que expressa ação ou estado",
      "Sujeito e predicado|Sujeito é sobre quem se fala e predicado é o que se diz dele.|Verbo é o núcleo do predicado.|O sujeito pode ser oculto e identificado pela desinência verbal.|#Exemplo: o aluno estudou tem sujeito e predicado|sujeito~Termo sobre o qual se faz a afirmação|predicado~Parte que traz a informação sobre o sujeito",
      "Concordância e regência|Concordância nominal ajusta gênero e número entre palavras.|Concordância verbal ajusta o verbo ao sujeito.|Regência depende da relação entre verbo e complemento.|#Exemplo: as alunas estudaram mostra concordância verbal|concordância~Ajuste de gênero, número ou pessoa|regência~Relação de dependência entre termos"
    ]},
    { id: "literatura", cat: "ensino-medio", t: "Português — Literatura", d: "Movimentos literários, gêneros e interpretação de texto.", e: "📚", n: "intermediario", tempo: 30, mods: [
      "Movimentos literários|Clasicismo valoriza equilíbrio e regras formais.|Romantismo valoriza emoção, natureza e individualismo.|Realismo retrata a sociedade com crítica e objetividade.|#Exemplo: Machado de Assis é destaque do Realismo|romantismo~Movimento ligado à emoção e à natureza|realismo~Movimento que retrata a realidade social",
      "Gêneros textuais|Gênero épico narra feitos heroicos em versos.|Gênero lírico expressa sentimentos, geralmente em poesia.|Gênero dramático é escrito para encenação.|#Exemplo: soneto é uma forma lírica de 14 versos|gênero lírico~Texto que expressa emoções|gênero dramático~Texto voltado ao teatro",
      "Interpretação de texto|Interpretação considera o sentido literal e o figurado.|Contexto histórico ajuda a compreender a obra.|Figuras de linguagem criam efeitos de sentido.|#Exemplo: metáfora compara duas ideias sem palavra comparativa|metáfora~Comparação implícita entre ideias|contexto~Conjunto de circunstâncias da obra"
    ]},
    { id: "sociologia", cat: "ensino-medio", t: "Sociologia", d: "Socialização, desigualdade, instituições e movimentos sociais.", e: "🏛️", n: "iniciante", tempo: 20, mods: [
      "Sociedade e socialização|Socialização é o processo de aprendizado das normas sociais.|Família, escola e mídia são agentes socializadores.|Valores e normas orientam o comportamento coletivo.|#Exemplo: criança aprende regras de convivência na escola|socialização~Aprendizado das normas sociais|norma~Regra de comportamento compartilhada",
      "Desigualdade e classes|Classe social relaciona renda, ocupação e acesso a bens.|Mobilidade social é a mudança de posição na estrutura social.|Preconceito e discriminação reforçam desigualdades.|#Exemplo: acesso à educação pode mudar trajetórias|mobilidade social~Mudança de posição social|desigualdade~Distribuição desigual de recursos",
      "Instituições e mudança|Instituições como Estado e família organizam a vida social.|Conflito e negociação produzem mudanças sociais.|Movimentos sociais buscam transformações na sociedade.|#Exemplo: movimentos por direitos civis mudaram leis|instituição~Estrutura organizada da sociedade|movimento social~Ação coletiva por mudança"
    ]},
    { id: "filosofia", cat: "ensino-medio", t: "Filosofia", d: "Filosofia antiga, ética, conhecimento e verdade.", e: "🏺", n: "intermediario", tempo: 30, mods: [
      "Filosofia antiga|Sócrates buscava definições por meio do diálogo.|Platão defendia a existência de ideias perfeitas.|Aristóteles valorizava a observação e a lógica.|#Exemplo: método socrático faz perguntas para revelar contradições|método socrático~Diálogo que busca conceitos por perguntas|ideia~Forma perfeita e abstrata em Platão",
      "Ética e moral|Ética reflete sobre o que é bom e justo.|Utilitarismo busca a maior felicidade para o maior número.|A deontologia de Kant foca deveres e intenções.|#Exemplo: dizer a verdade mesmo quando é difícil|utilitarismo~Ética baseada nas consequências|deontologia~Ética baseada em deveres",
      "Conhecimento e verdade|Epistemologia estuda a natureza do conhecimento.|Racionalismo valoriza a razão como fonte de verdade.|Empirismo valoriza a experiência sensorial.|#Exemplo: Descartes duvida para chegar a certezas|epistemologia~Estudo do conhecimento|empirismo~Corrente que valoriza a experiência"
    ]},
    { id: "ingles", cat: "ensino-medio", t: "Inglês", d: "Present, past e future simple, vocabulário e leitura de textos curtos.", e: "🇬🇧", n: "iniciante", tempo: 20, mods: [
      "Present simple|O present simple descreve rotinas, fatos e verdades gerais.|Ele e she recebem a terminação s na maioria dos verbos.|A negação usa do not ou does not antes do verbo.|#Exemplo: She works at school e They study every day|present simple~Tempo verbal para rotinas e fatos|rotina~Ação que se repete com frequência",
      "Past simple|O past simple narra ações concluídas em um tempo passado determinado.|Verbos regulares ganham ed e irregulares têm formas próprias.|A pergunta usa did seguido do verbo no infinitivo.|#Exemplo: I visited London last year|past simple~Tempo verbal para ações passadas concluídas|verbo irregular~Verbo que muda de forma no passado",
      "Future e leitura|O futuro com will expressa decisões e previsões.|Going to indica planos e intenções já decididas.|Questions e wh- words ajudam a entender perguntas em textos.|#Exemplo: I will study e We are going to travel|future~Tempo verbal para ações futuras|reading~Habilidade de compreender textos escritos"
    ]},
    { id: "artes", cat: "ensino-medio", t: "Artes", d: "Elementos visuais, composição, modernismo brasileiro e apreciação de obras.", e: "🎨", n: "iniciante", tempo: 20, mods: [
      "Elementos da arte|Linha, forma, cor, textura e espaço são elementos básicos da linguagem visual.|Composição é a organização desses elementos na obra.|Contraste e ritmo criam destaques e movimento visual.|#Exemplo: uma linha diagonal pode sugerir movimento|elemento visual~Parte constitutiva de uma imagem|composição~Organização dos elementos na obra",
      "Modernismo brasileiro|A Semana de Arte Moderna de 1922 marcou o modernismo no Brasil.|Oswald de Andrade propôs a antropofagia cultural.|Tarsila do Amaral combinou temas brasileiros e formas modernas.|#Exemplo: o quadro Abaporu usa cores fortes e formas simplificadas|modernismo~Movimento que rompe com a arte tradicional|antropofagia~Ideia de absorver e transformar influências",
      "Análise de obras|A apreciação considera contexto, técnica e intenção do artista.|A interpretação relaciona a obra à sociedade de sua época.|Ao analisar, descreva primeiro e interprete depois.|#Exemplo: descrever cores e formas antes de falar do significado|apreciação~Observação atenta e reflexiva da obra|contexto~Circunstâncias históricas da criação"
    ]},
    { id: "educacao-fisica", cat: "ensino-medio", t: "Educação Física", d: "Treino, biomecânica, nutrição, esportes e saúde no ensino médio.", e: "🏃", n: "iniciante", tempo: 20, mods: [
      "Fundamentos do treino|Frequência, intensidade, tempo e tipo compõem o princípio FITT.|A progressão aumenta gradualmente a carga de treino.|A periodização organiza o treino em ciclos para evitar estagnação.|#Exemplo: correr três vezes por semana e aumentar o tempo aos poucos|FITT~Modelo que organiza variáveis do treino|progressão~Aumento gradual da exigência",
      "Biomecânica e postura|Alavancas do corpo ampliam força e velocidade nos movimentos.|Postura adequada reduz o risco de lesões.|A mobilidade articular facilita movimentos amplos e seguros.|#Exemplo: flexionar os joelhos ao levantar peso|alavanca~Sistema de forças no movimento|postura~Alinhamento do corpo durante a atividade",
      "Saúde e esportes|A resistência aeróbia melhora com atividades contínuas e moderadas.|A força muscular é desenvolvida com sobrecarga progressiva.|Esportes coletivos exigem técnica, tática e trabalho em equipe.|#Exemplo: alternar corrida leve e exercícios de força|aeróbio~Exercício que usa oxigênio na produção de energia|tática~Estratégia usada para vencer uma partida"
    ]},
    { id: "historia-geral", cat: "ensino-medio", t: "História Geral", d: "Pré-história, civilizações antigas, Idade Média e revoluções.", e: "🏛️", n: "iniciante", tempo: 20, mods: [
      "Pré-história e antiguidade|A pré-história é dividida em Paleolítico, Mesolítico e Neolítico.|A revolução agrícola permitiu o sedentarismo e o excedente de alimentos.|Mesopotâmia, Egito e Grécia formaram civilizações antigas fundamentais.|#Exemplo: a escrita cuneiforme surgiu na Mesopotâmia|pré-história~Período anterior à escrita|sedentarismo~Fixação de grupos em um território",
      "Idade Média|A Idade Média é tradicionalmente marcada pela queda do Império Romano.|O feudalismo organizava a terra, o trabalho e o poder local.|A Igreja teve forte influência política e cultural.|#Exemplo: o servo trabalhava a terra do senhor feudal|feudalismo~Sistema baseado em terras e vassalagem|vassalagem~Relação de subordinação entre senhor e servo",
      "Revoluções e mundo moderno|A Revolução Industrial começou na Inglaterra no século XVIII.|A Revolução Francesa difundiu ideias de liberdade e cidadania.|O capitalismo industrial transformou trabalho, cidades e comércio.|#Exemplo: máquinas a vapor aceleraram a produção|Revolução Industrial~Mudança tecnológica e econômica do século XVIII|capitalismo~Sistema baseado em mercado e propriedade privada"
    ]},

    /* ------------------------------ MEDICINA */
    { id: "medicina-fundamentos", cat: "medicina", t: "Medicina: Fundamentos para Começar", d: "Do zero à base clínica: anatomia, fisiologia, bioquímica, patologia, farmacologia, exames, ética e emergências. Visão introdutória para quem está entrando na área, sem substituir a formação médica.", e: "🩺", n: "iniciante", tempo: 25, mods: [
      "Como a medicina pensa|A queixa principal é o motivo que trouxe o paciente à consulta, registrado preferencialmente nas palavras dele.|A anamnese coleta história pessoal, familiar, hábitos, medicamentos e evolução dos sintomas.|Sintoma é o relato subjetivo do paciente e sinal é o achado objetivo do exame físico.|#Exemplo: dor no peito há duas horas com falta de ar é uma queixa principal|anamnese~Conversa estruturada para colher a história clínica|sintoma~Manifestação subjetiva relatada pelo paciente|sinal~Achado objetivo observado no exame físico|diagnóstico diferencial~Lista de possibilidades consideradas diante de um quadro",
      "Anatomia o mapa do corpo|A posição anatômica de referência tem o corpo ereto, palmas voltadas para frente e polegares lateralmente.|O plano sagital divide o corpo em direita e esquerda, e o plano coronal divide em anterior e posterior.|O plano transversal corta o corpo em partes superior e inferior.|#Exemplo: uma tomografia axial corresponde ao plano transversal|plano sagital~Plano que separa os lados direito e esquerdo|posição anatômica~Postura de referência usada para descrever o corpo|plano transversal~Plano horizontal que divide o corpo em superior e inferior",
      "Fisiologia da célula|A membrana celular é seletiva e controla a entrada e saída de íons e nutrientes.|A homeostase mantém o meio interno estável, com participação dos sistemas nervoso e endócrino.|O transporte ativo gasta energia para mover substâncias contra o gradiente de concentração.|#Exemplo: a bomba de sódio e potássio consome ATP para manter o potencial de membrana|homeostase~Manutenção de condições internas estáveis|potencial de membrana~Diferença de carga elétrica entre o interior e o exterior da célula|transporte ativo~Movimento de substâncias com gasto de energia",
      "Bioquímica essencial|O ATP é a moeda energética da célula e é produzido principalmente nas mitocôndrias.|Enzimas aceleram reações químicas e podem ser inibidas por fármacos.|A glicólise é a via inicial de quebra da glicose e ocorre no citoplasma.|#Exemplo: a metformina atua em vias do metabolismo da glicose|ATP~Molécula que armazena e fornece energia para a célula|enzima~Proteína que catalisa reações químicas|glicólise~Quebra da glicose que gera piruvato e energia",
      "Genética e hereditariedade|O DNA guarda a informação genética em genes localizados nos cromossomos.|Alelos são formas diferentes de um mesmo gene e determinam variações hereditárias.|O cariótipo mostra o número e a forma dos cromossomos de um indivíduo.|#Exemplo: o cariótipo humano normal tem 46 cromossomos|gene~Segmento de DNA que carrega informação hereditária|alelo~Forma alternativa de um gene|cariótipo~Conjunto de cromossomos de uma célula",
      "Histologia e embriologia|Os quatro tecidos básicos são epitelial, conjuntivo, muscular e nervoso.|O tecido epitelial reveste superfícies e forma glândulas.|A gastrulação forma as três camadas germinativas: ectoderme, mesoderme e endoderme.|#Exemplo: a pele é derivada da ectoderme e o intestino da endoderme|tecido epitelial~Tecido que reveste superfícies e glândulas|gastrulação~Processo embrionário que forma as camadas germinativas|morfogênese~Processo que dá forma ao embrião",
      "Coração e circulação|O ciclo cardíaco alterna contração e relaxamento para impulsionar o sangue.|O débito cardíaco é o volume de sangue bombeado por minuto e iguala frequência cardíaca vezes volume sistólico.|A pressão arterial é a força do sangue contra a parede das artérias.|#Exemplo: pressão 120 por 80 mmHg é uma referência comum em adultos|débito cardíaco~Volume de sangue bombeado pelo coração em um minuto|pressão arterial~Força exercida pelo sangue nas paredes arteriais|ciclo cardíaco~Sequência de contração e relaxamento do coração",
      "Pulmões e respiração|A ventilação move ar para dentro e para fora dos pulmões por meio da contração do diafragma.|A troca gasosa ocorre nos alvéolos, onde oxigênio entra no sangue e dióxido de carbono sai.|A hemoglobina transporta oxigênio e sua saturação é acompanhada por oximetria.|#Exemplo: saturação abaixo de 95 por cento merece avaliação|ventilação~Entrada e saída de ar dos pulmões|hemoglobina~Proteína do sangue que transporta oxigênio|saturação de oxigênio~Percentual de hemoglobina ligada ao oxigênio",
      "Digestão e nutrição|A digestão mecânica tritura o alimento e a digestão química o decompõe com enzimas.|O peristaltismo são movimentos ondulantes que empurram o alimento pelo tubo digestivo.|A microbiota intestinal participa da digestão e da produção de vitaminas.|#Exemplo: o ácido clorídrico do estômago ativa enzimas digestivas|peristaltismo~Movimento ondulante do tubo digestivo|microbiota~Conjunto de microrganismos que vivem no intestino|absorção~Passagem de nutrientes para o sangue",
      "Rins água e eletrólitos|O nefrón é a unidade funcional do rim e filtra o sangue no glomérulo.|A filtração glomerular produz o filtrado inicial, que é reabsorvido e secretado ao longo do túbulo.|Eletrólitos como sódio e potássio são essenciais para o equilíbrio hídrico e elétrico.|#Exemplo: a desidratação reduz a diurese e concentra a urina|nefrón~Unidade funcional do rim|filtração glomerular~Passagem de água e solutos do sangue para o túbulo|eletrólito~Íon que participa do equilíbrio hídrico e elétrico",
      "Sistema nervoso|O neurônio é a célula fundamental do sistema nervoso e transmite impulsos elétricos.|A sinapse é a conexão entre neurônios, mediada por neurotransmissores.|O sistema nervoso central compreende cérebro e medula, e o periférico inclui nervos e gânglios.|#Exemplo: o reflexo do joelho envolve medula e nervo periférico|neurônio~Célula que transmite impulsos nervosos|sinapse~Conexão entre células nervosas|reflexo~Resposta rápida e involuntária a um estímulo",
      "Hormônios e endocrinologia|Hormônios são mensageiros químicos produzidos por glândulas endócrinas.|A insulina reduz a glicemia e é produzida pelo pâncreas.|O feedback negativo mantém a secreção hormonal sob controle, como no eixo da tireoide.|#Exemplo: níveis altos de glicose estimulam a liberação de insulina|hormônio~Mensageiro químico produzido por glândulas|insulina~Hormônio que diminui a glicemia|feedback negativo~Mecanismo que reduz a própria produção quando o nível está alto",
      "Imunologia e inflamação|A imunidade inata é rápida e não específica, enquanto a adaptativa é especializada e memoriza agentes.|Anticorpos são proteínas que reconhecem antígenos específicos.|Vacinas estimulam a imunidade adaptativa sem causar a doença na maioria dos casos.|#Exemplo: febre e vermelhidão são sinais típicos da inflamação local|anticorpo~Proteína que reconhece um antígeno|imunidade inata~Defesa rápida e não específica|vacina~Preparo que estimula imunidade protetora",
      "Microbiologia e infecções|Bactérias, vírus, fungos e parasitas são agentes infecciosos com formas diferentes de agir.|A resistência antimicrobiana ocorre quando um microrganismo deixa de responder ao fármaco.|O uso racional de antibióticos reduz a seleção de cepas resistentes.|#Exemplo: vírus não respondem a antibióticos, apenas a antivirais específicos|patógeno~Microrganismo capaz de causar doença|resistência antimicrobiana~Perda de sensibilidade a um anti-infeccioso|antibiótico~Fármaco que atua contra bactérias",
      "Farmacologia básica|Farmacocinética estuda o que o corpo faz com o fármaco: absorção, distribuição, metabolismo e excreção.|Farmacodinâmica estuda o que o fármaco faz com o corpo, incluindo mecanismo e efeito.|Efeitos adversos e contraindicações devem ser avaliados antes de prescrever.|#Exemplo: a dose deve ser ajustada em pacientes com insuficiência renal|farmacocinética~Estudo da absorção e eliminação do fármaco|farmacodinâmica~Estudo do efeito do fármaco no organismo|contraindicação~Situação em que o fármaco não deve ser usado",
      "Patologia geral|A adaptação celular pode ser hipertrofia, hiperplasia, atrofia ou metaplasia.|Necrose é a morte celular em um organismo vivo, geralmente após lesão.|Neoplasia é um crescimento celular descontrolado que pode ser benigno ou maligno.|#Exemplo: o câncer pode formar metástases em órgãos distantes|necrose~Morte de células em tecido vivo|neoplasia~Crescimento anormal e descontrolado de células|metástase~Disseminação de células tumorais para outros órgãos",
      "Exames e imagem|O hemograma avalia células sanguíneas e ajuda a investigar anemia e infecção.|A radiografia usa raios X e é útil para ossos e tórax, enquanto o ultrassom usa ondas sonoras.|Tomografia e ressonância produzem imagens detalhadas de órgãos e tecidos.|#Exemplo: a ressonância é muito usada para estudar o sistema nervoso|hemograma~Exame que conta e analisa células do sangue|tomografia~Exame de imagem com raios X e reconstrução computadorizada|ultrassonografia~Exame de imagem por ondas sonoras",
      "Sinais vitais e emergências|Os sinais vitais incluem frequência cardíaca, frequência respiratória, pressão arterial, temperatura e saturação.|A sequência ABCDE prioriza via aérea, respiração, circulação, deficiência neurológica e exposição.|A reanimação cardiopulmonar combina compressões torácicas e ventilações.|#Exemplo: uma parada cardíaca exige compressões imediatas e acionamento do serviço de emergência|sinais vitais~Medidas básicas do estado fisiológico|RCP~Sequência de compressões e ventilações na parada cardiorrespiratória|triagem~Classificação de pacientes por gravidade",
      "Comunicação e ética|O consentimento informado exige explicar riscos, benefícios e alternativas antes de um procedimento.|O sigilo profissional protege a privacidade das informações do paciente.|Escuta ativa e empatia melhoram a relação médico paciente e a adesão ao tratamento.|#Exemplo: explicar com palavras simples antes de pedir um exame|consentimento informado~Autorização após explicação clara|empatia~Capacidade de compreender a experiência do outro|sigilo profissional~Dever de manter informações em confidencialidade",
      "Prevenção e saúde pública|A prevenção primária evita o aparecimento da doença, como vacinação e educação em saúde.|A prevenção secundária busca diagnóstico precoce, como exames de rastreamento.|A epidemiologia estuda a distribuição das doenças e seus fatores de risco na população.|#Exemplo: a vacinação é prevenção primária e a mamografia é secundária|epidemiologia~Estudo da distribuição e determinantes das doenças|prevenção primária~Ações para evitar o surgimento da doença|determinantes sociais~Condições sociais que influenciam a saúde",
      "Ciclo de vida e especialidades|A pediatria cuida do crescimento e desenvolvimento de crianças e adolescentes.|A obstetrícia acompanha a gestação, o parto e o puerpério.|A geriatria trata o envelhecimento, com atenção a múltiplas doenças e medicamentos.|#Exemplo: uma gestante de baixo risco faz acompanhamento pré-natal|pediatria~Área que cuida de crianças e adolescentes|obstetrícia~Área que acompanha gestação e parto|geriatria~Área dedicada ao idoso",
      "Como estudar medicina|A repetição espaçada revisa o conteúdo em intervalos crescentes para fixar a memória.|A recordação ativa testa você antes de reler a resposta.|Intercalar matérias e usar questões melhora a retenção em comparação com leitura passiva.|#Exemplo: revise anatomia hoje, fisiologia amanhã e faça questões no fim da semana|repetição espaçada~Revisão em intervalos progressivos|recordação ativa~Tentativa de lembrar sem olhar a resposta|estudo intercalado~Alternância entre temas diferentes na mesma sessão"
    ]},

    /* FIM_CATALOGO */
  ];

  function embaralhar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copia[i]; copia[i] = copia[j]; copia[j] = temp;
    }
    return copia;
  }

  function parseModulo(texto) {
    const partes = texto.split("|").map(function (p) { return p.trim(); }).filter(Boolean);
    const modulo = { titulo: partes.shift() || "Aula", fatos: [], termos: [], exemplos: [] };
    partes.forEach(function (parte) {
      if (parte.indexOf("~") !== -1) {
        const pedacos = parte.split("~");
        modulo.termos.push({ frente: pedacos[0].trim(), verso: (pedacos[1] || "").trim() });
      } else if (parte.charAt(0) === "#") {
        modulo.exemplos.push(parte.slice(1).trim());
      } else {
        modulo.fatos.push(parte);
      }
    });
    return modulo;
  }

  function montarQuiz(termos, fatos, todosTermos) {
    const pool = (todosTermos && todosTermos.length ? todosTermos : termos)
      .filter(function (t, i, arr) { return arr.findIndex(function (outro) { return outro.frente === t.frente; }) === i; });
    if (!pool.length) return [];

    const perguntas = termos.slice(0, 4).map(function (termo) {
      const outros = pool.filter(function (t) { return t.frente !== termo.frente; })
        .map(function (t) { return t.frente; }).slice(0, 3);
      return {
        tipo: "conceito",
        enunciado: "Qual conceito corresponde a esta descrição? “" + termo.verso + "”",
        opcoes: embaralhar([termo.frente].concat(outros)),
        correta: termo.frente,
        explicacao: termo.frente + " — " + termo.verso
      };
    });

    // uma questão de verdadeiro/falso formada a partir de um dos fatos da aula
    if (fatos && fatos.length && pool.length > 1) {
      const frase = fatos[0];
      const termo = pool.find(function (t) { return frase.toLowerCase().indexOf(t.frente.toLowerCase()) !== -1; });
      if (termo) {
        const outro = pool.find(function (t) { return t.frente !== termo.frente; });
        const falsa = frase.replace(new RegExp(termo.frente.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), outro.frente);
        if (falsa !== frase) {
          const verdadeiro = Math.random() < 0.5;
          perguntas.push({
            tipo: "vf",
            enunciado: verdadeiro ? frase : falsa,
            opcoes: ["Verdadeiro", "Falso"],
            correta: verdadeiro ? "Verdadeiro" : "Falso",
            explicacao: "Afirmação correta: " + frase
          });
        }
      }
    }

    return embaralhar(perguntas);
  }

  function converter(id) {
    const curso = CURSOS.find(function (c) { return c.id === id; });
    if (!curso) return null;
    const contexto = CONTEXTO[curso.cat] || "";

    const todosTermos = curso.mods.reduce(function (acc, texto) {
      return acc.concat(parseModulo(texto).termos);
    }, []);

    const aulas = curso.mods.map(function (texto, indice) {
      const mod = parseModulo(texto);
      const secoes = [
        {
          titulo: "Visão geral",
          paragrafos: [contexto + " " + mod.fatos[0], mod.fatos[1]].filter(Boolean),
          listas: []
        },
        { titulo: "Conceitos principais", paragrafos: mod.fatos, listas: [] }
      ];
      if (mod.exemplos.length) secoes.push({ titulo: "Exemplo prático", paragrafos: [], listas: [mod.exemplos] });

      return {
        id: "pronto_" + curso.id + "_a" + indice,
        titulo: mod.titulo,
        tempo: curso.tempo || 20,
        secoes: secoes,
        objetivos: [
          "Entender o que é " + mod.titulo.toLowerCase(),
          "Reconhecer quando esse conhecimento é aplicado",
          "Fixar os termos com o quiz da aula"
        ],
        resumo: mod.fatos[0] + (mod.fatos[1] ? " " + mod.fatos[1] : ""),
        pontos: mod.fatos,
        quiz: montarQuiz(mod.termos, mod.fatos, todosTermos),
        flashcards: mod.termos.slice(0, 8)
      };
    });

    return {
      id: "pronto_" + curso.id,
      titulo: curso.t,
      assunto: curso.t,
      descricao: curso.d,
      categoria: curso.cat,
      emoji: curso.e,
      nivel: curso.n,
      duracao: curso.tempo || 20,
      profundidade: "equilibrado",
      foco: [],
      meta: 2,
      cor: "roxo",
      criadoEm: Date.parse("2026-01-01"),
      offline: false,
      pronto: true,
      fonte: { titulo: "Acervo Trilha", url: "" },
      fontesExtras: [],
      imagem: null,
      aulas: aulas
    };
  }

  function listar(categoria) {
    if (!categoria || categoria === "todos") return CURSOS.slice();
    return CURSOS.filter(function (c) { return c.cat === categoria; });
  }

  function nomeCategoria(id) {
    const cat = CATEGORIAS.find(function (c) { return c.id === id; });
    return cat ? cat.nome : id;
  }

  return {
    categorias: CATEGORIAS,
    listar: listar,
    converter: converter,
    nomeCategoria: nomeCategoria,
    total: CURSOS.length
  };
})();
