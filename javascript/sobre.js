/* =====================================================================
   SOBRE.JS · "Sobre a Ficha Ígnea" no painel social (amigos)
   Apresentação do criador, com o que o app foi feito e créditos/licenças.
   Para mudar os textos, edite o objeto SOBRE abaixo.
   ===================================================================== */
(function () {
  if (window._sobrePronto) return;
  window._sobrePronto = true;

  const SOBRE = {
    nome: "Leonardo José dos Santos",
    papel: "Criador da Ficha Ígnea",
    texto: [
      "Oi! Eu sou o Leonardo, e a Ficha Ígnea é o meu projeto.",
      "Criei o app pra deixar a ficha do jogador e a campanha do mestre mais fáceis de levar pra mesa: tudo num lugar só, sem papelada e sem precisar abrir livro no meio da sessão.",
      "Tem ideia, sugestão ou achou algum bug? Me chama, a Ficha Ígnea cresce junto com quem joga.",
    ],
    feitoCom: [
      ["ti-brand-html5", "HTML"],
      ["ti-brand-css3", "CSS"],
      ["ti-brand-javascript", "JavaScript"],
      ["ti-brand-firebase", "Firebase"],
      ["ti-icons", "Tabler Icons"],
      ["ti-typography", "Cinzel e EB Garamond"],
    ],
  };

  // Declaração exigida pelo SRD 5.2.1 — copiada sem alteração (não traduzir nem editar).
  const SRD_DECLARACAO =
    'This work includes material from the System Reference Document 5.2.1 (“SRD 5.2.1”) by Wizards of the Coast LLC, available at ' +
    '<a href="https://www.dndbeyond.com/srd" target="_blank" rel="noopener">https://www.dndbeyond.com/srd</a>. ' +
    "The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at " +
    '<a href="https://creativecommons.org/licenses/by/4.0/legalcode" target="_blank" rel="noopener">https://creativecommons.org/licenses/by/4.0/legalcode</a>.';

  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const versao = () => (typeof VERSAO_FICHA !== "undefined" ? VERSAO_FICHA : "");
  const iniciais = (n) => n.split(/\s+/).filter(Boolean).map((p) => p[0]).filter((c) => c === c.toUpperCase()).slice(0, 2).join("");

  function montar() {
    if (document.getElementById("sobreApp")) return;
    const ov = document.createElement("div");
    ov.id = "sobreAppOverlay";
    ov.onclick = fecharSobreApp;
    const el = document.createElement("div");
    el.id = "sobreApp";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Sobre a Ficha Ígnea");
    el.innerHTML = `
      <button type="button" class="sb-fechar" onclick="fecharSobreApp()" aria-label="Fechar">✕</button>

      <div class="sb-topo">
        <img src="logo-ficha-ignea.png" alt="" draggable="false">
        <h3>Ficha Ígnea</h3>
        <p>Fichas e campanhas de RPG de fantasia<br>Compatível com a quinta edição</p>
        ${versao() ? `<span class="sb-versao">versão ${esc(versao())}</span>` : ""}
      </div>

      <div class="sb-sec">
        <div class="sb-rot"><i></i><span>Quem fez</span><i></i></div>
        <div class="sb-autor">
          <span class="sb-av">${esc(iniciais(SOBRE.nome))}</span>
          <div><b>${esc(SOBRE.nome)}</b><small>${esc(SOBRE.papel)}</small></div>
        </div>
        ${SOBRE.texto.map((p) => `<p class="sb-texto">${esc(p)}</p>`).join("")}
      </div>

      <div class="sb-sec">
        <div class="sb-rot"><i></i><span>Feito com</span><i></i></div>
        <div class="sb-chips">${SOBRE.feitoCom.map(([ic, n]) => `<span><i class="ti ${ic}"></i>${esc(n)}</span>`).join("")}</div>
      </div>

      <div class="sb-sec">
        <div class="sb-rot"><i></i><span>Créditos e licenças</span><i></i></div>
        <div class="sb-cred">
          <h4>Regras, magias, itens e criaturas</h4>
          <p>Nomes em português e descrições escritos pela Ficha Ígnea a partir do SRD 5.2.1. Declaração da licença:</p>
          <blockquote lang="en">${SRD_DECLARACAO}</blockquote>
        </div>
        <div class="sb-cred">
          <h4>Ícones</h4>
          <p>Tabler Icons, licença MIT.</p>
        </div>
        <div class="sb-cred">
          <h4>Fontes</h4>
          <p>Cinzel e EB Garamond, via Google Fonts, licença SIL Open Font License.</p>
        </div>
        <div class="sb-cred">
          <h4>Login e nuvem</h4>
          <p>Firebase, do Google.</p>
        </div>
      </div>

      <p class="sb-legal"><a href="termos.html" target="_blank" rel="noopener">Termos de Uso</a> · <a href="privacidade.html" target="_blank" rel="noopener">Política de Privacidade</a></p>
      <p class="sb-rodape">Ficha Ígnea © ${new Date().getFullYear()} ${esc(SOBRE.nome)}.<br>App independente, feito no Brasil.</p>`;
    document.body.append(ov, el);
  }

  window.abrirSobreApp = function () {
    montar();
    const ov = document.getElementById("sobreAppOverlay"), el = document.getElementById("sobreApp");
    ov.style.display = "block";
    el.style.display = "block";
    el.scrollTop = 0;
    requestAnimationFrame(() => { ov.classList.add("aberto"); el.classList.add("aberto"); });
  };
  window.fecharSobreApp = function () {
    const ov = document.getElementById("sobreAppOverlay"), el = document.getElementById("sobreApp");
    if (!el) return;
    ov.classList.remove("aberto");
    el.classList.remove("aberto");
    setTimeout(() => { ov.style.display = "none"; el.style.display = "none"; }, 260);
  };
  document.addEventListener("keydown", (e) => {
    const el = document.getElementById("sobreApp");
    if (e.key === "Escape" && el && el.style.display === "block") fecharSobreApp();
  });

  /* botão no rodapé do painel social */
  function ligarBotao() {
    const painel = document.getElementById("painelAmigos");
    if (!painel || painel.querySelector(".am-sobre")) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "am-sobre";
    b.innerHTML = `<i class="ti ti-info-circle"></i><span>Sobre a Ficha Ígnea</span><i class="ti ti-chevron-right"></i>`;
    b.onclick = abrirSobreApp;
    painel.appendChild(b);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ligarBotao);
  else ligarBotao();
  window.addEventListener("load", ligarBotao);
})();