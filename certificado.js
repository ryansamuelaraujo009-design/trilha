/* ============================================================
   certificado.js — Certificado imprimível e exportável em PNG
   ============================================================ */
window.TrilhaCertificado = (function () {
  "use strict";

  function esc(texto) {
    return String(texto === null || texto === undefined ? "" : texto)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function dataFormatada(iso) {
    const d = new Date(iso || Date.now());
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  }

  function html(cert) {
    if (!cert) return "";
    return '<div class="certificado-papel" id="certificado-papel">' +
      '<div class="cert-moldura">' +
        '<div class="cert-marca"><span class="cert-selo">🎓</span><strong>trilha<span class="brand-dot">.</span></strong></div>' +
        '<div class="cert-titulo">Certificado de conclusão</div>' +
        '<p class="cert-intro">Certificamos que</p>' +
        '<h2 class="cert-aluno">' + esc(cert.aluno) + '</h2>' +
        '<p class="cert-corpo">concluiu com êxito o curso <strong>' + esc(cert.titulo) + '</strong>, ' +
          'composto por ' + esc(cert.aulas) + ' aulas, com carga horária de ' + esc(cert.carga) + ' ' +
          'e dedicação no nível ' + esc(cert.nivel) + '.</p>' +
        '<p class="cert-corpo cert-motivacao">O conhecimento adquirido é um passo a mais na jornada de aprendizado contínuo.</p>' +
        '<div class="cert-detalhes">' +
          '<div><small>Data de emissão</small><strong>' + esc(dataFormatada(cert.emissao)) + "</strong></div>" +
          '<div><small>Carga horária</small><strong>' + esc(cert.carga) + "</strong></div>" +
          '<div><small>Conclusão</small><strong>' + esc(cert.aulas) + " aulas</strong></div>" +
        "</div>" +
        '<div class="cert-rodape"><span class="cert-linha-assinatura">Trilha — Plataforma de estudos</span>' +
          "<small>Código de validação: " + esc(cert.codigo) + "</small></div>" +
      "</div></div>";
  }

  function quebrarTexto(ctx, texto, x, y, larguraMax, alturaLinha) {
    const palavras = String(texto).split(/\s+/);
    let linha = "";
    palavras.forEach(function (palavra) {
      const teste = linha ? linha + " " + palavra : palavra;
      if (ctx.measureText(teste).width > larguraMax && linha) {
        ctx.fillText(linha, x, y);
        y += alturaLinha;
        linha = palavra;
      } else {
        linha = teste;
      }
    });
    if (linha) ctx.fillText(linha, x, y);
    return y;
  }

  function desenhar(cert, canvas) {
    const ctx = canvas.getContext("2d");
    const largura = canvas.width;
    const altura = canvas.height;
    const cor = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#6c5ce7";

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, largura, altura);
    ctx.strokeStyle = cor;
    ctx.lineWidth = 6;
    ctx.strokeRect(22, 22, largura - 44, altura - 44);
    ctx.strokeStyle = "#d9d3f5";
    ctx.lineWidth = 2;
    ctx.strokeRect(38, 38, largura - 76, altura - 76);

    ctx.textAlign = "center";
    ctx.fillStyle = cor;
    ctx.font = "800 24px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.fillText("🎓  TRILHA", largura / 2, 110);
    ctx.fillStyle = "#231f42";
    ctx.font = "800 40px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.fillText("CERTIFICADO DE CONCLUSÃO", largura / 2, 180);

    ctx.fillStyle = "#716c8d";
    ctx.font = "500 22px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.fillText("Certificamos que", largura / 2, 255);

    ctx.fillStyle = "#231f42";
    ctx.font = "800 52px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.fillText(cert.aluno || "Estudante", largura / 2, 330);

    ctx.strokeStyle = cor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(largura / 2 - 230, 355);
    ctx.lineTo(largura / 2 + 230, 355);
    ctx.stroke();

    ctx.fillStyle = "#4a4568";
    ctx.font = "500 24px 'Plus Jakarta Sans', Arial, sans-serif";
    quebrarTexto(ctx, "concluiu com êxito o curso " + (cert.titulo || "") + ", composto por " +
      (cert.aulas || 0) + " aulas, com carga horária de " + (cert.carga || "") +
      " e dedicação no nível " + (cert.nivel || "") + ".", largura / 2, 415, largura - 220, 38);

    ctx.fillStyle = "#716c8d";
    ctx.font = "500 20px 'Plus Jakarta Sans', Arial, sans-serif";
    quebrarTexto(ctx, "O conhecimento adquirido é um passo a mais na jornada de aprendizado contínuo.",
      largura / 2, 550, largura - 280, 32);

    ctx.fillStyle = "#231f42";
    ctx.font = "700 22px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.fillText(dataFormatada(cert.emissao), largura / 2, 655);

    ctx.strokeStyle = "#c9c4df";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(largura / 2 - 200, 700);
    ctx.lineTo(largura / 2 + 200, 700);
    ctx.stroke();
    ctx.fillStyle = "#716c8d";
    ctx.font = "600 18px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.fillText("Trilha — Plataforma de estudos", largura / 2, 730);
    ctx.font = "500 15px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.fillText("Código de validação: " + (cert.codigo || ""), largura / 2, 775);
  }

  function baixarPNG(cert) {
    if (!cert) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 850;
    desenhar(cert, canvas);
    canvas.toBlob(function (blob) {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "certificado-trilha-" + String(cert.cursoId || "curso").replace(/[^a-zA-Z0-9]/g, "") + ".png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }, "image/png");
  }

  return { html: html, desenhar: desenhar, baixarPNG: baixarPNG, dataFormatada: dataFormatada };
})();
