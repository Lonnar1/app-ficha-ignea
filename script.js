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

let campanhaImagemBase64 = "";
let campanhasMaster =
  JSON.parse(localStorage.getItem("campanhasMaster")) || [];

let campanhaAtualMaster =
  JSON.parse(localStorage.getItem("campanhaAtualMaster")) ?? null;
  
function salvarCampanhasMaster() {
  localStorage.setItem("campanhasMaster", JSON.stringify(campanhasMaster));
  localStorage.setItem(
    "campanhaAtualMaster",
    JSON.stringify(campanhaAtualMaster)
  );
}

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

function previewImagemCampanha() {
  const input = document.getElementById("campanhaImagemInput");
  const preview = document.getElementById("previewCampanha");

  if (!input?.files?.[0]) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    campanhaImagemBase64 = e.target.result;

    preview.src = campanhaImagemBase64;
    preview.style.display = "block";
  };

  reader.readAsDataURL(input.files[0]);
}

function abrirTelaCampanhasMaster() {
  document.getElementById("tela-modo").style.display = "none";
  document.getElementById("masterIgnea").style.display = "none";

  const tela = document.getElementById("telaCampanhasMaster");
  if (tela) tela.style.display = "block";

  renderCampanhasMaster();
}

function renderCampanhasMaster() {
  const lista = document.getElementById("listaCampanhasMaster");
  if (!lista) return;

  lista.innerHTML = "";

  campanhasMaster.forEach((campanha, index) => {
    const card = document.createElement("div");
    card.className = "campanha-card";

    card.innerHTML = `
  <div
    class="campanha-card-bg"
    onclick="entrarCampanhaMaster(${index})"
    style="${
      campanha.imagem
        ? `background-image: linear-gradient(rgba(8,5,5,0.45), rgba(8,5,5,0.88)), url('${campanha.imagem}')`
        : ""
    }"
  >
    <div class="campanha-card-conteudo">
      <h3>${campanha.nome}</h3>

      <span>${campanha.sistema || "Sistema não definido"}</span>

      <p>${campanha.descricao || "Sem descrição ainda."}</p>
    </div>
  </div>

  <button
    class="monstro-delete campanha-delete"
    onclick="event.stopPropagation(); deletarCampanhaMaster(${index})"
  >
    ×
  </button>
`;

    lista.appendChild(card);
  });
}

function criarCampanhaMaster() {
  const nome = document.getElementById("novaCampanhaNome").value.trim();
  const sistema = document.getElementById("novaCampanhaSistema").value.trim();
  const descricao = document.getElementById("novaCampanhaDescricao").value.trim();

  if (!nome) {
    alert("Digite o nome da campanha.");
    return;
  }

  const novaCampanha = {
  id: Date.now(),
  nome,
  sistema,
  descricao,
  imagem: campanhaImagemBase64 || "",
  lore: "",
  jogadores: [],
  sessoes: [],
  quests: [],
  npcs: [],
  combates: []
};

  campanhasMaster.push(novaCampanha);
  salvarCampanhasMaster();

  document.getElementById("novaCampanhaNome").value = "";
  document.getElementById("novaCampanhaSistema").value = "";
  document.getElementById("novaCampanhaDescricao").value = "";

  campanhaImagemBase64 = "";
  const inputImagemCampanha = document.getElementById("campanhaImagemInput");
  const previewCampanha = document.getElementById("previewCampanha");
  if (inputImagemCampanha) inputImagemCampanha.value = "";
  if (previewCampanha) {
    previewCampanha.src = "";
    previewCampanha.style.display = "none";
  }

  renderCampanhasMaster();
}

function entrarCampanhaMaster(index) {
  campanhaAtualMaster = index;
  salvarCampanhasMaster();

  document.getElementById("telaCampanhasMaster").style.display = "none";
  document.getElementById("masterIgnea").style.display = "block";

  carregarDadosCampanhaAtual();
}

function deletarCampanhaMaster(index) {
  if (!confirm("Deseja deletar esta campanha?")) return;

  campanhasMaster.splice(index, 1);

  if (campanhaAtualMaster === index) {
    campanhaAtualMaster = null;
  }

  salvarCampanhasMaster();
  renderCampanhasMaster();
}

function voltarCampanhasMaster() {
  document.getElementById("masterIgnea").style.display = "none";
  document.getElementById("telaCampanhasMaster").style.display = "block";

  renderCampanhasMaster();
}

function carregarDadosCampanhaAtual() {
  const campanha = campanhasMaster[campanhaAtualMaster];
  if (!campanha) return;

  const titulo = document.getElementById("tituloCampanhaAtual");
  if (titulo) titulo.textContent = campanha.nome;
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
  try {
    localStorage.setItem("personagens", JSON.stringify(personagens));
  } catch (erro) {
    console.warn("localStorage cheio. Salvando apenas na nuvem.", erro);
  }

  if (typeof window.salvarFichasNaNuvem === "function") {
    window.salvarFichasNaNuvem();
  }
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

function controlarHeader(mostrar) {
  document.body.classList.remove("modo-mestre", "sem-header", "ocultar-logo", "hide-header");

  if (!mostrar) {
    document.body.classList.add("hide-header");
  }
}

function trocarAba(id, btn = null) {
  document.body.classList.remove("ocultar-logo");
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
      ativarDragEditorImagem();
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
      ativarDragEditorImagem();
    }
  }, 100);
}

function entrarFicha() {
  controlarHeader(true);

  const telaInicial = document.getElementById("tela-inicial");
  const ficha = document.getElementById("ficha");

  if (telaInicial) telaInicial.style.display = "none";
  if (ficha) ficha.style.display = "block";

  trocarAba("personagem");
}

function entrarModoJogadorAnimado() {
  const tela = document.getElementById("tela-modo");
  if (!tela) return;

  tela.classList.add("saindo");

  setTimeout(() => {
    tela.classList.remove("saindo");
    entrarModoJogador();

    tela.style.opacity = "1";
    tela.style.transform = "scale(1)";
  }, 450);
}

function entrarModoMestreAnimado() {
  const tela = document.getElementById("tela-modo");
  if (!tela) return;

  tela.classList.add("zoom-grimorio");

  setTimeout(() => {
    tela.classList.remove("zoom-grimorio");

    entrarModoMestre();

    tela.style.opacity = "1";
    tela.style.transform = "scale(1)";
  }, 550);
}



function voltarInicio() {
  const telaInicial = document.getElementById("tela-inicial");
  const ficha = document.getElementById("ficha");

  if (telaInicial) telaInicial.style.display = "block";
  if (ficha) ficha.style.display = "none";
  document.body.classList.remove("ocultar-logo");
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

async function deletarPersonagem(index) {
  const personagem = personagens[index];

  if (!personagem) return;

  if (
    !confirm(
      `Tem certeza que quer excluir "${personagem.nome || "Sem nome"}"?`
    )
  ) {
    return;
  }

  // 🔥 remove do Firebase
  if (
    personagem.id &&
    window.usuarioAtual
  ) {
    try {
      await deleteDoc(
        doc(
          db,
          "usuarios",
          window.usuarioAtual.uid,
          "fichas",
          String(personagem.id)
        )
      );
    } catch (erro) {
      console.error(
        "Erro ao deletar ficha da nuvem:",
        erro
      );
    }
  }

  // 🔥 remove local
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
    ativarDragEditorImagem();
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
  delete editor.dataset.dragAtivo;
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

  let arrastando = false;
  let ultimoX = 0;
  let ultimoY = 0;

  function aplicarPosicao() {
    imagemPosX = Math.max(0, Math.min(100, imagemPosX));
    imagemPosY = Math.max(0, Math.min(100, imagemPosY));
    img.style.setProperty(
      "object-position",
      `${imagemPosX}% ${imagemPosY}%`,
      "important"
    );
  }

  img.onmousedown = function (e) {
    arrastando = true;
    ultimoX = e.clientX;
    ultimoY = e.clientY;
    img.classList.add("arrastando");
    if (e.cancelable) {
    e.preventDefault();
}
  };

  document.onmousemove = function (e) {
    if (!arrastando) return;

    const dx = e.clientX - ultimoX;
    const dy = e.clientY - ultimoY;

    ultimoX = e.clientX;
    ultimoY = e.clientY;

    imagemPosX -= dx * 0.35;
    imagemPosY -= dy * 0.35;

    aplicarPosicao();
  };

  document.onmouseup = function () {
    arrastando = false;
    img.classList.remove("arrastando");
  };

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

  reader.onload = async function (event) {
    try {
      const dadosImportados = JSON.parse(event.target.result);

      let personagensSalvos =
        JSON.parse(localStorage.getItem("personagens")) || [];

      if (Array.isArray(dadosImportados)) {
        dadosImportados.forEach((p) => {
          p.imagem = "";
          personagensSalvos.push(p);
        });
      } else {
        dadosImportados.imagem = "";
        personagensSalvos.push(dadosImportados);
      }

      personagens = personagensSalvos;
      localStorage.setItem("personagens", JSON.stringify(personagens));

      if (typeof window.salvarFichasNaNuvem === "function") {
        await window.salvarFichasNaNuvem();
      }

      if (typeof renderPersonagens === "function") {
        renderPersonagens();
      }

      alert("Ficha importada com sucesso! A imagem precisa ser adicionada separadamente.");
    } catch (erro) {
      console.error("Erro ao importar ficha:", erro);
      alert("Arquivo inválido ou corrompido.");
    }

    e.target.value = "";
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

/* ================= GRIMÓRIO ÍGNEO / MASTER ================= */


const compendioPadrao = [
 {
  id: "padrao-goblin",
  origem: "padrao",
  nome: "Goblin",
  tipo: "Humanoide",
  regiao: "Cavernas, florestas e ruínas",
  hpMax: 7,
  hpAtual: 7,
  ca: 15,
  status: { for: 8, des: 14, con: 10, int: 10, sab: 8, car: 8 },
  lore: "Pequeno, traiçoeiro e covarde. Costuma atacar em grupo e fugir quando está em desvantagem.",
  habilidades: "Fuga ágil: pode escapar ou se esconder rapidamente.",
  dialogos: ["Peguem tudo que brilha!", "Corre! Corre!", "Você caiu na nossa armadilha!"],
  encontros: "Cavernas, acampamentos saqueadores e estradas abandonadas.",
  imagem: "img/monstros/Goblin.jpg"
},
  {
    id: "padrao-kobold",
    origem: "padrao",
    nome: "Kobold",
    tipo: "Humanoide dracônico",
    regiao: "Minas, túneis e covis de dragão",
    hpMax: 5,
    hpAtual: 5,
    ca: 12,
    status: { for: 7, des: 15, con: 9, int: 8, sab: 7, car: 8 },
    lore: "Criatura pequena e astuta, geralmente serve dragões ou vive em comunidades subterrâneas cheias de armadilhas.",
    habilidades: "Táticas de grupo: perigoso quando luta ao lado de aliados.",
    dialogos: ["O mestre dragão vai saber disso!", "Armadilha! Armadilha!", "Pequeno, mas mortal!"],
    encontros: "Minas abandonadas, túneis estreitos e covis subterrâneos.",
    imagem: "img/monstros/Kobold.jpg"
  },
  {
    id: "padrao-bandit",
    origem: "padrao",
    nome: "Bandido",
    tipo: "Humanoide",
    regiao: "Estradas, vilas e acampamentos",
    hpMax: 11,
    hpAtual: 11,
    ca: 12,
    status: { for: 11, des: 12, con: 12, int: 10, sab: 10, car: 10 },
    lore: "Criminoso comum que vive de roubos, emboscadas e intimidação.",
    habilidades: "Ataque coordenado quando está em grupo.",
    dialogos: ["Passe a bolsa e ninguém se machuca.", "Isso aqui é nosso território.", "Peguem eles!"],
    encontros: "Estradas perigosas, tavernas suspeitas e acampamentos de saqueadores.",
    imagem: "img/monstros/Bandido.jpg"
  },
  {
    id: "padrao-skeleton",
    origem: "padrao",
    nome: "Esqueleto",
    tipo: "Morto-vivo",
    regiao: "Criptas, ruínas e cemitérios",
    hpMax: 13,
    hpAtual: 13,
    ca: 13,
    status: { for: 10, des: 14, con: 15, int: 6, sab: 8, car: 5 },
    lore: "Restos animados por magia necromântica, obedecem ordens simples sem questionar.",
    habilidades: "Não sente medo, dor ou cansaço.",
    dialogos: ["...", "Clac... clac...", "A morte... permanece..."],
    encontros: "Tumbas antigas, catacumbas e templos abandonados.",
    imagem: "img/monstros/Esqueleto.jpg"
  },
  {
    id: "padrao-zombie",
    origem: "padrao",
    nome: "Zumbi",
    tipo: "Morto-vivo",
    regiao: "Cemitérios, pântanos e cidades destruídas",
    hpMax: 22,
    hpAtual: 22,
    ca: 8,
    status: { for: 13, des: 6, con: 16, int: 3, sab: 6, car: 5 },
    lore: "Cadáver reanimado que avança lentamente, mas é difícil de derrubar.",
    habilidades: "Resistência morta-viva: pode continuar de pé mesmo após golpes fatais.",
    dialogos: ["Uuurgh...", "Carne...", "Aaah..."],
    encontros: "Cemitérios profanados, vilas amaldiçoadas e campos de batalha antigos.",
    imagem: "img/monstros/Zumbi.jpg"
  },
  {
    id: "padrao-wolf",
    origem: "padrao",
    nome: "Lobo",
    tipo: "Besta",
    regiao: "Florestas e montanhas",
    hpMax: 11,
    hpAtual: 11,
    ca: 13,
    status: { for: 12, des: 15, con: 12, int: 3, sab: 12, car: 6 },
    lore: "Predador de matilha, rápido e perigoso quando cerca sua presa.",
    habilidades: "Tática de matilha: luta melhor ao lado de outros lobos.",
    dialogos: ["Grrrr...", "Auuuu!", "Rosna mostrando os dentes."],
    encontros: "Florestas escuras, trilhas nevadas e montanhas isoladas.",
    imagem: "img/monstros/Lobo.jpg"
  },
  {
    id: "padrao-giant-rat",
    origem: "padrao",
    nome: "Rato Gigante",
    tipo: "Besta",
    regiao: "Esgotos, porões e ruínas",
    hpMax: 7,
    hpAtual: 7,
    ca: 12,
    status: { for: 7, des: 15, con: 11, int: 2, sab: 10, car: 4 },
    lore: "Rato enorme e agressivo, normalmente encontrado em bandos.",
    habilidades: "Mordida infecciosa e movimentação rápida em locais apertados.",
    dialogos: ["Squeak!", "Chiado agressivo.", "Fareja comida ou sangue."],
    encontros: "Esgotos, depósitos abandonados e masmorras úmidas.",
    imagem: "img/monstros/Rato-Gigante.jpg"
  },
  {
    id: "padrao-orc",
    origem: "padrao",
    nome: "Orc",
    tipo: "Humanoide",
    regiao: "Montanhas, fortalezas e campos de guerra",
    hpMax: 15,
    hpAtual: 15,
    ca: 13,
    status: { for: 16, des: 12, con: 16, int: 7, sab: 11, car: 10 },
    lore: "Guerreiro brutal e impulsivo, valoriza força, conquista e intimidação.",
    habilidades: "Avanço agressivo: aproxima-se rapidamente do inimigo.",
    dialogos: ["Vou quebrar seus ossos!", "Fraco!", "Pelo clã!"],
    encontros: "Fortalezas tribais, campos de batalha e acampamentos de guerra.",
    imagem: "img/monstros/Orc.jpg"
  },
  {
    id: "padrao-gnoll",
    origem: "padrao",
    nome: "Gnoll",
    tipo: "Humanoide monstruoso",
    regiao: "Savanas, desertos e campos devastados",
    hpMax: 22,
    hpAtual: 22,
    ca: 15,
    status: { for: 14, des: 12, con: 11, int: 6, sab: 10, car: 7 },
    lore: "Criatura feroz semelhante a uma hiena, movida por fome e violência.",
    habilidades: "Frenesi: fica mais perigoso quando derruba uma presa.",
    dialogos: ["Hahaha! Carne fresca!", "Rasgar! Morder!", "A caça começou!"],
    encontros: "Campos de batalha, vilas saqueadas e regiões selvagens.",
    imagem: "img/monstros/Gnoll.jpg"
  },
  {
    id: "padrao-bugbear",
    origem: "padrao",
    nome: "Bugbear",
    tipo: "Humanoide goblinoide",
    regiao: "Florestas, cavernas e fortalezas goblinoides",
    hpMax: 27,
    hpAtual: 27,
    ca: 16,
    status: { for: 15, des: 14, con: 13, int: 8, sab: 11, car: 9 },
    lore: "Grande, silencioso e cruel. Usa emboscadas para destruir inimigos desprevenidos.",
    habilidades: "Ataque surpresa: causa grande dano quando pega o alvo desprevenido.",
    dialogos: ["Silêncio... agora morra.", "Você não me viu chegando.", "Pequenos ossos quebram fácil."],
    encontros: "Cavernas escuras, ruínas tomadas por goblins e fortalezas escondidas.",
    imagem: "img/monstros/Bugbear.jpg"
  },
  {
    id: "padrao-hobgoblin",
    origem: "padrao",
    nome: "Hobgoblin",
    tipo: "Humanoide goblinoide",
    regiao: "Fortes militares e territórios conquistados",
    hpMax: 11,
    hpAtual: 11,
    ca: 18,
    status: { for: 13, des: 12, con: 12, int: 10, sab: 10, car: 9 },
    lore: "Soldado disciplinado e estratégico, luta melhor em formação.",
    habilidades: "Vantagem marcial: aproveita aliados próximos para atacar melhor.",
    dialogos: ["Formação!", "Sem recuar!", "Pelo comandante!"],
    encontros: "Postos militares, fortalezas e patrulhas organizadas.",
    imagem: "img/monstros/Hobgoblin.jpg"
  },
  {
    id: "padrao-giant-spider",
    origem: "padrao",
    nome: "Aranha Gigante",
    tipo: "Besta",
    regiao: "Florestas densas, cavernas e ruínas",
    hpMax: 26,
    hpAtual: 26,
    ca: 14,
    status: { for: 14, des: 16, con: 12, int: 2, sab: 11, car: 4 },
    lore: "Predadora silenciosa que prende vítimas em teias antes de atacar.",
    habilidades: "Teia e veneno: pode imobilizar e envenenar suas presas.",
    dialogos: ["Som de patas nas paredes.", "A criatura observa em silêncio.", "Teias se movem ao redor."],
    encontros: "Cavernas, ruínas tomadas por teias e florestas antigas.",
    imagem: "img/monstros/Aranha-Gigante.jpg"
  },
  {
    id: "padrao-ogre",
    origem: "padrao",
    nome: "Ogro",
    tipo: "Gigante",
    regiao: "Colinas, cavernas e pântanos",
    hpMax: 59,
    hpAtual: 59,
    ca: 11,
    status: { for: 19, des: 8, con: 16, int: 5, sab: 7, car: 7 },
    lore: "Criatura enorme, burra e brutal, resolve quase tudo esmagando.",
    habilidades: "Golpes pesados capazes de derrubar aventureiros despreparados.",
    dialogos: ["Eu esmagar!", "Pequeno demais!", "Comida?"],
    encontros: "Cavernas grandes, pontes abandonadas e fortalezas destruídas.",
    imagem: "img/monstros/Ogro.jpg"
  },
  {
    id: "padrao-troll",
    origem: "padrao",
    nome: "Troll",
    tipo: "Gigante",
    regiao: "Pântanos, cavernas e florestas sombrias",
    hpMax: 84,
    hpAtual: 84,
    ca: 15,
    status: { for: 18, des: 13, con: 20, int: 7, sab: 9, car: 7 },
    lore: "Monstro regenerativo e faminto, conhecido por voltar a lutar mesmo após ferimentos horríveis.",
    habilidades: "Regeneração: recupera vida rapidamente, exceto contra fogo ou ácido.",
    dialogos: ["Arrancar braços!", "Fome! Fome!", "Você queima... eu odeio fogo!"],
    encontros: "Pontes antigas, pântanos, cavernas úmidas e florestas amaldiçoadas.",
    imagem: "img/monstros/Troll.jpg"
  }
];

window.monstrosMestre = JSON.parse(localStorage.getItem("monstrosMestre")) || [];
let monstrosMestre = window.monstrosMestre;

window.combatesMestre = JSON.parse(localStorage.getItem("combatesMestre")) || [];
let combatesMestre = window.combatesMestre;

let editandoMonstroMestre = -1;
let imagemMonstroBase64 = "";
let sheetMonstroIndexAtual = null;
let listaSheetCompendio = [];
let sheetDragInicioX = 0;
let sheetDragInicioY = 0;
let sheetArrastando = false;

function abrirTelaModo() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("tela-inicial").style.display = "none";
  document.getElementById("masterIgnea").style.display = "none";

  const campanhas = document.getElementById("telaCampanhasMaster");
  if (campanhas) campanhas.style.display = "none";

  const tela = document.getElementById("tela-modo");
  tela.style.display = "flex";

  tela.style.opacity = "0";
  tela.style.transform = "scale(1.06)";

  requestAnimationFrame(() => {
    tela.style.transition = "transform 0.45s ease, opacity 0.45s ease";
    tela.style.opacity = "1";
    tela.style.transform = "scale(1)";
  });
}

function esconderTelasPrincipais() {
  const ids = [
    "loginBox",
    "tela-modo",
    "tela-inicial",
    "ficha",
    "masterIgnea"
  ];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

function entrarModoJogador() {
  controlarHeader(true);

  document.getElementById("loginBox").style.display = "none";
  document.getElementById("tela-modo").style.display = "none";
  document.getElementById("masterIgnea").style.display = "none";
  document.getElementById("ficha").style.display = "none";
  document.getElementById("tela-inicial").style.display = "block";

  if (typeof renderPersonagens === "function") {
    renderPersonagens();
  }
}

function entrarModoMestre() {
  controlarHeader(false);

  document.getElementById("loginBox").style.display = "none";
  document.getElementById("tela-modo").style.display = "none";
  document.getElementById("tela-inicial").style.display = "none";
  document.getElementById("ficha").style.display = "none";
  document.getElementById("masterIgnea").style.display = "none";

  const telaCampanhas = document.getElementById("telaCampanhasMaster");
  if (telaCampanhas) {
    telaCampanhas.style.display = "block";
  }

  renderCampanhasMaster();
}

function voltarTelaModo() {
  abrirTelaModo();
}

function trocarAbaMaster(nomeAba, btn) {
  document.querySelectorAll(".master-aba").forEach(aba => {
    aba.style.display = "none";
    aba.classList.remove("active");
  });

  document.querySelectorAll(".master-tab-btn").forEach(botao => {
    botao.classList.remove("active");
  });

  const alvo = document.getElementById(`abaMaster-${nomeAba}`);
  if (alvo) {
    alvo.style.display = "block";
    alvo.classList.add("active");
  }

  if (btn) btn.classList.add("active");

  if (nomeAba === "compendio") renderMonstrosMestre();
  if (nomeAba === "combateMaster") renderCombatesMestre();
}

function salvarMonstrosMestreStorage() {
  localStorage.setItem("monstrosMestre", JSON.stringify(monstrosMestre));
  window.monstrosMestre = monstrosMestre;

  if (typeof window.salvarMonstrosNaNuvem === "function") {
    window.salvarMonstrosNaNuvem();
  }
}

function salvarCombatesMestreStorage() {
  localStorage.setItem("combatesMestre", JSON.stringify(combatesMestre));
  window.combatesMestre = combatesMestre;

  if (typeof window.salvarMonstrosNaNuvem === "function") {
    window.salvarMonstrosNaNuvem();
  }
}

function previewImagemMonstro() {
  const input = document.getElementById("monstroImagemInput");
  const preview = document.getElementById("previewMonstro");

  if (!input || !input.files || !input.files[0]) return;

  const file = input.files[0];

  const reader = new FileReader();

  reader.onload = function (e) {
    const img = new Image();

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // 🔥 tamanho máximo
      const maxWidth = 500;
      const scale = maxWidth / img.width;

      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      // desenha comprimida
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 🔥 qualidade 0.65
      imagemMonstroBase64 = canvas.toDataURL("image/jpeg", 0.65);

      if (preview) {
        preview.src = imagemMonstroBase64;
        preview.style.display = "block";
      }
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

function salvarMonstroMestre() {
  const nome = document.getElementById("monstroNome")?.value.trim();
  const tipo = document.getElementById("monstroTipo")?.value.trim();
  const regiao = document.getElementById("monstroRegiao")?.value.trim();

  if (!nome) {
    alert("Coloque o nome do monstro.");
    return;
  }

  const hpMax = parseInt(document.getElementById("monstroHpMax")?.value) || 0;
  let hpAtual = parseInt(document.getElementById("monstroHpAtual")?.value);

  if (isNaN(hpAtual)) hpAtual = hpMax;

  const monstroAntigo = editandoMonstroMestre >= 0
    ? monstrosMestre[editandoMonstroMestre]
    : null;

  const monstro = {
    id: monstroAntigo ? monstroAntigo.id : Date.now(),

    nome,
    tipo,
    regiao,
    hpMax,
    hpAtual,
    ca: parseInt(document.getElementById("monstroCa")?.value) || 0,

    status: {
      for: parseInt(document.getElementById("monstroFor")?.value) || 10,
      des: parseInt(document.getElementById("monstroDes")?.value) || 10,
      con: parseInt(document.getElementById("monstroCon")?.value) || 10,
      int: parseInt(document.getElementById("monstroInt")?.value) || 10,
      sab: parseInt(document.getElementById("monstroSab")?.value) || 10,
      car: parseInt(document.getElementById("monstroCar")?.value) || 10
    },

    lore: document.getElementById("monstroLore")?.value.trim() || "",
    habilidades: document.getElementById("monstroHabilidades")?.value.trim() || "",

    dialogos: (document.getElementById("monstroDialogos")?.value || "")
      .split("\n")
      .map(fala => fala.trim())
      .filter(fala => fala.length > 0),

    encontros: document.getElementById("monstroEncontros")?.value.trim() || "",
    imagem: imagemMonstroBase64 || monstroAntigo?.imagem || ""
  };

  if (editandoMonstroMestre >= 0) {
    monstrosMestre[editandoMonstroMestre] = monstro;
  } else {
    monstrosMestre.push(monstro);
  }

  salvarMonstrosMestreStorage();
  renderMonstrosMestre();
  limparFormMonstro();
  atualizarModsMonstro();
  const btnCompendio = document.querySelector(".master-tab-btn");
  trocarAbaMaster("compendio", btnCompendio);
}

function limparFormMonstro() {
  editandoMonstroMestre = -1;
  imagemMonstroBase64 = "";

  const campos = [
    "monstroNome",
    "monstroTipo",
    "monstroRegiao",
    "monstroHpMax",
    "monstroHpAtual",
    "monstroCa",
    "monstroLore",
    "monstroHabilidades",
    "monstroDialogos",
    "monstroEncontros"
  ];

  campos.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  const statusPadrao = {
    monstroFor: 10,
    monstroDes: 10,
    monstroCon: 10,
    monstroInt: 10,
    monstroSab: 10,
    monstroCar: 10
  };

  Object.keys(statusPadrao).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = statusPadrao[id];
  });

  const inputImagem = document.getElementById("monstroImagemInput");
  if (inputImagem) inputImagem.value = "";

  const preview = document.getElementById("previewMonstro");
  if (preview) {
    preview.src = "";
    preview.style.display = "none";
  }

  const titulo = document.getElementById("tituloFormMonstro");
  if (titulo) titulo.textContent = "Criar Monstro";
}

function renderMonstrosMestre() {
  const lista = document.getElementById("listaMonstrosMestre");
  if (!lista) return;

  lista.innerHTML = "";

 const listaCompleta = [
  ...compendioPadrao,
  ...monstrosMestre
];

let listaFiltrada = [...listaCompleta];

const pesquisa = document.getElementById("pesquisaMonstro")?.value
  ?.toLowerCase()
  .trim() || "";

if (pesquisa) {
  listaFiltrada = listaFiltrada.filter(monstro =>
    (monstro.nome || "").toLowerCase().includes(pesquisa) ||
    (monstro.tipo || "").toLowerCase().includes(pesquisa) ||
    (monstro.regiao || "").toLowerCase().includes(pesquisa)
  );
}

const ordenacao = document.getElementById("ordenarMonstros")?.value || "az";

listaFiltrada.sort((a, b) => {
  if (ordenacao === "az") {
    return (a.nome || "").localeCompare(b.nome || "");
  }

  if (ordenacao === "za") {
    return (b.nome || "").localeCompare(a.nome || "");
  }

  if (ordenacao === "hpMaior") {
    return (b.hpMax || 0) - (a.hpMax || 0);
  }

  if (ordenacao === "hpMenor") {
    return (a.hpMax || 0) - (b.hpMax || 0);
  }

  if (ordenacao === "caMaior") {
    return (b.ca || 0) - (a.ca || 0);
  }

  if (ordenacao === "caMenor") {
    return (a.ca || 0) - (b.ca || 0);
  }

  return 0;
});

listaSheetCompendio = listaFiltrada;


if (!listaFiltrada.length) {
  lista.innerHTML = `
    <p style="text-align:center; color:#cdb791; grid-column:1/-1;">
      Nenhum monstro disponível.
    </p>
  `;
  return;
}

    listaFiltrada.forEach((monstro, index) => {
    const card = document.createElement("div");
    card.className = "compendio-card";

    const imagem = monstro.imagem || "icon-512.png";
    card.style.backgroundImage = `url("${imagem}")`;

    card.onclick = () => abrirSheetMonstroPorObjeto(monstro, index, listaFiltrada);

    card.innerHTML = `
      <div class="compendio-info">
        <strong>${escapeHtml(monstro.nome)}</strong>
        <small>${escapeHtml(monstro.tipo || "Tipo não definido")}</small>
        <span>HP ${monstro.hpAtual}/${monstro.hpMax} • CA ${monstro.ca || 0}</span>
      </div>
    `;

    lista.appendChild(card);
  });
}


function criarCopiaEditavelMonstroPadrao(monstro) {
  const copia = JSON.parse(JSON.stringify(monstro));

  copia.id = Date.now();
  copia.origem = "usuario";
  copia.nome = `${monstro.nome} personalizado`;

  monstrosMestre.push(copia);
  salvarMonstrosMestreStorage();
  renderMonstrosMestre();

  const indexNovo = monstrosMestre.length - 1;
  editarMonstroMestre(indexNovo);
}

function abrirSheetMonstro(index) {
  const monstro = monstrosMestre[index];
  if (!monstro) return;

  sheetMonstroIndexAtual = index;

  const overlay = document.getElementById("sheetMonstroOverlay");
  const sheet = document.getElementById("sheetMonstro");
  const conteudo = document.getElementById("conteudoSheetMonstro");

  if (!overlay || !sheet || !conteudo) return;

  const imagem = monstro.imagem || "icon-512.png";

  conteudo.innerHTML = `
    <img class="sheet-img" src="${imagem}" alt="${escapeHtml(monstro.nome)}">

    <h2 class="sheet-titulo">${escapeHtml(monstro.nome)}</h2>

    <div class="sheet-meta">
      ${escapeHtml(monstro.tipo || "Tipo não definido")} • 
      ${escapeHtml(monstro.regiao || "Região não definida")}
    </div>

    <div class="sheet-hp-ca">
      HP ${monstro.hpAtual}/${monstro.hpMax} • CA ${monstro.ca || 0}
    </div>

    <div class="sheet-status-grid">
  <div>FOR<br>${monstro.status?.for || 10}<small>${formatarModMonstro(calcularModMonstro(monstro.status?.for || 10))}</small></div>
  <div>DES<br>${monstro.status?.des || 10}<small>${formatarModMonstro(calcularModMonstro(monstro.status?.des || 10))}</small></div>
  <div>CON<br>${monstro.status?.con || 10}<small>${formatarModMonstro(calcularModMonstro(monstro.status?.con || 10))}</small></div>
  <div>INT<br>${monstro.status?.int || 10}<small>${formatarModMonstro(calcularModMonstro(monstro.status?.int || 10))}</small></div>
  <div>SAB<br>${monstro.status?.sab || 10}<small>${formatarModMonstro(calcularModMonstro(monstro.status?.sab || 10))}</small></div>
  <div>CAR<br>${monstro.status?.car || 10}<small>${formatarModMonstro(calcularModMonstro(monstro.status?.car || 10))}</small></div>
    </div>

    <div class="sheet-acoes">
      <button class="btn-master-principal" onclick="enviarMonstroParaCombate(${index})">
        ⚔️ Enviar para combate
      </button>

      <button class="btn-master-secundario" onclick="editarMonstroMestre(${index})">
        ✏️ Editar
      </button>

      <button class="btn-master-perigo" onclick="excluirMonstroMestre(${index})">
        🗑️ Excluir
      </button>
    </div>

    <div class="sheet-bloco">
      <strong>Lore</strong>
      <p>${formatarTexto(monstro.lore || "Sem lore cadastrada.")}</p>
    </div>

    <div class="sheet-bloco">
      <strong>Habilidades especiais</strong>
      <p>${formatarTexto(monstro.habilidades || "Sem habilidades cadastradas.")}</p>
    </div>

    <div class="sheet-bloco">
      <strong>Diálogos</strong>
      <p>${monstro.dialogos?.length ? monstro.dialogos.map(f => `“${escapeHtml(f)}”`).join("<br>") : "Sem falas cadastradas."}</p>
      <button class="btn-master-principal" onclick="sortearFalaMonstro(${index})">🎲 Fala aleatória</button>
      <div id="falaAleatoriaTexto"></div>
    </div>

    <div class="sheet-bloco">
      <strong>Pontos de encontro</strong>
      <p>${formatarTexto(monstro.encontros || "Sem pontos de encontro cadastrados.")}</p>
    </div>
  `;

  overlay.style.display = "block";
sheet.style.display = "block";

sheet.classList.remove("full");
sheet.classList.remove("aberto");

requestAnimationFrame(() => {
  sheet.classList.add("aberto");
});

document.body.classList.add("master-sheet-aberto");
}



function abrirSheetMonstroPorObjeto(monstro, index, lista = null) {
  if (lista) listaSheetCompendio = lista;

  sheetMonstroIndexAtual = index;

  abrirSheetMonstroPadrao(monstro);
}

function abrirSheetMonstroPadrao(monstro) {
  const overlay = document.getElementById("sheetMonstroOverlay");
  const sheet = document.getElementById("sheetMonstro");
  const conteudo = document.getElementById("conteudoSheetMonstro");
  const estavaAberto = sheet.classList.contains("aberto");
  const estavaFull = sheet.classList.contains("full");  

  if (!overlay || !sheet || !conteudo) return;

  const imagem = monstro.imagem || "icon-512.png";

  conteudo.innerHTML = `
    <img class="sheet-img" src="${imagem}" alt="${escapeHtml(monstro.nome)}">

    <h2 class="sheet-titulo">${escapeHtml(monstro.nome)}</h2>

    <div class="sheet-meta">
      ${escapeHtml(monstro.tipo || "Tipo não definido")} • 
      ${escapeHtml(monstro.regiao || "Região não definida")}
    </div>

    <div class="sheet-hp-ca">
      HP ${monstro.hpAtual}/${monstro.hpMax} • CA ${monstro.ca || 0}
    </div>

    <div class="sheet-status-grid">
      <div>FOR<br>${monstro.status?.for || 10}<small>${formatarModMonstro(calcularModMonstro(monstro.status?.for || 10))}</small></div>
      <div>DES<br>${monstro.status?.des || 10}<small>${formatarModMonstro(calcularModMonstro(monstro.status?.des || 10))}</small></div>
      <div>CON<br>${monstro.status?.con || 10}<small>${formatarModMonstro(calcularModMonstro(monstro.status?.con || 10))}</small></div>
      <div>INT<br>${monstro.status?.int || 10}<small>${formatarModMonstro(calcularModMonstro(monstro.status?.int || 10))}</small></div>
      <div>SAB<br>${monstro.status?.sab || 10}<small>${formatarModMonstro(calcularModMonstro(monstro.status?.sab || 10))}</small></div>
      <div>CAR<br>${monstro.status?.car || 10}<small>${formatarModMonstro(calcularModMonstro(monstro.status?.car || 10))}</small></div>
    </div>

    <div class="sheet-acoes">
  <button class="btn-master-principal" onclick='enviarMonstroPadraoParaCombate(${JSON.stringify(monstro)})'>
    ⚔️ Enviar para combate
  </button>

  <button class="btn-master-secundario" onclick='criarCopiaEditavelMonstroPadrao(${JSON.stringify(monstro)})'>
    ✏️ Criar cópia editável
  </button>
</div>

    <div class="sheet-bloco">
      <strong>Lore</strong>
      <p>${formatarTexto(monstro.lore || "Sem lore cadastrada.")}</p>
    </div>

    <div class="sheet-bloco">
      <strong>Habilidades especiais</strong>
      <p>${formatarTexto(monstro.habilidades || "Sem habilidades cadastradas.")}</p>
    </div>

    <div class="sheet-bloco">
      <strong>Diálogos</strong>
      <p>${monstro.dialogos?.length ? monstro.dialogos.map(f => `“${escapeHtml(f)}”`).join("<br>") : "Sem falas cadastradas."}</p>
    </div>

    <div class="sheet-bloco">
      <strong>Pontos de encontro</strong>
      <p>${formatarTexto(monstro.encontros || "Sem pontos de encontro cadastrados.")}</p>
    </div>
  `;

sheet.style.transition = "";
sheet.style.transform = "";
sheet.style.opacity = "";
sheet.style.height = "";

overlay.style.display = "block";
sheet.style.display = "block";

if (!estavaAberto) {
  sheet.classList.remove("full");
  sheet.classList.remove("aberto");
}

if (estavaFull) {
  sheet.classList.add("full");
}

setTimeout(() => {
  sheet.classList.add("aberto");
}, 10);

document.body.classList.add("master-sheet-aberto");
ativarGestosSheetMonstro();
}


function ativarGestosSheetMonstro() {
  const sheet = document.getElementById("sheetMonstro");
  if (!sheet) return;

  if (sheet.dataset.gestosAtivos === "1") return;
  sheet.dataset.gestosAtivos = "1";

  sheet.addEventListener("touchstart", iniciarDragSheet, { passive: true });
  sheet.addEventListener("touchmove", moverDragSheet, { passive: false });
  sheet.addEventListener("touchend", finalizarDragSheet);

  sheet.addEventListener("mousedown", iniciarDragSheet);
  window.addEventListener("mousemove", moverDragSheet);
  window.addEventListener("mouseup", finalizarDragSheet);
}

function pegarPontoEvento(e) {
  if (e.touches && e.touches.length > 0) {
    return e.touches[0];
  }

  return e;
}

function iniciarDragSheet(e) {
  const sheet = document.getElementById("sheetMonstro");
  if (!sheet) return;

  const ponto = pegarPontoEvento(e);

  sheetDragInicioX = ponto.clientX;
  sheetDragInicioY = ponto.clientY;
  sheetArrastando = true;

  sheet.style.transition = "none";
}

function moverDragSheet(e) {
  if (!sheetArrastando) return;

  const sheet = document.getElementById("sheetMonstro");
  if (!sheet) return;

  const ponto = pegarPontoEvento(e);

  const diffX = ponto.clientX - sheetDragInicioX;
  const diffY = ponto.clientY - sheetDragInicioY;

  const movimentoHorizontal = Math.abs(diffX) > Math.abs(diffY);

  if (movimentoHorizontal) {
    if (e.cancelable) e.preventDefault();

    sheet.style.transform = `translateX(${diffX}px)`;
    sheet.style.opacity = String(1 - Math.min(Math.abs(diffX) / 500, 0.45));
    return;
  }

  // 🔥 movimento vertical fluido
  if (e.cancelable) e.preventDefault();

  if (diffY < 0 && !sheet.classList.contains("full")) {
    const aumento = Math.min(Math.abs(diffY), window.innerHeight * 0.28);
    sheet.style.height = `calc(72vh + ${aumento}px)`;
  }

  if (diffY > 0) {
    sheet.style.transform = `translateY(${Math.min(diffY, 220)}px)`;
    sheet.style.opacity = String(1 - Math.min(diffY / 450, 0.45));
  }
}

function finalizarDragSheet(e) {
  if (!sheetArrastando) return;

  const sheet = document.getElementById("sheetMonstro");
  if (!sheet) return;

  const ponto = pegarPontoEvento(e.changedTouches ? e.changedTouches[0] : e);

  const diffX = ponto.clientX - sheetDragInicioX;
  const diffY = ponto.clientY - sheetDragInicioY;

  sheetArrastando = false;

  sheet.style.transition =
    "transform 0.28s ease, opacity 0.22s ease, height 0.25s ease";

  if (Math.abs(diffX) > 90 && Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX < 0) {
      trocarMonstroSheet(1);
    } else {
      trocarMonstroSheet(-1);
    }
    return;
  }

  if (diffY < -80) {
    sheet.classList.add("full");
  }

  if (diffY > 120 && sheet.classList.contains("full")) {
    sheet.classList.remove("full");
  } else if (diffY > 170 && !sheet.classList.contains("full")) {
    fecharSheetMonstro();
    return;
  }

  sheet.style.transform = "";
  sheet.style.opacity = "";
  sheet.style.height = "";
}

function trocarMonstroSheet(direcao) {
  if (!listaSheetCompendio.length) return;

  let novoIndex = sheetMonstroIndexAtual + direcao;

  if (novoIndex < 0) novoIndex = listaSheetCompendio.length - 1;
  if (novoIndex >= listaSheetCompendio.length) novoIndex = 0;

  const sheet = document.getElementById("sheetMonstro");
  if (!sheet) return;

  const estavaFull = sheet.classList.contains("full");

  sheet.style.transition =
    "transform 0.22s ease, opacity 0.18s ease, height 0.25s ease";

  sheet.style.transform =
    direcao > 0 ? "translateX(-100%)" : "translateX(100%)";

  sheet.style.opacity = "0";

  setTimeout(() => {
    sheetMonstroIndexAtual = novoIndex;

    // troca só o conteúdo, sem fechar/reabrir a sheet
    abrirSheetMonstroPadrao(listaSheetCompendio[novoIndex]);

    if (estavaFull) {
      sheet.classList.add("full");
    }

    sheet.classList.add("aberto");

    sheet.style.transition = "none";
    sheet.style.transform =
      direcao > 0 ? "translateX(100%)" : "translateX(-100%)";
    sheet.style.opacity = "0";

    requestAnimationFrame(() => {
      sheet.style.transition =
        "transform 0.28s ease, opacity 0.22s ease, height 0.25s ease";

      sheet.style.transform = "";
      sheet.style.opacity = "";
      sheet.style.height = "";
    });
  }, 180);
}

function enviarMonstroPadraoParaCombate(monstro) {
  const copia = JSON.parse(JSON.stringify(monstro));

  copia.instanciaId = Date.now() + Math.floor(Math.random() * 9999);
  copia.monstroBaseId = monstro.id;
  copia.origem = "combate";
  copia.nome = gerarNomeInstanciaCombate(monstro.nome);

  combatesMestre.push(copia);

  salvarCombatesMestreStorage();
  renderCombatesMestre();

  alert(`${monstro.nome} foi enviado para o combate.`);
}

function fecharSheetMonstro() {
  const overlay = document.getElementById("sheetMonstroOverlay");
  const sheet = document.getElementById("sheetMonstro");

  if (sheet) {
    sheet.classList.remove("aberto");

    setTimeout(() => {
  sheet.style.display = "none";

  sheet.style.transition = "";
  sheet.style.transform = "";
  sheet.style.opacity = "";
  sheet.style.height = "";
  sheet.classList.remove("full");
  sheet.classList.remove("aberto");

  if (overlay) overlay.style.display = "none";
}, 380);
  }

  document.body.classList.remove("master-sheet-aberto");

  sheetMonstroIndexAtual = null;
}

function alternarSheetFull() {
  const sheet = document.getElementById("sheetMonstro");
  if (sheet) sheet.classList.toggle("full");
}

function editarMonstroMestre(index) {
  const monstro = monstrosMestre[index];
  if (!monstro) return;

  fecharSheetMonstro();

  editandoMonstroMestre = index;
  imagemMonstroBase64 = monstro.imagem || "";

  document.getElementById("monstroNome").value = monstro.nome || "";
  document.getElementById("monstroTipo").value = monstro.tipo || "";
  document.getElementById("monstroRegiao").value = monstro.regiao || "";
  document.getElementById("monstroHpMax").value = monstro.hpMax || 0;
  document.getElementById("monstroHpAtual").value = monstro.hpAtual || 0;
  document.getElementById("monstroCa").value = monstro.ca || 0;

  document.getElementById("monstroFor").value = monstro.status?.for || 10;
  document.getElementById("monstroDes").value = monstro.status?.des || 10;
  document.getElementById("monstroCon").value = monstro.status?.con || 10;
  document.getElementById("monstroInt").value = monstro.status?.int || 10;
  document.getElementById("monstroSab").value = monstro.status?.sab || 10;
  document.getElementById("monstroCar").value = monstro.status?.car || 10;

  document.getElementById("monstroLore").value = monstro.lore || "";
  document.getElementById("monstroHabilidades").value = monstro.habilidades || "";
  document.getElementById("monstroDialogos").value = Array.isArray(monstro.dialogos)
    ? monstro.dialogos.join("\n")
    : "";
  document.getElementById("monstroEncontros").value = monstro.encontros || "";

  const preview = document.getElementById("previewMonstro");
  if (preview && monstro.imagem) {
    preview.src = monstro.imagem;
    preview.style.display = "block";
  }

  const titulo = document.getElementById("tituloFormMonstro");
  if (titulo) titulo.textContent = "Editar Monstro";

  const btnCriar = document.querySelectorAll(".master-tab-btn")[1];
  trocarAbaMaster("criar", btnCriar);
  atualizarModsMonstro();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function excluirMonstroMestre(index) {
  const monstro = monstrosMestre[index];
  if (!monstro) return;

  const confirmar = confirm(`Deseja excluir "${monstro.nome}"?`);
  if (!confirmar) return;

  monstrosMestre.splice(index, 1);

  salvarMonstrosMestreStorage();
  renderMonstrosMestre();
  fecharSheetMonstro();
}

function enviarMonstroParaCombate(index) {
  const monstro = monstrosMestre[index];
  if (!monstro) return;

  const copia = JSON.parse(JSON.stringify(monstro));

  copia.instanciaId = Date.now() + Math.floor(Math.random() * 9999);
  copia.monstroBaseId = monstro.id;
  copia.nome = gerarNomeInstanciaCombate(monstro.nome);

  combatesMestre.push(copia);

  salvarCombatesMestreStorage();
  renderCombatesMestre();

  alert(`${monstro.nome} foi enviado para o combate.`);
}

function gerarNomeInstanciaCombate(nomeBase) {
  const quantidade = combatesMestre.filter(m =>
    (m.nome || "").startsWith(nomeBase)
  ).length + 1;

  return `${nomeBase} ${quantidade}`;
}

function toggleMinimizarCombate(index) {
  const monstro = combatesMestre[index];
  if (!monstro) return;

  monstro.minimizado = !monstro.minimizado;

  salvarCombatesMestreStorage();
  renderCombatesMestre();
}

function renderCombatesMestre() {
  const lista = document.getElementById("listaCombateMestre");
  if (!lista) return;

  lista.innerHTML = "";

  if (!combatesMestre.length) {
    lista.innerHTML = `
      <p style="text-align:center; color:#cdb791;">
        Nenhum monstro no combate ainda.
      </p>
    `;
    return;
  }

  combatesMestre.forEach((monstro, index) => {

    const card = document.createElement("div");

    const minimizado = monstro.minimizado ? "minimizado" : "";
    card.className = `combate-card ${minimizado}`;

    const imagem = monstro.imagem || "icon-512.png";

    card.innerHTML = `

      <!-- TOPO -->
      <div class="combate-topo">

        <img
          class="combate-img"
          src="${imagem}"
          alt="${escapeHtml(monstro.nome)}"
        >

        <div class="combate-info">

          <strong>${escapeHtml(monstro.nome)}</strong>

          <small>
            ${escapeHtml(monstro.tipo || "Tipo não definido")}
            • CA ${monstro.ca || 0}
          </small>

          <div class="combate-hp">
            ❤️ HP ${monstro.hpAtual}/${monstro.hpMax}
          </div>

        </div>

        <button
          class="btn-minimizar-combate"
          onclick="toggleMinimizarCombate(${index})"
        >
          ${monstro.minimizado ? "▼" : "▲"}
        </button>

      </div>

      <!-- DETALHES -->
      <div class="combate-detalhes">

        <!-- STATUS -->
        <div class="sheet-status-grid" style="margin-top:12px;">

          <div>
            FOR<br>
            ${monstro.status?.for || 10}
            <small>
              ${formatarModMonstro(
                calcularModMonstro(monstro.status?.for || 10)
              )}
            </small>
          </div>

          <div>
            DES<br>
            ${monstro.status?.des || 10}
            <small>
              ${formatarModMonstro(
                calcularModMonstro(monstro.status?.des || 10)
              )}
            </small>
          </div>

          <div>
            CON<br>
            ${monstro.status?.con || 10}
            <small>
              ${formatarModMonstro(
                calcularModMonstro(monstro.status?.con || 10)
              )}
            </small>
          </div>

          <div>
            INT<br>
            ${monstro.status?.int || 10}
            <small>
              ${formatarModMonstro(
                calcularModMonstro(monstro.status?.int || 10)
              )}
            </small>
          </div>

          <div>
            SAB<br>
            ${monstro.status?.sab || 10}
            <small>
              ${formatarModMonstro(
                calcularModMonstro(monstro.status?.sab || 10)
              )}
            </small>
          </div>

          <div>
            CAR<br>
            ${monstro.status?.car || 10}
            <small>
              ${formatarModMonstro(
                calcularModMonstro(monstro.status?.car || 10)
              )}
            </small>
          </div>

        </div>

        <!-- BOTÕES RÁPIDOS -->
        <div class="combate-botoes">

  <button class="btn-hp-dano" onclick="alterarHpCombate(${index}, -1)"> Dano -1</button>
<button class="btn-hp-dano" onclick="alterarHpCombate(${index}, -5)"> Dano -5</button>
<button class="btn-hp-dano" onclick="alterarHpCombate(${index}, -10)"> Dano -10</button>

<button class="btn-hp-cura" onclick="alterarHpCombate(${index}, 1)"> Cura +1</button>
<button class="btn-hp-cura" onclick="alterarHpCombate(${index}, 5)"> Cura +5</button>
<button class="btn-hp-cura" onclick="alterarHpCombate(${index}, 10)"> Cura +10</button>

        </div>

        <!-- MANUAL -->
        <div class="combate-manual">

          <input
            id="danoCombate${index}"
            type="number"
            placeholder="Dano recebido"
          >

          <input
            id="curaCombate${index}"
            type="number"
            placeholder="Cura recebida"
          >

        </div>

        <!-- AÇÕES -->
        <div class="combate-acoes">

          <button
            class="btn-master-perigo"
            onclick="aplicarDanoCombate(${index})"
          >
            Aplicar dano
          </button>

          <button
            class="btn-master-principal"
            onclick="aplicarCuraCombate(${index})"
          >
            Aplicar cura
          </button>

        </div>

        <!-- LORE -->
        ${monstro.lore ? `
          <div class="sheet-bloco">
            <strong>Lore</strong>
            <p>${formatarTexto(monstro.lore)}</p>
          </div>
        ` : ""}

        <!-- HABILIDADES -->
        ${monstro.habilidades ? `
          <div class="sheet-bloco">
            <strong>Habilidades especiais</strong>
            <p>${formatarTexto(monstro.habilidades)}</p>
          </div>
        ` : ""}

        <!-- ENCONTROS -->
        ${monstro.encontros ? `
          <div class="sheet-bloco">
            <strong>Pontos de encontro</strong>
            <p>${formatarTexto(monstro.encontros)}</p>
          </div>
        ` : ""}

        <!-- REMOVER -->
        <button
          class="btn-master-secundario"
          style="width:100%; margin-top:10px;"
          onclick="removerDoCombate(${index})"
        >
          Remover do combate
        </button>

      </div>
    `;

    lista.appendChild(card);
  });
}

function alterarHpCombate(index, valor) {
  const monstro = combatesMestre[index];
  if (!monstro) return;

  monstro.hpAtual += valor;

  if (monstro.hpAtual < 0) monstro.hpAtual = 0;
  if (monstro.hpAtual > monstro.hpMax) monstro.hpAtual = monstro.hpMax;

  salvarCombatesMestreStorage();
  renderCombatesMestre();
}

function aplicarDanoCombate(index) {
  const input = document.getElementById(`danoCombate${index}`);
  const dano = parseInt(input?.value) || 0;

  if (dano <= 0) return;

  alterarHpCombate(index, -dano);
}

function aplicarCuraCombate(index) {
  const input = document.getElementById(`curaCombate${index}`);
  const cura = parseInt(input?.value) || 0;

  if (cura <= 0) return;

  alterarHpCombate(index, cura);
}

function removerDoCombate(index) {
  const monstro = combatesMestre[index];
  if (!monstro) return;

  const confirmar = confirm(`Remover "${monstro.nome}" do combate?`);
  if (!confirmar) return;

  combatesMestre.splice(index, 1);
  salvarCombatesMestreStorage();
  renderCombatesMestre();
}

function sortearFalaMonstro(index) {
  const monstro = monstrosMestre[index];
  const alvo = document.getElementById("falaAleatoriaTexto");

  if (!monstro || !alvo) return;

  if (!monstro.dialogos || monstro.dialogos.length === 0) {
    alvo.textContent = "Esse monstro ainda não tem falas cadastradas.";
    return;
  }

  const fala = monstro.dialogos[Math.floor(Math.random() * monstro.dialogos.length)];
  alvo.textContent = `“${fala}”`;
}

function calcularModMonstro(valor) {
  return Math.floor((valor - 10) / 2);
}

function formatarModMonstro(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function atualizarModsMonstro() {

  const atributos = [
    ["For", "monstroFor"],
    ["Des", "monstroDes"],
    ["Con", "monstroCon"],
    ["Int", "monstroInt"],
    ["Sab", "monstroSab"],
    ["Car", "monstroCar"]
  ];

  atributos.forEach(([sigla, id]) => {

    const valor =
      parseInt(document.getElementById(id)?.value) || 10;

    const mod = calcularModMonstro(valor);

    const el = document.getElementById(`modMonstro${sigla}`);

    if (el) {
      el.textContent = formatarModMonstro(mod);
    }
  });
}

function escapeHtml(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatarTexto(texto) {
  return escapeHtml(texto).replace(/\n/g, "<br>");
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
  ativarDragEditorImagem();
});

atualizarDropdownRacas();
