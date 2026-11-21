/* ============================================================
   api.js — Integração com as APIs públicas da Wikimedia
   Nenhuma chave de API é necessária (CORS habilitado via origin=*).
   ============================================================ */
window.TrilhaAPI = (function () {
  "use strict";

  const DOMINIOS = {
    pt: "pt.wikipedia.org",
    en: "en.wikipedia.org",
    es: "es.wikipedia.org",
    fr: "fr.wikipedia.org",
    de: "de.wikipedia.org"
  };

  const TIMEOUT_MS = 14000;

  function urlBase(idioma) {
    return "https://" + (DOMINIOS[idioma] || DOMINIOS.pt) + "/w/api.php";
  }

  /** Faz uma requisição GET à API da Wikipedia. */
  async function request(parametros, idioma) {
    const url = new URL(urlBase(idioma));
    Object.keys(parametros).forEach(function (chave) {
      url.searchParams.set(chave, parametros[chave]);
    });
    url.searchParams.set("format", "json");
    url.searchParams.set("formatversion", "2");
    url.searchParams.set("origin", "*");

    const controlador = new AbortController();
    const temporizador = setTimeout(function () { controlador.abort(); }, TIMEOUT_MS);

    try {
      const resposta = await fetch(url.toString(), {
        signal: controlador.signal,
        headers: { Accept: "application/json" }
      });
      if (!resposta.ok) throw new Error("HTTP " + resposta.status);
      const dados = await resposta.json();
      if (dados.error) throw new Error(dados.error.info || "Erro na API");
      return dados;
    } catch (erro) {
      if (erro.name === "AbortError") throw new Error("Tempo limite ao consultar a fonte.");
      if (erro instanceof TypeError) throw new Error("Sem conexão com a internet.");
      throw erro;
    } finally {
      clearTimeout(temporizador);
    }
  }

  /** Sugestões de assuntos enquanto o usuário digita. */
  async function sugerir(termo, idioma) {
    if (!termo || termo.trim().length < 2) return [];
    // A Wikimedia mantém o módulo opensearch como action própria.
    // (action=query&list=opensearch foi descontinuado e passou a devolver avisos.)
    const dados = await request({
      action: "opensearch",
      search: termo.trim(),
      limit: 7,
      namespace: 0
    }, idioma);
    return (dados[1] || []).slice(0, 7);
  }

  /** Encontra a página mais provável para o termo digitado. */
  async function resolverPagina(termo, idioma) {
    const dados = await request({
      action: "query",
      titles: termo.trim(),
      redirects: 1,
      prop: "info"
    }, idioma);

    const pagina = dados.query && dados.query.pages && dados.query.pages[0];
    if (pagina && !pagina.missing) return { titulo: pagina.title, pageid: pagina.pageid };

    const busca = await request({
      action: "query",
      list: "search",
      srsearch: termo.trim(),
      srlimit: 1
    }, idioma);
    const primeiro = busca.query && busca.query.search && busca.query.search[0];
    if (primeiro) return { titulo: primeiro.title, pageid: primeiro.pageid };
    throw new Error("Nenhum assunto encontrado para “" + termo + "”.");
  }

  /** Busca o conteúdo completo de um assunto. */
  async function buscarConteudo(termo, idioma) {
    idioma = idioma || "pt";
    const resolvida = await resolverPagina(termo, idioma);

    const [dadosHtml, dadosInfo] = await Promise.all([
      request({
        action: "parse",
        pageid: resolvida.pageid,
        prop: "text|sections"
      }, idioma),
      request({
        action: "query",
        pageids: resolvida.pageid,
        prop: "pageimages|info",
        piprop: "thumbnail|original",
        pithumbsize: 900,
        inprop: "url"
      }, idioma)
    ]);

    const paginaInfo = dadosInfo.query.pages[0];
    const imagem = (paginaInfo.thumbnail && paginaInfo.thumbnail.source) ||
                   (paginaInfo.original && paginaInfo.original.source) || null;
    const html = (dadosHtml.parse && dadosHtml.parse.text) || "";

    return {
      titulo: resolvida.titulo,
      url: paginaInfo.fullurl || ("https://" + DOMINIOS[idioma] + "/wiki/" + encodeURIComponent(resolvida.titulo.replace(/ /g, "_"))),
      imagem: imagem,
      html: html,
      secoes: (dadosHtml.parse && dadosHtml.parse.sections) || [],
      idioma: idioma
    };
  }

  return {
    sugerir: sugerir,
    buscarConteudo: buscarConteudo,
    idiomas: DOMINIOS
  };
})();
