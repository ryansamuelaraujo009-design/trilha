/* ============================================================
   app.js — Interface e lógica da Trilha
   ============================================================ */
(function () {
  "use strict";

  const CHAVE = {
    cursos: "trilha.cursos.v1",
    progresso: "trilha.progresso.v1",
    prefs: "trilha.prefs.v1",
    tema: "trilha.tema.v1",
    notas: "trilha.notas.v1"
  };

  const PALETAS = {
    roxo:  { primario: "#6c5ce7", escuro: "#5646cf", suave: "#efecff" },
    verde: { primario: "#00b894", escuro: "#00997c", suave: "#e2faf3" },
    coral: { primario: "#ff6b6b", escuro: "#e85555", suave: "#ffeded" },
    azul:  { primario: "#0984e3", escuro: "#0769b5", suave: "#e5f2ff" },
    rosa:  { primario: "#e84393", escuro: "#c93678", suave: "#fdeaf4" }
  };

  const CURIOSIDADES = [
    "Você sabia? Estudar em sessões curtas com pausas ajuda o cérebro a fixar melhor o conteúdo.",
    "Dica: explicar o assunto com suas próprias palavras é uma das melhores formas de aprender.",
    "Curiosidade: revisar o conteúdo 24 horas depois pode dobrar a retenção das informações.",
    "Atenção: alternar entre temas diferentes em uma mesma sessão costuma reduzir o foco.",
    "Dica: os flashcards funcionam melhor quando você tenta responder antes de virar o card."
  ];

  const DESAFIOS = [
    { icone: "🎯", titulo: "Desafio do dia", texto: "Acerte todas as perguntas do quiz de uma aula. Você ganha bônus de XP!" },
    { icone: "🃏", titulo: "Desafio do dia", texto: "Reveja pelo menos 5 flashcards de um curso que você já começou." },
    { icone: "✍️", titulo: "Desafio do dia", texto: "Escreva nas anotações o que mais chamou sua atenção na aula de hoje." },
    { icone: "🚀", titulo: "Desafio do dia", texto: "Comece uma aula de um assunto completamente novo para você." },
    { icone: "🔁", titulo: "Desafio do dia", texto: "Refaça um quiz que você não acertou 100% na primeira tentativa." }
  ];

  const NIVEIS = { iniciante: "Iniciante", intermediario: "Intermediário", avancado: "Avançado" };
  const PROFUNDIDADE = { resumo: "Resumo", equilibrado: "Equilibrado", profundo: "Profundo" };

  const prefsPadrao = {
    tema: "",
    idioma: "pt",
    nivel: "iniciante",
    profundidade: "equilibrado",
    duracao: 20,
    foco: ["conceitos"],
    quiz: true,
    flashcards: true,
    imagens: true,
    meta: 2,
    cor: "roxo"
  };

  const Estado = {
    tela: "inicio",
    etapa: 1,
    categoriaPronta: "todos",
    buscaPronta: "",
    prefs: Object.assign({}, prefsPadrao),
    cursos: [],
    progresso: {},
    notas: {},
    cursoAtual: null,
    aulaAtual: 0,
    aba: "conteudo",
    abaPerfil: "dados",
    loginModo: "entrar",
    certificadoAtual: null,
    flashVistos: {},
    quiz: { indice: 0, acertos: 0, respondida: false },
    flash: { indice: 0, virado: false },
    timerGeracao: null,
    timerCuriosidade: null,
    timerNotas: null,
    timerSugestao: null
  };

  /* ------------------------------ Persistência */
  function ler(chave, padrao) {
    try {
      const bruto = localStorage.getItem(chave);
      return bruto === null ? padrao : JSON.parse(bruto);
    } catch (erro) { return padrao; }
  }
  function salvar(chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (erro) { /* armazenamento cheio */ }
  }
  function esc(texto) {
    return String(texto === null || texto === undefined ? "" : texto)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function delay(ms) { return new Promise(function (resolver) { setTimeout(resolver, ms); }); }

  /* ------------------------------ Feedback */
  function toast(mensagem) {
    const el = document.getElementById("toast");
    el.textContent = mensagem;
    el.classList.add("mostrar");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () { el.classList.remove("mostrar"); }, 3200);
  }

  /* ------------------------------ Navegação e tema */
  function mostrarTela(nome) {
    document.querySelectorAll(".tela").forEach(function (tela) {
      tela.classList.toggle("ativa", tela.id === "tela-" + nome);
    });
    document.querySelectorAll("[data-nav]").forEach(function (botao) {
      botao.classList.toggle("ativo", botao.dataset.nav === nome);
    });
    if (Estado.tela === "gerando") pararGeracao();
    Estado.tela = nome;
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function aplicarCor(cor) {
    const paleta = PALETAS[cor] || PALETAS.roxo;
    const raiz = document.documentElement.style;
    raiz.setProperty("--primary", paleta.primario);
    raiz.setProperty("--primary-dark", paleta.escuro);
    raiz.setProperty("--primary-soft", paleta.suave);
    document.querySelector('meta[name="theme-color"]').setAttribute("content", paleta.primario);
  }

  function alternarTema() {
    const escuro = document.body.classList.toggle("tema-escuro");
    salvar(CHAVE.tema, escuro);
    document.getElementById("btn-tema").textContent = escuro ? "☀️" : "🌙";
  }

  /* ------------------------------ Wizard */
  function irEtapa(numero) {
    Estado.etapa = Math.max(1, Math.min(3, numero));
    document.querySelectorAll(".etapa").forEach(function (etapa) {
      etapa.classList.toggle("ativa", Number(etapa.dataset.etapa) === Estado.etapa);
    });
    document.querySelectorAll(".step").forEach(function (step) {
      const n = Number(step.dataset.step);
      step.classList.toggle("ativo", n === Estado.etapa);
      step.classList.toggle("concluido", n < Estado.etapa);
    });
    document.getElementById("step-progress").style.width = (Estado.etapa * 33.33) + "%";
    document.getElementById("wizard-voltar").hidden = Estado.etapa === 1;
    document.getElementById("wizard-avancar").hidden = Estado.etapa === 3;
    document.getElementById("btn-gerar").hidden = Estado.etapa !== 3;
    if (Estado.etapa === 3) atualizarResumoPrefs();
  }

  function atualizarResumoPrefs() {
    const p = Estado.prefs;
    const foco = p.foco.length ? p.foco.join(", ") : "conteúdo geral";
    document.getElementById("resumo-prefs").innerHTML =
      "<strong>Resumo do seu curso:</strong><br>" +
      "Tema: " + esc(p.tema || "—") + " · " + esc(NIVEIS[p.nivel]) + "<br>" +
      "Formato: " + esc(PROFUNDIDADE[p.profundidade]) + ", aulas de " + p.duracao + " min<br>" +
      "Foco: " + esc(foco) + "<br>" +
      "Inclui: " + (p.quiz ? "quiz" : "sem quiz") + ", " + (p.flashcards ? "flashcards" : "sem flashcards") +
      (p.imagens ? " e imagens" : "") + " · meta de " + p.meta + (p.meta === 1 ? " aula" : " aulas") + " por dia.";
  }

  function sincronizarWizard() {
    const p = Estado.prefs;
    document.getElementById("personal-tema").value = p.tema || "";
    document.getElementById("personal-idioma").value = p.idioma;
    document.querySelectorAll(".opcoes[data-grupo], .chips-multiplos[data-grupo], .cores-tema[data-grupo]").forEach(function (grupo) {
      grupo.querySelectorAll(".opcao, .chip-selecionavel, .cor-opcao").forEach(function (opcao) {
        let selecionado = false;
        if (grupo.dataset.grupo === "foco") selecionado = p.foco.indexOf(opcao.dataset.valor) !== -1;
        else if (grupo.dataset.grupo === "meta") selecionado = Number(opcao.dataset.valor) === Number(p.meta);
        else if (grupo.dataset.grupo === "duracao") selecionado = Number(opcao.dataset.valor) === Number(p.duracao);
        else selecionado = opcao.dataset.valor === p[grupo.dataset.grupo];
        opcao.classList.toggle("selecionado", selecionado);
      });
    });
    document.querySelectorAll("[data-pref]").forEach(function (input) {
      input.checked = !!p[input.dataset.pref];
    });
    aplicarCor(p.cor);
  }

  function abrirPersonalizacao(termo) {
    if (termo) {
      Estado.prefs.tema = termo.trim();
      document.getElementById("personal-tema").value = Estado.prefs.tema;
    }
    sincronizarWizard();
    irEtapa(1);
    mostrarTela("personalizar");
  }

  /* ------------------------------ Sugestões */
  function configurarSugestoes(inputId, listaId, idiomaFn) {
    const input = document.getElementById(inputId);
    const lista = document.getElementById(listaId);

    function esconder() { lista.hidden = true; lista.innerHTML = ""; }

    input.addEventListener("input", function () {
      clearTimeout(Estado.timerSugestao);
      const termo = input.value.trim();
      if (termo.length < 2) { esconder(); return; }
      Estado.timerSugestao = setTimeout(async function () {
        try {
          const itens = await TrilhaAPI.sugerir(termo, idiomaFn());
          if (input.value.trim() !== termo || !itens.length) { esconder(); return; }
          lista.innerHTML = itens.map(function (item) {
            return '<button type="button" data-sugestao="' + esc(item) + '">🔎 ' + esc(item) + "</button>";
          }).join("");
          lista.hidden = false;
        } catch (erro) { esconder(); }
      }, 320);
    });

    lista.addEventListener("click", function (evento) {
      const botao = evento.target.closest("[data-sugestao]");
      if (!botao) return;
      input.value = botao.dataset.sugestao;
      esconder();
      input.focus();
    });

    input.addEventListener("keydown", function (evento) { if (evento.key === "Escape") esconder(); });
    document.addEventListener("click", function (evento) {
      if (!lista.contains(evento.target) && evento.target !== input) esconder();
    });
    return { esconder: esconder };
  }

  /* ------------------------------ Geração do curso */
  function atualizarProgresso(valor) {
    document.getElementById("gerando-bar").style.width = valor + "%";
    document.getElementById("gerando-pct").textContent = valor + "%";
    const etapas = document.querySelectorAll("#gerando-etapas li");
    const indice = valor >= 75 ? 3 : (valor >= 50 ? 2 : (valor >= 25 ? 1 : 0));
    const titulos = ["Buscando informações...", "Lendo as fontes...", "Montando as aulas...", "Criando quizzes e flashcards..."];
    document.getElementById("gerando-titulo").textContent = titulos[indice];
    etapas.forEach(function (li, i) {
      li.classList.toggle("ativa", i === indice);
      li.classList.toggle("feita", i < indice);
    });
  }

  function iniciarGeracao() {
    let progresso = 0;
    Estado.timerGeracao = setInterval(function () {
      progresso = Math.min(progresso + 4 + Math.random() * 7, 86);
      atualizarProgresso(Math.round(progresso));
    }, 260);
    let i = 0;
    Estado.timerCuriosidade = setInterval(function () {
      i = (i + 1) % CURIOSIDADES.length;
      document.getElementById("curiosidade-texto").textContent = CURIOSIDADES[i];
    }, 2600);
  }

  function pararGeracao() {
    clearInterval(Estado.timerGeracao);
    clearInterval(Estado.timerCuriosidade);
  }

  async function gerarCurso() {
    const tema = (document.getElementById("personal-tema").value || "").trim();
    if (tema.length < 2) {
      toast("Digite um assunto para criar suas aulas.");
      irEtapa(1);
      document.getElementById("personal-tema").focus();
      return;
    }
    Estado.prefs.tema = tema;
    salvar(CHAVE.prefs, Estado.prefs);

    mostrarTela("gerando");
    iniciarGeracao();
    atualizarProgresso(4);

    let pagina = null;
    try {
      const resultado = await Promise.all([
        TrilhaAPI.buscarConteudo(tema, Estado.prefs.idioma),
        delay(1700)
      ]);
      pagina = resultado[0];
      atualizarProgresso(68);
    } catch (erro) {
      await delay(900);
      pagina = TrilhaGerador.conteudoOffline(tema);
      atualizarProgresso(68);
      setTimeout(function () { toast("Sem conexão: usando conteúdo de exemplo."); }, 400);
    }

    let curso;
    try {
      await delay(500);
      curso = TrilhaGerador.gerarCurso(pagina, Estado.prefs);
    } catch (erro) {
      pararGeracao();
      toast(erro.message || "Não foi possível montar o curso.");
      mostrarTela("personalizar");
      return;
    }

    await delay(450);
    pararGeracao();
    atualizarProgresso(100);
    await delay(350);

    curso.favorito = false;
    Estado.cursos.unshift(curso);
    if (Estado.cursos.length > 6) Estado.cursos = Estado.cursos.slice(0, 6);
    salvar(CHAVE.cursos, Estado.cursos);

    Estado.cursoAtual = curso;
    Estado.aulaAtual = 0;
    Estado.aba = "conteudo";
    resetarInteracoes();
    atualizarEstatisticas();
    renderizarBiblioteca();
    renderizarCurso();
    mostrarTela("curso");
    toast("✨ Curso pronto! " + curso.aulas.length + " aulas para você.");
  }

  function resetarInteracoes() {
    Estado.quiz = { indice: 0, acertos: 0, respondida: false };
    Estado.flash = { indice: 0, virado: false };
    Estado.flashVistos = {};
  }

  /* ------------------------------ Curso e aulas */
  function progressoDoCurso(curso) {
    const feitas = (Estado.progresso[curso.id] && Estado.progresso[curso.id].concluidas) || [];
    return { feitas: feitas, percentual: curso.aulas.length ? Math.round(feitas.length / curso.aulas.length * 100) : 0 };
  }

  function renderizarCurso() {
    const curso = Estado.cursoAtual;
    if (!curso) return;
    document.getElementById("curso-titulo").textContent = curso.titulo;
    document.getElementById("curso-badge").textContent = curso.pronto
      ? "📦 Curso pronto"
      : (curso.offline ? "⚠️ Modo offline" : "✨ Curso personalizado");
    const categoria = curso.pronto && window.TrilhaCursosProntos
      ? TrilhaCursosProntos.nomeCategoria(curso.categoria) + " · "
      : "";
    document.getElementById("curso-meta").textContent =
      categoria + curso.aulas.length + " aulas · " + (NIVEIS[curso.nivel] || curso.nivel) + " · " +
      curso.duracao + " min por aula" + (curso.pronto ? "" : " · " + (curso.idioma || "pt").toUpperCase());
    const botaoFav = document.getElementById("btn-favorito");
    botaoFav.textContent = curso.favorito ? "★" : "☆";
    botaoFav.classList.toggle("btn-favorito-on", !!curso.favorito);
    renderizarSidebar();
    renderizarAula();
    atualizarBotaoCertificado();
  }

  function renderizarSidebar() {
    const curso = Estado.cursoAtual;
    const feitas = progressoDoCurso(curso).feitas;
    document.getElementById("sidebar-aulas").innerHTML = curso.aulas.map(function (aula, i) {
      const concluida = feitas.indexOf(aula.id) !== -1;
      return '<button class="item-aula ' + (i === Estado.aulaAtual ? "ativa " : "") + (concluida ? "item-aula-concluida" : "") +
        '" data-action="ir-aula" data-i="' + i + '">' +
        '<span class="aula-num">AULA ' + (i + 1) + " " + (concluida ? '<span class="item-aula-check">✓</span>' : "") + "</span>" +
        '<span class="item-aula-titulo">' + esc(aula.titulo) + "</span>" +
        '<span class="item-aula-meta">⏱ ' + aula.tempo + " min" + (aula.quiz.length ? " · quiz" : "") + "</span>" +
        "</button>";
    }).join("");
    document.getElementById("progresso-curso-bar").style.width = progressoDoCurso(curso).percentual + "%";
  }

  function renderizarAula() {
    const curso = Estado.cursoAtual;
    const aula = curso.aulas[Estado.aulaAtual];
    document.querySelectorAll("#abas-aula .aba").forEach(function (aba) {
      aba.classList.toggle("ativa", aba.dataset.aba === Estado.aba);
    });
    if (Estado.aba === "quiz") renderizarQuiz(aula);
    else if (Estado.aba === "flashcards") renderizarFlashcards(aula);
    else if (Estado.aba === "notas") renderizarNotas(aula);
    else renderizarConteudo(curso, aula);
    renderizarSidebar();
  }

  function renderizarConteudo(curso, aula) {
    const html = [];
    html.push('<div class="aula-cabecalho">');
    html.push("<h3>Aula " + (Estado.aulaAtual + 1) + ": " + esc(aula.titulo) + "</h3>");
    html.push('<div class="aula-tags"><span class="tag">⏱ ' + aula.tempo + " min</span>" +
      '<span class="tag">🎯 ' + esc(NIVEIS[curso.nivel] || "") + "</span>" +
      '<span class="tag">📚 ' + esc(PROFUNDIDADE[curso.profundidade] || "") + "</span></div>");
    html.push("</div>");

    if (curso.imagem) {
      html.push('<img class="aula-imagem" src="' + esc(curso.imagem) + '" alt="Imagem sobre ' + esc(aula.titulo) + '" loading="lazy" referrerpolicy="no-referrer">');
    }

    if (curso.offline) {
      html.push('<div class="dica-box" style="margin:0 0 18px"><span>⚠️</span><p><strong>Modo offline:</strong> este conteúdo é um exemplo. Reconecte-se à internet e crie o curso novamente para obter informações reais da web.</p></div>');
    }

    if (aula.resumo) {
      html.push('<div class="bloco-destaque aula-secao"><h4>Resumo da aula</h4><p>' + esc(aula.resumo) + "</p></div>");
    }

    if (aula.objetivos.length) {
      html.push('<div class="aula-secao"><h4>O que você vai aprender</h4><ul class="lista-objetivos">' +
        aula.objetivos.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul></div>");
    }

    aula.secoes.forEach(function (secao) {
      html.push('<div class="aula-secao"><h4>' + esc(secao.titulo) + "</h4>");
      secao.paragrafos.forEach(function (p) { html.push("<p>" + esc(p) + "</p>"); });
      secao.listas.forEach(function (lista) {
        html.push("<ul>" + lista.map(function (item) { return "<li>" + esc(item) + "</li>"; }).join("") + "</ul>");
      });
      html.push("</div>");
    });

    if (aula.pontos.length) {
      html.push('<div class="aula-secao"><h4>Pontos-chave para lembrar</h4><ul class="pontos-chave">' +
        aula.pontos.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></div>");
    }

    html.push('<div class="fonte-box"><strong>Fonte principal:</strong> ');
    if (curso.fonte.url) {
      html.push('<a href="' + esc(curso.fonte.url) + '" target="_blank" rel="noopener noreferrer">' + esc(curso.fonte.titulo) + " ↗</a>");
    } else {
      html.push("<span>" + esc(curso.fonte.titulo) + " (conteúdo de exemplo)</span>");
    }
    if (curso.fontesExtras.length) {
      html.push("<br><strong>Referências adicionais:</strong> ");
      html.push(curso.fontesExtras.map(function (url) {
        return '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(url.replace(/^https?:\/\//, "").slice(0, 42)) + " ↗</a>";
      }).join(""));
    }
    html.push("</div>");

    const feitas = progressoDoCurso(curso).feitas;
    const concluida = feitas.indexOf(aula.id) !== -1;
    const temProxima = Estado.aulaAtual < curso.aulas.length - 1;
    html.push('<div class="aula-nav">');
    html.push('<button class="btn ' + (concluida ? "btn-ghost" : "btn-primary") + '" data-action="marcar-concluida">' +
      (concluida ? "✓ Concluída" : "✓ Marcar como concluída") + "</button>");
    if (temProxima) html.push('<button class="btn btn-ghost" data-action="proxima-aula">Próxima aula →</button>');
    html.push("</div>");

    document.getElementById("conteudo-aula").innerHTML = html.join("");
  }

  function renderizarQuiz(aula) {
    const el = document.getElementById("conteudo-aula");
    if (!aula.quiz.length) {
      el.innerHTML = '<div class="estado-vazio"><span class="vazio-icone">🧠</span><h3>Sem quiz nesta aula</h3>' +
        '<p>Você optou por não incluir quizzes, ou não foi possível gerar perguntas para este trecho.</p>' +
        '<button class="btn btn-primary" data-action="ir-aba" data-aba="conteudo">Voltar ao conteúdo</button></div>';
      return;
    }

    if (Estado.quiz.indice >= aula.quiz.length) {
      const total = aula.quiz.length;
      const pct = Math.round(Estado.quiz.acertos / total * 100);
      const mensagem = pct >= 80 ? "Excelente! Você dominou esta aula." : (pct >= 50 ? "Bom trabalho! Revise os pontos-chave." : "Vale revisar o conteúdo antes de continuar.");
      el.innerHTML = '<div class="quiz-final"><div class="nota-grande">' + pct + "%</div><h3>Quiz concluído</h3>" +
        "<p>" + Estado.quiz.acertos + " de " + total + " acertos. " + mensagem + "</p>" +
        '<button class="btn btn-primary" data-action="reiniciar-quiz">🔄 Refazer quiz</button></div>';
      return;
    }

    const pergunta = aula.quiz[Estado.quiz.indice];
    const letras = ["A", "B", "C", "D"];
    let html = '<div class="quiz-cabecalho"><h3>🧠 Quiz da aula</h3><span class="quiz-contador">' +
      (Estado.quiz.indice + 1) + " / " + aula.quiz.length + "</span></div>";
    html += '<div class="quiz-barra"><i style="width:' + (Estado.quiz.indice / aula.quiz.length * 100) + '%"></i></div>';
    const tipos = { vf: "VERDADEIRO OU FALSO", conceito: "QUAL É O CONCEITO?" };
    html += '<span class="quiz-tipo">' + (tipos[pergunta.tipo] || "COMPLETE A FRASE") + "</span>";
    html += '<p class="quiz-pergunta">' + esc(pergunta.enunciado) + "</p>";
    html += '<div class="opcoes-quiz">';
    pergunta.opcoes.forEach(function (opcao, i) {
      let classe = "opcao-quiz";
      if (Estado.quiz.respondida) {
        if (opcao === pergunta.correta) classe += " correta";
        else if (opcao === Estado.quiz.resposta) classe += " errada";
      }
      html += '<button class="' + classe + '" data-action="responder" data-opcao="' + esc(opcao) + '"' + (Estado.quiz.respondida ? " disabled" : "") + ">" +
        '<span class="letra">' + letras[i] + "</span><span>" + esc(opcao) + "</span></button>";
    });
    html += "</div>";

    if (Estado.quiz.respondida) {
      const acertou = Estado.quiz.resposta === pergunta.correta;
      html += '<div class="feedback-quiz ' + (acertou ? "" : "errou") + '"><strong>' +
        (acertou ? "✅ Correto!" : "❌ Resposta correta: " + esc(pergunta.correta)) + "</strong><br>" +
        esc(pergunta.explicacao) + "</div>";
      html += '<button class="btn btn-primary" style="margin-top:16px;width:100%" data-action="proxima-pergunta">' +
        (Estado.quiz.indice === aula.quiz.length - 1 ? "Ver resultado →" : "Próxima pergunta →") + "</button>";
    }
    el.innerHTML = html;
  }

  function renderizarFlashcards(aula) {
    const el = document.getElementById("conteudo-aula");
    if (!aula.flashcards.length) {
      el.innerHTML = '<div class="estado-vazio"><span class="vazio-icone">🃏</span><h3>Sem flashcards nesta aula</h3>' +
        '<p>Ative os flashcards na personalização para revisar os termos importantes.</p>' +
        '<button class="btn btn-primary" data-action="ir-aba" data-aba="conteudo">Voltar ao conteúdo</button></div>';
      return;
    }
    const cartao = aula.flashcards[Estado.flash.indice];
    el.innerHTML = '<h3 style="font-size:1.15rem;margin-bottom:14px">🃏 Flashcards</h3>' +
      '<div class="flash-controles"><span>Cartão ' + (Estado.flash.indice + 1) + " de " + aula.flashcards.length + "</span><span>Toque para virar</span></div>" +
      '<div class="flash-cena"><div class="flash-card ' + (Estado.flash.virado ? "virado" : "") + '" data-action="flash-virar">' +
      '<div class="flash-face"><strong>' + esc(cartao.frente) + "</strong><small>Pergunta — toque para ver</small></div>" +
      '<div class="flash-face verso"><strong>' + esc(cartao.verso) + "</strong><small>Resposta</small></div>" +
      '</div></div><p class="flash-dica">Tente lembrar a resposta antes de virar o cartão.</p>' +
      '<div class="flash-acoes"><button class="btn btn-ghost" data-action="flash-ant" ' + (Estado.flash.indice === 0 ? "disabled" : "") + '>← Anterior</button>' +
      '<button class="btn btn-primary" data-action="flash-prox" ' + (Estado.flash.indice === aula.flashcards.length - 1 ? "disabled" : "") + '>Próximo →</button></div>';
  }

  function renderizarNotas(aula) {
    const texto = Estado.notas[aula.id] || "";
    document.getElementById("conteudo-aula").innerHTML =
      '<h3 style="font-size:1.15rem;margin-bottom:6px">✍️ Anotações da aula</h3>' +
      '<p style="color:var(--text-soft);font-size:.82rem;margin-bottom:16px">Escreva aqui suas ideias e dúvidas. Suas anotações ficam salvas automaticamente neste navegador.</p>' +
      '<textarea class="notas-area" id="campo-notas" placeholder="Ex.: O que mais me chamou atenção foi...">' + esc(texto) + "</textarea>" +
      '<div class="notas-status" id="notas-status">' + (texto ? "✓ Anotações salvas" : "") + "</div>";

    const campo = document.getElementById("campo-notas");
    campo.addEventListener("input", function () {
      clearTimeout(Estado.timerNotas);
      const status = document.getElementById("notas-status");
      if (status) status.textContent = "Salvando...";
      Estado.timerNotas = setTimeout(function () {
        Estado.notas[aula.id] = campo.value;
        salvar(CHAVE.notas, Estado.notas);
        const statusFinal = document.getElementById("notas-status");
        if (statusFinal) statusFinal.textContent = "✓ Anotações salvas";
      }, 500);
    });
  }

  function irParaAula(indice) {
    const curso = Estado.cursoAtual;
    if (indice < 0 || indice >= curso.aulas.length) return;
    Estado.aulaAtual = indice;
    Estado.aba = "conteudo";
    resetarInteracoes();
    renderizarAula();
    document.querySelector(".aula-area").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function marcarConcluida() {
    const curso = Estado.cursoAtual;
    const aula = curso.aulas[Estado.aulaAtual];
    if (!Estado.progresso[curso.id]) Estado.progresso[curso.id] = { concluidas: [], quiz: {} };
    if (Estado.progresso[curso.id].concluidas.indexOf(aula.id) === -1) {
      Estado.progresso[curso.id].concluidas.push(aula.id);
    }
    salvar(CHAVE.progresso, Estado.progresso);
    registrarGanho("aula", { minutos: curso.duracao });
    atualizarEstatisticas();
    renderizarAula();
    verificarConclusaoCurso();
    if (Estado.aulaAtual < curso.aulas.length - 1) {
      toast("Aula concluída! +20 XP. Indo para a próxima.");
      setTimeout(function () { irParaAula(Estado.aulaAtual + 1); }, 600);
    }
  }

  /* ------------------------------ Cursos prontos */
  function renderizarFiltrosProntos() {
    if (!window.TrilhaCursosProntos) return;
    document.getElementById("filtros-prontos").innerHTML = TrilhaCursosProntos.categorias.map(function (cat) {
      const total = TrilhaCursosProntos.listar(cat.id).length;
      return '<button class="filtro-pronto ' + (cat.id === Estado.categoriaPronta ? "ativo" : "") +
        '" data-categoria-pronta="' + cat.id + '">' + cat.emoji + " " + cat.nome +
        ' <span style="opacity:.65">(' + total + ")</span></button>";
    }).join("");
  }

  function renderizarCursosProntos() {
    if (!window.TrilhaCursosProntos) return;
    const termo = Estado.buscaPronta.trim().toLowerCase();
    const cursos = TrilhaCursosProntos.listar(Estado.categoriaPronta).filter(function (curso) {
      if (!termo) return true;
      return (curso.t + " " + curso.d + " " + TrilhaCursosProntos.nomeCategoria(curso.cat)).toLowerCase().indexOf(termo) !== -1;
    });

    document.getElementById("grid-prontos").innerHTML = cursos.map(function (curso) {
      return '<article class="card-pronto">' +
        '<div class="card-pronto-topo"><div class="card-pronto-ico">' + esc(curso.e) + "</div>" +
        "<div><h3>" + esc(curso.t) + "</h3>" +
        '<span class="card-pronto-cat">' + esc(TrilhaCursosProntos.nomeCategoria(curso.cat)) + "</span></div></div>" +
        '<p class="card-pronto-desc">' + esc(curso.d) + "</p>" +
        '<div class="card-pronto-meta"><span class="tag">📚 ' + curso.mods.length + " aulas</span>" +
        '<span class="tag">⏱ ' + (curso.tempo || 20) + " min</span>" +
        '<span class="tag">🎯 ' + esc(NIVEIS[curso.n] || curso.n) + "</span></div>" +
        '<div class="card-pronto-acoes"><button class="btn btn-primary btn-sm" data-curso-pronto="' + esc(curso.id) + '">Começar →</button></div>' +
        "</article>";
    }).join("");
    document.getElementById("prontos-vazio").hidden = cursos.length > 0;
    document.getElementById("contador-prontos").textContent = TrilhaCursosProntos.total;
  }

  function abrirCursoPronto(id) {
    if (!window.TrilhaCursosProntos) return;
    const convertido = TrilhaCursosProntos.converter(id);
    if (!convertido) return;

    let curso = Estado.cursos.find(function (c) { return c.id === convertido.id; });
    if (!curso) {
      curso = convertido;
      Estado.cursos.unshift(curso);
      if (Estado.cursos.length > 12) Estado.cursos = Estado.cursos.slice(0, 12);
      salvar(CHAVE.cursos, Estado.cursos);
      renderizarBiblioteca();
      atualizarEstatisticas();
    }

    // um curso pronto também acompanha as preferências atuais do aluno
    curso.duracao = Estado.prefs.duracao;
    curso.cor = Estado.prefs.cor;
    curso.aulas.forEach(function (aula) {
      if (!aula.quizOriginal) aula.quizOriginal = aula.quiz.slice();
      if (!aula.flashOriginal) aula.flashOriginal = aula.flashcards.slice();
      aula.tempo = Estado.prefs.duracao;
      aula.quiz = Estado.prefs.quiz ? aula.quizOriginal.slice() : [];
      aula.flashcards = Estado.prefs.flashcards ? aula.flashOriginal.slice() : [];
    });
    aplicarCor(curso.cor);

    Estado.cursoAtual = curso;
    Estado.aulaAtual = 0;
    Estado.aba = "conteudo";
    resetarInteracoes();
    renderizarCurso();
    mostrarTela("curso");
    toast("📦 " + curso.titulo + " carregado. Bons estudos!");
  }

  /* ------------------------------ Biblioteca */
  function cartaoCurso(curso) {
    const progresso = progressoDoCurso(curso);
    return '<article class="card-curso">' +
      '<div class="card-curso-topo"><div class="card-curso-ico">' + (curso.pronto ? esc(curso.emoji || "📦") : (curso.offline ? "⚠️" : "📘")) + "</div>" +
      "<div><h3>" + esc(curso.titulo) + "</h3><small>" + curso.aulas.length + " aulas · " +
      esc(NIVEIS[curso.nivel] || "") + " · " + new Date(curso.criadoEm).toLocaleDateString("pt-BR") + "</small></div></div>" +
      '<div class="card-curso-barra"><i style="width:' + progresso.percentual + '%"></i></div>' +
      "<small>" + progresso.feitas.length + " de " + curso.aulas.length + " aulas concluídas (" + progresso.percentual + "%)</small>" +
      '<div class="card-curso-acoes"><button class="btn btn-primary btn-sm" data-action="abrir-curso" data-id="' + esc(curso.id) + '">Continuar →</button>' +
      '<button class="btn btn-ghost btn-sm" data-action="excluir-curso" data-id="' + esc(curso.id) + '">🗑️</button></div></article>';
  }

  function renderizarBiblioteca() {
    const lista = document.getElementById("lista-biblioteca");
    lista.innerHTML = Estado.cursos.map(cartaoCurso).join("");
    document.getElementById("biblioteca-vazia").hidden = Estado.cursos.length > 0;

    const recentes = document.getElementById("lista-recentes");
    recentes.innerHTML = Estado.cursos.slice(0, 3).map(cartaoCurso).join("");
    document.getElementById("cursos-recentes").hidden = Estado.cursos.length === 0;
  }

  function atualizarEstatisticas() {
    document.getElementById("stat-cursos").textContent = Estado.cursos.length;
    const total = Object.keys(Estado.progresso).reduce(function (soma, id) {
      return soma + ((Estado.progresso[id] && Estado.progresso[id].concluidas.length) || 0);
    }, 0);
    document.getElementById("stat-concluidas").textContent = total;
  }

  function abrirCurso(id) {
    const curso = Estado.cursos.find(function (c) { return c.id === id; });
    if (!curso) return;
    Estado.cursoAtual = curso;
    Estado.aulaAtual = 0;
    Estado.aba = "conteudo";
    resetarInteracoes();
    renderizarCurso();
    mostrarTela("curso");
  }

  function excluirCurso(id) {
    const curso = Estado.cursos.find(function (c) { return c.id === id; });
    if (!curso || !window.confirm("Excluir o curso “" + curso.titulo + "”?")) return;
    Estado.cursos = Estado.cursos.filter(function (c) { return c.id !== id; });
    delete Estado.progresso[id];
    salvar(CHAVE.cursos, Estado.cursos);
    salvar(CHAVE.progresso, Estado.progresso);
    renderizarBiblioteca();
    atualizarEstatisticas();
    toast("Curso excluído.");
  }

  /* ------------------------------ Perfil, motivação e certificados */
  function atualizarPerfilUI() {
    if (!window.TrilhaPerfil) return;
    const r = TrilhaPerfil.resumo();
    document.getElementById("avatar-topo").textContent = r.usuario ? r.usuario.avatar : "👤";
    document.getElementById("nome-topo").textContent = r.usuario ? r.usuario.nome : "Entrar";
    document.getElementById("streak-topo").textContent = "🔥 " + r.sequencia;
    document.getElementById("btn-sair").hidden = !r.logado;
    renderizarPainelProgresso(r);
    if (Estado.tela === "perfil") renderizarPerfil();
    if (Estado.cursoAtual) atualizarBotaoCertificado();
  }

  function renderizarPainelProgresso(r) {
    const resumo = r || TrilhaPerfil.resumo();
    const restantes = Math.max(0, resumo.nivel.necessario - resumo.nivel.atual);
    const itens = [
      { rotulo: "Sequência atual", valor: resumo.sequencia, unidade: resumo.sequencia === 1 ? "dia" : "dias",
        pct: Math.min(100, resumo.sequencia / 7 * 100),
        nota: resumo.sequencia >= 3 ? "Continue assim, você está em ritmo!" : "Estude hoje para iniciar sua sequência" },
      { rotulo: "Seu nível", valor: resumo.nivel.nivel, unidade: "nível",
        pct: resumo.nivel.atual / resumo.nivel.necessario * 100,
        nota: resumo.stats.xp + " XP · " + restantes + " XP para o próximo" },
      { rotulo: "Meta de hoje", valor: resumo.hoje.aulas + "/" + resumo.meta, unidade: "aulas",
        pct: resumo.metaProgresso,
        nota: resumo.metaProgresso >= 100 ? "Meta cumprida! Parabéns 🎉" : "Faltam " + Math.max(0, resumo.meta - resumo.hoje.aulas) + " aula(s) para bater a meta" },
      { rotulo: "Conquistas", valor: resumo.stats.conquistas.length + "/" + resumo.conquistas.length, unidade: "selos",
        pct: resumo.stats.conquistas.length / resumo.conquistas.length * 100,
        nota: resumo.proximaConquista ? "Próxima: " + resumo.proximaConquista.emoji + " " + resumo.proximaConquista.nome : "Todas desbloqueadas!" }
    ];
    document.getElementById("progresso-grid").innerHTML = itens.map(function (item) {
      return '<div class="progresso-item"><small>' + esc(item.rotulo) + '</small>' +
        '<strong class="progresso-valor">' + esc(item.valor) + ' <span>' + esc(item.unidade) + '</span></strong>' +
        '<div class="mini-barra"><i style="width:' + Math.round(item.pct) + '%"></i></div>' +
        '<small style="margin-top:7px">' + esc(item.nota) + '</small></div>';
    }).join("");

    const desafio = DESAFIOS[new Date().getDate() % DESAFIOS.length];
    document.getElementById("desafio-dia").innerHTML =
      '<span class="desafio-icone">' + desafio.icone + "</span><div><strong>" + esc(desafio.titulo) +
      "</strong><p>" + esc(desafio.texto) + "</p></div>";
  }

  function abrirPerfil() {
    if (!window.TrilhaPerfil || !TrilhaPerfil.logado()) {
      Estado.loginModo = "entrar";
      atualizarFormLogin();
      mostrarTela("login");
      return;
    }
    renderizarPerfil();
    mostrarTela("perfil");
  }

  function renderizarPerfil() {
    const r = TrilhaPerfil.resumo();
    const u = r.usuario;
    document.querySelectorAll(".perfil-aba").forEach(function (aba) {
      aba.classList.toggle("ativo", aba.dataset.perfilAba === Estado.abaPerfil);
    });
    if (u) {
      document.getElementById("perfil-cartao").innerHTML =
        '<div class="perfil-avatar-grande">' + esc(u.avatar) + "</div>" +
        "<h3>" + esc(u.nome) + "</h3><p>" + esc(u.email) + "</p>" +
        '<div class="perfil-nivel"><div class="perfil-nivel-topo"><span>Nível ' + r.nivel.nivel +
        "</span><span>" + r.stats.xp + " XP</span></div>" +
        '<div class="mini-barra"><i style="width:' + Math.round(r.nivel.atual / r.nivel.necessario * 100) + '%"></i></div></div>' +
        '<div class="perfil-cartao-stats">' +
          "<div><strong>" + r.sequencia + "</strong><small>dias seguidos</small></div>" +
          "<div><strong>" + r.stats.totalAulas + "</strong><small>aulas</small></div>" +
          "<div><strong>" + r.stats.conquistas.length + "</strong><small>selos</small></div>" +
        "</div>";
    }
    if (Estado.abaPerfil === "dados") renderizarPerfilDados(r);
    else if (Estado.abaPerfil === "estudos") renderizarPerfilEstudos(r);
    else if (Estado.abaPerfil === "conquistas") renderizarPerfilConquistas(r);
    else renderizarPerfilCertificados(r);
  }

  function renderizarPerfilDados(r) {
    const u = r.usuario;
    if (!u) {
      document.getElementById("perfil-conteudo").innerHTML =
        '<h3>Você ainda não entrou</h3><p class="descricao">Crie um perfil local para salvar suas preferências, acompanhar sua evolução e emitir certificados.</p>' +
        '<button class="btn btn-primary" data-abrir-login>Criar meu perfil →</button>';
      return;
    }
    const opcoesMeta = [1, 2, 3, 4, 5].map(function (n) {
      return '<option value="' + n + '"' + (n === u.metaDiaria ? " selected" : "") + ">" + n + (n === 1 ? " aula" : " aulas") + " por dia</option>";
    }).join("");
    document.getElementById("perfil-conteudo").innerHTML =
      "<h3>Dados pessoais</h3><p class=\"descricao\">Personalize como a Trilha chama você e como quer ser visto nos seus certificados.</p>" +
      '<div class="perfil-bloco"><span class="campo-label">Escolha seu avatar</span><div class="avatar-opcoes">' +
        TrilhaPerfil.AVATARES.map(function (emoji) {
          return '<button type="button" class="avatar-opcao ' + (emoji === u.avatar ? "selecionado" : "") +
            '" data-avatar="' + esc(emoji) + '" aria-label="Avatar ' + esc(emoji) + '">' + esc(emoji) + "</button>";
        }).join("") + "</div>" +
        '<form id="form-perfil">' +
          '<div class="campo-form"><label for="perfil-nome">Nome completo</label><input id="perfil-nome" type="text" value="' + esc(u.nome) + '" required minlength="2"></div>' +
          '<div class="campo-form" style="margin-top:12px"><label for="perfil-email">E-mail</label><input id="perfil-email" type="email" value="' + esc(u.email) + '" required></div>' +
          '<div class="campo-form" style="margin-top:12px"><label for="perfil-bio">Sobre você <small>(opcional)</small></label><textarea id="perfil-bio" placeholder="O que você está estudando?">' + esc(u.bio) + "</textarea></div>" +
          '<div class="campo-form" style="margin-top:12px"><label for="perfil-meta">Meta diária</label><select id="perfil-meta">' + opcoesMeta + "</select></div>" +
          '<div class="perfil-acoes"><button type="submit" class="btn btn-primary">💾 Salvar alterações</button>' +
          '<button type="button" class="btn btn-ghost" id="btn-editar-prefs">Ajustar aulas</button></div>' +
        "</form></div>";
  }

  function renderizarPerfilEstudos(r) {
    const dias = TrilhaPerfil.dias();
    const ultimos = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const chave = TrilhaPerfil.dataLocal(d);
      const registro = dias[chave] || { aulas: 0 };
      ultimos.push('<div class="progresso-item" style="text-align:center"><small>' +
        d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "") + "</small>" +
        '<strong class="progresso-valor" style="font-size:1rem">' + (registro.aulas ? "🔥" : "·") + "</strong>" +
        "<small>" + registro.aulas + " aula(s)</small></div>");
    }
    document.getElementById("perfil-conteudo").innerHTML =
      "<h3>Seu progresso</h3><p class=\"descricao\">Cada aula concluída vira XP. Mantenha a sequência para não perder o ritmo!</p>" +
      '<div class="progresso-grid">' +
        '<div class="progresso-item"><small>Aulas concluídas</small><strong class="progresso-valor">' + r.stats.totalAulas + "</strong></div>" +
        '<div class="progresso-item"><small>Quizzes feitos</small><strong class="progresso-valor">' + r.stats.totalQuiz + "</strong></div>" +
        '<div class="progresso-item"><small>Cursos terminados</small><strong class="progresso-valor">' + r.stats.totalCursos + "</strong></div>" +
        '<div class="progresso-item"><small>Flashcards revisados</small><strong class="progresso-valor">' + r.stats.totalFlash + "</strong></div>" +
      "</div>" +
      '<div class="perfil-bloco"><div class="perfil-nivel-topo"><span>Meta de hoje: ' + r.hoje.aulas + " de " + r.meta + ' aulas</span><span>' + r.metaProgresso + "%</span></div>" +
        '<div class="mini-barra"><i style="width:' + r.metaProgresso + '%"></i></div>' +
        '<p class="descricao" style="margin-top:12px">' +
          (r.metaProgresso >= 100 ? "🎉 Meta cumprida! Você pode ir além ou descansar — amanhã tem mais." :
            "💡 " + DESAFIOS[new Date().getDate() % DESAFIOS.length].texto) + "</p></div>" +
      '<div class="perfil-bloco"><span class="campo-label">Últimos 7 dias</span><div class="progresso-grid" style="margin-top:10px">' + ultimos.join("") + "</div></div>";
  }

  function renderizarPerfilConquistas(r) {
    const valores = {
      aulas: r.stats.totalAulas, quizPerfeitos: r.stats.quizPerfeitos, cursos: r.stats.totalCursos,
      flash: r.stats.totalFlash, cursosDistintos: r.stats.cursosDistintos.length,
      xp: r.stats.xp, sequencia: r.sequencia
    };
    document.getElementById("perfil-conteudo").innerHTML =
      "<h3>Conquistas</h3><p class=\"descricao\">Desbloqueie selos estudando um pouco todos os dias. Você já tem " +
      r.stats.conquistas.length + " de " + r.conquistas.length + ".</p>" +
      '<div class="conquista-grid">' + r.conquistas.map(function (c) {
        const atual = Math.min(valores[c.tipo] || 0, c.meta);
        return '<div class="conquista-item ' + (c.conquistada ? "" : "bloqueada") + '">' +
          '<span class="conquista-emoji">' + esc(c.emoji) + "</span><div><strong>" + esc(c.nome) +
          (c.conquistada ? " ✓" : "") + "</strong><small>" + esc(c.descricao) + "</small>" +
          '<div class="mini-barra" style="margin-top:7px"><i style="width:' + Math.round(atual / c.meta * 100) + '%"></i></div>' +
          "</div></div>";
      }).join("") + "</div>";
  }

  function renderizarPerfilCertificados(r) {
    const certificados = TrilhaPerfil.certificados();
    document.getElementById("perfil-conteudo").innerHTML =
      "<h3>Meus certificados</h3><p class=\"descricao\">Conclua todas as aulas de um curso para receber um certificado. Você pode imprimir, salvar em PDF ou baixar em imagem.</p>" +
      (certificados.length ? certificados.map(function (c) {
        return '<div class="cert-lista-item"><span class="cert-lista-ico">🏅</span><div><strong>' + esc(c.titulo) +
          "</strong><small>" + esc(TrilhaCertificado.dataFormatada(c.emissao)) + " · " + esc(c.carga) + "</small></div>" +
          '<button class="btn btn-primary btn-sm" data-certificado="' + esc(c.id) + '">Abrir</button></div>';
      }).join("") : '<div class="vazio-pequeno"><span style="font-size:2rem">📜</span><p>Nenhum certificado ainda.<br>Termine um curso para ganhar o seu!</p></div>');
  }

  function abrirCertificado(id) {
    const certificado = id
      ? TrilhaPerfil.certificados().find(function (c) { return c.id === id; })
      : Estado.certificadoAtual;
    if (!certificado) { toast("Certificado não encontrado."); return; }
    Estado.certificadoAtual = certificado;
    document.getElementById("certificado-area").innerHTML = TrilhaCertificado.html(certificado);
    mostrarTela("certificado");
  }

  function atualizarBotaoCertificado() {
    const curso = Estado.cursoAtual;
    if (!curso) return;
    const progresso = progressoDoCurso(curso);
    document.getElementById("btn-certificado").hidden =
      !(progresso.feitas.length === curso.aulas.length && curso.aulas.length > 0);
  }

  function mostrarCelebracao(conteudo, botoes) {
    document.getElementById("celebracao-conteudo").innerHTML = conteudo;
    document.getElementById("celebracao-acoes").innerHTML = botoes;
    document.getElementById("celebracao").hidden = false;
  }

  function fecharCelebracao() { document.getElementById("celebracao").hidden = true; }

  function verificarConclusaoCurso() {
    const curso = Estado.cursoAtual;
    if (!curso) return;
    atualizarBotaoCertificado();
    const progresso = progressoDoCurso(curso);
    if (progresso.feitas.length !== curso.aulas.length || !curso.aulas.length) return;
    const nome = TrilhaPerfil.usuario() ? TrilhaPerfil.usuario().nome : "Estudante";
    const jaEmitido = TrilhaPerfil.certificados().some(function (c) {
      return c.cursoId === curso.id && c.aluno === nome;
    });
    if (jaEmitido) return;

    const ganho = TrilhaPerfil.registrar("curso", { cursoId: curso.id });
    const certificado = TrilhaPerfil.emitirCertificado(curso);
    Estado.certificadoAtual = certificado;
    const conquistas = ganho.novasConquistas.length
      ? "<ul class=\"modal-lista\">" + ganho.novasConquistas.map(function (c) {
          return "<li>" + esc(c.emoji) + " Nova conquista: " + esc(c.nome) + "</li>";
        }).join("") + "</ul>"
      : "";
    mostrarCelebracao(
      '<div class="modal-emoji">🎉</div><h2 id="celebracao-titulo">Curso concluído!</h2>' +
      "<p>Você terminou <strong>" + esc(curso.titulo) + "</strong> e ganhou <strong>+" + ganho.ganho +
      " XP</strong>. Seu certificado já está disponível!</p>" + conquistas,
      '<button class="btn btn-primary" data-celebracao="certificado">🏅 Ver certificado</button>' +
      '<button class="btn btn-ghost" data-celebracao="fechar">Continuar estudando</button>'
    );
    const botaoCert = document.getElementById("btn-certificado");
    botaoCert.classList.add("pulso");
    setTimeout(function () { botaoCert.classList.remove("pulso"); }, 3600);
  }

  function registrarGanho(tipo, dados) {
    if (!window.TrilhaPerfil) return null;
    const nivelAntes = TrilhaPerfil.resumo().nivel.nivel;
    const ganho = TrilhaPerfil.registrar(tipo, dados);
    if (ganho.nivel.nivel > nivelAntes) {
      toast("🎊 Novo nível! Você chegou ao nível " + ganho.nivel.nivel + ".");
    }
    if (ganho.novasConquistas.length) {
      const nova = ganho.novasConquistas[0];
      setTimeout(function () { toast(nova.emoji + " Conquista desbloqueada: " + nova.nome + "!"); }, 700);
    }
    return ganho;
  }

  function atualizarFormLogin() {
    const criar = Estado.loginModo === "criar";
    document.querySelectorAll(".login-aba").forEach(function (aba) {
      aba.classList.toggle("ativo", aba.dataset.loginAba === Estado.loginModo);
    });
    document.getElementById("campo-nome").hidden = !criar;
    document.getElementById("login-submit").textContent = criar ? "Criar minha conta →" : "Entrar →";
    document.getElementById("login-senha").autocomplete = criar ? "new-password" : "current-password";
  }

  /* ------------------------------ Eventos */
  function registrarEventos() {
    document.addEventListener("click", function (evento) {
      const alvo = evento.target;

      const nav = alvo.closest("[data-nav]");
      if (nav) {
        const destino = nav.dataset.nav;
        if (destino === "como-funciona") {
          mostrarTela("inicio");
          setTimeout(function () { document.getElementById("como-funciona").scrollIntoView({ behavior: "smooth" }); }, 60);
        } else if (destino === "personalizar") {
          abrirPersonalizacao();
        } else if (destino === "perfil") {
          abrirPerfil();
        } else {
          mostrarTela(destino);
        }
        return;
      }

      const opcao = alvo.closest(".opcao, .chip-selecionavel, .cor-opcao");
      if (opcao && opcao.parentElement) {
        const grupo = opcao.parentElement.dataset.grupo;
        if (grupo === "foco") {
          const indice = Estado.prefs.foco.indexOf(opcao.dataset.valor);
          if (indice === -1) Estado.prefs.foco.push(opcao.dataset.valor);
          else Estado.prefs.foco.splice(indice, 1);
          opcao.classList.toggle("selecionado", indice === -1);
        } else {
          opcao.parentElement.querySelectorAll(".opcao, .chip-selecionavel, .cor-opcao").forEach(function (irmao) {
            irmao.classList.remove("selecionado");
          });
          opcao.classList.add("selecionado");
          const valor = opcao.dataset.valor;
          if (grupo === "meta" || grupo === "duracao") Estado.prefs[grupo] = Number(valor);
          else Estado.prefs[grupo] = valor;
          if (grupo === "cor") aplicarCor(valor);
        }
        salvar(CHAVE.prefs, Estado.prefs);
        return;
      }

      const step = alvo.closest(".step");
      if (step) { irEtapa(Number(step.dataset.step)); return; }

      const chip = alvo.closest(".chip-tema");
      if (chip) { abrirPersonalizacao(chip.dataset.tema); return; }

      const filtro = alvo.closest("[data-categoria-pronta]");
      if (filtro) {
        Estado.categoriaPronta = filtro.dataset.categoriaPronta;
        renderizarFiltrosProntos();
        renderizarCursosProntos();
        return;
      }

      const pronto = alvo.closest("[data-curso-pronto]");
      if (pronto) { abrirCursoPronto(pronto.dataset.cursoPronto); return; }

      const abaPerfil = alvo.closest(".perfil-aba");
      if (abaPerfil) {
        Estado.abaPerfil = abaPerfil.dataset.perfilAba;
        renderizarPerfil();
        return;
      }

      const abaLogin = alvo.closest(".login-aba");
      if (abaLogin) {
        Estado.loginModo = abaLogin.dataset.loginAba;
        atualizarFormLogin();
        return;
      }

      const avatar = alvo.closest("[data-avatar]");
      if (avatar) {
        document.querySelectorAll(".avatar-opcao").forEach(function (botao) { botao.classList.remove("selecionado"); });
        avatar.classList.add("selecionado");
        return;
      }

      const abrirLogin = alvo.closest("[data-abrir-login]");
      if (abrirLogin) {
        Estado.loginModo = "criar";
        atualizarFormLogin();
        mostrarTela("login");
        return;
      }

      const editarPrefs = alvo.closest("#btn-editar-prefs");
      if (editarPrefs) {
        aplicarCor(Estado.prefs.cor);
        abrirPersonalizacao();
        return;
      }

      const certificado = alvo.closest("[data-certificado]");
      if (certificado) { abrirCertificado(certificado.dataset.certificado); return; }

      const celebracao = alvo.closest("[data-celebracao]");
      if (celebracao) {
        fecharCelebracao();
        if (celebracao.dataset.celebracao === "certificado") abrirCertificado();
        return;
      }

      const acao = alvo.closest("[data-action]");
      if (acao) { tratarAcaoCurso(acao); return; }
    });

    document.getElementById("btn-tema").addEventListener("click", alternarTema);

    document.getElementById("form-busca").addEventListener("submit", function (evento) {
      evento.preventDefault();
      const termo = document.getElementById("busca-assunto").value.trim();
      if (termo.length < 2) { toast("Digite um assunto com pelo menos 2 letras."); return; }
      abrirPersonalizacao(termo);
    });

    document.getElementById("wizard-avancar").addEventListener("click", function () {
      if (Estado.etapa === 1 && (document.getElementById("personal-tema").value || "").trim().length < 2) {
        toast("Primeiro, digite o assunto que você quer estudar.");
        document.getElementById("personal-tema").focus();
        return;
      }
      irEtapa(Estado.etapa + 1);
    });
    document.getElementById("wizard-voltar").addEventListener("click", function () { irEtapa(Estado.etapa - 1); });
    document.getElementById("btn-gerar").addEventListener("click", gerarCurso);

    document.querySelectorAll("[data-pref]").forEach(function (input) {
      input.addEventListener("change", function () {
        Estado.prefs[input.dataset.pref] = input.checked;
        salvar(CHAVE.prefs, Estado.prefs);
      });
    });

    configurarSugestoes("busca-assunto", "sugestoes", function () { return "pt"; });
    configurarSugestoes("personal-tema", "sugestoes-personal", function () { return document.getElementById("personal-idioma").value; });
    document.getElementById("personal-idioma").addEventListener("change", function () {
      Estado.prefs.idioma = this.value;
      salvar(CHAVE.prefs, Estado.prefs);
    });

    document.getElementById("busca-prontos").addEventListener("input", function () {
      Estado.buscaPronta = this.value;
      renderizarCursosProntos();
    });

    document.addEventListener("submit", function (evento) {
      if (evento.target.id === "form-login") {
        evento.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const senha = document.getElementById("login-senha").value;
        const nome = document.getElementById("login-nome").value.trim();
        try {
          if (Estado.loginModo === "criar") TrilhaPerfil.criarConta({ nome: nome, email: email, senha: senha });
          else TrilhaPerfil.entrar(email, senha);
          toast("👋 Bem-vindo(a) ao seu espaço de estudos!");
          Estado.abaPerfil = "dados";
          abrirPerfil();
        } catch (erro) { toast(erro.message); }
      }
      if (evento.target.id === "form-perfil") {
        evento.preventDefault();
        const avatar = document.querySelector(".avatar-opcao.selecionado");
        try {
          TrilhaPerfil.atualizar({
            nome: document.getElementById("perfil-nome").value.trim(),
            email: document.getElementById("perfil-email").value.trim(),
            bio: document.getElementById("perfil-bio").value.trim(),
            metaDiaria: Number(document.getElementById("perfil-meta").value),
            avatar: avatar ? avatar.dataset.avatar : undefined
          });
          toast("✅ Perfil atualizado!");
          renderizarPerfil();
        } catch (erro) { toast(erro.message); }
      }
    });

    document.getElementById("btn-sair").addEventListener("click", function () {
      TrilhaPerfil.sair();
      toast("Você saiu da conta. Seus cursos continuam salvos aqui.");
      mostrarTela("inicio");
    });
    document.getElementById("btn-imprimir-cert").addEventListener("click", function () { window.print(); });
    document.getElementById("btn-png-cert").addEventListener("click", function () {
      if (Estado.certificadoAtual) TrilhaCertificado.baixarPNG(Estado.certificadoAtual);
    });
    document.getElementById("celebracao").addEventListener("click", function (evento) {
      if (evento.target === this) fecharCelebracao();
    });
    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape") fecharCelebracao();
    });
    document.addEventListener("trilha:perfil", function () { atualizarPerfilUI(); });
  }

  function tratarAcaoCurso(botao) {
    const acao = botao.dataset.action;
    const aula = Estado.cursoAtual && Estado.cursoAtual.aulas[Estado.aulaAtual];

    switch (acao) {
      case "ir-aula": irParaAula(Number(botao.dataset.i)); break;
      case "marcar-concluida": marcarConcluida(); break;
      case "proxima-aula": irParaAula(Estado.aulaAtual + 1); break;
      case "ir-aba":
        Estado.aba = botao.dataset.aba;
        renderizarAula();
        break;
      case "responder": {
        if (Estado.quiz.respondida) return;
        const pergunta = aula.quiz[Estado.quiz.indice];
        const resposta = botao.dataset.opcao;
        Estado.quiz.resposta = resposta;
        Estado.quiz.respondida = true;
        if (resposta === pergunta.correta) Estado.quiz.acertos++;
        renderizarQuiz(aula);
        break;
      }
      case "proxima-pergunta":
        Estado.quiz.indice++;
        Estado.quiz.respondida = false;
        renderizarQuiz(aula);
        if (Estado.quiz.indice >= aula.quiz.length) {
          const id = Estado.cursoAtual.id;
          if (!Estado.progresso[id]) Estado.progresso[id] = { concluidas: [], quiz: {} };
          Estado.progresso[id].quiz[aula.id] = { acertos: Estado.quiz.acertos, total: aula.quiz.length };
          salvar(CHAVE.progresso, Estado.progresso);
          registrarGanho("quiz", { acertos: Estado.quiz.acertos, total: aula.quiz.length });
          atualizarEstatisticas();
          if (Estado.quiz.acertos === aula.quiz.length) toast("🎯 Quiz perfeito! Bônus de XP.");
        }
        break;
      case "reiniciar-quiz":
        resetarInteracoes();
        renderizarQuiz(aula);
        break;
      case "flash-virar": {
        const chaveCartao = Estado.cursoAtual.id + "_" + aula.id + "_" + Estado.flash.indice;
        if (!Estado.flashVistos[chaveCartao]) {
          Estado.flashVistos[chaveCartao] = true;
          registrarGanho("flashcards", { quantidade: 1 });
        }
        Estado.flash.virado = !Estado.flash.virado;
        renderizarFlashcards(aula);
        break;
      }
      case "flash-ant":
        if (Estado.flash.indice > 0) { Estado.flash.indice--; Estado.flash.virado = false; renderizarFlashcards(aula); }
        break;
      case "flash-prox":
        if (Estado.flash.indice < aula.flashcards.length - 1) { Estado.flash.indice++; Estado.flash.virado = false; renderizarFlashcards(aula); }
        break;
      case "abrir-curso": abrirCurso(botao.dataset.id); break;
      case "excluir-curso": excluirCurso(botao.dataset.id); break;
    }
  }

  function registrarAbas() {
    document.getElementById("abas-aula").addEventListener("click", function (evento) {
      const aba = evento.target.closest(".aba");
      if (!aba) return;
      Estado.aba = aba.dataset.aba;
      renderizarAula();
    });
    document.getElementById("btn-favorito").addEventListener("click", function () {
      const curso = Estado.cursoAtual;
      curso.favorito = !curso.favorito;
      salvar(CHAVE.cursos, Estado.cursos);
      this.textContent = curso.favorito ? "★" : "☆";
      this.classList.toggle("btn-favorito-on", !!curso.favorito);
      toast(curso.favorito ? "Curso favoritado." : "Favorito removido.");
    });
    document.getElementById("btn-compartilhar").addEventListener("click", async function () {
      const curso = Estado.cursoAtual;
      const texto = "Estou estudando " + curso.titulo + " na Trilha: " + curso.aulas.length + " aulas personalizadas, quizzes e flashcards!";
      try {
        if (navigator.share) await navigator.share({ title: "Trilha", text: texto });
        else if (navigator.clipboard) { await navigator.clipboard.writeText(texto); toast("Resumo copiado!"); }
        else toast(texto);
      } catch (erro) { /* compartilhamento cancelado */ }
    });
  }

  /* ------------------------------ Inicialização */
  function iniciar() {
    Estado.cursos = ler(CHAVE.cursos, []);
    Estado.progresso = ler(CHAVE.progresso, {});
    Estado.notas = ler(CHAVE.notas, {});
    Estado.prefs = Object.assign({}, prefsPadrao, ler(CHAVE.prefs, {}));

    if (ler(CHAVE.tema, false)) {
      document.body.classList.add("tema-escuro");
      document.getElementById("btn-tema").textContent = "☀️";
    }

    registrarEventos();
    registrarAbas();
    sincronizarWizard();
    renderizarFiltrosProntos();
    renderizarCursosProntos();
    renderizarBiblioteca();
    atualizarEstatisticas();
    atualizarPerfilUI();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
