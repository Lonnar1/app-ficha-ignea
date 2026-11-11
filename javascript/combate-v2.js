/* =====================================================================
   COMBATE v2
   - vida com a faixa Domínio · Exaustão · Morte
   - abas Armas · Armaduras · Resistências com cards compactos
   - nova arma / armadura / item num painel que sobe de baixo
   - resistências prontas (toque troca: resistente → imune → vulnerável)
   ===================================================================== */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const esc2 = (t) => (typeof esc === "function" ? esc(t) : String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]));
  const listaArmas = () => (typeof armas !== "undefined" ? armas : []);
  const listaArmaduras = () => (typeof armaduras !== "undefined" ? armaduras : []);
  const listaItens = () => (typeof inventario !== "undefined" ? inventario : []);
  const fichaAtual = () => (typeof personagens !== "undefined" && typeof personagemAtual !== "undefined" && personagemAtual !== null ? personagens[personagemAtual] : null);

  /* ---------------- abas Armas · Armaduras · Resistências ---------------- */
  window.cb2Painel = function (qual) {
    document.querySelectorAll("#cb2Seg button").forEach((b) => b.classList.toggle("on", b.dataset.painel === qual));
    document.querySelectorAll("#combate .cb2-painel").forEach((p) => p.classList.toggle("on", p.dataset.painel === qual));
    if (qual === "resist") cb2RenderResist();
  };

  function contar() {
    const n = (id, v) => { const el = $(id); if (el) el.textContent = v ? String(v) : ""; };
    n("cb2NArmas", listaArmas().length);
    n("cb2NArmaduras", listaArmaduras().length);
    n("cb2NResist", contarResist());
  }

  /* ---------------- cards compactos ---------------- */
  const abertos = { arma: new Set(), armadura: new Set() };

  function bolinhasCargas(obj, index, fn) {
    if (!obj.temCargas || !(obj.maxCargas > 0)) return "";
    return `<span class="cb2-carg">${Array.from({ length: obj.maxCargas }, (_, i) =>
      `<i class="${obj.cargasGastas?.[i] ? "on" : ""}" onclick="event.stopPropagation(); ${fn}(${index}, ${i})"></i>`).join("")}</span>`;
  }

  function iconeCard(obj, ico) {
    return obj.imagemUrl
      ? `<span class="cb2-ic drag-handle" style="background-image:url('${esc2(obj.imagemUrl)}')" aria-label="Arrastar para reordenar"></span>`
      : `<span class="cb2-ic drag-handle" aria-label="Arrastar para reordenar"><i class="ti ${ico}"></i></span>`;
  }

  function sintoniaTag(obj) {
    if (!obj.requerSintonia) return "";
    return `<span class="cb2-sint ${obj.sintonizado ? "on" : ""}">${obj.sintonizado ? "Sintonizado" : "Sintonia"}</span>`;
  }

  function detalhesHTML(obj) {
    const mods = typeof modsChipsHTML === "function" ? modsChipsHTML(obj.modificacoes) : "";
    const desc = obj.desc ? `<p class="cb2-desc">${esc2(obj.desc)}</p>` : "";
    return mods + desc;
  }

  function armaNumeros(arma) {
    const usa = typeof armaUsaCalculo === "function" && armaUsaCalculo(arma);
    const sep = typeof separarDanoArma === "function" ? separarDanoArma(arma) : { expr: arma.dano || "", tipo: "" };
    const atk = usa ? fmtBonus(calcAtaqueArma(arma).total) : "";
    return { atk, dano: sep.expr || "", tipo: sep.tipo || "", usa };
  }

  function subArma(arma) {
    const partes = [];
    const n = armaNumeros(arma);
    if (n.usa && arma.atributoAtaque && typeof NOMES_ATRIBUTO !== "undefined") partes.push(NOMES_ATRIBUTO[arma.atributoAtaque]);
    if (n.tipo) partes.push(n.tipo);
    const qm = (arma.modificacoes || []).length;
    if (qm) partes.push(qm === 1 ? "1 mod" : qm + " mods");
    return partes.join(" · ") || (arma.desc ? arma.desc : "Toque pra ver");
  }

  function renderArmasV2() {
    const ul = $("listaArmas");
    if (!ul) return;
    ul.innerHTML = "";
    listaArmas().forEach((arma, index) => {
      const n = armaNumeros(arma);
      const li = document.createElement("li");
      li.className = "cb2-card arma-card" + (abertos.arma.has(index) ? " aberto" : "");
      li.dataset.index = index;
      const temDano = typeof extrairDados === "function" && extrairDados(arma.dano);
      li.innerHTML = `
        <div class="cb2-linha" onclick="cb2Abrir('arma', ${index})">
          ${iconeCard(arma, "ti-sword")}
          <div class="cb2-t">
            <b>${esc2(arma.nome) || "Sem nome"} ${sintoniaTag(arma)}</b>
            <small>${esc2(subArma(arma))}</small>
            ${bolinhasCargas(arma, index, "toggleCargaArma")}
          </div>
          <div class="cb2-num">${n.atk ? `<b>${n.atk}</b>` : ""}<small>${esc2(n.dano || "—")}</small></div>
          <i class="cb2-chev ti ti-chevron-down" onclick="event.stopPropagation(); cb2Fechar('arma', ${index})"></i>
        </div>
        <div class="cb2-mais">
          ${detalhesHTML(arma)}
          <div class="cb2-acoes">
            <button type="button" class="cb2-a forte" onclick="rolarAtaqueArma(${index})"><i class="ti ti-dice-5"></i> Atacar</button>
            ${temDano ? `<button type="button" class="cb2-a forte" onclick="rolarDanoArma(${index})"><i class="ti ti-droplet"></i> Dano</button>` : ""}
            <span class="cb2-acoes-ico">
              <button type="button" class="cb2-i" onclick="window.abrirDarItem('armas', ${index})" title="Dar" aria-label="Dar"><i class="ti ti-gift"></i></button>
              <button type="button" class="cb2-i" onclick="editarArma(${index})" title="Editar" aria-label="Editar"><i class="ti ti-pencil"></i></button>
              <button type="button" class="cb2-i perigo" onclick="cb2Remover('arma', ${index})" title="Remover" aria-label="Remover"><i class="ti ti-trash"></i></button>
            </span>
          </div>
        </div>`;
      ul.appendChild(li);
    });
    if (typeof habilitarArrastarReordenar === "function") habilitarArrastarReordenar(ul, listaArmas(), renderArmasV2);
    contar();
  }

  function renderArmadurasV2() {
    const ul = $("listaArmaduras");
    if (!ul) return;
    ul.innerHTML = "";
    listaArmaduras().forEach((a, index) => {
      const li = document.createElement("li");
      li.className = "cb2-card armadura-card" + (abertos.armadura.has(index) ? " aberto" : "");
      li.dataset.index = index;
      const qm = (a.modificacoes || []).length;
      const sub = [qm ? (qm === 1 ? "1 mod" : qm + " mods") : "", a.desc || ""].filter(Boolean).join(" · ") || "Toque pra ver";
      li.innerHTML = `
        <div class="cb2-linha" onclick="cb2Abrir('armadura', ${index})">
          ${iconeCard(a, "ti-shield")}
          <div class="cb2-t">
            <b>${esc2(a.nome) || "Sem nome"} ${sintoniaTag(a)}</b>
            <small>${esc2(sub)}</small>
            ${bolinhasCargas(a, index, "toggleCargaArmadura")}
          </div>
          <div class="cb2-num"><b>${esc2(a.ca) || "—"}</b><small>CA</small></div>
          <i class="cb2-chev ti ti-chevron-down" onclick="event.stopPropagation(); cb2Fechar('armadura', ${index})"></i>
        </div>
        <div class="cb2-mais">
          ${detalhesHTML(a)}
          <div class="cb2-acoes">
            <button type="button" class="cb2-a" onclick="verArmadura(${index})"><i class="ti ti-eye"></i> Ver tudo</button>
            <span class="cb2-acoes-ico">
              <button type="button" class="cb2-i" onclick="window.abrirDarItem('armaduras', ${index})" title="Dar" aria-label="Dar"><i class="ti ti-gift"></i></button>
              <button type="button" class="cb2-i" onclick="editarArmadura(${index})" title="Editar" aria-label="Editar"><i class="ti ti-pencil"></i></button>
              <button type="button" class="cb2-i perigo" onclick="cb2Remover('armadura', ${index})" title="Remover" aria-label="Remover"><i class="ti ti-trash"></i></button>
            </span>
          </div>
        </div>`;
      ul.appendChild(li);
    });
    if (typeof habilitarArrastarReordenar === "function") habilitarArrastarReordenar(ul, listaArmaduras(), renderArmadurasV2);
    contar();
  }

  window.cb2Abrir = function (tipo, index) {
    const set = abertos[tipo];
    const ul = $(tipo === "arma" ? "listaArmas" : "listaArmaduras");
    const li = ul && ul.querySelector(`li[data-index="${index}"]`);
    if (set.has(index)) set.delete(index); else set.add(index);
    if (li) li.classList.toggle("aberto", set.has(index));
  };

  window.cb2Remover = async function (tipo, index) {
    abertos[tipo].clear();
    if (tipo === "arma") await removerArma(index);
    else await removerArmadura(index);
  };

  // troca os renders antigos pelos novos (as outras funções chamam pelo nome global)
  window.renderArmas = renderArmasV2;
  window.renderArmaduras = renderArmadurasV2;
  try { renderArmas = renderArmasV2; } catch (e) {}
  try { renderArmaduras = renderArmadurasV2; } catch (e) {}
  // quando atributo ou proficiência mudam, só redesenha os números
  window.atualizarCalculosArmas = function () {
    document.querySelectorAll("#listaArmas li.cb2-card").forEach((li) => {
      const arma = listaArmas()[parseInt(li.dataset.index)];
      const box = li.querySelector(".cb2-num");
      if (!arma || !box) return;
      const n = armaNumeros(arma);
      box.innerHTML = `${n.atk ? `<b>${n.atk}</b>` : ""}<small>${esc2(n.dano || "—")}</small>`;
    });
  };
  try { atualizarCalculosArmas = window.atualizarCalculosArmas; } catch (e) {}

  /* ---------------- painel que sobe de baixo ---------------- */
  let sheetAberta = null;
  let fundo = null;

  function prepararSheets() {
    fundo = document.createElement("div");
    fundo.className = "cb2-fundo";
    fundo.addEventListener("click", () => cb2FecharSheet());
    document.body.appendChild(fundo);
    ["cb2Sheet-arma", "cb2Sheet-armadura", "cb2Sheet-estado", "boxItensForm", "cb2Sheet-diario", "boxMapasForm"].forEach((id) => {
      const sh = $(id);
      if (!sh) return;
      document.body.appendChild(sh); // fora das abas (elas animam com transform)
      // extras: cada linha abre e fecha ali mesmo
      sh.querySelectorAll(".cb2-ex[data-det] > .cb2-ex-cab").forEach((cab) => {
        cab.addEventListener("click", () => {
          const ex = cab.parentElement;
          ex.classList.toggle("on");
          if (ex.classList.contains("on")) setTimeout(() => ex.scrollIntoView({ block: "nearest", behavior: "smooth" }), 40);
        });
      });
      // linha com chave: o cartão inteiro acende quando ligado
      sh.querySelectorAll(".cb2-ex-sw > .cb2-ex-cab input[type=checkbox]").forEach((c) => {
        c.addEventListener("change", () => c.closest(".cb2-ex").classList.toggle("ligado", c.checked));
      });
      // arrastar o puxador pra baixo fecha
      const cab = sh.querySelector(".cb2-puxa");
      let y0 = null;
      [cab, sh.querySelector(".cb2-sh-cab")].forEach((el) => {
        if (!el) return;
        el.addEventListener("pointerdown", (e) => { y0 = e.clientY; });
        el.addEventListener("pointerup", (e) => { if (y0 !== null && e.clientY - y0 > 60) cb2FecharSheet(); y0 = null; });
      });
    });
  }

  function resetarSheet(sh) {
    sh.querySelectorAll(".cb2-ex[data-det]").forEach((d) => d.classList.remove("on"));
    sh.querySelectorAll(".cb2-ex-sw").forEach((d) => d.classList.toggle("ligado", !!d.querySelector(".cb2-ex-cab input[type=checkbox]")?.checked));
    [...sh.classList].filter((c) => c.startsWith("d-")).forEach((c) => sh.classList.remove(c));
    const corpo = sh.querySelector(".cb2-sh-corpo");
    if (corpo) corpo.scrollTop = 0;
  }

  // a linha fica aberta se já tiver algo preenchido nela
  function abrirDetalhesPreenchidos(sh) {
    const temValor = {
      desc: (ex) => (ex.querySelector("textarea")?.value || "").trim(),
      img: (ex) => ex.querySelector("img")?.style.display === "block",
      mods: (ex) => ex.querySelector(".mod-chip, .mods-lista li, .mods-chips span"),
    };
    sh.querySelectorAll(".cb2-ex[data-det]").forEach((ex) => {
      const f = temValor[ex.dataset.det];
      if (f && f(ex)) ex.classList.add("on");
    });
  }

  /* arma: o atributo vai do lado do dano e os bônus ficam num link */
  function arrumarAtaque() {
    const box = document.querySelector("#cb2Sheet-arma .arma-atk-box");
    if (!box || box.querySelector(".cb2-ajustar")) return;
    const link = document.createElement("button");
    link.type = "button";
    link.className = "cb2-ajustar";
    link.innerHTML = '<i class="ti ti-adjustments-horizontal"></i> Ajustar bônus e proficiência <i class="ti ti-chevron-down cb2-ex-seta"></i>';
    link.addEventListener("click", () => {
      const sh = $("cb2Sheet-arma");
      sh.classList.toggle("d-bonus");
      if (sh.classList.contains("d-bonus")) setTimeout(() => box.querySelector(".arma-atk-linha")?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 40);
    });
    const res = box.querySelector(".arma-atk-resultado");
    if (res) res.insertAdjacentElement("afterend", link); else box.appendChild(link);
  }

  window.cb2AbrirSheet = function (tipo) {
    const sh = tipo === "item" ? $("boxItensForm") : tipo === "mapa" ? $("boxMapasForm") : $("cb2Sheet-" + tipo);
    if (tipo === "diario") {
      if (!sh) return;
      if (sheetAberta && sheetAberta !== sh) fecharJa(sheetAberta);
      sheetAberta = sh;
      sh.removeAttribute("inert");
      fundo.classList.add("on");
      document.body.classList.add("cb2-travado");
      requestAnimationFrame(() => sh.classList.add("on"));
      return;
    }
    if (!sh) return;
    if (sheetAberta && sheetAberta !== sh) fecharJa(sheetAberta);
    resetarSheet(sh);
    if (tipo === "arma") { arrumarAtaque(); }
    if (tipo === "item" && typeof atualizarCampoGuardarEm === "function") { try { atualizarCampoGuardarEm(); } catch (e) {} }
    abrirDetalhesPreenchidos(sh);
    sheetAberta = sh;
    sh.removeAttribute("inert");
    fundo.classList.add("on");
    document.body.classList.add("cb2-travado");
    requestAnimationFrame(() => sh.classList.add("on"));
  };

  function fecharJa(sh) {
    if (sh.contains(document.activeElement)) document.activeElement.blur();
    sh.classList.remove("on");
    sh.setAttribute("inert", "");
  }

  window.cb2FecharSheet = function () {
    if (!sheetAberta) return;
    const sh = sheetAberta;
    fecharJa(sh);
    fundo.classList.remove("on");
    document.body.classList.remove("cb2-travado");
    if (sh.id === "cb2Sheet-estado") devolverEstado();
    sheetAberta = null;
  };

  window.cb2Adicionar = async function (tipo) {
    const cfg = {
      arma: { nome: "armaNome", lista: listaArmas, fn: "addArma" },
      armadura: { nome: "armaduraNome", lista: listaArmaduras, fn: "addArmadura" },
      item: { nome: "itemNome", lista: listaItens, fn: "addItem" },
      mapa: { nome: "mapaNome", lista: () => (typeof mapas !== "undefined" ? mapas : []), fn: "addMapa" },
    }[tipo];
    if (!cfg) return;
    const nomeEl = $(cfg.nome);
    if (!nomeEl || !nomeEl.value.trim()) {
      if (nomeEl) { nomeEl.classList.remove("cb2-erro"); void nomeEl.offsetWidth; nomeEl.classList.add("cb2-erro"); nomeEl.focus(); }
      return;
    }
    const sh = sheetAberta;
    const btn = sh && sh.querySelector(".cb2-ok");
    const antes = cfg.lista().length;
    if (btn) { btn.disabled = true; btn.dataset.txt = btn.textContent; if (tipo === "mapa") btn.textContent = "Enviando…"; }
    try {
      const f = window[cfg.fn];
      if (typeof f === "function") await f();
    } finally {
      if (btn) { btn.disabled = false; if (btn.dataset.txt) btn.textContent = btn.dataset.txt; }
    }
    if (cfg.lista().length > antes || (tipo !== "mapa" && !nomeEl.value.trim())) {
      cb2FecharSheet();
      if (tipo === "arma" || tipo === "armadura") cb2Painel(tipo === "arma" ? "armas" : "armaduras");
      contar();
      contarInv();
    } else if (tipo !== "mapa") {
      // algo faltou (ex.: cargas ligadas sem a quantidade): mostra o campo
      const q = sh && sh.querySelector(".cb2-qtd-cargas");
      if (q && q.style.display !== "none" && !q.value) { q.classList.remove("cb2-erro"); void q.offsetWidth; q.classList.add("cb2-erro"); q.focus(); }
    }
  };

  /* ---------------- domínio · exaustão · morte ---------------- */
  const ESTADO = {
    dominio: { tit: "Pontos de domínio", box: "cb2BoxDominio" },
    exaustao: { tit: "Exaustão", box: "cb2BoxExaustao" },
    morte: { tit: "Teste de morte", box: "cb2BoxMorte" },
  };
  let estadoAtual = null;

  window.cb2AbrirEstado = function (qual) {
    const cfg = ESTADO[qual];
    const corpo = $("cb2EstadoCorpo");
    const box = $(cfg && cfg.box);
    if (!cfg || !corpo || !box) return;
    devolverEstado();
    $("cb2EstadoTit").textContent = cfg.tit;
    corpo.appendChild(box);
    estadoAtual = qual;
    cb2AbrirSheet("estado");
  };

  function devolverEstado() {
    const g = $("cb2Guardado");
    const corpo = $("cb2EstadoCorpo");
    if (!g || !corpo) return;
    [...corpo.children].forEach((c) => g.appendChild(c));
    estadoAtual = null;
  }

  window.cb2RolarMorte = function () {
    if (typeof rolarD20 === "function") rolarD20("Teste de morte", 0);
  };

  function atualizarEstado() {
    // domínio
    const d = $("cb2EstDominio");
    if (d) {
      const lista = typeof dominio !== "undefined" && Array.isArray(dominio) ? dominio : [];
      d.innerHTML = lista.length ? lista.map((v) => `<i class="${v ? "on" : ""}"></i>`).join("") : `<em>nenhum</em>`;
    }
    // exaustão
    const nivel = typeof exaustao !== "undefined" ? Number(exaustao) || 0 : 0;
    const er = $("cb2EstExaRot");
    if (er) er.textContent = "Exaustão " + nivel;
    const e = $("cb2EstExa");
    if (e) e.innerHTML = Array.from({ length: 6 }, (_, i) => `<i class="${i < nivel ? "on" : ""}"></i>`).join("");
    const btnE = e && e.closest(".cb2-est");
    if (btnE) btnE.classList.toggle("alerta", nivel > 0);
    // morte
    const m = $("cb2EstMorte");
    if (m) {
      const mt = typeof morte !== "undefined" && morte ? morte : { sucessos: [], falhas: [] };
      m.innerHTML =
        [0, 1, 2].map((i) => `<i class="${mt.sucessos?.[i] ? "on" : ""}"></i>`).join("") +
        `<span class="cb2-sep"></span>` +
        [0, 1, 2].map((i) => `<i class="r ${mt.falhas?.[i] ? "on" : ""}"></i>`).join("");
    }
  }
  window.cb2AtualizarEstado = atualizarEstado;

  function observarEstado() {
    const obs = new MutationObserver(() => atualizarEstado());
    ["cb2BoxDominio", "cb2BoxExaustao", "cb2BoxMorte"].forEach((id) => {
      const el = $(id);
      if (el) obs.observe(el, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
    });
  }

  /* ---------------- resistências ---------------- */
  const TIPOS = [
    ["fogo", "🔥", "Fogo"], ["frio", "❄️", "Frio"], ["eletrico", "⚡", "Elétrico"], ["veneno", "☠️", "Veneno"],
    ["acido", "🧪", "Ácido"], ["necrotico", "💀", "Necrótico"], ["radiante", "☀️", "Radiante"], ["psiquico", "🧠", "Psíquico"],
    ["trovejante", "🔊", "Trovejante"], ["forca", "✨", "Força"], ["cortante", "🗡️", "Cortante"], ["perfurante", "🎯", "Perfurante"],
    ["concussao", "🔨", "Concussão"],
  ];
  const CICLO = ["", "res", "imu", "vul"];
  const ROTULO = { res: "Resist.", imu: "Imune", vul: "Vuln." };

  function dadosResist() {
    const p = fichaAtual();
    if (!p) return null;
    if (!p.resistTipos || typeof p.resistTipos !== "object") p.resistTipos = {};
    if (!Array.isArray(p.resistOutras)) p.resistOutras = [];
    if (!Array.isArray(p.imuneCondicoes)) p.imuneCondicoes = [];
    return p;
  }

  function contarResist() {
    const p = fichaAtual();
    if (!p) return 0;
    const n1 = Object.values(p.resistTipos || {}).filter(Boolean).length;
    const n2 = (p.resistOutras || []).filter((o) => o && o.estado).length;
    return n1 + n2;
  }

  function salvarResist() {
    if (typeof salvarTudo === "function") salvarTudo();
    contar();
  }

  function cb2RenderResist() {
    const grid = $("cb2Rgrid");
    const conds = $("cb2Conds");
    const p = dadosResist();
    if (!grid) return;
    if (!p) { grid.innerHTML = ""; if (conds) conds.innerHTML = ""; return; }
    const card = (estado, ico, nome, onclick, extra) =>
      `<button type="button" class="cb2-r ${estado || ""}" onclick="${onclick}"><span class="e">${ico}</span><span class="n">${esc2(nome)}</span><span class="tag">${estado ? ROTULO[estado] : "—"}</span>${extra || ""}</button>`;
    grid.innerHTML =
      TIPOS.map(([id, ico, nome]) => card(p.resistTipos[id], ico, nome, `cb2CicloResist('${id}')`)).join("") +
      p.resistOutras.map((o, i) => card(o.estado, "◈", o.nome, `cb2CicloOutra(${i})`,
        `<i class="cb2-rx" onclick="event.stopPropagation(); cb2RemoverOutra(${i})" aria-label="Remover">✕</i>`)).join("") +
      `<button type="button" class="cb2-r cb2-r-nova" onclick="cb2NovaResist()">+ Outra</button>`;
    if (conds) {
      conds.innerHTML = p.imuneCondicoes.length
        ? p.imuneCondicoes.map((c, i) => `<span class="cb2-cond">${esc2(c)}<i onclick="cb2RemoverCondicao(${i})" aria-label="Remover">✕</i></span>`).join("")
        : `<em class="cb2-vazio">Nenhuma. Toque no + pra adicionar (ex.: Envenenado, Amedrontado).</em>`;
    }
    contar();
  }
  window.cb2RenderResist = cb2RenderResist;

  const proximo = (e) => CICLO[(CICLO.indexOf(e || "") + 1) % CICLO.length];

  window.cb2CicloResist = function (id) {
    const p = dadosResist();
    if (!p) return;
    const n = proximo(p.resistTipos[id]);
    if (n) p.resistTipos[id] = n; else delete p.resistTipos[id];
    cb2RenderResist();
    salvarResist();
  };
  window.cb2CicloOutra = function (i) {
    const p = dadosResist();
    if (!p || !p.resistOutras[i]) return;
    p.resistOutras[i].estado = proximo(p.resistOutras[i].estado);
    cb2RenderResist();
    salvarResist();
  };
  window.cb2NovaResist = async function () {
    const p = dadosResist();
    if (!p) return;
    const nome = typeof promptBonito === "function" ? await promptBonito("Nome do tipo de dano", "") : prompt("Nome do tipo de dano");
    if (!nome || !String(nome).trim()) return;
    p.resistOutras.push({ nome: String(nome).trim().slice(0, 30), estado: "res" });
    cb2RenderResist();
    salvarResist();
  };
  window.cb2RemoverOutra = function (i) {
    const p = dadosResist();
    if (!p) return;
    p.resistOutras.splice(i, 1);
    cb2RenderResist();
    salvarResist();
  };
  window.cb2AddCondicao = async function () {
    const p = dadosResist();
    if (!p) return;
    const nome = typeof promptBonito === "function" ? await promptBonito("Imune a qual condição?", "") : prompt("Imune a qual condição?");
    if (!nome || !String(nome).trim()) return;
    p.imuneCondicoes.push(String(nome).trim().slice(0, 30));
    cb2RenderResist();
    salvarResist();
  };
  window.cb2RemoverCondicao = function (i) {
    const p = dadosResist();
    if (!p) return;
    p.imuneCondicoes.splice(i, 1);
    cb2RenderResist();
    salvarResist();
  };

  /* ---------------- inventário: cards menores que expandem ---------------- */
  const itensAbertos = new Set();

  function cardItemCompacto(item, index, guardado) {
    const temMochila = typeof recipientesInventario === "function" && recipientesInventario().length > 0;
    const qm = (item.modificacoes || []).length;
    const sub = [item.desc ? String(item.desc).split("\n")[0] : "", qm ? (qm === 1 ? "1 mod" : qm + " mods") : ""].filter(Boolean).join(" · ");
    const chave = item.id || "i" + index;
    const mover = guardado
      ? `<button type="button" class="cb2-i" title="Tirar da mochila" aria-label="Tirar da mochila" onclick="event.stopPropagation(); moverItemParaRecipiente(${index}, '')"><i class="ti ti-arrow-bar-up"></i></button>`
      : temMochila
        ? `<button type="button" class="cb2-i" title="Guardar numa mochila" aria-label="Guardar numa mochila" onclick="event.stopPropagation(); abrirGuardarItem(${index})"><i class="ti ti-backpack"></i></button>`
        : "";
    return `
      <div class="cb2-linha" onclick="cb2ToqueItem(${index}, '${esc2(chave)}')">
        ${item.imagemUrl
          ? `<span class="cb2-ic drag-handle" style="background-image:url('${esc2(item.imagemUrl)}')" aria-label="Arrastar para reordenar"></span>`
          : `<span class="cb2-ic drag-handle" aria-label="Arrastar para reordenar"><i class="ti ti-package"></i></span>`}
        <div class="cb2-t">
          <b>${item.nome ? esc2(item.nome) : "Sem nome"} ${sintoniaTag(item)}</b>
          ${sub ? `<small>${esc2(sub)}</small>` : ""}
        </div>
        <span class="cb2-qtd">x${parseInt(item.qtd) || 1}</span>
        <i class="cb2-chev ti ti-chevron-down" onclick="event.stopPropagation(); cb2FecharItem('${esc2(chave)}', ${index})"></i>
      </div>
      <div class="cb2-mais">
        ${detalhesHTML(item)}
        <div class="cb2-acoes">
          <button type="button" class="cb2-a" onclick="verItem(${index})"><i class="ti ti-eye"></i> Ver tudo</button>
          <span class="cb2-acoes-ico">
            ${mover}
            <button type="button" class="cb2-i" title="Dar" aria-label="Dar" onclick="window.abrirDarItem('inventario', ${index})"><i class="ti ti-gift"></i></button>
          </span>
        </div>
      </div>`;
  }

  // 1º toque abre o card; com ele aberto, tocar de novo abre o popup completo
  window.cb2ToqueItem = function (index, chave) {
    const li = document.querySelector(`#lista li[data-index="${index}"]`);
    if (itensAbertos.has(chave)) { if (typeof verItem === "function") verItem(index); return; }
    itensAbertos.add(chave);
    if (li) li.classList.add("aberto");
  };
  // a setinha só abre e fecha
  window.cb2FecharItem = function (chave, index) {
    const li = document.querySelector(`#lista li[data-index="${index}"]`);
    if (itensAbertos.has(chave)) itensAbertos.delete(chave); else itensAbertos.add(chave);
    if (li) li.classList.toggle("aberto", itensAbertos.has(chave));
  };
  // o mesmo vale pra arma e armadura: aberto + toque = popup completo
  const abrirOriginal = window.cb2Abrir;
  window.cb2Abrir = function (tipo, index) {
    if (abertos[tipo].has(index)) {
      if (tipo === "arma" && typeof verArma === "function") return verArma(index);
      if (tipo === "armadura" && typeof verArmadura === "function") return verArmadura(index);
    }
    return abrirOriginal(tipo, index);
  };
  window.cb2Fechar = function (tipo, index) { abrirOriginal(tipo, index); };

  if (typeof cardItemInvHTML === "function" && !cardItemInvHTML._cb2) {
    const origCard = cardItemInvHTML;
    const novoCard = function (item, index, guardado) {
      if (!item || item.bolsa || item.recipiente) return origCard.apply(this, arguments);
      return cardItemCompacto(item, index, guardado);
    };
    novoCard._cb2 = true;
    window.cardItemInvHTML = novoCard;
    try { cardItemInvHTML = novoCard; } catch (e) {}
  }
  if (typeof renderInv === "function" && !renderInv._cb2) {
    const origInv = renderInv;
    const novoInv = function () {
      const r = origInv.apply(this, arguments);
      document.querySelectorAll("#lista > li").forEach((li) => {
        if (!li.querySelector(":scope > .cb2-linha")) return;
        li.classList.add("cb2-card", "cb2-item");
        const item = listaItens()[parseInt(li.dataset.index)];
        const chave = (item && item.id) || "i" + li.dataset.index;
        li.classList.toggle("aberto", itensAbertos.has(chave));
      });
      return r;
    };
    novoInv._cb2 = true;
    window.renderInv = novoInv;
    try { renderInv = novoInv; } catch (e) {}
  }

  /* ---------------- diário em meia página ---------------- */
  window.toggleDiario = function () {
    const sh = $("cb2Sheet-diario");
    if (!sh) return;
    if (sheetAberta === sh) cb2FecharSheet();
    else cb2AbrirSheet("diario");
  };
  try { toggleDiario = window.toggleDiario; } catch (e) {}
  // o "salvo" acende enquanto escreve
  document.addEventListener("input", (e) => {
    if (e.target && e.target.id === "diario") {
      const s = $("cb2DiarioSalvo");
      if (!s) return;
      s.classList.add("salvando");
      clearTimeout(s._t);
      s._t = setTimeout(() => s.classList.remove("salvando"), 900);
    }
  });


  /* ---------------- inventário: abas Itens · Mapas ---------------- */
  window.cb2InvAba = function (qual) {
    document.querySelectorAll("#cb2InvTabs button").forEach((b) => b.classList.toggle("on", b.dataset.inv === qual));
    document.querySelectorAll("#inventario .cb2-invp").forEach((p) => p.classList.toggle("on", p.dataset.inv === qual));
  };
  function contarInv() {
    const ni = $("cb2NItens"), nm = $("cb2NMapas");
    if (ni) ni.textContent = String(listaItens().filter((i) => i && !i.recipiente).length || 0);
    if (nm) nm.textContent = String(typeof mapas !== "undefined" ? mapas.length : 0);
  }

  /* mapas em cards iguais aos outros */
  function renderMapasV2() {
    const ul = $("listaMapas");
    if (!ul) return;
    const lista = typeof mapas !== "undefined" ? mapas : [];
    ul.innerHTML = lista.length ? "" : `<li class="cb2-vazio-lista">Nenhum mapa ainda. Adicione o primeiro pra riscar e anotar nele.</li>`;
    lista.forEach((mapa, index) => {
      const li = document.createElement("li");
      li.className = "cb2-card cb2-mapa";
      const n = (mapa.anotacoes || []).length;
      li.innerHTML = `
        <div class="cb2-linha" onclick="verMapa(${index})">
          ${mapa.imagemUrl
            ? `<span class="cb2-ic cb2-thumb" style="background-image:url('${esc2(mapa.imagemUrl)}')"></span>`
            : `<span class="cb2-ic cb2-thumb"><i class="ti ti-map-2"></i></span>`}
          <div class="cb2-t">
            <b>${esc2(mapa.nome) || "Sem nome"}</b>
            <small>${esc2(mapa.desc) || "Sem descrição"}</small>
            <small class="cb2-anot"><i class="ti ti-pencil"></i> ${n}/30 anotações</small>
          </div>
          <button type="button" class="cb2-i cb2-abrir-mapa" title="Abrir o mapa" aria-label="Abrir o mapa" onclick="event.stopPropagation(); abrirMapaViewer(${index})"><i class="ti ti-arrows-maximize"></i></button>
        </div>`;
      ul.appendChild(li);
    });
    contarInv();
  }
  window.renderMapas = renderMapasV2;
  try { renderMapas = renderMapasV2; } catch (e) {}
  if (typeof renderInv === "function") {
    const r0 = renderInv;
    const r1 = function () { const r = r0.apply(this, arguments); contarInv(); return r; };
    r1._cb2 = true;
    window.renderInv = r1;
    try { renderInv = r1; } catch (e) {}
  }

  /* ---------------- poderes e magias: card que abre e fecha ---------------- */
  const poderesAbertos = new Set();
  function chavePoder(i) { const p = (typeof poderes !== "undefined" ? poderes : [])[i]; return p ? String(p.id ?? "i" + i) : "i" + i; }

  function maisPoderHTML(index) {
    const p = poderes[index];
    if (!p) return "";
    const magia = typeof ehMagia === "function" && ehMagia(p);
    const linhas = [["Alcance", p.alcance], ["Duração", p.duracao], ["Conjuração", p.tempo]].filter((x) => x[1]);
    const dados = typeof extrairDados === "function" ? extrairDados(p.dano) : "";
    return `
      ${linhas.length ? `<div class="cb2-pw-info">${linhas.map(([r, v]) => `<span><small>${r}</small>${esc2(v)}</span>`).join("")}</div>` : ""}
      ${p.desc ? `<p class="cb2-desc">${esc2(p.desc)}</p>` : ""}
      <div class="cb2-acoes">
        ${magia ? `<button type="button" class="cb2-a forte" onclick="event.stopPropagation(); conjurarMagia(${index})"><i class="ti ti-sparkles"></i> Conjurar</button>` : ""}
        ${dados ? `<button type="button" class="cb2-a forte" onclick="event.stopPropagation(); rolarDanoPoder(${index})"><i class="ti ti-dice-5"></i> ${esc2(dados)}</button>` : ""}
        <button type="button" class="cb2-a" onclick="event.stopPropagation(); verPoder(${index})"><i class="ti ti-eye"></i> Ver tudo</button>
        <span class="cb2-acoes-ico">
          <button type="button" class="cb2-i" title="Editar" aria-label="Editar" onclick="event.stopPropagation(); abrirFormPoder(${index})"><i class="ti ti-pencil"></i></button>
          <button type="button" class="cb2-i perigo" title="Remover" aria-label="Remover" onclick="event.stopPropagation(); removerPoder(${index})"><i class="ti ti-trash"></i></button>
        </span>
      </div>`;
  }

  window.cb2ToquePoder = function (index, el) {
    const li = el && el.closest("li.pw-card");
    const k = chavePoder(index);
    if (poderesAbertos.has(k)) poderesAbertos.delete(k); else poderesAbertos.add(k);
    // o mesmo poder pode aparecer em Favoritos e na lista: abre os dois
    document.querySelectorAll(`li.pw-card[data-index="${index}"]`).forEach((x) => x.classList.toggle("aberto", poderesAbertos.has(k)));
    if (li && poderesAbertos.has(k)) setTimeout(() => li.scrollIntoView({ block: "nearest", behavior: "smooth" }), 60);
  };

  if (typeof cardPoderEl === "function" && !cardPoderEl._cb2) {
    const origPw = cardPoderEl;
    const novoPw = function (index) {
      const li = origPw.apply(this, arguments);
      try {
        li.querySelectorAll(".pw-selo, .pw-corpo").forEach((el) => {
          el.removeAttribute("onclick");
          el.addEventListener("click", () => cb2ToquePoder(index, el));
        });
        const mais = document.createElement("div");
        mais.className = "cb2-mais cb2-pw-mais";
        mais.innerHTML = maisPoderHTML(index);
        li.appendChild(mais);
        li.classList.add("cb2-pw");
        if (poderesAbertos.has(chavePoder(index))) li.classList.add("aberto");
      } catch (e) {}
      return li;
    };
    novoPw._cb2 = true;
    window.cardPoderEl = novoPw;
    try { cardPoderEl = novoPw; } catch (e) {}
  }

  /* ---------------- formulários em popup: sobem de baixo, compactos ---------------- */
  const FORMS_SHEET = ["#editArmaNome", "#editArmaduraNome", "#editItemNome", "#pfNome", "#vNome", "#cNome", "#editMapaNome", "#caNome", "#chNome", "#ciNome", "#cfgAvisosGrupo"];
  if (typeof abrirPopup === "function" && !abrirPopup._cb2) {
    const origPop = abrirPopup;
    const novoPop = function () {
      const r = origPop.apply(this, arguments);
      const pop = document.getElementById("popup");
      if (pop) {
        const ehForm = FORMS_SHEET.some((s) => pop.querySelector(s));
        pop.classList.toggle("cb2-popsheet", ehForm);
        if (ehForm) { const c = pop.querySelector(".popup-content"); if (c) { c.style.animation = "none"; void c.offsetWidth; c.style.animation = ""; } }
      }
      return r;
    };
    novoPop._cb2 = true;
    window.abrirPopup = novoPop;
    try { abrirPopup = novoPop; } catch (e) {}
  }

  /* ---------------- ligar tudo ---------------- */
  function aoCarregarFicha() {
    abertos.arma.clear();
    abertos.armadura.clear();
    itensAbertos.clear();
    poderesAbertos.clear();
    try { renderArmasV2(); } catch (e) {}
    try { renderArmadurasV2(); } catch (e) {}
    cb2RenderResist();
    atualizarEstado();
    contar();
    try { renderMapasV2(); } catch (e) {}
    contarInv();
  }

  if (typeof carregarPersonagem === "function" && !carregarPersonagem._cb2) {
    const orig = carregarPersonagem;
    const novo = function () {
      const r = orig.apply(this, arguments);
      try { aoCarregarFicha(); } catch (e) {}
      return r;
    };
    novo._cb2 = true;
    window.carregarPersonagem = novo;
    try { carregarPersonagem = novo; } catch (e) {}
  }

  function iniciar() {
    prepararSheets();
    observarEstado();
    atualizarEstado();
    if (typeof montarCamposAtaqueFormArma === "function" && $("armaCamposAtaque") && !$("armaCamposAtaque").children.length) {
      try { montarCamposAtaqueFormArma(); } catch (e) {}
    }
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") cb2FecharSheet(); });
    contar();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();

/* perícias: tira o degradê do fim quando chegou no último item */
(function () {
  function ligar() {
    var el = document.getElementById("pericias");
    if (!el || el._cb2fim) return;
    el._cb2fim = true;
    var ver = function () {
      el.classList.toggle("cb2-fim", el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
    };
    el.addEventListener("scroll", ver, { passive: true });
    new MutationObserver(ver).observe(el, { childList: true });
    ver();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ligar);
  else ligar();
})();