# Trilha — aulas personalizadas a partir da web

Site de estudos que consulta **APIs públicas da Wikipedia** (sem chave, sem cadastro) e transforma qualquer assunto em um curso com aulas, resumos, pontos-chave, quizzes e flashcards.

## Como abrir

O site funciona direto no navegador. Para evitar bloqueios de CORS em alguns navegadores quando se abre `file://`, o ideal é servir a pasta com um servidor local:

```bash
cd trilha
python -m http.server 8765
```

Depois acesse **http://localhost:8765**.

> Se preferir, abra `index.html` diretamente. Caso a consulta à Wikipedia falhe, o site entra automaticamente em **modo offline** com conteúdo de exemplo.

## Como publicar na internet sem criar empresa

Não é necessário CNPJ, empresa ou cartão. Basta uma **conta pessoal gratuita** (ou nem isso, no Netlify Drop):

1. **GitHub Pages (grátis)** — crie um repositório público, envie o conteúdo desta pasta para ele e vá em **Settings → Pages → Deploy from a branch → main / root**. O endereço será `https://seu-usuario.github.io/nome-do-repositorio/`.
2. **Netlify Drop** — abra `https://app.netlify.com/drop` e arraste a pasta `trilha` para a página. Você recebe um link público na hora, sem cadastro. Depois pode “reivindicar” o site com uma conta gratuita.
3. **Cloudflare Pages** — com uma conta gratuita, conecte o repositório do GitHub ou envie os arquivos. O plano free inclui HTTPS, domínio `*.pages.dev` e 500 builds/mês.

O site é só HTML/CSS/JS, então qualquer host estático serve. O progresso, perfil e certificados ficam no `localStorage` de cada navegador — se quiser sincronizar entre dispositivos, aí sim será preciso um pequeno backend (também há opções gratuitas, sem empresa).

## O que o site faz

- 📦 **71 cursos prontos** na tela inicial: programação (18), robótica (13), psicologia (16), ensino médio (23) e **medicina (1)**, com filtros e busca. Basta clicar em “Começar”.
  - 🩺 **Medicina: Fundamentos para Começar** — 22 aulas introdutórias (anamnese, anatomia, fisiologia, bioquímica, genética, histologia, órgãos e sistemas, patologia, farmacologia, exames, emergências, ética, prevenção e técnicas de estudo). É uma visão geral para entrar na área sabendo o vocabulário e os conceitos-base; **não substitui** a formação médica.
- 🔎 Busca sugestões de assuntos e consulta a Wikipedia no idioma escolhido (PT, EN, ES, FR, DE).
- 🎛️ **Personalização em 3 telas**: assunto/idioma, estilo (nível, profundidade, tempo por aula, foco) e ritmo (quiz, flashcards, imagens, meta diária e cor do tema).
- 📚 Monta de 2 a 9 aulas com resumo, objetivos, seções, pontos-chave e fontes.
- 🧠 Gera questões de múltipla escolha e verdadeiro/falso a partir do próprio texto.
- 🃏 Cria flashcards com os principais termos do assunto.
- ✍️ Anotações por aula, progresso, favoritos e biblioteca salvos no `localStorage`.
- 👤 **Perfil local**: nome, avatar, bio, meta diária e preferências de aula. Aviso: é uma conta de demonstração, não autenticação segura.
- 🎮 **Motivação**: XP, níveis, sequência diária, desafio do dia e 10 conquistas para manter o interesse nos estudos.
- 🏅 **Certificados**: ao concluir todas as aulas de um curso, você recebe um certificado que pode imprimir/salvar em PDF ou baixar em PNG.
- 🌙 Tema claro/escuro e layout **mobile-first** com navegação inferior.

## Estrutura

```
trilha/
├── index.html          # todas as telas (SPA)
├── css/estilos.css     # visual vibrante, responsivo e tema escuro
├── js/
│   ├── api.js          # integração com a API da Wikimedia
│   ├── cursos-prontos.js # catálogo com 71 cursos prontos (incl. Medicina)
│   ├── gerador.js      # extração e montagem das aulas, quizzes e flashcards
│   ├── perfil.js       # conta local, XP, níveis, sequência e conquistas
│   ├── certificado.js  # certificado imprimível e exportável em PNG
│   └── app.js          # interface, navegação e persistência
└── README.md
```

## Observações

- As questões são geradas automaticamente por heurísticas sobre o texto; revise sempre o conteúdo antes de usar para fins acadêmicos formais.
- O curso de Medicina é introdutório e educativo: **não substitui** ensino superior, orientação profissional nem protocolos clínicos atualizados.
- A conta de perfil é apenas local (guardada neste navegador). Não use uma senha real.
- As fontes originais ficam linkadas no final de cada aula.
- Nenhum dado é enviado para servidores próprios: apenas requisições diretas à Wikimedia.
