let morte = {
  sucessos: [false, false, false],
  falhas: [false, false, false],
};

let racasCustomSalvas =
  JSON.parse(localStorage.getItem("racasCustomSalvas")) || [];
let editandoRacaCustom = -1;
let bonusRacaCustom = {
  forca: 0,
  destreza: 0,
  constituicao: 0,
  inteligencia: 0,
  sabedoria: 0,
  carisma: 0,
};

let gastosCirculos = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
};

for (let i = 0; i <= 9; i++) {
  renderSlotsCirculo(i);
}
let nomeRacaCustom = "";
let dominio = [false, false, false, false, false, false];
let editandoItem = -1;
let editandoArma = -1;
let editandoPoder = -1;
let editandoAliado = -1;
let vidaAtual = 50;
let vidaTemp = 0;
let inventario = [];
let armas = [];
let poderes = [];
let profs = {};
let saves = {};
let imagemBase64 = "";
let exaustao = 0;
let armaduras = [];
let editandoArmadura = -1;
let personagens = JSON.parse(localStorage.getItem("personagens")) || [];
let personagemAtual = null;
let modoExportacao = false;
let imagemPosX = 50;
let imagemPosY = 50;

/* ================= DADOS FIXOS ================= */

const pericias = [
  { nome: "Acrobacia", attr: "destreza" },
  { nome: "Arcanismo", attr: "inteligencia" },
  { nome: "Atletismo", attr: "forca" },
  { nome: "Atuação", attr: "carisma" },
  { nome: "Enganação", attr: "carisma" },
  { nome: "Furtividade", attr: "destreza" },
  { nome: "História", attr: "inteligencia" },
  { nome: "Intimidação", attr: "carisma" },
  { nome: "Intuição", attr: "sabedoria" },
  { nome: "Investigação", attr: "inteligencia" },
  { nome: "Lidar com Animais", attr: "sabedoria" },
  { nome: "Medicina", attr: "sabedoria" },
  { nome: "Natureza", attr: "inteligencia" },
  { nome: "Percepção", attr: "sabedoria" },
  { nome: "Persuasão", attr: "carisma" },
  { nome: "Prestidigitação", attr: "destreza" },
  { nome: "Religião", attr: "inteligencia" },
  { nome: "Sobrevivência", attr: "sabedoria" },
];

const racas = {
  custom: {},
  humano: {
    forca: 1,
    destreza: 1,
    constituicao: 1,
    inteligencia: 1,
    sabedoria: 1,
    carisma: 1,
  },
  elfo: { destreza: 2 },
  anao: { constituicao: 2 },
  halfling: { destreza: 2 },
  meio_elfo: { carisma: 2, destreza: 1 },
  meio_orc: { forca: 2, constituicao: 1 },
  draconato: { forca: 2, carisma: 1 },
  tiefling: { carisma: 2, inteligencia: 1 },
  gnomo: { inteligencia: 2 },
  tritao: { forca: 1, constituicao: 1, carisma: 1 },
};

const efeitosExaustao = [
  "Sem exaustão",
  "Desvantagem em testes de habilidade",
  "Metade da velocidade",
  "Desvantagem em ataques e testes de resistência",
  "Metade do HP máximo",
  "Velocidade = 0",
  "Morte",
];

/* ================= FUNÇÕES BASE ================= */

function ativarModoExportacao() {
  if (!personagens || personagens.length === 0) {
    alert("Você ainda não tem fichas para exportar.");
    return;
  }

  modoExportacao = true;
  mostrarAvisoExportacao();
}

function mostrarAvisoExportacao() {
  const aviso = document.createElement("div");
  aviso.innerText = "Clique na ficha para baixá-la";

  aviso.style.position = "fixed";
  aviso.style.bottom = "90px";
  aviso.style.left = "50%";
  aviso.style.transform = "translateX(-50%)";
  aviso.style.background = "#2c221d";
  aviso.style.color = "#f8f1df";
  aviso.style.padding = "10px 16px";
  aviso.style.borderRadius = "10px";
  aviso.style.zIndex = "9999";
  aviso.style.fontSize = "14px";
  aviso.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";

  document.body.appendChild(aviso);

  setTimeout(() => {
    aviso.remove();
  }, 2000);
}

function getAtributoFinal(attr) {
  const base = get(attr);
  const racaSelect = document.getElementById("racaSelect")?.value || "";

  let bonusRaca = 0;

  if (racaSelect.startsWith("custom_")) {
    const index = parseInt(racaSelect.replace("custom_", ""));
    bonusRaca = racasCustomSalvas[index]?.bonus?.[attr] || 0;
  } else if (racaSelect !== "") {
    bonusRaca = racas[racaSelect]?.[attr] || 0;
  }

  return Math.min(base + bonusRaca, 20);
}

function atualizarAtributosFinaisVisuais() {
  [
    "forca",
    "destreza",
    "constituicao",
    "inteligencia",
    "sabedoria",
    "carisma",
  ].forEach((attr) => {
    const el = document.getElementById(`final_${attr}`);
    if (!el) return;

    el.textContent = getAtributoFinal(attr);
  });
}

function aoMudarRaca() {
  const select = document.getElementById("racaSelect");
  const raca = select?.value || "";

  if (raca === "custom") {
    abrirPopupGerenciarRacasCustom();
    select.value = "";
    return;
  }

  atualizarTudo();
  salvarTudo();
}

function salvarRacasCustomStorage() {
  localStorage.setItem("racasCustomSalvas", JSON.stringify(racasCustomSalvas));
}

function abrirPopupGerenciarRacasCustom() {
  let lista = "";

  racasCustomSalvas.forEach((raca, index) => {
    lista += `
      <div class="raca-custom-card">
        <strong>${raca.nome}</strong>

        <div class="raca-custom-acoes">
          <button class="raca-btn raca-btn-editar" onclick="editarRacaCustom(${index})">
  ✏️ Editar
</button>

<button class="raca-btn raca-btn-deletar" onclick="deletarRacaCustom(${index})">
  🗑️
</button>
        </div>
      </div>
    `;
  });

  if (!lista) {
    lista = `<p style="text-align:center; color:#cdb791;">Nenhuma raça custom criada.</p>`;
  }

  abrirPopup(
    "Raças custom",
    `
    <div class="popup-form">
      ${lista}

      <button class="popup-salvar-btn" onclick="abrirPopupBonusCustom()">
        + Nova raça custom
      </button>
    </div>
  `,
    true,
    null,
  );
}

function salvarBonusRacaCustom() {
  const nome =
    document.getElementById("nomeRacaCustom")?.value.trim() || "Raça custom";

  const raca = {
    nome,
    bonus: {
      forca: parseInt(document.getElementById("bonusCustomForca")?.value) || 0,
      destreza:
        parseInt(document.getElementById("bonusCustomDestreza")?.value) || 0,
      constituicao:
        parseInt(document.getElementById("bonusCustomConstituicao")?.value) ||
        0,
      inteligencia:
        parseInt(document.getElementById("bonusCustomInteligencia")?.value) ||
        0,
      sabedoria:
        parseInt(document.getElementById("bonusCustomSabedoria")?.value) || 0,
      carisma:
        parseInt(document.getElementById("bonusCustomCarisma")?.value) || 0,
    },
  };

  if (editandoRacaCustom >= 0) {
    racasCustomSalvas[editandoRacaCustom] = raca;
  } else {
    racasCustomSalvas.push(raca);
  }

  salvarRacasCustomStorage();
  atualizarDropdownRacas();
  atualizarTudo();
  salvarTudo();
  fecharPopup();
}

function editarRacaCustom(index) {
  abrirPopupBonusCustom(index);
}

function deletarRacaCustom(index) {
  if (!confirm("Deseja deletar essa raça custom?")) return;

  const select = document.getElementById("racaSelect");
  const valorAtual = select?.value;

  racasCustomSalvas.splice(index, 1);

  salvarRacasCustomStorage();
  atualizarDropdownRacas();

  if (valorAtual === `custom_${index}` && select) {
    select.value = "";
  }

  atualizarTudo();
  salvarTudo();
  abrirPopupGerenciarRacasCustom();
}

function abrirPopupBonusCustom() {
  const html = `
    <div class="popup-form">

      <label class="popup-label">Nome da raça</label>
      <input id="nomeRacaCustom" value="${nomeRacaCustom || ""}">

      <label class="popup-label">Força</label>
      <input id="bonusCustomForca" type="number" value="${bonusRacaCustom.forca || 0}">

      <label class="popup-label">Destreza</label>
      <input id="bonusCustomDestreza" type="number" value="${bonusRacaCustom.destreza || 0}">

      <label class="popup-label">Constituição</label>
      <input id="bonusCustomConstituicao" type="number" value="${bonusRacaCustom.constituicao || 0}">

      <label class="popup-label">Inteligência</label>
      <input id="bonusCustomInteligencia" type="number" value="${bonusRacaCustom.inteligencia || 0}">

      <label class="popup-label">Sabedoria</label>
      <input id="bonusCustomSabedoria" type="number" value="${bonusRacaCustom.sabedoria || 0}">

      <label class="popup-label">Carisma</label>
      <input id="bonusCustomCarisma" type="number" value="${bonusRacaCustom.carisma || 0}">

      <button class="popup-salvar-btn" onclick="salvarBonusRacaCustom()">
        Salvar
      </button>
    </div>
  `;

  abrirPopup("Raça Custom", html, true, null);
}

function getNomeRacaAtual() {
  const raca = document.getElementById("racaSelect")?.value;

  if (raca === "custom") {
    return nomeRacaCustom || "Custom";
  }

  return raca || "Sem raça";
}

function mod(v) {
  return Math.floor((v - 10) / 2);
}

function get(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  return parseInt(el.value) || 0;
}

function exportarFichaAtual() {
  if (personagemAtual === null || personagemAtual === undefined) {
    alert("Selecione uma ficha primeiro.");
    return;
  }

  exportarFicha(personagemAtual);
}

function salvarPersonagens() {
  localStorage.setItem("personagens", JSON.stringify(personagens));
}

function normalizarTipo(tipo) {
  return (tipo || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getIconeTipo(tipo) {
  const t = normalizarTipo(tipo);

  if (t.includes("fogo")) return "🔥";
  if (t.includes("gelo")) return "❄️";
  if (t.includes("agua")) return "💧";
  if (t.includes("raio")) return "⚡";
  if (t.includes("trovej")) return "🌩️";
  if (t.includes("necrot")) return "💀";
  if (t.includes("radiante")) return "✨";
  if (t.includes("veneno")) return "☠️";
  if (t.includes("psiqu")) return "🧠";
  if (t.includes("corte")) return "🔪";
  if (t.includes("perfur")) return "📌";
  if (t.includes("concuss")) return "💥";
  if (t.includes("fisico")) return "🗡️";
  if (t.includes("magico")) return "☄️";
  if (t.includes("trevas")) return "🌑";
  if (t.includes("luz")) return "🌕";
  if (t.includes("espirit")) return "🌓";
  if (t.includes("vento")) return "🍃";
  if (t.includes("madeira")) return "🌳";
  if (t.includes("terra")) return "🌍";

  return "🔮";
}

function getClasseTipo(tipo) {
  const t = normalizarTipo(tipo);

  if (t.includes("fogo")) return "tipo-fogo";
  if (t.includes("gelo")) return "tipo-gelo";
  if (t.includes("raio")) return "tipo-raio";
  if (t.includes("trovej")) return "tipo-trovejante";
  if (t.includes("necrot")) return "tipo-necrotico";
  if (t.includes("radiante")) return "tipo-radiante";
  if (t.includes("veneno")) return "tipo-veneno";
  if (t.includes("psiqu")) return "tipo-psiquico";
  if (t.includes("corte")) return "tipo-corte";
  if (t.includes("perfur")) return "tipo-perfurante";
  if (t.includes("concuss")) return "tipo-concussao";

  return "tipo-padrao";
}

function atualizarDropdownRacas() {
  const select = document.getElementById("racaSelect");
  if (!select) return;

  // remove antigas custom (sem mexer nas fixas)
  const antigas = document.querySelectorAll(".raca-custom");
  antigas.forEach((el) => el.remove());

  // adiciona custom salvas
  racasCustomSalvas.forEach((raca, index) => {
    const option = document.createElement("option");
    option.value = "custom_" + index;
    option.textContent = raca.nome;
    option.classList.add("raca-custom");

    select.insertBefore(option, select.children[2]);
    // 🔥 coloca logo abaixo de "Custom"
  });
}

function trocarSubAbaPoderes(tipo, btn) {
  const subabas = document.querySelectorAll(".subaba-poderes");
  subabas.forEach((el) => {
    el.style.display = "none";
    el.classList.remove("active");
  });

  document
    .querySelectorAll(".subtab-poder")
    .forEach((b) => b.classList.remove("active"));

  if (tipo === "poderes-comuns") {
    const alvo = document.getElementById("subaba-poderes-comuns");
    if (alvo) {
      alvo.style.display = "block";
      alvo.classList.add("active");
    }
  }

  if (tipo === "magias") {
    const alvo = document.getElementById("subaba-magias");
    if (alvo) {
      alvo.style.display = "block";
      alvo.classList.add("active");
    }
  }

  if (btn) btn.classList.add("active");
}

function atualizarGastoCirculo(circulo, valor) {
  let total = parseInt(valor) || 0;
  if (total < 0) total = 0;

  const atual = Array.isArray(gastosCirculos[circulo])
    ? gastosCirculos[circulo]
    : [];
  const novoArray = [];

  for (let i = 0; i < total; i++) {
    novoArray.push(atual[i] || false);
  }

  gastosCirculos[circulo] = novoArray;
  renderSlotsCirculo(circulo);
  salvarTudo();
}

function trocarSubAbaCirculo(circulo, btn) {
  const caixas = document.querySelectorAll(".circulo-box");
  caixas.forEach((el) => {
    el.style.display = "none";
    el.classList.remove("active");
  });

  document
    .querySelectorAll(".subtab-circulo")
    .forEach((b) => b.classList.remove("active"));

  const alvo = document.getElementById(`circulo-${circulo}`);
  if (alvo) {
    alvo.style.display = "block";
    alvo.classList.add("active");
  }

  if (btn) btn.classList.add("active");
}

function salvarGastosCirculos() {
  for (let i = 0; i <= 9; i++) {
    const input = document.getElementById(`gastoCirculo${i}`);
    gastosCirculos[i] = input ? parseInt(input.value) || 0 : 0;
  }

  salvarTudo();
}

/* ================= POPUP ================= */

function abrirPopup(titulo, conteudo, usarHTML = false, onEditar = null) {
  const popup = document.getElementById("popup");
  const tituloEl = document.getElementById("popup-titulo");
  const textoEl = document.getElementById("popup-texto");
  const btnEditar = document.getElementById("popup-editar");

  if (!popup || !tituloEl || !textoEl) return;

  tituloEl.textContent = titulo || "";

  if (usarHTML) {
    textoEl.innerHTML = conteudo || "";
  } else {
    textoEl.textContent = conteudo || "";
  }

  if (btnEditar) {
    if (onEditar) {
      btnEditar.style.display = "inline-flex";
      btnEditar.onclick = onEditar;
    } else {
      btnEditar.style.display = "none";
      btnEditar.onclick = null;
    }
  }

  popup.style.display = "flex";
}

function editarQuantidadeSlotsCirculo(circulo) {
  if (!gastosCirculos[circulo]) gastosCirculos[circulo] = [];

  const atual = gastosCirculos[circulo].length;
  const resposta = prompt(`Quantas bolinhas no círculo ${circulo}?`, atual);

  if (resposta === null) return;

  let novoTotal = parseInt(resposta);
  if (isNaN(novoTotal) || novoTotal < 0) novoTotal = 0;

  const novoArray = [];
  for (let i = 0; i < novoTotal; i++) {
    novoArray.push(gastosCirculos[circulo][i] || false);
  }

  gastosCirculos[circulo] = novoArray;

  renderSlotsCirculo(circulo);
  salvarTudo();
}

function renderSlotsCirculo(circulo) {
  const container = document.getElementById(`slotsCirculo${circulo}`);
  if (!container) return;

  container.innerHTML = "";

  const slots = gastosCirculos[circulo] || [];

  slots.forEach((usado, i) => {
    const bolinha = document.createElement("div");
    bolinha.className = "slot-bolinha" + (usado ? " usado" : "");

    bolinha.onclick = () => {
      gastosCirculos[circulo][i] = !gastosCirculos[circulo][i];
      renderSlotsCirculo(circulo);
      salvarTudo();
    };

    container.appendChild(bolinha);
  });
}

function editarItem(index) {
  const item = inventario[index];
  if (!item) return;

  const html = `
    <div class="popup-form">
      <label class="popup-label">Nome</label>
      <input id="editItemNome" value="${item.nome || ""}">

      <label class="popup-label">Descrição</label>
      <textarea id="editItemDesc">${item.desc || ""}</textarea>

      <label class="popup-label">Quantidade</label>
      <input id="editItemQtd" type="number" min="1" value="${item.qtd || 1}">

      <div class="toggle-cargas" style="margin-top:10px;">
        <span class="toggle-cargas-texto">Requer sintonia</span>
        <label class="switch-cargas">
          <input
            type="checkbox"
            id="editItemRequerSintonia"
            ${item.requerSintonia ? "checked" : ""}
            onchange="toggleEditSintoniaItem()"
          >
          <span class="slider-cargas"></span>
        </label>
      </div>

      <div id="boxEditItemSintonizado" style="display:${item.requerSintonia ? "block" : "none"};">
        <div class="toggle-cargas" style="margin-top:10px;">
          <span class="toggle-cargas-texto">Está sintonizado</span>
          <label class="switch-cargas">
            <input
              type="checkbox"
              id="editItemSintonizado"
              ${item.sintonizado ? "checked" : ""}
            >
            <span class="slider-cargas"></span>
          </label>
        </div>
      </div>

      <button class="popup-salvar-btn" onclick="salvarEdicaoItem(${index})">
        Salvar
      </button>
    </div>
  `;

  abrirPopup("Editar item", html, true, null);
}

function salvarEdicaoItem(index) {
  const nome = document.getElementById("editItemNome").value.trim();
  const desc = document.getElementById("editItemDesc").value.trim();
  const qtd = parseInt(document.getElementById("editItemQtd")?.value) || 1;
  const requerSintonia = !!document.getElementById("editItemRequerSintonia")
    ?.checked;
  const sintonizado =
    requerSintonia && !!document.getElementById("editItemSintonizado")?.checked;

  if (!nome) return;

  inventario[index] = {
    nome,
    desc,
    qtd,
    requerSintonia,
    sintonizado,
  };

  renderInv();
  salvarTudo();
  fecharPopup();
}

function moverItem(index, direcao) {
  const lista = document.querySelectorAll(".item-card");

  if (!lista[index]) return;

  lista[index].classList.add("animando");

  const novoIndex = index + direcao;

  if (novoIndex < 0 || novoIndex >= inventario.length) {
    lista[index].classList.remove("animando");
    return;
  }

  setTimeout(() => {
    [inventario[index], inventario[novoIndex]] = [
      inventario[novoIndex],
      inventario[index],
    ];
    renderInv();
    salvarTudo();
  }, 150);
}

function editarArma(index) {
  const arma = armas[index];
  if (!arma) return;

  const html = `
    <div class="popup-form">
      <label class="popup-label">Nome</label>
      <input id="editArmaNome" value="${arma.nome || ""}">

      <label class="popup-label">Dano</label>
      <input id="editArmaDano" value="${arma.dano || ""}">

      <label class="popup-label">Descrição</label>
      <textarea id="editArmaDesc">${arma.desc || ""}</textarea>

      <div class="toggle-cargas" style="margin-top:10px;">
        <span class="toggle-cargas-texto">Usa cargas</span>

        <label class="switch-cargas">
          <input
            type="checkbox"
            id="editArmaTemCargas"
            ${arma.temCargas ? "checked" : ""}
            onchange="toggleEditCampoCargas()"
          >
          <span class="slider-cargas"></span>
        </label>
      </div>

      <input
        id="editArmaMaxCargas"
        type="number"
        min="1"
        max="20"
        placeholder="Qtd. de cargas"
        value="${arma.maxCargas || ""}"
        style="display:${arma.temCargas ? "block" : "none"};"
      >

      <button class="popup-salvar-btn" onclick="salvarEdicaoArma(${index})">
        Salvar
      </button>
    </div>
  `;

  abrirPopup("Editar arma", html, true, null);
}

function toggleEditCampoCargas() {
  const check = document.getElementById("editArmaTemCargas");
  const input = document.getElementById("editArmaMaxCargas");

  if (!check || !input) return;

  if (check.checked) {
    input.style.display = "block";
  } else {
    input.style.display = "none";
    input.value = "";
  }
}

function toggleEditCampoCargasPoder() {
  const check = document.getElementById("editPoderTemCargas");
  const input = document.getElementById("editPoderMaxCargas");

  if (!check || !input) return;

  if (check.checked) {
    input.style.display = "block";
  } else {
    input.style.display = "none";
    input.value = "";
  }
}

function editarPoder(index) {
  const poder = poderes[index];
  if (!poder) return;

  const html = `
    <div class="popup-form">
      <label class="popup-label">Nome</label>
      <input id="editPoderNome" value="${poder.nome || ""}">

      <label class="popup-label">Tipo</label>
      <select id="editPoderTipo" class="input-personagem">
  <option value="">Tipo de dano</option>
  <option value="fogo" ${normalizarTipo(poder.tipo) === "fogo" ? "selected" : ""}>🔥 Fogo</option>
  <option value="gelo" ${normalizarTipo(poder.tipo) === "gelo" ? "selected" : ""}>❄️ Gelo</option>
  <option value="raio" ${normalizarTipo(poder.tipo) === "raio" ? "selected" : ""}>⚡ Raio</option>
  <option value="trovejante" ${normalizarTipo(poder.tipo) === "trovejante" ? "selected" : ""}>🌩️ Trovejante</option>
  <option value="necrotico" ${normalizarTipo(poder.tipo) === "necrotico" ? "selected" : ""}>💀 Necrótico</option>
  <option value="radiante" ${normalizarTipo(poder.tipo) === "radiante" ? "selected" : ""}>✨ Radiante</option>
  <option value="veneno" ${normalizarTipo(poder.tipo) === "veneno" ? "selected" : ""}>☠️ Veneno</option>
  <option value="agua" ${normalizarTipo(poder.tipo) === "agua" ? "selected" : ""}>💧 Água</option>
  <option value="magico" ${normalizarTipo(poder.tipo) === "magico" ? "selected" : ""}>☄️ Mágico</option>
  <option value="psiquico" ${normalizarTipo(poder.tipo) === "psiquico" ? "selected" : ""}>🧠 Psíquico</option>
  <option value="corte" ${normalizarTipo(poder.tipo) === "corte" ? "selected" : ""}>🔪 Corte</option>
  <option value="perfurante" ${normalizarTipo(poder.tipo) === "perfurante" ? "selected" : ""}>📌 Perfurante</option>
  <option value="concussao" ${normalizarTipo(poder.tipo) === "concussao" ? "selected" : ""}>💥 Concussão</option>
  <option value="metal" ${normalizarTipo(poder.tipo) === "metal" ? "selected" : ""}>⚙️ Metal</option>
  <option value="fisico" ${normalizarTipo(poder.tipo) === "fisico" ? "selected" : ""}>🗡️ Físico</option>
  <option value="vento" ${normalizarTipo(poder.tipo) === "vento" ? "selected" : ""}>🍃 Vento</option>
  <option value="madeira" ${normalizarTipo(poder.tipo) === "madeira" ? "selected" : ""}>🌳 Madeira</option>
  <option value="terra" ${normalizarTipo(poder.tipo) === "terra" ? "selected" : ""}>🌍 Terra</option>
  <option value="trevas" ${normalizarTipo(poder.tipo) === "trevas" ? "selected" : ""}>🌑 Trevas</option>
  <option value="luz" ${normalizarTipo(poder.tipo) === "luz" ? "selected" : ""}>🌕 Luz</option>
  <option value="espirito" ${normalizarTipo(poder.tipo) === "espirito" ? "selected" : ""}>🌓 Espírito</option>
</select>

      <label class="popup-label">Dano</label>
      <input id="editPoderDano" value="${poder.dano || ""}">

      <label class="popup-label">Círculo</label>
<select id="editPoderCirculo" class="input-personagem">
  <option value="" ${(poder.circulo ?? "") === "" ? "selected" : ""}>Sem círculo (Poder)</option>
  <option value="0" ${String(poder.circulo ?? "") === "0" ? "selected" : ""}>Círculo 0 (Truque)</option>
  <option value="1" ${String(poder.circulo ?? "") === "1" ? "selected" : ""}>Círculo 1</option>
  <option value="2" ${String(poder.circulo ?? "") === "2" ? "selected" : ""}>Círculo 2</option>
  <option value="3" ${String(poder.circulo ?? "") === "3" ? "selected" : ""}>Círculo 3</option>
  <option value="4" ${String(poder.circulo ?? "") === "4" ? "selected" : ""}>Círculo 4</option>
  <option value="5" ${String(poder.circulo ?? "") === "5" ? "selected" : ""}>Círculo 5</option>
  <option value="6" ${String(poder.circulo ?? "") === "6" ? "selected" : ""}>Círculo 6</option>
  <option value="7" ${String(poder.circulo ?? "") === "7" ? "selected" : ""}>Círculo 7</option>
  <option value="8" ${String(poder.circulo ?? "") === "8" ? "selected" : ""}>Círculo 8</option>
  <option value="9" ${String(poder.circulo ?? "") === "9" ? "selected" : ""}>Círculo 9</option>
</select>

      <label class="popup-label">Conjuração</label>
      <input id="editPoderTempo" value="${poder.tempo || ""}">

      <label class="popup-label">Alcance</label>
      <input id="editPoderAlcance" value="${poder.alcance || ""}">

      <label class="popup-label">Duração</label>
      <input id="editPoderDuracao" value="${poder.duracao || ""}">

      <label class="popup-label">Descrição</label>
<textarea id="editPoderDesc">${poder.desc || ""}</textarea>

<div class="toggle-cargas" style="margin-top:10px;">
  <span class="toggle-cargas-texto">Possui uso</span>

  <label class="switch-cargas">
    <input
      type="checkbox"
      id="editPoderTemCargas"
      ${poder.temCargas ? "checked" : ""}
      onchange="toggleEditCampoCargasPoder()"
    >
    <span class="slider-cargas"></span>
  </label>
</div>

<input
  id="editPoderMaxCargas"
  type="number"
  min="1"
  max="30"
  placeholder="Qtd. de usos"
  value="${poder.maxCargas || ""}"
  style="display:${poder.temCargas ? "block" : "none"};"
>

<button class="popup-salvar-btn" onclick="salvarEdicaoPoder(${index})">
        Salvar
      </button>
    </div>
  `;

  abrirPopup("Editar poder", html, true, null);
}

function salvarEdicaoPoder(index) {
  const nome = document.getElementById("editPoderNome").value.trim();
  const tipo = document.getElementById("editPoderTipo").value.trim();
  const dano = document.getElementById("editPoderDano").value.trim();
  const circulo = document.getElementById("editPoderCirculo").value.trim();
  const tempo = document.getElementById("editPoderTempo").value.trim();
  const alcance = document.getElementById("editPoderAlcance").value.trim();
  const duracao = document.getElementById("editPoderDuracao").value.trim();
  const desc = document.getElementById("editPoderDesc").value.trim();

  const temCargas = !!document.getElementById("editPoderTemCargas")?.checked;
  const maxCargas = temCargas
    ? parseInt(document.getElementById("editPoderMaxCargas")?.value) || 0
    : 0;

  if (!nome) return;
  if (temCargas && maxCargas <= 0) return;

  const poderAnterior = poderes[index];

  let cargasGastas = [];

  if (temCargas) {
    if (
      poderAnterior?.temCargas &&
      poderAnterior.maxCargas === maxCargas &&
      Array.isArray(poderAnterior.cargasGastas)
    ) {
      cargasGastas = poderAnterior.cargasGastas;
    } else {
      cargasGastas = Array(maxCargas).fill(false);
    }
  }

  poderes[index] = {
    nome,
    tipo,
    dano,
    circulo,
    tempo,
    alcance,
    duracao,
    desc,
    temCargas,
    maxCargas,
    cargasGastas,
  };

  renderPoderes();
  salvarTudo();
  fecharPopup();
}

function atualizarTextoBotaoEdicao() {
  const btnItem = document.querySelector("#inventario .inv-add-btn");
  const btnArma = document.querySelector(
    "#combate .arma-add .inv-add-btn, #combate .arma-add button",
  );
  const btnPoder = document.querySelector("#poderes .inv-add-btn");

  if (btnItem) btnItem.textContent = editandoItem >= 0 ? "Salvar edição" : "+";
  if (btnArma) btnArma.textContent = editandoArma >= 0 ? "Salvar edição" : "+";
  if (btnPoder)
    btnPoder.textContent = editandoPoder >= 0 ? "Salvar edição" : "+";
}

function fecharPopup() {
  const popup = document.getElementById("popup");
  if (popup) popup.style.display = "none";
}

function salvarEdicaoArma(index) {
  const nome = document.getElementById("editArmaNome").value.trim();
  const dano = document.getElementById("editArmaDano").value.trim();
  const desc = document.getElementById("editArmaDesc").value.trim();

  const temCargas = !!document.getElementById("editArmaTemCargas")?.checked;
  const maxCargas = temCargas
    ? parseInt(document.getElementById("editArmaMaxCargas")?.value) || 0
    : 0;

  if (!nome) return;
  if (temCargas && maxCargas <= 0) return;

  const armaAnterior = armas[index];

  let cargasGastas = [];
  if (temCargas) {
    if (
      armaAnterior?.temCargas &&
      armaAnterior.maxCargas === maxCargas &&
      Array.isArray(armaAnterior.cargasGastas)
    ) {
      cargasGastas = armaAnterior.cargasGastas;
    } else {
      cargasGastas = Array(maxCargas).fill(false);
    }
  }

  armas[index] = {
    nome,
    dano,
    desc,
    temCargas,
    maxCargas,
    cargasGastas,
  };

  renderArmas();
  salvarTudo();
  fecharPopup();
}

/* ================= ABAS ================= */

function trocarAba(id, btn = null) {
  const abas = document.querySelectorAll(".aba");
  const novaAba = document.getElementById(id);
  const abaAtual = document.querySelector(".aba.active");
  const saindoDoCombate =
    abaAtual && abaAtual.id === "combate" && id !== "combate";

  if (saindoDoCombate) {
    document.body.classList.remove("low-hp");
  }

  if (!novaAba) return;

  if (abaAtual === novaAba) {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));

    if (btn) {
      btn.classList.add("active");
    } else {
      const botao = document.querySelector(`.tab-btn[onclick*="${id}"]`);
      if (botao) botao.classList.add("active");
    }

    setTimeout(() => {
      ativarDragImagemPreview();
    }, 100);

    atualizarEstadoLowHP();
    return;
  }

  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));

  if (btn) {
    btn.classList.add("active");
  } else {
    const botao = document.querySelector(`.tab-btn[onclick*="${id}"]`);
    if (botao) botao.classList.add("active");
  }

  if (abaAtual) {
    abaAtual.classList.remove("show");
    abaAtual.classList.add("hiding");

    setTimeout(() => {
      abaAtual.classList.remove("active", "hiding");
      abaAtual.style.display = "none";
    }, 250);
  }

  abas.forEach((aba) => {
    if (aba !== novaAba) {
      aba.classList.remove("show", "hiding");
    }
  });

  novaAba.style.display = "block";
  novaAba.classList.add("active");

  atualizarEstadoLowHP();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      novaAba.classList.add("show");
    });
  });

  setTimeout(() => {
    if (id === "personagem") {
      ativarDragImagemPreview();
    }
  }, 100);
}

function entrarFicha() {
  const telaInicial = document.getElementById("tela-inicial");
  const ficha = document.getElementById("ficha");

  if (telaInicial) telaInicial.style.display = "none";
  if (ficha) ficha.style.display = "block";

  trocarAba("personagem");
}

function voltarInicio() {
  const telaInicial = document.getElementById("tela-inicial");
  const ficha = document.getElementById("ficha");

  if (telaInicial) telaInicial.style.display = "block";
  if (ficha) ficha.style.display = "none";
}

/* ================= PERSONAGENS ================= */

function renderPersonagens() {
  const div = document.getElementById("listaPersonagens");
  if (!div) return;

  div.innerHTML = "";

  personagens.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.backgroundImage = `url('${p.imagem || ""}')`;

    const posX = p.imagemPosX ?? 50;
    const posY = p.imagemPosY ?? 50;
    card.style.backgroundPosition = `${posX}% ${posY}%`;
    card.style.backgroundSize = "cover";

    card.innerHTML = `
      <div class="card-info">
        <span class="card-nome">${p.nome || "Sem nome"}</span>
        <span class="card-classe">${p.classe || "Sem classe"}</span>
      </div>

      <div class="card-acoes">
        <button
          type="button"
          class="btn-duplicar"
          onclick="duplicarPersonagem(${i}); event.stopPropagation();"
        >⧉</button>

        <button
          type="button"
          class="btn-deletar"
          onclick="deletarPersonagem(${i}); event.stopPropagation();"
        >X</button>
      </div>
    `;

    card.onclick = () => {
      if (modoExportacao) {
        modoExportacao = false;
        exportarFicha(i);
        return;
      }

      personagemAtual = i;
      carregarPersonagem(i);
    };
    div.appendChild(card);
  });

  const add = document.createElement("div");
  add.className = "card add";
  add.innerText = "+";
  add.onclick = criarPersonagem;
  div.appendChild(add);
}

function duplicarPersonagem(index) {
  const original = personagens[index];
  if (!original) return;

  const copia = JSON.parse(JSON.stringify(original));
  copia.nome = (original.nome || "Sem nome") + " (Cópia)";

  personagens.push(copia);
  salvarPersonagens();
  renderPersonagens();
}

function toggleSecao(id, titulo) {
  const box = document.getElementById(id);
  if (!box) return;

  box.classList.toggle("fechado");

  const estaFechado = box.classList.contains("fechado");

  if (titulo) {
    titulo.classList.toggle("fechado", estaFechado);
  }

  localStorage.setItem("secao_" + id, estaFechado ? "fechada" : "aberta");
}

function restaurarSecoes() {
  const secoes = document.querySelectorAll(".conteudo-toggle");

  secoes.forEach((box) => {
    const id = box.id;
    if (!id) return;

    const estado = localStorage.getItem("secao_" + id);
    const titulo = document.querySelector(`[onclick*="${id}"]`);

    if (estado === "fechada") {
      box.classList.add("fechado");
      if (titulo) titulo.classList.add("fechado");
    } else {
      box.classList.remove("fechado");
      if (titulo) titulo.classList.remove("fechado");
    }
  });
}

function renderAliados() {
  const ul = document.getElementById("listaAliados");
  if (!ul || personagemAtual === null) return;

  ul.innerHTML = "";

  const p = personagens[personagemAtual];
  if (!Array.isArray(p.aliados)) {
    p.aliados = [];
  }

  p.aliados.forEach((aliado, index) => {
    const li = document.createElement("li");
    li.className = "item-card";

    li.innerHTML = `
      <div class="item-info">
        <strong class="item-nome">${aliado.nome || "Sem nome"}</strong>
        ${aliado.local ? `<div class="aliado-local">📍 ${aliado.local}</div>` : ""}
        <p class="item-preview">
          ${aliado.desc ? aliado.desc.substring(0, 80) + (aliado.desc.length > 80 ? "..." : "") : "Sem descrição"}
        </p>
      </div>

      <div class="item-acoes">
        <div class="acoes-topo">
          <button type="button" class="btn-editar" onclick="event.stopPropagation(); editarAliado(${index})">✏️</button>
        </div>
        <button type="button" class="item-remover" onclick="event.stopPropagation(); removerAliado(${index})">X</button>
      </div>
    `;

    ul.appendChild(li);
  });
}

function removerAliado(index) {
  const p = personagens[personagemAtual];
  if (!p || !Array.isArray(p.aliados)) return;

  p.aliados.splice(index, 1);

  if (editandoAliado === index) {
    editandoAliado = -1;
    document.getElementById("aliadoNome").value = "";
    document.getElementById("aliadoDesc").value = "";
  } else if (editandoAliado > index) {
    editandoAliado--;
  }

  salvarTudo();
  renderAliados();
}

function toggleDominio(index) {
  dominio[index] = !dominio[index];
  renderDominio();
  salvarTudo();
}

function renderDominio() {
  const checks = document.querySelectorAll(".dominio-check");
  if (!checks.length) return;

  checks.forEach((check, i) => {
    check.classList.toggle("ativo", !!dominio[i]);
  });
}

function toggleCampoCargas() {
  const check = document.getElementById("armaTemCargas");
  const input = document.getElementById("armaMaxCargas");

  if (!check || !input) return;

  if (check.checked) {
    input.style.display = "block";
  } else {
    input.style.display = "none";
    input.value = "";
  }
}
function editarAliado(index) {
  const p = personagens[personagemAtual];
  if (!p || !Array.isArray(p.aliados)) return;

  const aliado = p.aliados[index];
  if (!aliado) return;

  const html = `
    <div class="popup-form">
      <label class="popup-label">Nome</label>
      <input id="editAliadoNome" value="${aliado.nome || ""}">

      <label class="popup-label">Região / Local</label>
      <input id="editAliadoLocal" value="${aliado.local || ""}">

      <label class="popup-label">Descrição</label>
      <textarea id="editAliadoDesc">${aliado.desc || ""}</textarea>

      <button class="popup-salvar-btn" onclick="salvarEdicaoAliado(${index})">
        Salvar
      </button>
    </div>
  `;

  abrirPopup("Editar aliado", html, true, null);
}

function salvarEdicaoAliado(index) {
  const p = personagens[personagemAtual];
  if (!p || !Array.isArray(p.aliados)) return;

  const nome = document.getElementById("editAliadoNome").value.trim();
  const local = document.getElementById("editAliadoLocal").value.trim();
  const desc = document.getElementById("editAliadoDesc").value.trim();

  if (!nome) return;

  p.aliados[index] = {
    nome,
    local,
    desc,
  };

  salvarTudo();
  renderAliados();
  fecharPopup();
}

function adicionarAliado() {
  const nome = document.getElementById("aliadoNome").value.trim();
  const local = document.getElementById("aliadoLocal").value.trim();
  const desc = document.getElementById("aliadoDesc").value.trim();

  if (!nome) return;

  const p = personagens[personagemAtual];
  if (!Array.isArray(p.aliados)) {
    p.aliados = [];
  }

  p.aliados.push({
    nome,
    local,
    desc,
  });

  document.getElementById("aliadoNome").value = "";
  document.getElementById("aliadoLocal").value = "";
  document.getElementById("aliadoDesc").value = "";

  salvarTudo();
  renderAliados();
}

function criarPersonagem() {
  const novo = {
    nome: "",
    classe: "",
    raca: "",
    idade: "",
    altura: "",
    nivel: "",
    imagem: "",
    imagemPosX: 50,
    imagemPosY: 50,
    antecedentes: "",
    idiomas: "",
    diario: "",
    proficienciasExtras: "",
    gastosCirculos: {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
    },

    vidaMax: 50,
    vidaAtual: 50,
    vidaTemp: 0,
    ca: "",
    deslocamento: 9,

    forca: 10,
    destreza: 10,
    constituicao: 10,
    inteligencia: 10,
    sabedoria: 10,
    carisma: 10,
    bonusProf: 2,

    armaduras: [],
    aliados: [],
    inventario: [],
    armas: [],
    poderes: [],
    profs: {},
    saves: {},
    exaustao: 0,
    inspiracao: 0,
    dtBase: 8,
    dtAtributo: 0,
    dtProf: 2,
    dominio: [false, false, false, false, false, false],
    morte: {
      sucessos: [false, false, false],
      falhas: [false, false, false],
    },
  };

  personagens.push(novo);
  salvarPersonagens();
  renderPersonagens();
}

function deletarPersonagem(index) {
  if (!confirm("Tem certeza que quer excluir?")) return;

  personagens.splice(index, 1);
  salvarPersonagens();
  renderPersonagens();

  if (personagemAtual === index) {
    personagemAtual = null;
    voltarInicio();
  }
}

function toggleDiario() {
  const box = document.getElementById("diario-box");
  if (!box) return;

  if (box.style.display === "none" || box.style.display === "") {
    box.style.display = "block";
  } else {
    box.style.display = "none";
  }
}

function addArmadura() {
  const nome = document.getElementById("armaduraNome").value.trim();
  const ca = document.getElementById("armaduraCA").value.trim();
  const desc = document.getElementById("armaduraDesc").value.trim();

  const temCargasEl = document.getElementById("armaduraTemCargas");
  const maxCargasEl = document.getElementById("armaduraMaxCargas");

  const temCargas = !!temCargasEl?.checked;
  const maxCargas = temCargas ? parseInt(maxCargasEl?.value) || 0 : 0;

  if (!nome) return;
  if (temCargas && maxCargas <= 0) return;

  const novaArmadura = {
    nome,
    ca,
    desc,
    temCargas,
    maxCargas,
    cargasGastas: temCargas ? Array(maxCargas).fill(false) : [],
  };

  if (editandoArmadura >= 0) {
    const armaduraAnterior = armaduras[editandoArmadura];

    if (
      armaduraAnterior?.temCargas &&
      temCargas &&
      armaduraAnterior.maxCargas === maxCargas &&
      Array.isArray(armaduraAnterior.cargasGastas)
    ) {
      novaArmadura.cargasGastas = armaduraAnterior.cargasGastas;
    }

    armaduras[editandoArmadura] = novaArmadura;
    editandoArmadura = -1;
  } else {
    armaduras.push(novaArmadura);
  }

  renderArmaduras();
  salvarTudo();

  document.getElementById("armaduraNome").value = "";
  document.getElementById("armaduraCA").value = "";
  document.getElementById("armaduraDesc").value = "";

  if (temCargasEl) temCargasEl.checked = false;
  if (maxCargasEl) {
    maxCargasEl.value = "";
    maxCargasEl.style.display = "none";
  }
}

function toggleCargaArmadura(indexArmadura, indexCarga) {
  const armadura = armaduras[indexArmadura];
  if (!armadura || !armadura.temCargas || !Array.isArray(armadura.cargasGastas))
    return;

  armadura.cargasGastas[indexCarga] = !armadura.cargasGastas[indexCarga];
  renderArmaduras();
  salvarTudo();
}

function renderArmaduras() {
  const ul = document.getElementById("listaArmaduras");
  if (!ul) return;

  ul.innerHTML = "";

  armaduras.forEach((armadura, index) => {
    const li = document.createElement("li");
    li.className = "armadura-card";

    const cargasHTML =
      armadura.temCargas && armadura.maxCargas > 0
        ? `
        <div class="arma-cargas-box">
          <span class="arma-cargas-label">Cargas</span>
          <div class="arma-cargas-checks">
            ${Array.from(
              { length: armadura.maxCargas },
              (_, i) => `
              <div
                class="arma-carga-check ${armadura.cargasGastas?.[i] ? "ativo" : ""}"
                onclick="event.stopPropagation(); toggleCargaArmadura(${index}, ${i})"
              ></div>
            `,
            ).join("")}
          </div>
        </div>
      `
        : "";

    li.innerHTML = `
      <div class="armadura-info" onclick="verArmadura(${index})">
        <strong class="armadura-nome">${armadura.nome || "Sem nome"}</strong>
        <p class="armadura-ca-preview">CA: ${armadura.ca || "Sem CA"}</p>
        <p class="armadura-desc-preview">
          ${armadura.desc ? armadura.desc.substring(0, 60) + (armadura.desc.length > 60 ? "..." : "") : "Sem descrição"}
        </p>
        ${cargasHTML}
      </div>

      <div class="item-acoes">
        <button type="button" class="btn-editar" onclick="event.stopPropagation(); editarArmadura(${index})">✏️</button>
        <button type="button" class="arma-remover" onclick="event.stopPropagation(); removerArmadura(${index})">X</button>
      </div>
    `;

    ul.appendChild(li);
  });
}

function toggleCampoCargasArmadura() {
  const check = document.getElementById("armaduraTemCargas");
  const input = document.getElementById("armaduraMaxCargas");

  if (!check || !input) return;

  if (check.checked) {
    input.style.display = "block";
  } else {
    input.style.display = "none";
    input.value = "";
  }
}

function verArmadura(index) {
  const armadura = armaduras[index];
  if (!armadura) return;

  const html = `
    <div class="popup-bloco">
      <div>
        <span class="popup-label">CA</span>
        <div class="popup-descricao">${armadura.ca || "Sem CA"}</div>
      </div>

      <div style="margin-top: 12px;">
        <span class="popup-label">Descrição</span>
        <div class="popup-descricao">${armadura.desc || "Sem descrição"}</div>
      </div>
    </div>
  `;

  abrirPopup(armadura.nome || "Sem nome", html, true, () =>
    editarArmadura(index),
  );
}

function editarArmadura(index) {
  const armadura = armaduras[index];
  if (!armadura) return;

  const html = `
    <div class="popup-form">
      <label class="popup-label">Nome</label>
      <input id="editArmaduraNome" value="${armadura.nome || ""}">

      <label class="popup-label">CA</label>
      <input id="editArmaduraCA" value="${armadura.ca || ""}">

      <label class="popup-label">Descrição</label>
      <textarea id="editArmaduraDesc">${armadura.desc || ""}</textarea>

      <div class="toggle-cargas" style="margin-top:10px;">
        <span class="toggle-cargas-texto">Usa cargas</span>

        <label class="switch-cargas">
          <input
            type="checkbox"
            id="editArmaduraTemCargas"
            ${armadura.temCargas ? "checked" : ""}
            onchange="toggleEditCampoCargasArmadura()"
          >
          <span class="slider-cargas"></span>
        </label>
      </div>

      <input
        id="editArmaduraMaxCargas"
        type="number"
        min="1"
        max="20"
        placeholder="Qtd. de cargas"
        value="${armadura.maxCargas || ""}"
        style="display:${armadura.temCargas ? "block" : "none"};"
      >

      <button class="popup-salvar-btn" onclick="salvarEdicaoArmadura(${index})">
        Salvar
      </button>
    </div>
  `;

  abrirPopup("Editar armadura", html, true, null);
}

function toggleEditCampoCargasArmadura() {
  const check = document.getElementById("editArmaduraTemCargas");
  const input = document.getElementById("editArmaduraMaxCargas");

  if (!check || !input) return;

  if (check.checked) {
    input.style.display = "block";
  } else {
    input.style.display = "none";
    input.value = "";
  }
}

function salvarEdicaoArmadura(index) {
  const nome = document.getElementById("editArmaduraNome").value.trim();
  const ca = document.getElementById("editArmaduraCA").value.trim();
  const desc = document.getElementById("editArmaduraDesc").value.trim();

  const temCargas = !!document.getElementById("editArmaduraTemCargas")?.checked;
  const maxCargas = temCargas
    ? parseInt(document.getElementById("editArmaduraMaxCargas")?.value) || 0
    : 0;

  if (!nome) return;
  if (temCargas && maxCargas <= 0) return;

  const armaduraAnterior = armaduras[index];

  let cargasGastas = [];
  if (temCargas) {
    if (
      armaduraAnterior?.temCargas &&
      armaduraAnterior.maxCargas === maxCargas &&
      Array.isArray(armaduraAnterior.cargasGastas)
    ) {
      cargasGastas = armaduraAnterior.cargasGastas;
    } else {
      cargasGastas = Array(maxCargas).fill(false);
    }
  }

  armaduras[index] = {
    nome,
    ca,
    desc,
    temCargas,
    maxCargas,
    cargasGastas,
  };

  renderArmaduras();
  salvarTudo();
  fecharPopup();
}

function removerArmadura(index) {
  const armadura = armaduras[index];
  if (!armadura) return;

  const confirmar = confirm(`Remover "${armadura.nome}"?`);
  if (!confirmar) return;

  armaduras.splice(index, 1);
  renderArmaduras();
  salvarTudo();
}

function carregarPersonagem(index) {
  personagemAtual = index;
  const p = personagens[index];
  if (!p) return;

  document.getElementById("classe").value = p.classe || "";
  document.getElementById("nome").value = p.nome || "";
  const racaSelect = document.getElementById("racaSelect");
  if (racaSelect) {
    racaSelect.value = p.racaSelect || p.raca || "";
  }
  bonusRacaCustom = p.bonusRacaCustom || {
    forca: 0,
    destreza: 0,
    constituicao: 0,
    inteligencia: 0,
    sabedoria: 0,
    carisma: 0,
  };
  document.getElementById("idade").value = p.idade || "";
  document.getElementById("altura").value = p.altura || "";
  document.getElementById("nivel").value = p.nivel || "";
  document.getElementById("antecedentes").value = p.antecedentes || "";
  document.getElementById("vidaMax").value = p.vidaMax ?? 50;
  document.getElementById("ca").value = p.ca ?? "";
  document.getElementById("deslocamento").value = p.deslocamento ?? 9;
  const antecedenteSelect = document.getElementById("antecedenteSelect");
  if (antecedenteSelect)
    antecedenteSelect.value = p.antecedenteSelect || p.antecedentes || "custom";
  document.getElementById("idiomas").value = p.idiomas || "";

  const resistenciasEl = document.getElementById("resistencias");
  const diarioEl = document.getElementById("diario");

  if (resistenciasEl) resistenciasEl.value = p.resistencias || "";
  if (diarioEl) diarioEl.value = p.diario || "";

  document.getElementById("forca").value = p.forca ?? 10;
  document.getElementById("destreza").value = p.destreza ?? 10;
  document.getElementById("constituicao").value = p.constituicao ?? 10;
  document.getElementById("inteligencia").value = p.inteligencia ?? 10;
  document.getElementById("sabedoria").value = p.sabedoria ?? 10;
  document.getElementById("carisma").value = p.carisma ?? 10;
  document.getElementById("bonusProf").value = p.bonusProf ?? 2;

  const inspiracao = document.getElementById("inspiracao");
  if (inspiracao) inspiracao.value = p.inspiracao ?? 0;

  const profExtras = document.getElementById("proficienciasExtras");
  if (profExtras) profExtras.value = p.proficienciasExtras || "";

  const dtBase = document.getElementById("dtBase");
  const dtAtributo = document.getElementById("dtAtributo");
  const dtProf = document.getElementById("dtProf");

  if (dtBase) dtBase.value = p.dtBase ?? 8;
  if (dtAtributo) dtAtributo.value = p.dtAtributo ?? 0;
  if (dtProf) dtProf.value = p.dtProf ?? 2;

  document.getElementById("preview").src = p.imagem || "";
  imagemBase64 = p.imagem || "";

  const nomeArquivo = document.getElementById("nome-arquivo");
  if (nomeArquivo) {
    nomeArquivo.innerText = p.imagem
      ? "Imagem carregada"
      : "Nenhum arquivo escolhido";
  }

  imagemPosX = p.imagemPosX ?? 50;
  imagemPosY = p.imagemPosY ?? 50;

  const preview = document.getElementById("preview");
  if (preview) {
    preview.style.objectPosition = `${imagemPosX}% ${imagemPosY}%`;
  }

  dominio = p.dominio || [false, false, false, false, false, false];
  vidaAtual = p.vidaAtual ?? 50;
  vidaTemp = p.vidaTemp ?? 0;
  inventario = p.inventario || [];
  armas = p.armas || [];
  poderes = p.poderes || [];
  profs = p.profs || {};
  armaduras = p.armaduras || [];
  nomeRacaCustom = p.nomeRacaCustom || "";
  atualizarNomeOpcaoCustom();
  gastosCirculos = p.gastosCirculos || {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
  };

  for (let i = 0; i <= 9; i++) {
    if (!Array.isArray(gastosCirculos[i])) {
      gastosCirculos[i] = [];
    }
    renderSlotsCirculo(i);
  }
  saves = p.saves || {};
  exaustao = p.exaustao ?? 0;
  morte = p.morte || {
    sucessos: [false, false, false],
    falhas: [false, false, false],
  };

  renderInv();
  renderArmas();
  renderPoderes();
  atualizarTudo();
  atualizarSaves();
  atualizarBadgesSaves();
  atualizarHP();
  atualizarTemp();
  setExaustao(exaustao);
  atualizarMorte();
  atualizarDT();
  entrarFicha();
  renderAliados();
  renderDominio();
  restaurarSecoes();
  renderArmaduras();

  setTimeout(() => {
    ativarDragImagemPreview();
  }, 100);
}

/* ================= SALVAR ================= */

function salvarTudo() {
  if (personagemAtual === null) return;

  const p = personagens[personagemAtual];
  if (!p) return;

  p.nome = document.getElementById("nome").value;
  p.classe = document.getElementById("classe").value;
  p.racaSelect = document.getElementById("racaSelect")?.value || "custom";
  p.raca = p.racaSelect;
  p.bonusRacaCustom = bonusRacaCustom;
  p.idade = document.getElementById("idade").value;
  p.nomeRacaCustom = nomeRacaCustom;
  p.altura = document.getElementById("altura").value;
  p.nivel = document.getElementById("nivel")?.value || "";
  p.antecedentes = document.getElementById("antecedentes")?.value || "";
  p.idiomas = document.getElementById("idiomas").value;
  p.armaduras = armaduras;
  p.proficienciasExtras =
    document.getElementById("proficienciasExtras")?.value || "";
  p.imagem = imagemBase64;
  p.imagemPosX = imagemPosX;
  p.imagemPosY = imagemPosY;
  const resistenciasEl = document.getElementById("resistencias");
  const diarioEl = document.getElementById("diario");

  p.resistencias = resistenciasEl ? resistenciasEl.value : "";
  p.diario = diarioEl ? diarioEl.value : "";

  p.vidaMax = get("vidaMax");
  p.vidaAtual = vidaAtual;
  p.vidaTemp = vidaTemp;
  p.ca = document.getElementById("ca").value;
  p.deslocamento = document.getElementById("deslocamento").value;

  p.forca = get("forca");
  p.destreza = get("destreza");
  p.constituicao = get("constituicao");
  p.inteligencia = get("inteligencia");
  p.sabedoria = get("sabedoria");
  p.carisma = get("carisma");
  p.bonusProf = get("bonusProf");

  p.inventario = inventario;
  p.armas = armas;
  p.poderes = poderes;
  p.gastosCirculos = gastosCirculos;
  p.profs = profs;
  p.saves = saves;
  p.exaustao = exaustao;
  p.morte = morte;
  p.dominio = dominio;

  const inspiracao = document.getElementById("inspiracao");
  const dtBase = document.getElementById("dtBase");
  const dtAtributo = document.getElementById("dtAtributo");
  const dtProf = document.getElementById("dtProf");

  p.inspiracao = inspiracao ? inspiracao.value : 0;
  p.dtBase = dtBase ? dtBase.value : 8;
  p.dtAtributo = dtAtributo ? dtAtributo.value : 0;
  p.dtProf = dtProf ? dtProf.value : 2;

  salvarPersonagens();
  renderPersonagens();
}

/* ================= IMAGEM ================= */

function atualizarNomeOpcaoCustom() {
  const optionCustom = document.querySelector(
    '#racaSelect option[value="custom"]',
  );
  if (!optionCustom) return;

  optionCustom.textContent = nomeRacaCustom?.trim()
    ? nomeRacaCustom.trim()
    : "Raças Personalizadas";
}

function previewImagem() {
  const input = document.getElementById("imagem");
  const preview = document.getElementById("preview");
  const nomeArquivo = document.getElementById("nome-arquivo");

  if (!input || !preview || !input.files || !input.files[0]) return;

  const file = input.files[0];
  if (nomeArquivo) nomeArquivo.innerText = file.name;

  const reader = new FileReader();
  reader.onload = function (e) {
    imagemBase64 = e.target.result;
    imagemPosX = 50;
    imagemPosY = 50;

    preview.src = imagemBase64;
    preview.style.objectPosition = `${imagemPosX}% ${imagemPosY}%`;

    salvarTudo();
    renderPersonagens();
  };

  reader.readAsDataURL(file);
}

function abrirEditorImagem() {
  if (!imagemBase64) {
    alert("Escolha uma imagem primeiro.");
    return;
  }

  const editorWrap = document.getElementById("editorImagemInline");
  const editor = document.getElementById("previewEditor");

  if (!editorWrap || !editor) return;

  editor.src = imagemBase64;
  editor.style.objectPosition = `${imagemPosX}% ${imagemPosY}%`;

  editorWrap.classList.remove("fechado");
  ativarDragEditorImagem();
}

function fecharEditorImagem() {
  const editorWrap = document.getElementById("editorImagemInline");
  if (editorWrap) {
    editorWrap.classList.add("fechado");
  }
}

function salvarEditorImagem() {
  const preview = document.getElementById("preview");
  if (preview) {
    preview.style.objectPosition = `${imagemPosX}% ${imagemPosY}%`;
  }

  salvarTudo();
  renderPersonagens();
  fecharEditorImagem();
}

function ativarDragEditorImagem() {
  const img = document.getElementById("previewEditor");
  if (!img) return;

  if (img.dataset.dragAtivo === "1") return;
  img.dataset.dragAtivo = "1";

  let arrastando = false;
  let ultimoX = 0;
  let ultimoY = 0;

  function aplicarPosicao() {
    imagemPosX = Math.max(0, Math.min(100, imagemPosX));
    imagemPosY = Math.max(0, Math.min(100, imagemPosY));
    img.style.objectPosition = `${imagemPosX}% ${imagemPosY}%`;
  }

  img.addEventListener("mousedown", (e) => {
    arrastando = true;
    ultimoX = e.clientX;
    ultimoY = e.clientY;
    img.classList.add("arrastando");
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!arrastando) return;

    const dx = e.clientX - ultimoX;
    const dy = e.clientY - ultimoY;

    ultimoX = e.clientX;
    ultimoY = e.clientY;

    imagemPosX -= dx * 0.2;
    imagemPosY -= dy * 0.2;

    aplicarPosicao();
  });

  document.addEventListener("mouseup", () => {
    if (!arrastando) return;
    arrastando = false;
    img.classList.remove("arrastando");
  });

  img.addEventListener(
    "touchstart",
    (e) => {
      if (!e.touches[0]) return;
      arrastando = true;
      ultimoX = e.touches[0].clientX;
      ultimoY = e.touches[0].clientY;
      img.classList.add("arrastando");
    },
    { passive: true },
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!arrastando || !e.touches[0]) return;

      const dx = e.touches[0].clientX - ultimoX;
      const dy = e.touches[0].clientY - ultimoY;

      ultimoX = e.touches[0].clientX;
      ultimoY = e.touches[0].clientY;

      imagemPosX -= dx * 0.2;
      imagemPosY -= dy * 0.2;

      aplicarPosicao();
    },
    { passive: true },
  );

  document.addEventListener("touchend", () => {
    if (!arrastando) return;
    arrastando = false;
    img.classList.remove("arrastando");
  });

  aplicarPosicao();
}

/* ================= INVENTÁRIO ================= */

function addItem() {
  const nome = document.getElementById("itemNome")?.value.trim();
  const desc = document.getElementById("itemDesc")?.value.trim();
  const qtd = parseInt(document.getElementById("itemQtd")?.value) || 1;
  const requerSintonia =
    !!document.getElementById("itemRequerSintonia")?.checked;
  const sintonizado =
    requerSintonia && !!document.getElementById("itemSintonizado")?.checked;

  if (!nome) return;

  const novoItem = {
    nome,
    desc,
    qtd,
    requerSintonia,
    sintonizado,
  };

  if (editandoItem >= 0) {
    inventario[editandoItem] = novoItem;
    editandoItem = -1;
  } else {
    inventario.push(novoItem);
  }

  renderInv();
  salvarTudo();

  document.getElementById("itemNome").value = "";
  document.getElementById("itemDesc").value = "";
  document.getElementById("itemQtd").value = "";
  document.getElementById("itemRequerSintonia").checked = false;
  document.getElementById("itemSintonizado").checked = false;
  document.getElementById("boxItemSintonizado").style.display = "none";
}

function toggleSintoniaItem() {
  const requer = document.getElementById("itemRequerSintonia");
  const box = document.getElementById("boxItemSintonizado");
  const sintonizado = document.getElementById("itemSintonizado");

  if (!requer || !box || !sintonizado) return;

  if (requer.checked) {
    box.style.display = "block";
  } else {
    box.style.display = "none";
    sintonizado.checked = false;
  }
}

function renderInv() {
  const ul = document.getElementById("lista");
  if (!ul) return;

  ul.innerHTML = "";

  inventario.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "item-card";

    li.innerHTML = `
      <div class="item-info" onclick="verItem(${index})">
        <div class="item-topo-linha">
          <strong class="item-nome">
            ${item.nome || "Sem nome"}
            ${item.requerSintonia ? `<span class="item-tag-sintonia">${item.sintonizado ? "Sint." : "Req. Sint."}</span>` : ""}
          </strong>

          <span class="item-qtd-badge">x${item.qtd || 1}</span>
        </div>

        <div class="item-subtags">
          ${item.requerSintonia ? `<span class="item-subtag">🔗 Requer sintonia</span>` : ""}
          ${item.sintonizado ? `<span class="item-subtag ativo">✅ Sintonizado</span>` : ""}
        </div>

        <p class="item-preview">
          ${item.desc ? item.desc.substring(0, 60) + (item.desc.length > 60 ? "..." : "") : "Sem descrição"}
        </p>
      </div>

      <div class="item-acoes">
        <div class="acoes-topo">
          <button type="button" class="btn-mover" onclick="event.stopPropagation(); moverItemCima(${index})">↑</button>
          <button type="button" class="btn-mover" onclick="event.stopPropagation(); moverItemBaixo(${index})">↓</button>
          <button type="button" class="btn-editar" onclick="event.stopPropagation(); editarItem(${index})">✏️</button>
        </div>

        <button type="button" class="item-remover" onclick="event.stopPropagation(); removerItem(${index})">X</button>
      </div>
    `;

    ul.appendChild(li);
  });
}

function toggleEditSintoniaItem() {
  const requer = document.getElementById("editItemRequerSintonia");
  const box = document.getElementById("boxEditItemSintonizado");
  const sintonizado = document.getElementById("editItemSintonizado");

  if (!requer || !box) return;

  if (requer.checked) {
    box.style.display = "block";
  } else {
    box.style.display = "none";
    if (sintonizado) sintonizado.checked = false;
  }
}

function moverItemCima(index) {
  if (index <= 0) return;

  const lista = document.getElementById("lista");
  const item = lista.children[index];

  item.classList.add("item-animar-cima");

  setTimeout(() => {
    [inventario[index - 1], inventario[index]] = [
      inventario[index],
      inventario[index - 1],
    ];
    renderInv();
    salvarTudo();
  }, 200);
}

function moverItemBaixo(index) {
  if (index >= inventario.length - 1) return;

  const lista = document.getElementById("lista");
  const item = lista.children[index];

  item.classList.add("item-animar-baixo");

  setTimeout(() => {
    [inventario[index + 1], inventario[index]] = [
      inventario[index],
      inventario[index + 1],
    ];
    renderInv();
    salvarTudo();
  }, 200);
}

function verItem(index) {
  const item = inventario[index];
  if (!item) return;

  const html = `
  <div class="popup-bloco">
    <div>
      <span class="popup-label">Quantidade</span>
      <div class="popup-descricao popup-descricao-pequena">${item.qtd || 1}</div>
    </div>

    <div style="margin-top: 12px;">
      <span class="popup-label">Sintonia</span>
      <div class="popup-descricao popup-descricao-pequena">
        ${
          item.requerSintonia
            ? item.sintonizado
              ? "Requer sintonia — Sintonizado"
              : "Requer sintonia — Não sintonizado"
            : "Não requer sintonia"
        }
      </div>
    </div>

    <div style="margin-top: 12px;">
      <span class="popup-label">Descrição</span>
      <div class="popup-descricao popup-descricao-grande">${item.desc || "Sem descrição"}</div>
    </div>
  </div>
`;

  abrirPopup(item.nome || "Sem nome", html, true, () => editarItem(index));
}

function removerItem(index) {
  const item = inventario[index];
  if (!item) return;

  const confirmar = confirm(`Remover "${item.nome}"?`);
  if (!confirmar) return;

  inventario.splice(index, 1);
  renderInv();
  salvarTudo();
}

/* ================= ARMAS ================= */

function addArma() {
  const nome = document.getElementById("armaNome").value.trim();
  const dano = document.getElementById("armaDano").value.trim();
  const descEl = document.getElementById("armaDesc");
  const desc = descEl ? descEl.value.trim() : "";

  const temCargasEl = document.getElementById("armaTemCargas");
  const maxCargasEl = document.getElementById("armaMaxCargas");

  const temCargas = !!temCargasEl?.checked;
  const maxCargas = temCargas ? parseInt(maxCargasEl?.value) || 0 : 0;

  if (!nome) return;
  if (temCargas && maxCargas <= 0) return;

  const novaArma = {
    nome,
    dano,
    desc,
    temCargas,
    maxCargas,
    cargasGastas: temCargas ? Array(maxCargas).fill(false) : [],
  };

  if (editandoArma >= 0) {
    const armaAnterior = armas[editandoArma];

    if (
      armaAnterior?.temCargas &&
      temCargas &&
      armaAnterior.maxCargas === maxCargas &&
      Array.isArray(armaAnterior.cargasGastas)
    ) {
      novaArma.cargasGastas = armaAnterior.cargasGastas;
    }

    armas[editandoArma] = novaArma;
    editandoArma = -1;
  } else {
    armas.push(novaArma);
  }

  renderArmas();
  salvarTudo();

  document.getElementById("armaNome").value = "";
  document.getElementById("armaDano").value = "";
  if (descEl) descEl.value = "";

  if (temCargasEl) temCargasEl.checked = false;
  if (maxCargasEl) {
    maxCargasEl.value = "";
    maxCargasEl.style.display = "none";
  }
}

function renderArmas() {
  const ul = document.getElementById("listaArmas");
  if (!ul) return;

  ul.innerHTML = "";

  armas.forEach((arma, index) => {
    const li = document.createElement("li");
    li.className = "arma-card";

    const cargasHTML =
      arma.temCargas && arma.maxCargas > 0
        ? `
        <div class="arma-cargas-box">
          <span class="arma-cargas-label">Cargas</span>
          <div class="arma-cargas-checks">
            ${Array.from(
              { length: arma.maxCargas },
              (_, i) => `
              <div
                class="arma-carga-check ${arma.cargasGastas?.[i] ? "ativo" : ""}"
                onclick="event.stopPropagation(); toggleCargaArma(${index}, ${i})"
              ></div>
            `,
            ).join("")}
          </div>
        </div>
      `
        : "";

    li.innerHTML = `
      <div class="arma-info" onclick="verArma(${index})">
        <strong class="arma-nome">${arma.nome || "Sem nome"}</strong>
        <p class="arma-dano-preview">${arma.dano || "Sem dano"}</p>
        <p class="arma-desc-preview">
          ${arma.desc ? arma.desc.substring(0, 60) + (arma.desc.length > 60 ? "..." : "") : "Sem descrição"}
        </p>
        ${cargasHTML}
      </div>

      <div class="item-acoes">
        <button type="button" class="btn-editar" onclick="event.stopPropagation(); editarArma(${index})">✏️</button>
        <button type="button" class="arma-remover" onclick="event.stopPropagation(); removerArma(${index})">X</button>
      </div>
    `;

    ul.appendChild(li);
  });
}

function toggleCargaArma(indexArma, indexCarga) {
  const arma = armas[indexArma];
  if (!arma || !arma.temCargas || !Array.isArray(arma.cargasGastas)) return;

  arma.cargasGastas[indexCarga] = !arma.cargasGastas[indexCarga];
  renderArmas();
  salvarTudo();
}

function verArma(index) {
  const arma = armas[index];
  if (!arma) return;

  const html = `
    <div class="popup-bloco">
      <div>
        <span class="popup-label">Dano</span>
        <div class="popup-tags">
  <span class="tag-dano">${arma.dano || "—"}</span>
</div>
        </div>
      </div>

      <div style="margin-top: 12px;">
        <span class="popup-label">Descrição</span>
        <div class="popup-descricao">
          ${arma.desc || "Sem descrição"}
        </div>
      </div>
    </div>
  `;

  abrirPopup(arma.nome || "Sem nome", html, true, () => editarArma(index));
}

function removerArma(index) {
  const arma = armas[index];
  if (!arma) return;

  const confirmar = confirm(`Remover "${arma.nome}"?`);
  if (!confirmar) return;

  armas.splice(index, 1);
  renderArmas();
  salvarTudo();
}

/* ================= PODERES ================= */

function addPoder() {
  const nome = document.getElementById("poderNome").value.trim();
  const tipo = document.getElementById("poderTipo").value.trim();
  const dano = document.getElementById("poderDano").value.trim();
  const circulo = document.getElementById("poderCirculo").value.trim();
  const tempo = document.getElementById("poderTempo").value.trim();
  const alcance = document.getElementById("poderAlcance").value.trim();
  const duracao = document.getElementById("poderDuracao").value.trim();
  const desc = document.getElementById("poderDesc").value.trim();
  const temCargas = !!document.getElementById("poderTemCargas")?.checked;
  const maxCargas = temCargas
    ? parseInt(document.getElementById("poderMaxCargas")?.value) || 0
    : 0;

  if (!nome) return;

  const novoPoder = {
    nome,
    tipo,
    dano,
    circulo,
    tempo,
    alcance,
    duracao,
    desc,
    temCargas,
    maxCargas,
    cargasGastas: temCargas ? Array(maxCargas).fill(false) : [],
  };

  if (editandoPoder >= 0) {
    poderes[editandoPoder] = novoPoder;
    editandoPoder = -1;
  } else {
    poderes.push(novoPoder);
  }

  renderPoderes();
  salvarTudo();

  document.getElementById("poderNome").value = "";
  document.getElementById("poderTipo").value = "";
  document.getElementById("poderDano").value = "";
  document.getElementById("poderCirculo").value = "";
  document.getElementById("poderTempo").value = "";
  document.getElementById("poderAlcance").value = "";
  document.getElementById("poderDuracao").value = "";
  document.getElementById("poderDesc").value = "";
  document.getElementById("poderTemCargas").checked = false;
  document.getElementById("poderMaxCargas").value = "";
  document.getElementById("poderMaxCargas").style.display = "none";
}

function atualizarEstadoLowHP() {
  const vidaTotal = vidaAtual + vidaTemp;
  const abaCombate = document.querySelector(".aba.active");

  const combateAtivo = abaCombate && abaCombate.id === "combate";

  if (vidaTotal < 15 && combateAtivo) {
    document.body.classList.add("low-hp");
  } else {
    document.body.classList.remove("low-hp");
  }
}

function renderPoderes() {
  const listaPoderesComuns = document.getElementById("listaPoderesComuns");

  const listasCirculos = {
    0: document.getElementById("listaMagiasCirculo0"),
    1: document.getElementById("listaMagiasCirculo1"),
    2: document.getElementById("listaMagiasCirculo2"),
    3: document.getElementById("listaMagiasCirculo3"),
    4: document.getElementById("listaMagiasCirculo4"),
    5: document.getElementById("listaMagiasCirculo5"),
    6: document.getElementById("listaMagiasCirculo6"),
    7: document.getElementById("listaMagiasCirculo7"),
    8: document.getElementById("listaMagiasCirculo8"),
    9: document.getElementById("listaMagiasCirculo9"),
  };

  if (listaPoderesComuns) listaPoderesComuns.innerHTML = "";

  Object.values(listasCirculos).forEach((lista) => {
    if (lista) lista.innerHTML = "";
  });

  poderes.forEach((poder, index) => {
    const icone = getIconeTipo(poder.tipo);
    const circulo = (poder.circulo ?? "").toString().trim();

    // 🔥 ===== CARGAS =====
    let cargasHTML = "";

    if (poder.temCargas && poder.maxCargas > 0) {
      if (!Array.isArray(poder.cargasGastas)) {
        poder.cargasGastas = Array(poder.maxCargas).fill(false);
      }

      cargasHTML = `<div style="margin-top:6px;">`;

      for (let i = 0; i < poder.maxCargas; i++) {
        const usada = poder.cargasGastas[i];

        cargasHTML += `
          <span
            style="
              display:inline-block;
              width:14px;
              height:14px;
              border-radius:50%;
              border:2px solid #b89654;
              margin-right:4px;
              background:${usada ? "#b89654" : "transparent"};
              cursor:pointer;
            "
            onclick="event.stopPropagation(); toggleCargaPoder(${index}, ${i})"
          ></span>
        `;
      }

      cargasHTML += `</div>`;
    }
    // 🔥 ===== FIM CARGAS =====

    const li = document.createElement("li");
    li.className = "poder-card";

    li.innerHTML = `
      <div class="poder-info" onclick="verPoder(${index})">
        <strong class="poder-nome">${icone} ${poder.nome || "Sem nome"}</strong>

        ${
          poder.dano
            ? `
          <div class="poder-tags">
            <span class="tag-dano">${poder.dano}</span>
          </div>
        `
            : ""
        }

        <p class="poder-preview">
          ${poder.desc ? poder.desc.substring(0, 70) + (poder.desc.length > 70 ? "..." : "") : "Sem descrição"}
        </p>

        ${cargasHTML}
      </div>

      <div class="item-acoes">

        <div class="acoes-topo">
          <button class="btn-mover" onclick="moverPoderCima(${index})">↑</button>
          <button class="btn-mover" onclick="moverPoderBaixo(${index})">↓</button>
          <button class="btn-editar" onclick="editarPoder(${index})">✏️</button>
        </div>

        <button class="btn-deletar" onclick="removerPoder(${index})">X</button>

      </div>
    `;

    if (circulo === "") {
      if (listaPoderesComuns) listaPoderesComuns.appendChild(li);
    } else if (listasCirculos[circulo]) {
      listasCirculos[circulo].appendChild(li);
    } else {
      if (listaPoderesComuns) listaPoderesComuns.appendChild(li);
    }
  });

  for (let i = 0; i <= 9; i++) {
    const inputGasto = document.getElementById(`gastoCirculo${i}`);
    if (inputGasto) {
      inputGasto.value = gastosCirculos[i] || 0;
    }
  }
}

function abrirImportacao() {
  const input = document.getElementById("importarFicha");

  if (!input) {
    alert("Input de importação não encontrado no HTML.");
    console.error("Elemento #importarFicha não existe.");
    return;
  }

  input.value = "";
  input.click();
}

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("popup");
  if (popup && popup.parentElement !== document.body) {
    document.body.appendChild(popup);
  }

  const inputImportar = document.getElementById("importarFicha");

  if (!inputImportar) {
    console.warn("Input #importarFicha não encontrado ao carregar a página.");
    return;
  }

  inputImportar.addEventListener("change", importarFichaArquivo);
});

function importarFichaArquivo(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      const dadosImportados = JSON.parse(event.target.result);
      let personagensSalvos =
        JSON.parse(localStorage.getItem("personagens")) || [];

      if (Array.isArray(dadosImportados)) {
        dadosImportados.forEach((p) => {
          p.imagem = "";
        });
        personagensSalvos.push(...dadosImportados);
      } else {
        dadosImportados.imagem = "";
        personagensSalvos.push(dadosImportados);
      }

      localStorage.setItem("personagens", JSON.stringify(personagensSalvos));

      alert(
        "Ficha importada com sucesso! A imagem precisa ser adicionada separadamente.",
      );
      location.reload();
    } catch (erro) {
      console.error("Erro ao importar ficha:", erro);
      alert("Arquivo inválido ou corrompido.");
    }
  };

  reader.readAsText(file);
}

function exportarFicha(index) {
  const personagens = JSON.parse(localStorage.getItem("personagens")) || [];
  const ficha = personagens[index];

  if (!ficha) {
    alert("Ficha não encontrada.");
    return;
  }

  const nomeArquivo =
    ficha.nome && ficha.nome.trim()
      ? ficha.nome.trim().replace(/[\\/:*?"<>|]/g, "_")
      : `ficha-${index + 1}`;

  const conteudo = JSON.stringify(ficha, null, 2);
  const arquivo = `${nomeArquivo}.json`;

  // Android WebView
  if (window.Android && Android.exportarFicha) {
    Android.exportarFicha(conteudo, arquivo);
    return;
  }

  // Navegador normal
  const blob = new Blob([conteudo], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = arquivo;
  a.click();
  URL.revokeObjectURL(url);
}

function colarFicha() {
  const codigo = prompt("Cole o código:");
  const dados = atob(codigo);
  localStorage.setItem("personagens", dados);
  location.reload();
}

function aoMover(ev) {
  atualizarDestino(ev.clientY);
}

function aoSoltar() {
  const card = document.querySelector(".poder-card.dragging");
  const lista = document.getElementById("listaPoderes");

  if (card) {
    card.classList.remove("dragging");
  }

  if (lista) {
    lista.querySelectorAll(".poder-card").forEach((c) => {
      c.classList.remove("drag-over");
    });
  }

  window.removeEventListener("pointermove", aoMover);
  window.removeEventListener("pointerup", aoSoltar);

  if (
    typeof destino !== "undefined" &&
    typeof origem !== "undefined" &&
    destino !== origem
  ) {
    moverPoderPorDrag(origem, destino);
  }
}

function moverPoderPorDrag(origem, destino) {
  if (origem === destino || origem < 0 || destino < 0) return;
  if (origem >= poderes.length || destino >= poderes.length) return;

  const [itemMovido] = poderes.splice(origem, 1);
  poderes.splice(destino, 0, itemMovido);

  renderPoderes();
  salvarTudo();
}

function verPoder(index) {
  const poder = poderes[index];
  if (!poder) return;

  const tipoTexto = poder.tipo || "Sem tipo";
  const icone = getIconeTipo(tipoTexto);

  const tags = [
    poder.dano ? `<span class="tag-dano">${poder.dano}</span>` : "",
    poder.circulo
      ? `<span class="popup-tag">Círculo: ${poder.circulo}</span>`
      : "",
    poder.tempo
      ? `<span class="popup-tag">Conjuração: ${poder.tempo}</span>`
      : "",
    poder.alcance
      ? `<span class="popup-tag">Alcance: ${poder.alcance}</span>`
      : "",
    poder.duracao
      ? `<span class="popup-tag">Duração: ${poder.duracao}</span>`
      : "",
  ].join("");

  const html = `
    <div class="popup-bloco">
      ${tags ? `<div class="popup-tags">${tags}</div>` : ""}

      <div style="margin-top: 12px;">
        <span class="popup-label">Descrição</span>
        <div class="popup-descricao">
          ${poder.desc || "Sem descrição"}
        </div>
      </div>
    </div>
  `;

  abrirPopup(`${icone} ${poder.nome}`, html, true, null);
}

function removerPoder(index) {
  const poder = poderes[index];
  if (!poder) return;

  const confirmar = confirm(`Remover "${poder.nome}"?`);
  if (!confirmar) return;

  poderes.splice(index, 1);
  renderPoderes();
  salvarTudo();
}

function ativarDragVida() {
  const barra = document.getElementById("hpBar");
  if (!barra) return;

  let arrastando = false;

  function atualizarPorPosicao(clientX) {
    const rect = barra.getBoundingClientRect();
    const max = get("vidaMax");

    let pos = clientX - rect.left;
    pos = Math.max(0, Math.min(pos, rect.width));

    const porcentagem = pos / rect.width;
    vidaAtual = Math.round(porcentagem * max);

    atualizarHP();
    salvarTudo();
  }

  // CLICK normal (desktop e toque rápido)
  barra.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") return;
    atualizarPorPosicao(e.clientX);
  });

  // TOUCH (celular)
  barra.addEventListener(
    "touchstart",
    (e) => {
      if (e.target.tagName === "BUTTON") return;

      arrastando = true;
      atualizarPorPosicao(e.touches[0].clientX);
    },
    { passive: true },
  );

  barra.addEventListener(
    "touchmove",
    (e) => {
      if (!arrastando) return;

      atualizarPorPosicao(e.touches[0].clientX);
    },
    { passive: true },
  );

  barra.addEventListener("touchend", () => {
    arrastando = false;
  });

  // MOUSE DRAG (PC também fica bom)
  barra.addEventListener("mousedown", (e) => {
    if (e.target.tagName === "BUTTON") return;

    arrastando = true;
    atualizarPorPosicao(e.clientX);
  });

  document.addEventListener("mousemove", (e) => {
    if (!arrastando) return;

    atualizarPorPosicao(e.clientX);
  });

  document.addEventListener("mouseup", () => {
    arrastando = false;
  });
}
/* ================= DT ================= */

function atualizarDT() {
  const base = parseInt(document.getElementById("dtBase")?.value) || 0;
  const atributo = parseInt(document.getElementById("dtAtributo")?.value) || 0;
  const prof = parseInt(document.getElementById("dtProf")?.value) || 0;

  const total = base + atributo + prof;
  const dtTotal = document.getElementById("dtTotal");

  if (dtTotal) dtTotal.textContent = total;
}

/* ================= VIDA ================= */

function atualizarHP() {
  const max = get("vidaMax");
  const porcentagem = max > 0 ? (vidaAtual / max) * 100 : 0;

  const fill = document.getElementById("hp-fill");
  const texto = document.getElementById("vida-texto");

  if (fill) fill.style.width = `${porcentagem}%`;
  if (texto) texto.innerText = `${vidaAtual}/${max}`;

  atualizarTotal();
  atualizarEstadoLowHP();
}

function animarAttr(id) {
  const el = document.getElementById(id).closest(".attr");
  el.classList.add("up");

  setTimeout(() => {
    el.classList.remove("up");
  }, 400);
}

function atualizarTemp() {
  const max = get("vidaMax");
  const porcentagem = max > 0 ? (vidaTemp / max) * 100 : 0;

  const fill = document.getElementById("temp-fill");
  const texto = document.getElementById("temp-texto");

  if (fill) fill.style.width = `${porcentagem}%`;
  if (texto) texto.innerText = vidaTemp;

  atualizarEstadoLowHP();
  atualizarTotal();
}

function atualizarTotal() {
  const max = get("vidaMax");
  const total = vidaAtual + vidaTemp;
  const totalBox = document.querySelector(".hp-total");
  const totalEl = document.getElementById("vida-total");

  if (!totalBox || !totalEl) return;

  if (vidaTemp > 0) {
    totalBox.style.display = "block";
    totalEl.innerText = `${total}/${max}`;
  } else {
    totalBox.style.display = "none";
  }
}

function alterarVida(v) {
  const max = get("vidaMax");
  vidaAtual += v;

  if (vidaAtual > max) vidaAtual = max;
  if (vidaAtual < 0) vidaAtual = 0;

  atualizarHP();
  salvarTudo();
}

function alterarTemp(v) {
  vidaTemp += v;
  if (vidaTemp < 0) vidaTemp = 0;

  atualizarTemp();
  salvarTudo();
}

/* ================= EXAUSTÃO ================= */

function setExaustao(nivel) {
  exaustao = nivel;

  const checks = document.querySelectorAll(".exaustao-check");
  checks.forEach((el, i) => {
    el.classList.toggle("ativo", i === nivel);
  });

  const desc = document.getElementById("exaustao-desc");
  if (desc) desc.innerText = efeitosExaustao[nivel] || "Sem exaustão";

  salvarTudo();
}

/* ================= MORTE ================= */

function toggleMorte(tipo, index) {
  morte[tipo][index] = !morte[tipo][index];
  atualizarMorte();
  salvarTudo();
}

function atualizarMorte() {
  const checksSucesso = document.querySelectorAll(
    ".morte-linha:nth-of-type(1) .morte-check",
  );
  const checksFalha = document.querySelectorAll(
    ".morte-linha:nth-of-type(2) .morte-check",
  );

  checksSucesso.forEach((check, i) => {
    check.classList.toggle("ativo", !!morte.sucessos[i]);
  });

  checksFalha.forEach((check, i) => {
    check.classList.toggle("ativo", !!morte.falhas[i]);
  });
}

/* ================= SAVES ================= */

function toggleSave(attr) {
  saves[attr] = !saves[attr];
  atualizarSaves();
  atualizarBadgesSaves();
  salvarTudo();
}

function atualizarSaves() {
  [
    "forca",
    "destreza",
    "constituicao",
    "inteligencia",
    "sabedoria",
    "carisma",
  ].forEach((attr) => {
    const check = document.querySelector(
      `.save-check[onclick="toggleSave('${attr}')"]`,
    );
    if (check) check.classList.toggle("ativo", !!saves[attr]);
  });
}

function atualizarBadgesSaves() {
  const bonus = get("bonusProf");
  const attrs = [
    "forca",
    "destreza",
    "constituicao",
    "inteligencia",
    "sabedoria",
    "carisma",
  ];

  attrs.forEach((attr) => {
    const badge = document.getElementById(`save_${attr}`);
    if (!badge) return;

    const valor = mod(getAtributoFinal(attr)) + (saves[attr] ? bonus : 0);

    if (saves[attr]) {
      badge.style.display = "flex";
      badge.textContent = valor >= 0 ? `+${valor}` : `${valor}`;
    } else {
      badge.style.display = "none";
      badge.textContent = "";
    }
  });
}

/* ================= PERÍCIAS ================= */

function toggleCampoCargasPoder() {
  const check = document.getElementById("poderTemCargas");
  const input = document.getElementById("poderMaxCargas");

  if (!check || !input) return;

  if (check.checked) {
    input.style.display = "block";
  } else {
    input.style.display = "none";
    input.value = "";
  }
}

function toggleCargaPoder(index, i) {
  const poder = poderes[index];
  if (!poder) return;

  if (!Array.isArray(poder.cargasGastas)) {
    poder.cargasGastas = Array(poder.maxCargas || 0).fill(false);
  }

  poder.cargasGastas[i] = !poder.cargasGastas[i];

  renderPoderes();
  salvarTudo();
}

function atualizarTudo() {
  atualizarAtributosFinaisVisuais();
  const bonus = get("bonusProf");

  const mods = {
    forca: mod(getAtributoFinal("forca")),
    destreza: mod(getAtributoFinal("destreza")),
    constituicao: mod(getAtributoFinal("constituicao")),
    inteligencia: mod(getAtributoFinal("inteligencia")),
    sabedoria: mod(getAtributoFinal("sabedoria")),
    carisma: mod(getAtributoFinal("carisma")),
  };

  document.getElementById("mod_forca").innerText =
    mods.forca >= 0 ? `+${mods.forca}` : mods.forca;
  document.getElementById("mod_destreza").innerText =
    mods.destreza >= 0 ? `+${mods.destreza}` : mods.destreza;
  document.getElementById("mod_constituicao").innerText =
    mods.constituicao >= 0 ? `+${mods.constituicao}` : mods.constituicao;
  document.getElementById("mod_inteligencia").innerText =
    mods.inteligencia >= 0 ? `+${mods.inteligencia}` : mods.inteligencia;
  document.getElementById("mod_sabedoria").innerText =
    mods.sabedoria >= 0 ? `+${mods.sabedoria}` : mods.sabedoria;
  document.getElementById("mod_carisma").innerText =
    mods.carisma >= 0 ? `+${mods.carisma}` : mods.carisma;

  const lista = document.getElementById("pericias");
  if (lista) {
    lista.innerHTML = "";

    pericias.forEach((pericia) => {
      let bonusFinal = 0;

      if (profs[pericia.nome] === 1) {
        bonusFinal = bonus;
      } else if (profs[pericia.nome] === 2) {
        bonusFinal = bonus * 2;
      }

      const valor = mods[pericia.attr] + bonusFinal;

      const div = document.createElement("div");
      div.className = "pericia";
      div.innerHTML = `
        <label>
          <div class="check 
  ${profs[pericia.nome] === 1 ? "ativo" : ""} 
  ${profs[pericia.nome] === 2 ? "expertise" : ""}" onclick="toggleProf('${pericia.nome}', event)"></div>
          ${pericia.nome}
        </label>
        <span>${valor >= 0 ? `+${valor}` : valor}</span>
      `;
      lista.appendChild(div);
    });

    function atualizarAtributos() {
      [
        "forca",
        "destreza",
        "constituicao",
        "inteligencia",
        "sabedoria",
        "carisma",
      ].forEach((attr) => {
        const el = document.getElementById(`mod_${attr}`);
        if (el) {
          el.innerText = mod(getAtributoFinal(attr));
        }
      });
    }

    function atualizarAtributosVisuais() {
      const attrs = [
        "forca",
        "destreza",
        "constituicao",
        "inteligencia",
        "sabedoria",
        "carisma",
      ];

      attrs.forEach((attr) => {
        const baseInput = document.getElementById(attr);
        const display = baseInput?.parentElement?.querySelector(".valor-attr"); // ou equivalente

        if (!baseInput || !display) return;

        const final = getAtributoFinal(attr);
        display.innerText = final;
      });
    }
  }

  atualizarBadgesSaves();
}

function toggleProf(nome, event) {
  if (event) event.stopPropagation();

  // 0 = nada | 1 = prof | 2 = expertise
  if (!profs[nome]) {
    profs[nome] = 1;
  } else if (profs[nome] === 1) {
    profs[nome] = 2;
  } else {
    profs[nome] = 0;
  }

  atualizarTudo();
  salvarTudo();
}

function limparFocoBotoesVida() {
  const botoes = document.querySelectorAll(".hp-overlay button");

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      botao.blur();
    });

    botao.addEventListener(
      "touchend",
      () => {
        botao.blur();
      },
      { passive: true },
    );

    botao.addEventListener("mouseup", () => {
      botao.blur();
    });
  });
}

function ativarDragTemp() {
  const barra = document.getElementById("tempBar");
  if (!barra) return;

  let arrastando = false;

  function atualizarPorPosicao(clientX) {
    const rect = barra.getBoundingClientRect();
    const max = get("vidaMax");

    if (max <= 0) return;

    let pos = clientX - rect.left;
    pos = Math.max(0, Math.min(pos, rect.width));

    const porcentagem = pos / rect.width;
    vidaTemp = Math.round(porcentagem * max);

    atualizarTemp();
    salvarTudo();
  }

  barra.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") return;
    atualizarPorPosicao(e.clientX);
  });

  barra.addEventListener(
    "touchstart",
    (e) => {
      if (e.target.tagName === "BUTTON") return;

      arrastando = true;
      atualizarPorPosicao(e.touches[0].clientX);
    },
    { passive: true },
  );

  barra.addEventListener(
    "touchmove",
    (e) => {
      if (!arrastando) return;
      atualizarPorPosicao(e.touches[0].clientX);
    },
    { passive: true },
  );

  barra.addEventListener("touchend", () => {
    arrastando = false;
  });

  barra.addEventListener("mousedown", (e) => {
    if (e.target.tagName === "BUTTON") return;

    arrastando = true;
    atualizarPorPosicao(e.clientX);
  });

  document.addEventListener("mousemove", (e) => {
    if (!arrastando) return;
    atualizarPorPosicao(e.clientX);
  });

  document.addEventListener("mouseup", () => {
    arrastando = false;
  });
}

function getGrupoPoder(poder) {
  const circulo = (poder?.circulo ?? "").toString().trim();

  if (circulo === "") return "comum";

  const numero = parseInt(circulo, 10);

  if (isNaN(numero) || numero < 0 || numero > 9) {
    return "comum";
  }

  return `circulo-${numero}`;
}

function limitarAtributo(input) {
  let valor = parseInt(input.value);

  if (isNaN(valor)) return;
  if (valor > 20) input.value = 20;
  if (valor < 1) input.value = 1;
}

function moverPoderCima(index) {
  moverPoderNoGrupo(index, -1);
}

function moverPoderBaixo(index) {
  moverPoderNoGrupo(index, 1);
}

function moverPoderNoGrupo(indexOriginal, direcao) {
  const poderAtual = poderes[indexOriginal];
  if (!poderAtual) return;

  const grupo = getGrupoPoder(poderAtual);

  const indicesDoGrupo = poderes
    .map((p, i) => ({ poder: p, index: i }))
    .filter((item) => getGrupoPoder(item.poder) === grupo)
    .map((item) => item.index);

  const posicaoNoGrupo = indicesDoGrupo.indexOf(indexOriginal);
  if (posicaoNoGrupo === -1) return;

  const novaPosicaoNoGrupo = posicaoNoGrupo + direcao;
  if (novaPosicaoNoGrupo < 0 || novaPosicaoNoGrupo >= indicesDoGrupo.length)
    return;

  const indexDestino = indicesDoGrupo[novaPosicaoNoGrupo];
  animarTrocaPoder(indexOriginal, indexDestino, grupo);
}

function animarTrocaPoder(origem, destino, grupo) {
  let seletorLista = "#listaPoderesComuns";

  if (grupo !== "comum") {
    const numero = grupo.replace("circulo-", "");
    seletorLista = `#listaMagiasCirculo${numero}`;
  }

  const cards = Array.from(
    document.querySelectorAll(`${seletorLista} .poder-card`),
  );

  const indicesDoGrupo = poderes
    .map((p, i) => ({ poder: p, index: i }))
    .filter((item) => getGrupoPoder(item.poder) === grupo)
    .map((item) => item.index);

  const posOrigem = indicesDoGrupo.indexOf(origem);
  const posDestino = indicesDoGrupo.indexOf(destino);

  const cardOrigem = cards[posOrigem];
  const cardDestino = cards[posDestino];

  if (!cardOrigem || !cardDestino) {
    [poderes[origem], poderes[destino]] = [poderes[destino], poderes[origem]];
    renderPoderes();
    salvarTudo();
    return;
  }

  const rectOrigem = cardOrigem.getBoundingClientRect();
  const rectDestino = cardDestino.getBoundingClientRect();
  const distancia = rectDestino.top - rectOrigem.top;

  cardOrigem.style.transition = "transform 0.22s ease";
  cardDestino.style.transition = "transform 0.22s ease";

  cardOrigem.style.transform = `translateY(${distancia}px)`;
  cardDestino.style.transform = `translateY(${-distancia}px)`;

  cardOrigem.style.zIndex = "2";
  cardDestino.style.zIndex = "2";

  setTimeout(() => {
    [poderes[origem], poderes[destino]] = [poderes[destino], poderes[origem]];
    renderPoderes();
    salvarTudo();
  }, 220);
}

/* ================= INIT ================= */

function init() {
  atualizarTudo();
  renderPersonagens();
  atualizarHP();
  atualizarTemp();
  atualizarMorte();
  atualizarDT();
  atualizarSaves();
  atualizarBadgesSaves();
  ativarDragVida();
  ativarDragTemp();
  limparFocoBotoesVida();

  const nome = document.getElementById("nome");
  const raca = document.getElementById("racaSelect");
  const classe = document.getElementById("classe");
  const ca = document.getElementById("ca");
  const deslocamento = document.getElementById("deslocamento");
  const idade = document.getElementById("idade");
  const altura = document.getElementById("altura");
  const nivel = document.getElementById("nivel");
  const vidaMax = document.getElementById("vidaMax");

  [nome, raca, classe, ca, deslocamento, idade, altura, nivel].forEach((el) => {
    if (el) el.addEventListener("input", salvarTudo);
  });

  if (vidaMax) {
    vidaMax.addEventListener("input", () => {
      const max = get("vidaMax");
      if (vidaAtual > max) vidaAtual = max;
      atualizarHP();
      atualizarTemp();
      salvarTudo();
    });
  }

  const camposAutoSave = [
    "classe",
    "forca",
    "destreza",
    "constituicao",
    "inteligencia",
    "sabedoria",
    "carisma",
    "bonusProf",
    "ca",
    "deslocamento",
    "idade",
    "altura",
    "nivel",
    "inspiracao",
    "dtBase",
    "dtAtributo",
    "dtProf",
    "racaSelect",
    "antecedentes",
    "aliados",
    "idiomas",
  ];

  camposAutoSave.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener("input", () => {
      atualizarTudo();
      atualizarDT();
      salvarTudo();
    });
  });

  const popup = document.getElementById("popup");
  if (popup) {
    popup.addEventListener("click", (e) => {
      if (e.target.id === "popup") fecharPopup();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharPopup();
  });

  trocarAba("personagem");
}

document.addEventListener("DOMContentLoaded", init);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(() => console.log("SW registrado"))
    .catch((err) => console.log("Erro SW:", err));
}

window.onload = function () {
  restaurarSecoes();
};

document.addEventListener("DOMContentLoaded", () => {
  ativarDragImagemPreview();
});

atualizarDropdownRacas();
