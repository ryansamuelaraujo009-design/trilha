/* ============================================================
   perfil.js — Conta local, gamificação e certificados da Trilha
   Todos os dados ficam neste navegador (localStorage).
   ============================================================ */
window.TrilhaPerfil = (function () {
  "use strict";

  const CHAVE = {
    usuario: "trilha.usuario.v1",
    sessao: "trilha.sessao.v1",
    stats: "trilha.stats.v1",
    dias: "trilha.dias.v1",
    certificados: "trilha.certificados.v1"
  };

  const AVATARES = ["🦊", "🐼", "🦉", "🐨", "🦁", "🐸", "🐙", "🦋", "🚀", "🎓", "🧠", "🌱"];

  const ESTATISTICAS_PADRAO = {
    xp: 0,
    totalAulas: 0,
    totalQuiz: 0,
    totalCursos: 0,
    totalFlash: 0,
    quizPerfeitos: 0,
    cursosDistintos: [],
    maxSequencia: 0,
    conquistas: []
  };

  const CONQUISTAS = [
    { id: "primeira-aula", emoji: "🌱", nome: "Primeiro passo", descricao: "Conclua sua primeira aula", meta: 1, tipo: "aulas" },
    { id: "quiz-perfeito", emoji: "🎯", nome: "Mente afiada", descricao: "Acerte 100% de um quiz", meta: 1, tipo: "quizPerfeitos" },
    { id: "dez-aulas", emoji: "📚", nome: "Estudioso", descricao: "Conclua 10 aulas", meta: 10, tipo: "aulas" },
    { id: "curso-concluido", emoji: "🏆", nome: "Curso completo", descricao: "Termine um curso inteiro", meta: 1, tipo: "cursos" },
    { id: "sequencia-3", emoji: "🔥", nome: "Em ritmo", descricao: "Estude 3 dias seguidos", meta: 3, tipo: "sequencia" },
    { id: "sequencia-7", emoji: "⚡", nome: "Imparável", descricao: "Estude 7 dias seguidos", meta: 7, tipo: "sequencia" },
    { id: "cartoes-50", emoji: "🃏", nome: "Memória de elefante", descricao: "Revise 50 flashcards", meta: 50, tipo: "flash" },
    { id: "explorador", emoji: "🧭", nome: "Explorador", descricao: "Comece 3 cursos diferentes", meta: 3, tipo: "cursosDistintos" },
    { id: "xp-500", emoji: "⭐", nome: "Estrela da Trilha", descricao: "Alcance 500 XP", meta: 500, tipo: "xp" },
    { id: "xp-1500", emoji: "👑", nome: "Mestre dos estudos", descricao: "Alcance 1500 XP", meta: 1500, tipo: "xp" }
  ];

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

  function notificar() {
    document.dispatchEvent(new CustomEvent("trilha:perfil", { detail: resumo() }));
  }

  function dataLocal(data) {
    const d = data || new Date();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + mes + "-" + dia;
  }

  function somarDias(chave, quantidade) {
    const partes = chave.split("-").map(Number);
    const d = new Date(partes[0], partes[1] - 1, partes[2]);
    d.setDate(d.getDate() + quantidade);
    return dataLocal(d);
  }

  /* ------------------------------ Conta local */
  // Hash simples apenas para não guardar a senha em texto puro.
  function hash(texto) {
    let h = 5381;
    const entrada = "trilha::" + String(texto);
    for (let i = 0; i < entrada.length; i++) h = ((h << 5) + h + entrada.charCodeAt(i)) | 0;
    return "h" + (h >>> 0).toString(36);
  }

  function usuario() {
    const u = ler(CHAVE.usuario, null);
    if (!u) return null;
    const copia = Object.assign({}, u);
    delete copia.senhaHash;
    return copia;
  }

  function logado() {
    const u = ler(CHAVE.usuario, null);
    return !!(u && ler(CHAVE.sessao, null) === u.email);
  }

  function criarConta(dados) {
    const nome = String(dados.nome || "").trim();
    const email = String(dados.email || "").trim().toLowerCase();
    const senha = String(dados.senha || "");
    if (nome.length < 2) throw new Error("Digite seu nome (mínimo de 2 letras).");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Digite um e-mail válido.");
    if (senha.length < 4) throw new Error("A senha precisa ter pelo menos 4 caracteres.");
    const atual = ler(CHAVE.usuario, null);
    if (atual && atual.email === email) throw new Error("Já existe um perfil com este e-mail neste navegador.");

    salvar(CHAVE.usuario, {
      nome: nome,
      email: email,
      senhaHash: hash(senha),
      avatar: dados.avatar || AVATARES[0],
      bio: String(dados.bio || "").slice(0, 220),
      metaDiaria: Number(dados.metaDiaria) || 2,
      lembrete: !!dados.lembrete,
      criadoEm: Date.now()
    });
    salvar(CHAVE.sessao, email);
    notificar();
    return usuario();
  }

  function entrar(email, senha) {
    const u = ler(CHAVE.usuario, null);
    if (!u) throw new Error("Ainda não existe um perfil neste navegador. Crie um primeiro.");
    if (u.email !== String(email || "").trim().toLowerCase()) throw new Error("E-mail não encontrado.");
    if (u.senhaHash !== hash(senha)) throw new Error("Senha incorreta.");
    salvar(CHAVE.sessao, u.email);
    notificar();
    return usuario();
  }

  function sair() {
    localStorage.removeItem(CHAVE.sessao);
    notificar();
  }

  function atualizar(dados) {
    const u = ler(CHAVE.usuario, null);
    if (!u) return null;
    const permitidos = ["nome", "avatar", "bio", "metaDiaria", "lembrete", "email"];
    permitidos.forEach(function (campo) {
      if (Object.prototype.hasOwnProperty.call(dados, campo) && dados[campo] !== undefined) u[campo] = dados[campo];
    });
    u.nome = String(u.nome || "").trim() || "Estudante";
    u.email = String(u.email || "").trim().toLowerCase();
    u.metaDiaria = Math.max(1, Math.min(9, Number(u.metaDiaria) || 2));
    salvar(CHAVE.usuario, u);
    salvar(CHAVE.sessao, u.email);
    notificar();
    return usuario();
  }

  /* ------------------------------ Gamificação */
  function stats() {
    const s = ler(CHAVE.stats, {});
    const base = Object.assign({}, ESTATISTICAS_PADRAO, s);
    base.cursosDistintos = Array.isArray(base.cursosDistintos) ? base.cursosDistintos : [];
    base.conquistas = Array.isArray(base.conquistas) ? base.conquistas : [];
    return base;
  }

  function nivelInfo(xp) {
    const limite = function (n) { return 50 * n * (n - 1); };
    let nivel = 1;
    while (nivel < 99 && xp >= limite(nivel + 1)) nivel++;
    return {
      nivel: nivel,
      atual: xp - limite(nivel),
      necessario: limite(nivel + 1) - limite(nivel),
      proximo: limite(nivel + 1)
    };
  }

  function sequencia() {
    const dias = ler(CHAVE.dias, {});
    let chave = dataLocal();
    if (!dias[chave]) chave = somarDias(chave, -1);
    if (!dias[chave]) return 0;
    let total = 0;
    while (dias[chave]) { total++; chave = somarDias(chave, -1); }
    return total;
  }

  function registrar(tipo, extra) {
    extra = extra || {};
    const s = stats();
    const dias = ler(CHAVE.dias, {});
    const hoje = dataLocal();
    if (!dias[hoje]) dias[hoje] = { aulas: 0, quiz: 0, flash: 0, xp: 0, minutos: 0 };
    const dia = dias[hoje];
    let ganho = 0;

    if (tipo === "aula") {
      ganho = 20 + (dia.aulas === 0 ? 5 : 0);
      s.totalAulas++;
      dia.aulas++;
      dia.minutos += Number(extra.minutos) || 0;
    } else if (tipo === "quiz") {
      const acertos = Number(extra.acertos) || 0;
      const total = Number(extra.total) || 0;
      ganho = acertos * 4 + (acertos === total && total > 0 ? 10 : 0);
      s.totalQuiz += total;
      dia.quiz += total;
      if (acertos === total && total > 0) s.quizPerfeitos++;
    } else if (tipo === "flashcards") {
      ganho = 5;
      s.totalFlash += Number(extra.quantidade) || 1;
      dia.flash += Number(extra.quantidade) || 1;
    } else if (tipo === "curso") {
      ganho = 40;
      s.totalCursos++;
      if (extra.cursoId && s.cursosDistintos.indexOf(extra.cursoId) === -1) s.cursosDistintos.push(extra.cursoId);
    }

    s.xp += ganho;
    dia.xp += ganho;
    const seq = sequencia();
    s.maxSequencia = Math.max(s.maxSequencia, seq);

    const antes = s.conquistas.slice();
    CONQUISTAS.forEach(function (c) {
      const valor = c.tipo === "aulas" ? s.totalAulas
        : c.tipo === "quizPerfeitos" ? s.quizPerfeitos
        : c.tipo === "cursos" ? s.totalCursos
        : c.tipo === "flash" ? s.totalFlash
        : c.tipo === "cursosDistintos" ? s.cursosDistintos.length
        : c.tipo === "xp" ? s.xp
        : seq;
      if (valor >= c.meta && s.conquistas.indexOf(c.id) === -1) s.conquistas.push(c.id);
    });

    salvar(CHAVE.stats, s);
    salvar(CHAVE.dias, dias);
    const novas = s.conquistas.filter(function (id) { return antes.indexOf(id) === -1; })
      .map(function (id) { return CONQUISTAS.find(function (c) { return c.id === id; }); }).filter(Boolean);
    notificar();
    return { ganho: ganho, nivel: nivelInfo(s.xp), novasConquistas: novas };
  }

  function resumo() {
    const s = stats();
    const u = usuario();
    const dias = ler(CHAVE.dias, {});
    const hoje = dias[dataLocal()] || { aulas: 0, quiz: 0, flash: 0, xp: 0, minutos: 0 };
    const meta = u ? u.metaDiaria : 2;
    const seq = sequencia();
    const nivel = nivelInfo(s.xp);
    const conquistas = CONQUISTAS.map(function (c) {
      return Object.assign({}, c, { conquistada: s.conquistas.indexOf(c.id) !== -1 });
    });
    const proxima = conquistas.find(function (c) { return !c.conquistada; }) || null;
    return {
      usuario: u,
      logado: logado(),
      stats: s,
      nivel: nivel,
      sequencia: seq,
      hoje: hoje,
      meta: meta,
      metaProgresso: Math.min(100, Math.round(hoje.aulas / meta * 100)),
      conquistas: conquistas,
      proximaConquista: proxima
    };
  }

  /* ------------------------------ Certificados */
  function emitirCertificado(curso) {
    const r = resumo();
    const certificado = {
      id: "cert_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      cursoId: curso.id,
      titulo: curso.titulo,
      aluno: r.usuario ? r.usuario.nome : "Estudante",
      nivel: curso.nivel || "—",
      carga: (curso.aulas.length * (Number(curso.duracao) || 20)) + " minutos",
      aulas: curso.aulas.length,
      emissao: new Date().toISOString(),
      codigo: "TRL-" + String(curso.id).replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase() + "-" +
              String(Date.now()).slice(-4)
    };
    const lista = ler(CHAVE.certificados, []);
    // Um curso = um certificado, mesmo que o aluno tenha editado o nome depois.
    const existente = lista.findIndex(function (c) { return c.cursoId === curso.id; });
    if (existente !== -1) lista.splice(existente, 1);
    lista.unshift(certificado);
    salvar(CHAVE.certificados, lista.slice(0, 20));
    notificar();
    return certificado;
  }

  function certificados() { return ler(CHAVE.certificados, []); }

  return {
    AVATARES: AVATARES,
    CONQUISTAS: CONQUISTAS,
    usuario: usuario,
    logado: logado,
    criarConta: criarConta,
    entrar: entrar,
    sair: sair,
    atualizar: atualizar,
    registrar: registrar,
    resumo: resumo,
    dias: function () { return ler(CHAVE.dias, {}); },
    emitirCertificado: emitirCertificado,
    certificados: certificados,
    dataLocal: dataLocal
  };
})();
