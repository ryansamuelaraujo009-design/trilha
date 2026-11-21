/* ============================================================
   gerador.js — Transforma páginas da Wikipedia em cursos
   ============================================================ */
window.TrilhaGerador = (function () {
  "use strict";

  const IGNORAR_SECOES = /^(referências|referencias|notas|bibliografia|ligações externas|ligacoes externas|ver também|ver tambem|veja também|see also|external links|references|further reading|fontes|anexos|galeria)$/i;

  const PALAVRAS_FOCO = {
    conceitos: ["conceito", "definição", "definicao", "significa", "consiste", "característica", "caracteristica"],
    exemplos: ["exemplo", "por exemplo", "caso", "ilustra"],
    historia: ["história", "historia", "origem", "século", "ano", "surgiu", "criado", "descoberto", "tradicionalmente"],
    aplicacoes: ["aplicação", "aplicacao", "aplicações", "aplicacoes", "usado", "utilizado", "prática", "metodo", "método", "tecnologia"],
    curiosidades: ["curiosidade", "interessante", "peculiar", "incomum", "recorde", "surpreendente"]
  };

  /* ------------------------------ Utilitários */
  function limparTexto(texto) {
    return (texto || "")
      .replace(/\[\s*\d+\s*\]/g, "")
      .replace(/\[(?:edit|editar|source|fonte)\]/gi, "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function embaralhar(array) {
    const copia = array.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copia[i]; copia[i] = copia[j]; copia[j] = temp;
    }
    return copia;
  }

  function cortar(texto, max) {
    if (texto.length <= max) return texto;
    const parte = texto.slice(0, max);
    const ultimoEspaco = parte.lastIndexOf(" ");
    return (ultimoEspaco > max * 0.6 ? parte.slice(0, ultimoEspaco) : parte).replace(/[,;:\s]+$/, "") + "…";
  }

  function dividirFrases(texto) {
    return (texto || "")
      .replace(/([.!?])\s+(?=[A-ZÀ-Ý0-9"“])/g, "$1\n")
      .split("\n")
      .map(limparTexto)
      .filter(function (frase) { return frase.length >= 45; });
  }

  function pontuarFrase(frase, foco) {
    let pontos = 0;
    if (/\d/.test(frase)) pontos += 3;
    if (/\b(é|são|foi|foram|consiste|significa|define|conhecido|chamado|principal|importante|primeiro|segundo|após|antes|durante|entre|permite|possui)\b/i.test(frase)) pontos += 2;
    if (frase.length >= 70 && frase.length <= 230) pontos += 2;
    if (/\b(por exemplo|em resumo|ou seja)\b/i.test(frase)) pontos += 1;
    (foco || []).forEach(function (chave) {
      const palavras = PALAVRAS_FOCO[chave] || [];
      if (palavras.some(function (p) { return frase.toLowerCase().indexOf(p) !== -1; })) pontos += 3;
    });
    return pontos;
  }

  /* ------------------------------ Extração do HTML da Wikipedia */
  function extrairConteudo(html) {
    if (!html) return [];
    const doc = new DOMParser().parseFromString(html, "text/html");
    const seletorRemover = "sup.reference, .reflist, .mw-editsection, .hatnote, .shortdescription, .ambox, .sidebar, .navbox, .metadata, figure, table, style, script, .mw-empty-elt";
    doc.querySelectorAll(seletorRemover).forEach(function (el) { el.remove(); });

    const blocos = [];
    let atual = { titulo: "Visão geral", nivel: 2, paragrafos: [], listas: [], termos: [], ignorar: false };
    const elementos = doc.body.querySelectorAll("h2, h3, h4, p, ul, ol");

    elementos.forEach(function (el) {
      const tag = el.tagName;
      if (/^H[234]$/.test(tag)) {
        const titulo = limparTexto(el.textContent);
        if (!titulo) return;
        if (atual.paragrafos.length || atual.listas.length) blocos.push(atual);
        atual = {
          titulo: titulo,
          nivel: Number(tag[1]),
          paragrafos: [],
          listas: [],
          termos: [],
          ignorar: IGNORAR_SECOES.test(titulo)
        };
        return;
      }
      if (atual.ignorar) return;

      if (tag === "P") {
        const texto = limparTexto(el.textContent);
        if (texto.length < 55) return;
        if (atual.paragrafos.indexOf(texto) !== -1) return;
        atual.paragrafos.push(texto);
        el.querySelectorAll("b, strong").forEach(function (termoEl) {
          const termo = limparTexto(termoEl.textContent);
          if (termo.length >= 3 && termo.length <= 55 && !/\d{4}\s*–/.test(termo)) {
            if (atual.termos.indexOf(termo) === -1) atual.termos.push(termo);
          }
        });
      } else if ((tag === "UL" || tag === "OL") && !el.closest("li")) {
        const itens = [];
        el.querySelectorAll(":scope > li").forEach(function (li) {
          const item = limparTexto(li.textContent);
          if (item.length >= 12 && item.length <= 320) itens.push(item);
        });
        if (itens.length >= 2) atual.listas.push(itens);
      }
    });

    if (atual.paragrafos.length || atual.listas.length) blocos.push(atual);
    return blocos;
  }

  function extrairFontesExtras(html, urlPrincipal) {
    if (!html) return [];
    const doc = new DOMParser().parseFromString(html, "text/html");
    const encontradas = [];
    doc.querySelectorAll('a[href^="http"]').forEach(function (a) {
      const href = a.getAttribute("href");
      if (!href || /wikipedia\.org|wikimedia\.org|wikidata\.org/.test(href)) return;
      if (encontradas.indexOf(href) !== -1 || href === urlPrincipal) return;
      if (encontradas.length < 3) encontradas.push(href);
    });
    return encontradas;
  }

  /* ------------------------------ Termos, pontos e perguntas */
  function extrairTermos(blocos) {
    const lista = [];
    blocos.forEach(function (bloco) {
      bloco.termos.forEach(function (t) { lista.push(t); });
    });
    // complemento: palavras importantes em negrito ausente
    if (lista.length < 12) {
      blocos.forEach(function (bloco) {
        bloco.paragrafos.slice(0, 2).forEach(function (p) {
          dividirFrases(p).slice(0, 2).forEach(function (frase) {
            const palavras = frase.split(/\s+/);
            palavras.forEach(function (palavra, indice) {
              const limpa = palavra.replace(/[^\p{L}\p{N}-]/gu, "");
              if (indice > 0 && limpa.length > 5 && /^[A-ZÀ-Ý]/.test(limpa)) lista.push(limpa);
            });
          });
        });
      });
    }
    const vistos = {};
    return lista.filter(function (termo) {
      const chave = termo.toLowerCase();
      if (vistos[chave] || termo.length < 4 || termo.length > 55) return false;
      vistos[chave] = true;
      return true;
    });
  }

  function extrairPontosChave(texto, max, foco) {
    const frases = dividirFrases(texto);
    return frases
      .map(function (frase) { return { frase: frase, nota: pontuarFrase(frase, foco) }; })
      .sort(function (a, b) { return b.nota - a.nota; })
      .slice(0, max)
      .map(function (item) { return cortar(item.frase, 190); });
  }

  function escolherTermo(frase, termos, jaUsados) {
    let melhor = null;
    termos.forEach(function (termo) {
      if (jaUsados.indexOf(termo.toLowerCase()) !== -1) return;
      if (termo.length < 4 || termo.length > 40) return;
      if (!new RegExp("\\b" + escaparRegex(termo) + "\\b", "i").test(frase)) return;
      if (!melhor || termo.length > melhor.length) melhor = termo;
    });
    return melhor;
  }

  function gerarQuiz(blocos, termos, quantidade, foco, nivel) {
    if (!quantidade) return [];
    const limiteEnunciado = nivel === "iniciante" ? 175 : 230;
    const frases = [];
    blocos.forEach(function (bloco) {
      bloco.paragrafos.forEach(function (p) {
        dividirFrases(p).forEach(function (frase) { frases.push(frase); });
      });
      bloco.listas.forEach(function (lista) {
        lista.forEach(function (item) {
          const frase = limparTexto(item);
          if (frase.length >= 40) frases.push(frase);
        });
      });
    });

    const candidatas = frases
      .filter(function (frase) { return frase.length >= 45 && frase.length <= 280 && pontuarFrase(frase, foco) >= 2; })
      .sort(function (a, b) { return pontuarFrase(b, foco) - pontuarFrase(a, foco); });

    const perguntas = [];
    const usados = [];
    const vistos = {};
    function adicionar(pergunta) {
      const chave = pergunta.enunciado.toLowerCase().replace(/\s+/g, " ");
      if (vistos[chave]) return false;
      vistos[chave] = true;
      perguntas.push(pergunta);
      return true;
    }

    candidatas.forEach(function (frase) {
      if (perguntas.length >= quantidade) return;
      const termo = escolherTermo(frase, termos, usados);
      if (!termo) return;

      const enunciado = frase.replace(new RegExp("\\b" + escaparRegex(termo) + "\\b", "i"), "_____");
      if (enunciado.replace(/_____/g, "").trim().length < 28) return;

      const candidatos = termos.filter(function (outro) {
        return outro.toLowerCase() !== termo.toLowerCase() &&
               enunciado.toLowerCase().indexOf(outro.toLowerCase()) === -1;
      });
      // prefere opções com tamanho parecido para tornar a questão justa
      candidatos.sort(function (a, b) {
        return Math.abs(a.length - termo.length) - Math.abs(b.length - termo.length);
      });
      const distratores = embaralhar(candidatos.slice(0, Math.min(8, candidatos.length))).slice(0, 3);
      if (distratores.length < 2) return;

      usados.push(termo.toLowerCase());
      adicionar({
        tipo: "complete",
        enunciado: cortar(enunciado, limiteEnunciado),
        opcoes: embaralhar([termo].concat(distratores)),
        correta: termo,
        explicacao: cortar(frase, 260)
      });
    });

    // uma questão de verdadeiro/falso, com resposta sorteada (nem sempre "Falso")
    if (perguntas.length < quantidade) {
      for (let i = 0; i < candidatas.length && perguntas.length < quantidade; i++) {
        const frase = candidatas[i];
        if (perguntas.some(function (q) { return String(q.explicacao).indexOf(frase) !== -1; })) continue;
        const termo = escolherTermo(frase, termos, []);
        const outro = termos.find(function (t) { return t.toLowerCase() !== (termo || "").toLowerCase(); });
        if (!termo || !outro) continue;
        const falsa = frase.replace(new RegExp("\\b" + escaparRegex(termo) + "\\b", "i"), outro);
        if (falsa === frase) continue;
        const verdadeiro = Math.random() < 0.5;
        adicionar({
          tipo: "vf",
          enunciado: cortar(verdadeiro ? frase : falsa, limiteEnunciado),
          opcoes: ["Verdadeiro", "Falso"],
          correta: verdadeiro ? "Verdadeiro" : "Falso",
          explicacao: "Afirmação correta: " + cortar(frase, 250)
        });
        break;
      }
    }

    // último recurso: perguntas sobre os títulos das seções, para nenhuma aula ficar sem quiz
    if (perguntas.length < Math.min(2, quantidade)) {
      const titulos = blocos.map(function (b) { return limparTexto(b.titulo); })
        .filter(function (t) { return t && t !== "Visão geral" && t.length >= 5 && t.length <= 70; });
      titulos.forEach(function (titulo) {
        if (perguntas.length >= Math.min(2, quantidade)) return;
        const contexto = frases.find(function (f) { return f.toLowerCase().indexOf(titulo.toLowerCase()) !== -1; }) ||
                         titulos.find(function (t) { return t !== titulo; }) || "";
        const distratores = embaralhar(titulos.filter(function (t) { return t.toLowerCase() !== titulo.toLowerCase(); })).slice(0, 3);
        if (distratores.length < 2) return;
        adicionar({
          tipo: "conceito",
          enunciado: cortar("Qual dos temas abaixo melhor descreve este trecho: “" + contexto + "”?", limiteEnunciado),
          opcoes: embaralhar([titulo].concat(distratores)),
          correta: titulo,
          explicacao: "O trecho está relacionado a " + titulo + "."
        });
      });
    }

    return embaralhar(perguntas).slice(0, quantidade);
  }

  function gerarFlashcards(blocos, termos, quantidade) {
    if (!quantidade) return [];
    const cartoes = [];
    const frases = [];
    blocos.forEach(function (bloco) {
      bloco.paragrafos.forEach(function (p) { frases.push.apply(frases, dividirFrases(p)); });
    });

    termos.forEach(function (termo) {
      if (cartoes.length >= quantidade) return;
      const regex = new RegExp("\\b" + escaparRegex(termo) + "\\b", "i");
      const frase = frases.find(function (f) { return regex.test(f); });
      if (!frase) return;
      cartoes.push({ frente: termo, verso: cortar(frase, 210) });
    });

    if (cartoes.length < quantidade) {
      blocos.forEach(function (bloco) {
        if (cartoes.length >= quantidade) return;
        if (bloco.titulo === "Visão geral") return;
        const verso = bloco.paragrafos[0] ? cortar(dividirFrases(bloco.paragrafos[0])[0] || bloco.paragrafos[0], 210) : "";
        if (verso) cartoes.push({ frente: bloco.titulo, verso: verso });
      });
    }

    const vistos = {};
    return cartoes.filter(function (cartao) {
      const chave = cartao.frente.toLowerCase();
      if (vistos[chave]) return false;
      vistos[chave] = true;
      return true;
    }).slice(0, quantidade);
  }

  /* ------------------------------ Montagem do curso */
  function distribuirBlocos(blocos, alvo) {
    const validos = blocos.filter(function (b) {
      const tamanho = b.paragrafos.join(" ") + " " + b.listas.join(" ");
      return tamanho.trim().length > 90;
    });
    const usaveis = validos.length ? validos : blocos;
    const n = Math.max(1, Math.min(alvo, usaveis.length));
    const peso = function (b) { return b.paragrafos.join(" ").length + b.listas.join(" ").length * 0.5; };
    const total = usaveis.reduce(function (soma, b) { return soma + peso(b); }, 0) || 1;

    const grupos = [];
    for (let i = 0; i < n; i++) grupos.push([]);
    let acumulado = 0, indice = 0;
    usaveis.forEach(function (bloco) {
      grupos[indice].push(bloco);
      acumulado += peso(bloco);
      if (indice < n - 1 && acumulado >= total * (indice + 1) / n) indice++;
    });
    return grupos.filter(function (g) { return g.length > 0; });
  }

  function gerarCurso(pagina, prefs) {
    const blocos = extrairConteudo(pagina.html);
    if (!blocos.length) throw new Error("Não conseguimos ler o conteúdo deste assunto. Tente outro termo.");

    // A profundidade define a quantidade de aulas (como prometido na interface).
    // A duração de cada aula define a densidade de perguntas e flashcards.
    const alvo = prefs.profundidade === "resumo" ? 3 : (prefs.profundidade === "profundo" ? 8 : 5);

    const grupos = distribuirBlocos(blocos, alvo);
    const termos = extrairTermos(blocos);
    let qtdQuiz = prefs.quiz ? (Number(prefs.duracao) === 10 ? 3 : (Number(prefs.duracao) === 30 ? 6 : 4)) : 0;
    if (prefs.nivel === "iniciante") qtdQuiz = Math.min(qtdQuiz, 3);
    if (prefs.nivel === "avancado") qtdQuiz = Math.min(7, qtdQuiz + 1);
    if (prefs.quiz) qtdQuiz = Math.max(2, qtdQuiz);
    const qtdFlash = prefs.flashcards
      ? (prefs.nivel === "iniciante" ? 6 : (prefs.nivel === "avancado" ? 10 : 8))
      : 0;
    const qtdPontos = prefs.nivel === "avancado" ? 7 : (prefs.nivel === "iniciante" ? 4 : 5);
    const tamanhoResumo = prefs.nivel === "iniciante" ? 1 : (prefs.nivel === "avancado" ? 3 : 2);

    const aulas = grupos.map(function (grupo, indice) {
      const texto = grupo.map(function (b) { return b.paragrafos.join(" "); }).join(" ");
      const titulo = indice === 0 && grupo[0].titulo === "Visão geral"
        ? pagina.titulo
        : grupo[0].titulo;

      const secoes = grupo.map(function (b) {
        return {
          titulo: b.titulo,
          paragrafos: b.paragrafos,
          listas: b.listas
        };
      });

      const objetivos = secoes.slice(0, 3).map(function (s) {
        return s.titulo === "Visão geral"
          ? "Conhecer os aspectos básicos de " + pagina.titulo
          : "Compreender: " + s.titulo.toLowerCase();
      });

      const resumo = extrairPontosChave(texto, tamanhoResumo, prefs.foco).join(" ");
      const pontos = extrairPontosChave(texto, qtdPontos, prefs.foco);
      const quiz = gerarQuiz(grupo, termos, qtdQuiz, prefs.foco, prefs.nivel);
      const flashcards = gerarFlashcards(grupo, termos, qtdFlash);

      return {
        id: "aula_" + indice + "_" + Math.random().toString(36).slice(2, 7),
        titulo: titulo,
        tempo: prefs.duracao,
        secoes: secoes,
        objetivos: objetivos,
        resumo: resumo || cortar(texto, 260),
        pontos: pontos,
        quiz: quiz,
        flashcards: flashcards
      };
    });

    return {
      id: "curso_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      titulo: pagina.titulo,
      assunto: prefs.tema,
      idioma: prefs.idioma,
      nivel: prefs.nivel,
      profundidade: prefs.profundidade,
      duracao: prefs.duracao,
      foco: prefs.foco,
      meta: prefs.meta,
      cor: prefs.cor,
      criadoEm: Date.now(),
      offline: !!pagina.offline,
      fonte: { titulo: pagina.titulo, url: pagina.url },
      fontesExtras: extrairFontesExtras(pagina.html, pagina.url),
      imagem: prefs.imagens ? pagina.imagem : null,
      aulas: aulas
    };
  }

  /* ------------------------------ Modo offline (sem internet) */
  function montarHtml(secoes) {
    return "<div>" + secoes.map(function (s) {
      return "<h2>" + s.titulo + "</h2>" + s.paragrafos.map(function (p) { return "<p>" + p + "</p>"; }).join("");
    }).join("") + "</div>";
  }

  function paginaOffline(titulo, secoes) {
    return {
      titulo: titulo,
      url: "",
      imagem: null,
      html: montarHtml(secoes),
      idioma: "pt",
      offline: true
    };
  }

  function conteudoOffline(termo) {
    const chave = termo.toLowerCase();
    if (/foto|plant|clorofil/.test(chave)) {
      return paginaOffline("Fotossíntese", [
        { titulo: "Visão geral", paragrafos: [
          "A fotossíntese é o processo pelo qual plantas, algas e algumas bactérias convertem energia luminosa em energia química. Esse processo usa água e dióxido de carbono para produzir glicose e oxigênio.",
          "A reação ocorre principalmente nos cloroplastos, organelas que contêm clorofila, o pigmento responsável por absorver a luz solar. A equação geral envolve 6 moléculas de água e 6 de dióxido de carbono, gerando glicose e 6 de oxigênio."
        ]},
        { titulo: "Fases do processo", paragrafos: [
          "A fase clara acontece nos tilacoides e depende diretamente da luz. Nela, a água é quebrada, liberando oxigênio e gerando ATP e NADPH como forma de energia química.",
          "A fase escura, ou ciclo de Calvin, ocorre no estroma e não precisa de luz diretamente. Ela usa ATP e NADPH para fixar o dióxido de carbono e produzir açúcares."
        ]},
        { titulo: "Importância", paragrafos: [
          "A fotossíntese é a base da maior parte das cadeias alimentares do planeta. Ela produz o oxigênio que respiramos e armazena energia na forma de matéria orgânica.",
          "Além disso, o processo remove dióxido de carbono da atmosfera, influenciando diretamente o clima e o equilíbrio dos ecossistemas."
        ]}
      ]);
    }
    if (/intelig| artificial| IA|machine learning/i.test(termo)) {
      return paginaOffline("Inteligência artificial", [
        { titulo: "Visão geral", paragrafos: [
          "Inteligência artificial é a área da computação que cria sistemas capazes de realizar tarefas normalmente associadas à inteligência humana, como raciocinar, aprender e reconhecer padrões.",
          "O termo ganhou força em 1956, na conferência de Dartmouth, e hoje está presente em buscadores, assistentes de voz, recomendações e veículos autônomos."
        ]},
        { titulo: "Como funciona", paragrafos: [
          "Sistemas de aprendizado de máquina treinam com grandes volumes de dados e ajustam seus parâmetros para melhorar o desempenho em uma tarefa específica.",
          "Redes neurais artificiais são inspiradas no cérebro humano e organizam camadas de unidades que processam informações progressivamente."
        ]},
        { titulo: "Aplicações e desafios", paragrafos: [
          "Entre as aplicações estão diagnósticos médicos, tradução automática, análise de imagens e robótica. Cada área exige cuidados com a qualidade dos dados usados no treinamento.",
          "Os principais desafios incluem viés nos modelos, falta de transparência nas decisões e o impacto das automações no mercado de trabalho."
        ]}
      ]);
    }
    if (/guerra fria/.test(chave)) {
      return paginaOffline("Guerra Fria", [
        { titulo: "Visão geral", paragrafos: [
          "A Guerra Fria foi um período de tensão geopolítica entre Estados Unidos e União Soviética e seus aliados, aproximadamente entre 1947 e 1991.",
          "Apesar do nome, não houve confronto militar direto em larga escala entre as duas superpotências. A disputa ocorreu em áreas como ideologia, economia, ciência e conflitos indiretos."
        ]},
        { titulo: "Origem e desenvolvimento", paragrafos: [
          "A doutrina de contenção dos Estados Unidos buscava impedir a expansão soviética, enquanto a URSS consolidava sua influência no leste europeu.",
          "A corrida armamentista e a corrida espacial tornaram-se símbolos da rivalidade, com eventos como o lançamento do Sputnik em 1957 e a crise dos mísseis de Cuba em 1962."
        ]},
        { titulo: "Fim e consequências", paragrafos: [
          "O processo de abertura política na União Soviética e a queda do Muro de Berlim em 1989 marcaram o fim do bloco socialista.",
          "Em 1991, a dissolução da União Soviética encerrou formalmente o período e reorganizou o cenário internacional."
        ]}
      ]);
    }
    // conteúdo genérico para qualquer outro assunto
    const assunto = termo.charAt(0).toUpperCase() + termo.slice(1);
    return paginaOffline(assunto, [
      { titulo: "Visão geral", paragrafos: [
        assunto + " é o tema escolhido para este estudo. Sem conexão com a internet, a Trilha usa um conteúdo de exemplo estruturado para mostrar como suas aulas serão organizadas.",
        "Ao voltar a ter conexão, o aplicativo consulta fontes públicas da web e substitui este conteúdo por informações reais e atualizadas sobre " + assunto + "."
      ]},
      { titulo: "Como estudar este assunto", paragrafos: [
        "Comece identificando os conceitos fundamentais e como eles se relacionam. Depois, procure exemplos concretos que mostrem esses conceitos na prática.",
        "Registre dúvidas nas anotações, use os flashcards para revisar termos e teste-se com o quiz ao final de cada aula."
      ]},
      { titulo: "Próximos passos", paragrafos: [
        "Após entender o básico, procure fontes adicionais, compare pontos de vista e tente explicar o assunto com suas próprias palavras.",
        "Estudar um pouco todos os dias costuma ser mais eficiente do que longas sessões isoladas de memorização."
      ]}
    ]);
  }

  return {
    gerarCurso: gerarCurso,
    conteudoOffline: conteudoOffline,
    extrairConteudo: extrairConteudo
  };
})();
