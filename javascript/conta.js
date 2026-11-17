/* =====================================================================
   EXCLUIR CONTA
   Fica no fim do próprio perfil. Pra excluir, a pessoa digita a
   senha duas vezes; o Firebase confere a senha antes de apagar.
   Ordem: confere a senha → sai dos grupos → desfaz amizades → apaga
   tudo dentro de usuarios/{uid} → libera o Nome#tag → apaga o perfil →
   apaga o login. Cada passo que falhar não trava os outros.
   ===================================================================== */
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, deleteUser, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fb = () => ({ db: window.db, doc: window.doc, getDoc: window.getDoc, getDocs: window.getDocs, deleteDoc: window.deleteDoc, updateDoc: window.updateDoc, collection: window.collection, query: window.query, where: window.where });

// tudo que mora dentro de usuarios/{uid}
const SUBCOLECOES = ["fichas", "amigos", "itensRecebidos", "convitesGrupo", "solicitacoesRecebidas", "monstros", "recados", "elogios", "estado"];
// o que o app guarda no aparelho (só as chaves da Ficha Ígnea)
const CHAVES_LOCAIS = ["personagens", "personagens_backup", "campanhasMaster", "campanhaAtualMaster", "combatesMestre", "monstrosMestre", "iniciativaJogadores",
  "racasCustomSalvas", "ignea_criacoes_dono", "ignea_subclasses", "compendioMigrado", "avisosRolagensGrupo", "compartilharRolagens", "ultimoEmailLogin", "rgCalc", "pmCompacto", "posDisqueteFlutuante", "wjFechadas"];

let estado = "menu"; // menu | excluir | apagando | fim

function overlay() {
  let el = document.getElementById("contaApp");
  if (!el) {
    el = document.createElement("div");
    el.id = "contaApp";
    el.onclick = (e) => { if (e.target === el && estado !== "apagando") fecharConta(); };
    document.body.appendChild(el);
  }
  return el;
}

window.abrirConta = function () {
  estado = "menu";
  const el = overlay();
  render();
  el.style.display = "flex";
  requestAnimationFrame(() => el.classList.add("aberto"));
};
window.fecharConta = function () {
  if (estado === "apagando") return;
  const el = document.getElementById("contaApp");
  if (!el) return;
  el.classList.remove("aberto");
  setTimeout(() => { el.style.display = "none"; }, 220);
};
window.contaIrExcluir = function () { estado = "excluir"; render(); setTimeout(() => document.getElementById("ctSenha1")?.focus(), 80); };
window.contaVoltar = function () { fecharConta(); };
window.contaSair = function () { fecharConta(); if (typeof window.sairConta === "function") window.sairConta(); };

function render(msgErro) {
  const el = overlay();
  const email = getAuth().currentUser?.email || "";
  const fechar = estado === "apagando" ? "" : `<button type="button" class="ct-x" onclick="fecharConta()" aria-label="Fechar">✕</button>`;

  if (estado === "menu") {
    el.innerHTML = `
      <div class="ct-card" role="dialog" aria-label="Minha conta">${fechar}
        <div class="ct-ic"><i class="ti ti-user-circle"></i></div>
        <h4>Minha conta</h4>
        <p class="ct-sub">${email ? `Conectado como <b>${esc(email)}</b>` : "Você não está conectado."}</p>
        <button type="button" class="ct-btn" onclick="contaSair()"><i class="ti ti-logout"></i>Sair da conta</button>
        <div class="ct-perigo">
          <span class="ct-rot">Zona de perigo</span>
          <p>Apaga a sua conta e tudo que está nela. Não dá pra desfazer.</p>
          <button type="button" class="ct-btn ct-vermelho" onclick="contaIrExcluir()"><i class="ti ti-trash"></i>Excluir minha conta</button>
        </div>
      </div>`;
    return;
  }

  if (estado === "excluir") {
    el.innerHTML = `
      <div class="ct-card" role="dialog" aria-label="Excluir conta">${fechar}
        <div class="ct-ic perigo"><i class="ti ti-alert-triangle"></i></div>
        <h4>Excluir conta</h4>
        <p class="ct-sub">Isso apaga pra sempre:</p>
        <ul class="ct-lista">
          <li>todas as suas fichas</li>
          <li>suas campanhas e tudo que você criou no Grimório</li>
          <li>seu perfil, seu Nome#tag e seus amigos</li>
          <li>sua participação nos grupos (os grupos que você criou são apagados)</li>
        </ul>
        <p class="ct-sub">Pra confirmar, digite a sua senha duas vezes.</p>
        <label class="ct-rot" for="ctSenha1">Senha</label>
        <input type="password" id="ctSenha1" autocomplete="current-password" oninput="contaChecar()">
        <label class="ct-rot" for="ctSenha2">Repita a senha</label>
        <input type="password" id="ctSenha2" autocomplete="off" oninput="contaChecar()">
        <p class="ct-erro" id="ctErro">${msgErro ? esc(msgErro) : ""}</p>
        <button type="button" class="ct-btn ct-vermelho" id="ctConfirmar" disabled onclick="contaExcluir()"><i class="ti ti-trash"></i>Excluir pra sempre</button>
        <button type="button" class="ct-link" onclick="contaVoltar()">Cancelar</button>
      </div>`;
    return;
  }

  if (estado === "apagando") {
    el.innerHTML = `
      <div class="ct-card" role="dialog" aria-label="Excluindo conta">
        <div class="ct-ic perigo girando"><i class="ti ti-loader-2"></i></div>
        <h4>Excluindo…</h4>
        <p class="ct-sub" id="ctPasso">Conferindo a senha</p>
        <p class="ct-sub ct-peq">Não feche o app agora.</p>
      </div>`;
    return;
  }

  // fim
  el.innerHTML = `
    <div class="ct-card" role="dialog" aria-label="Conta excluída">
      <div class="ct-ic"><i class="ti ti-check"></i></div>
      <h4>Conta excluída</h4>
      <p class="ct-sub">Tudo foi apagado. Obrigado por ter jogado com a Ficha Ígnea.</p>
      <button type="button" class="ct-btn" onclick="location.reload()">Fechar</button>
    </div>`;
}

window.contaChecar = function () {
  const a = document.getElementById("ctSenha1")?.value || "";
  const b = document.getElementById("ctSenha2")?.value || "";
  const btn = document.getElementById("ctConfirmar");
  const erro = document.getElementById("ctErro");
  const iguais = a.length > 0 && a === b;
  if (btn) btn.disabled = !iguais;
  if (erro) erro.textContent = b.length >= a.length && b.length > 0 && a !== b ? "As senhas não são iguais." : "";
};

const passo = (t) => { const p = document.getElementById("ctPasso"); if (p) p.textContent = t; };
async function tentar(fn) { try { await fn(); } catch (e) { console.warn("excluir conta:", e?.code || e?.message || e); } }

window.contaExcluir = async function () {
  const a = document.getElementById("ctSenha1")?.value || "";
  const b = document.getElementById("ctSenha2")?.value || "";
  if (!a || a !== b) return contaChecar();
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user || !user.email) { render("Você precisa estar conectado."); return; }

  estado = "apagando";
  render();

  // 1) confere a senha (o Firebase só deixa apagar com login recente)
  try {
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, a));
  } catch (e) {
    const c = e?.code || "";
    const msg = c.includes("wrong-password") || c.includes("invalid-credential") || c.includes("invalid-login") ? "Senha incorreta."
      : c.includes("too-many-requests") ? "Muitas tentativas. Espere alguns minutos e tente de novo."
      : c.includes("network") ? "Sem internet. Confere a conexão e tenta de novo."
      : "Não consegui conferir a senha agora.";
    estado = "excluir";
    render(msg);
    return;
  }

  const { db, doc, getDoc, getDocs, deleteDoc, updateDoc, collection, query, where } = fb();
  const uid = user.uid;
  let perfil = {};
  await tentar(async () => { const s = await getDoc(doc(db, "usuarios", uid)); perfil = s.exists() ? s.data() : {}; });

  // 2) grupos: sai dos que participa, apaga os que criou
  passo("Saindo dos grupos");
  await tentar(async () => {
    const gs = await getDocs(query(collection(db, "grupos"), where("membrosUids", "array-contains", uid)));
    for (const g of gs.docs) {
      const d = g.data() || {};
      if (d.criadoPor === uid) {
        await tentar(async () => { const r = await getDocs(collection(db, "grupos", g.id, "rolagens")); for (const x of r.docs) await tentar(() => deleteDoc(x.ref)); });
        await tentar(() => deleteDoc(g.ref));
      } else {
        await tentar(() => updateDoc(g.ref, {
          membros: (d.membros || []).filter((m) => m.uid !== uid),
          membrosUids: (d.membrosUids || []).filter((u) => u !== uid),
          mestresUids: (d.mestresUids || []).filter((u) => u !== uid),
        }));
      }
    }
  });

  // 3) amizades: tira você da lista dos seus amigos
  passo("Desfazendo amizades");
  await tentar(async () => {
    const am = await getDocs(collection(db, "usuarios", uid, "amigos"));
    for (const x of am.docs) await tentar(() => deleteDoc(doc(db, "usuarios", x.id, "amigos", uid)));
  });

  // 4) tudo que está dentro da sua conta
  passo("Apagando fichas e campanhas");
  for (const sub of SUBCOLECOES) {
    await tentar(async () => {
      const s = await getDocs(collection(db, "usuarios", uid, sub));
      for (const x of s.docs) await tentar(() => deleteDoc(x.ref));
    });
  }

  // 5) libera o Nome#tag e apaga o perfil
  passo("Apagando o perfil");
  const nick = String(perfil.nicknameLower || perfil.nickname || "").toLowerCase();
  if (nick && perfil.tag) await tentar(() => deleteDoc(doc(db, "tagsUsuario", `${nick}#${perfil.tag}`)));
  await tentar(() => deleteDoc(doc(db, "usuarios", uid)));

  // 6) apaga o login
  passo("Apagando o login");
  try {
    await deleteUser(user);
  } catch (e) {
    console.warn("deleteUser:", e?.code || e);
    await tentar(() => signOut(auth));
  }

  // 7) limpa o que ficou guardado no aparelho
  try {
    CHAVES_LOCAIS.forEach((k) => localStorage.removeItem(k));
    Object.keys(localStorage).filter((k) => k.startsWith("secao_")).forEach((k) => localStorage.removeItem(k));
  } catch (e) {}

  estado = "fim";
  render();
};

/* "Excluir minha conta" no fim do próprio perfil (depois do Mural).
   O perfil redesenha as seções em pfRenderExtras; a gente acrescenta a nossa depois. */
function secaoConta() {
  const box = document.getElementById("perfilExtras");
  if (!box) return;
  const ehMeu = window._pf ? !!window._pf.ehMeu : !!window._perfilEhMeu;
  let sec = document.getElementById("pfSecConta");
  if (!ehMeu) { if (sec) sec.remove(); return; }
  if (!sec) {
    sec = document.createElement("div");
    sec.className = "pf-secao";
    sec.id = "pfSecConta";
  }
  box.appendChild(sec);
  sec.innerHTML = `
    <div class="pf-secao-titulo"><span>⚙️ Conta</span></div>
    <button type="button" class="pf-conta-excluir" onclick="abrirExcluirConta()"><i class="ti ti-trash"></i><span>Excluir minha conta</span></button>`;
}
window.abrirExcluirConta = function () { window.abrirConta(); window.contaIrExcluir(); };

function ligarPerfil() {
  const orig = window.pfRenderExtras;
  if (typeof orig !== "function" || orig._comConta) return;
  const novo = function (...args) {
    const r = orig.apply(this, args);
    try { secaoConta(); } catch (e) {}
    return r;
  };
  novo._comConta = true;
  window.pfRenderExtras = novo;
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ligarPerfil);
else ligarPerfil();

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const el = document.getElementById("contaApp");
  if (el && el.style.display === "flex") fecharConta();
});