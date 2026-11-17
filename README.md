<div align="center">

# 🔥 Ficha Ígnea

**A ficha de RPG digital que nasceu numa mesa de amigos — e cresceu para o mundo**

[![Plataforma](https://img.shields.io/badge/Plataforma-Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](#-android--google-play-store)
[![Play Store](https://img.shields.io/badge/Play%20Store-em%20breve-4285F4?style=for-the-badge&logo=googleplay&logoColor=white)](#-planos-e-assinatura)
[![Modelo](https://img.shields.io/badge/Modelo-Freemium-C4A95B?style=for-the-badge)](#-planos-e-assinatura)
[![Backend](https://img.shields.io/badge/Backend-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](#%EF%B8%8F-tecnologias)
[![Stack](https://img.shields.io/badge/Stack-Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#%EF%B8%8F-tecnologias)
[![Empacotamento](https://img.shields.io/badge/Empacotamento-Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](#-android--google-play-store)
[![Licença](https://img.shields.io/badge/Licença-Todos%20os%20direitos%20reservados-7B1E28?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Índice

- [A História do Projeto](#-a-história-do-projeto)
- [Preview](#-preview)
- [Modos do App](#%EF%B8%8F-modos-do-app)
  - [Jornada — Modo Jogador](#%EF%B8%8F-jornada--modo-jogador)
  - [Grimório — Modo Mestre](#-grimório--modo-mestre)
- [Funcionalidades — Jornada](#%EF%B8%8F-funcionalidades--jornada)
  - [Personagem](#-personagem)
  - [Atributos e Perícias](#-atributos-e-perícias)
  - [Combate](#%EF%B8%8F-combate)
  - [Inventário e Mapas](#-inventário-e-mapas)
  - [Poderes e Magias](#-poderes-e-magias)
  - [Evolução e Subclasses](#-evolução-e-subclasses)
  - [Catálogos e Colar Texto](#-catálogos-e-colar-texto)
  - [Configurações](#%EF%B8%8F-configurações)
- [Funcionalidades — Grimório](#-funcionalidades--grimório)
  - [Campanhas](#-campanhas)
  - [Lore](#-lore)
  - [Mundo](#-mundo)
  - [Compêndio](#-compêndio)
  - [Forjar](#-forjar)
  - [Combate do Mestre](#%EF%B8%8F-combate-do-mestre)
  - [Iniciativa](#-iniciativa)
  - [Grupo — Dashboard em Tempo Real](#-grupo--dashboard-em-tempo-real)
- [Sistema Social](#-sistema-social)
  - [Amigos](#-amigos)
  - [Grupos](#-grupos)
  - [Perfil](#-perfil)
  - [Troca de Itens](#-troca-de-itens)
- [Conta, Suporte e Privacidade](#-conta-suporte-e-privacidade)
- [Raças Disponíveis](#-raças-disponíveis)
- [Perícias](#-perícias)
- [Tipos de Dano](#-tipos-de-dano)
- [Editor de Imagens](#%EF%B8%8F-editor-de-imagens)
- [Tecnologias](#%EF%B8%8F-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Rodar Localmente](#%EF%B8%8F-como-rodar-localmente)
- [Android — Google Play Store](#-android--google-play-store)
- [Armazenamento de Dados](#-armazenamento-de-dados)
- [Exportar e Importar Personagens](#-exportar-e-importar-personagens)
- [Planos e Assinatura](#-planos-e-assinatura)
- [Segurança](#-segurança)
- [Design](#-design)
- [Roadmap](#-roadmap)
- [Créditos](#-créditos)
- [Licença](#-licença)
- [Autor](#-autor)

---

## 📖 A História do Projeto

O **Ficha Ígnea** não nasceu como uma ficha online. Começou muito mais simples do que isso: literalmente um bloco de notas, criado só pra ajudar um grupo de amigos numa mesa de D&D 5e a anotar as coisas da sessão sem se perder — atributos rasurados, anotações espalhadas em cadernos diferentes, sem jeito nenhum de organizar magias, itens e combate no calor do jogo.

Sessão após sessão, aquele bloco de notas foi ganhando estrutura: virou uma ficha de verdade, depois um sistema de conta na nuvem, depois um modo separado só pro mestre gerenciar toda a campanha — e hoje é um app completo, com um ecossistema social inteiro em volta da mesa: amigos, grupos, perfis, dashboard ao vivo do mestre e troca de itens entre personagens.

| Problema comum | Solução do Ficha Ígnea |
|---|---|
| Ficha de papel se perde ou rasura | Dados salvos na nuvem (Firebase), sincronizados entre sessões |
| Apps de ficha limitados ou pagos demais | Plano gratuito completo + planos pagos opcionais |
| Grupo espalhado sem organização | Sistema de amigos e grupos dentro do próprio app |
| Mestre sem visão da mesa em tempo real | Dashboard ao vivo com HP, magias e inventário de cada jogador |
| Trocar item de um personagem pra outro é chato | Sistema de "Dar item" direto entre fichas do mesmo grupo |
| Difícil de usar no celular | Interface mobile-first, pensada pra tocar durante a sessão |

---

## 📸 Preview

> Espaço reservado pras capturas de tela do app — telas de Personagem, Combate, Inventário, Poderes, Grimório (Lore/Mundo/Compêndio/Forjar/Combate/Grupo) e o painel de Amigos. Adicione suas próprias imagens em `assets/` e referencie aqui quando quiser publicar.

---

## 🗺️ Modos do App

Ao entrar, o usuário escolhe entre dois caminhos:

### 🕯️ Jornada — Modo Jogador

Acesso completo à ficha do personagem: atributos, perícias, combate, inventário, mapas e poderes/magias — tudo pensado pra ser usado durante a sessão, com toques rápidos em vez de rolar texto infinito.

### 📖 Grimório — Modo Mestre

Ferramenta completa de mestre: lore da campanha, mundo (missões, NPCs, encontros), compêndio de criaturas e itens, criação de conteúdo (monstros, bosses, NPCs, itens, mapas, encontros), gerenciamento de combate com iniciativa, e um dashboard ao vivo de todos os jogadores do grupo vinculado à campanha.

---

## ⚔️ Funcionalidades — Jornada

### 👤 Personagem

- **Informações básicas** — classe, nome, idade, altura, nível (1–20) e antecedentes
- **Raça** via dropdown, com as raças do SRD 5.2.1 e **raças personalizadas** (criadas na mão ou coladas de um texto)
- **Antecedente** com leitor de texto: cole o antecedente e o app preenche perícias, ferramentas e talento
- **Upload de imagem** com editor de posicionamento embutido (drag, zoom e recorte)
- **Idiomas** — campo livre
- **Aliados** — cadastro de NPCs aliados com nome, região/local e descrição
- **Lore do personagem** — história, origem e motivações, salvos automaticamente

---

### 📊 Atributos e Perícias

- **6 atributos principais** (FOR, DES, CON, INT, SAB, CAR) com modificador calculado automaticamente
- **Marcação de salvaguardas proficientes**, por atributo
- **Bônus de proficiência** configurável, usado em todos os cálculos automáticos
- **Inspiração** — campo de controle
- **18 perícias** com toggle de proficiência individual (veja [Perícias](#-perícias))
- **Proficiências extras** — campo livre pra armas, armaduras, ferramentas e outras proficiências

---

### ⚔️ Combate

- **HP** — vida máxima, vida atual com barra visual e controles rápidos de +/-, vida temporária em barra separada
- **CA** e **Deslocamento** editáveis
- **Armas** — nome, dano (ex: `2d6+3`), descrição, imagem opcional e sistema de cargas
- **Armaduras** — nome, CA, descrição, imagem opcional e sistema de cargas
- **Pontos de Domínio** — checkboxes configuráveis pra habilidades de usos limitados (e o sistema de **Domínios**, regra opcional ligada nas Configurações)
- **Exaustão** — 7 níveis (0 a 6), com descrição do efeito de cada nível
- **Pontos de Morte** — 3 sucessos e 3 falhas em checkboxes
- **Resistências** — campo livre pra resistências, imunidades e vulnerabilidades
- **Combatente do Essstilo** — subclasse de Guerreiro com aba própria (💀 Estilo): ranks de D a SSS, barra de dano e golpes

---

### 🎒 Inventário e Mapas

- **Itens** com nome, descrição, imagem opcional, quantidade e toggle de **sintonia** (com sub-toggle "está sintonizado")
- **Diário** — campo de texto livre pra anotações de missão, pistas, NPCs, eventos
- **Mapas**: upload de imagem, nome e descrição, visualizador em **tela cheia** com pan/zoom, e ferramentas de anotação direto sobre o mapa:
  - Pincel livre, texto, seta, X, caveira, pergaminho, interrogação
  - 5 cores predefinidas
  - Desfazer, zoom +/-, salvar anotações (persistidas na nuvem)

---

### 🔥 Poderes e Magias

- **DT (Dificuldade de Teste)** com base, modificador de atributo e bônus de proficiência calculados automaticamente
- **Poderes** com nome, tipo de dano, dado de dano, tempo de conjuração, alcance, duração, descrição e sistema de usos/cargas
- Organização em **4 sub-abas**: Poderes, Magias, Talentos e Passivas
- **Magias por círculo (0 a 9)**, cada círculo com controle de slots gastos e sua própria lista
- **21 tipos de dano** com identificação visual (veja [Tipos de Dano](#-tipos-de-dano))

---

### 📈 Evolução e Subclasses

- **Subir de nível** guiado: o app mostra o que você ganha em cada nível
- **Pular vários níveis de uma vez** (ex: do 1 ao 10), com resumo de tudo que foi ganho
- **Escolha de subclasse** no nível certo, com as do SRD e subclasses criadas pela mesa
- **Leitor de classes**: cole o texto de uma classe e o app entende as características por nível
- **Domínios** (regra opcional): no nível 3 você escolhe um domínio, no 6 ganha a extensão e no 12 escolhe a habilidade final

---

### 📚 Catálogos e Colar Texto

- **Catálogos** de armas, armaduras, itens, itens mágicos e magias, prontos pra adicionar na ficha
- **Colar texto**: cole a descrição de uma arma, item, magia ou poder e o app preenche os campos sozinho
- Aviso (sem bloquear) quando falta proficiência ou algum requisito

---

### ⚙️ Configurações

- **Abas** — escolha quais abas aparecem na ficha
- **Regras** — regras opcionais da ficha (como Domínios) e as regras da mesa definidas pelo mestre
- **Jogadores** — mostrar ou esconder as rolagens do grupo

---

## 📚 Funcionalidades — Grimório

### 🏰 Campanhas

- Criação de múltiplas campanhas, cada uma isolada, com nome, sistema utilizado, descrição e imagem de capa
- Cada campanha pode ter um **grupo vinculado**, escolhido na criação ou depois via edição — é esse vínculo que conecta a campanha ao dashboard ao vivo dos jogadores

---

### 📜 Lore

Três sub-abas:
- **História** — lore principal da campanha (guerras, profecias, deuses, eras)
- **Sessões** — planejadas, completas ou canceladas, com resumo do que aconteceu
- **Eventos** — batalha, revelação, morte, aliança ou outro, com descrição detalhada

---

### 🌍 Mundo

Três sub-abas:
- **Missões** — nome, prioridade (em andamento/concluída/abandonada), dificuldade (fácil/médio/difícil/épico), etapas numeradas e descrição
- **NPCs** — galeria de personagens não-jogáveis da campanha
- **Encontros** — região, localização, dificuldade, envolvidos, objetivo, gatilho, ambiente, consequências e loot

---

### 📖 Compêndio

- Grid visual com todos os monstros, bosses, NPCs, itens e mapas criados na campanha
- **Busca por nome** e **ordenação** (A-Z, Z-A, HP maior/menor, CA maior/menor)
- Sheet de detalhe completa ao clicar: atributos, habilidades, ataques, reações, resistências, diálogos
- Botão de enviar direto pro combate
- **Regras** — consulta rápida de condições, combate, exploração, perigos, venenos, doenças e armadilhas pra usar no meio da sessão

---

### 🔨 Forjar

Criador de conteúdo com **7 tipos**, cada um com formulário próprio. Cada um pode começar **em branco**, **do catálogo** (criaturas do SRD) ou **colando um texto** (o app lê a ficha da criatura e preenche):

| Tipo | Campos principais |
|---|---|
| **Monstro** | Tipo, região, idade, localização, 6 atributos, HP/CA, lore, habilidades especiais, ataques, reações, resistências, diálogos |
| **Boss** | Tudo do Monstro + título/epíteto, fases, mecânicas especiais, fraquezas, reações lendárias |
| **NPC** | Raça, classe, idade, religião, região, atributos, perícias, personalidade, relações, segredo, dados de combate completos |
| **Item** | Tipo, raridade (normal/incomum/raro/relíquia), sintonização, efeito, descrição, história e origem |
| **Mapa** | Nome, descrição/notas do mestre, imagem |
| **Encontro** | Região, localização, dificuldade, envolvidos, objetivo, gatilho, ambiente, consequências, loot, notas |
| **Subclasse** | Subclasses próprias da mesa, que os jogadores escolhem na Evolução |

Todos com upload de imagem e cadastro dinâmico de habilidades/ataques (adiciona quantos quiser, um por um).

---

### ⚔️ Combate do Mestre

- Envio direto de monstros do Compêndio pro combate
- Cards em grid, expansíveis (clique pra abrir/fechar com animação)
- Cada card mostra: nome, HP com barra colorida, CA, 6 atributos com modificadores, habilidades e ataques
- Log de combate com histórico de dano/cura, com hora e data

---

### 🎲 Iniciativa

- Painel deslizante (☰) com lista de participantes
- Numeração de ordem de turno e indicador do turno ativo
- Botão "Próximo turno" avança automaticamente

---

### 👥 Grupo — Dashboard em Tempo Real

- Aba própria dentro do Grimório, ao lado de Lore/Mundo/Compêndio/Forjar/Combate
- Mostra **ao vivo** (via `onSnapshot` do Firestore) cada jogador do grupo vinculado à campanha:
  - HP com barra colorida
  - Poderes, Magias (por círculo, com bolinhas de gasto), Talentos e Passivas
  - Armas, Armaduras, Inventário
  - Pontos de Domínio e Exaustão
- Cada item é expansível (2 linhas por padrão, clique pra ver a descrição completa) e mostra pílula de cargas quando tem usos limitados
- Visual idêntico ao card de monstro do próprio app, pra manter consistência

---

## 🤝 Sistema Social

### 👋 Amigos

- Adição por **Nickname#0000** (estilo Discord), não por e-mail
- Fluxo de solicitação: enviar, aceitar ou recusar
- Lista de amigos sincronizada em tempo real
- Clique num amigo abre o perfil dele

### 🛡️ Grupos

- Criação de grupo com convite formal — quem é convidado precisa aceitar, não entra direto
- Gestão completa: ver membros, trocar cargo entre mestre e jogador, remover membro, renomear grupo, excluir grupo, sair do grupo
- Cada jogador escolhe **qual ficha** representa ele em cada grupo (uma ficha só pode estar vinculada a um grupo por vez)

### 🧑‍🎨 Perfil

- Foto de fundo e avatar circular, com upload próprio
- Biografia editável
- **Cores personalizadas** do próprio perfil (fundo, nome, linhas de destaque), escolhidas num seletor de cor customizado (quadrado de saturação/valor + barra de matiz)
- Vitrine com até **4 personagens em destaque**
- Fichas podem ser marcadas como **públicas** — outros usuários veem um botão "Pegar" que duplica a ficha (cópia independente, não vínculo) pra própria conta

### 🔁 Troca de Itens

- **Jogador → Jogador**: botão "Dar" em qualquer item, arma ou armadura da própria ficha, envia pra qualquer jogador do mesmo grupo
- **Mestre → Jogador**: botão "Dar" em qualquer item do compêndio da campanha (inclusive itens pré-definidos), mestre escolhe o jogador do grupo vinculado
- Itens recebidos entram numa caixa de entrada com **aceitar** ou **recusar**
- Item recusado **volta automaticamente** pro remetente

---

## 🛟 Conta, Suporte e Privacidade

- **Relatar bug** — formulário dentro do app (painel de amigos ou Sobre), com até 3 prints; a versão do app e o aparelho vão junto automaticamente
- **Excluir conta** — no fim do próprio perfil; pede a senha duas vezes e apaga fichas, campanhas, perfil, amizades e o login
- **Sobre** — créditos do projeto e de quem ajudou a construir
- **[Termos de Uso](termos.html)** e **[Política de Privacidade](privacidade.html)**

---

## 🧬 Raças Disponíveis

As raças do **SRD 5.2.1** já vêm no app. Além delas, dá pra criar **raças personalizadas** à mão ou colando o texto de uma raça — o leitor entende os traços e o editor mostra tudo pra revisar.

---|---|---|
| Humano | Elfo | Anão |
| Halfling | Meio-Elfo | Meio-Orc |
| Draconato | Tiefling | Gnomo |
| Tritão | — | **Personalizada** (criação livre) |

---

## 🎯 Perícias

18 perícias com toggle de proficiência individual e cálculo automático de modificador:

| Coluna 1 | Coluna 2 | Coluna 3 |
|---|---|---|
| Acrobacia | Furtividade | Medicina |
| Arcanismo | História | Natureza |
| Atletismo | Intimidação | Percepção |
| Atuação | Intuição | Persuasão |
| Enganação | Investigação | Prestidigitação |
| Lidar c/ Animais | Religião | Sobrevivência |

---

## 💥 Tipos de Dano

21 tipos de dano disponíveis pra Poderes e Magias, cada um com ícone próprio:

| Tipo | Ícone | Tipo | Ícone | Tipo | Ícone |
|---|---|---|---|---|---|
| Fogo | 🔥 | Raio | ⚡ | Trovejante | 🌩️ |
| Gelo | ❄️ | Necrótico | 💀 | Radiante | ✨ |
| Veneno | ☠️ | Água | 💧 | Mágico | ☄️ |
| Psíquico | 🧠 | Corte | 🔪 | Perfurante | 📌 |
| Concussão | 💥 | Metal | ⚙️ | Físico | 🗡️ |
| Vento | 🍃 | Madeira | 🌳 | Terra | 🌍 |
| Trevas | 🌑 | Luz | 🌕 | Espírito | 🌓 |

---

## 🖼️ Editor de Imagens

- Editor embutido em canvas HTML5, usado no upload de personagem, monstros, itens, mapas, avatar e fundo de perfil
- Drag pra reposicionar, zoom por slider, recorte não destrutivo (a imagem original fica preservada pra reeditar depois sem perda de qualidade)
- Imagens hospedadas via **ImgBB**, com exclusão automática ao apagar o item/ficha correspondente

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| **HTML5 / CSS3 / JavaScript** puros | Toda a estrutura, estilo e lógica — sem frameworks, sem build |
| **Firebase Auth** | Login e cadastro de conta |
| **Firebase Firestore** | Banco de dados na nuvem: fichas, campanhas, amigos, grupos, perfis, itens |
| **ImgBB** + **Cloudflare Worker** | Hospedagem das imagens (personagens, monstros, itens, mapas, perfil), com o envio passando por um Worker |
| **Web3Forms** | Envio dos relatos de bug direto pro email do projeto |
| **Capacitor** | Empacotamento do app como Android nativo pra Google Play Store |
| **Service Worker + Web App Manifest** | Suporte a instalação como PWA |
| **Google Fonts** | Tipografia — Cinzel e EB Garamond |
| **Tabler Icons** | Ícones de linha fina |

> Sem npm, sem etapa de build — o app roda a partir do `index.html` e dos arquivos em `javascript/`.

---

## 📁 Estrutura do Projeto

```
app-ficha-ignea/
├── index.html                  # Estrutura completa (login, Jornada e Grimório) + Firebase
├── privacidade.html            # Política de Privacidade
├── termos.html                 # Termos de Uso
├── javascript/
│   ├── script.js               # Lógica principal da ficha, do Grimório e do social
│   ├── combate-v2.js           # Aba de combate
│   ├── catalogo*.js            # Catálogos (armas, itens, magias, itens mágicos, monstros)
│   ├── leitor-*.js             # Leitores de texto (itens, poderes, monstros, raças e antecedentes)
│   ├── classes-dados.js        # Classes e subclasses
│   ├── progressao.js           # Evolução e subida de nível
│   ├── dominios.js             # Sistema de Domínios
│   ├── devil-trigger.js        # Combatente do Essstilo
│   ├── regras*.js              # Regras de consulta e regras da mesa
│   ├── atributos.js            # Atributos e perícias
│   ├── sobre.js                # Sobre e Relatar bug
│   └── conta.js                # Excluir conta
├── css/                        # 00-base.css até 18-conta.css (carregados em ordem)
├── img/                        # Ícones, logos, imagens de criaturas/itens e fotos da equipe
├── assets/                     # Capturas de tela
├── sw.js                       # Service Worker (PWA)
└── manifest.json               # Configuração do PWA
```

---

## 🖥️ Como Rodar Localmente

O app depende do Firebase (Auth + Firestore), então **precisa rodar por um servidor local** — abrir `index.html` direto pelo `file://` quebra a autenticação de forma silenciosa.

**Python:**
```bash
cd app-ficha-ignea
python -m http.server 8080
# Acesse: http://localhost:8080
```

**VS Code — extensão Live Server:**
1. Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Clique com o botão direito no `index.html`
3. Selecione **"Open with Live Server"**

> ⚠️ Se você mexer no código e as mudanças não aparecerem, desconfie do **Service Worker em cache** — abra o DevTools → Application → Service Workers → Unregister, e Application → Storage → Clear site data, antes de testar de novo.

---

## 🤖 Android — Google Play Store

O app é empacotado como aplicativo Android nativo usando **Capacitor**, que renderiza a interface web dentro de uma WebView nativa — com ícone próprio no launcher e funcionamento offline via cache do Service Worker.

O cadastro na Google Play Console já foi iniciado (conta individual, nome de desenvolvedor "Ficha Ígnea"), com a integração de pagamento (RevenueCat + Google Play Billing) planejada como próximo passo antes da publicação.

---

## 💾 Armazenamento de Dados

O app usa um modelo **híbrido**: nuvem como fonte de verdade, com cache local pra acesso rápido e uso offline.

- **Firebase Firestore** — fichas, campanhas, amigos, grupos, perfis e itens, sincronizados entre dispositivos
- **localStorage** — cópia local pra abrir rápido e funcionar mesmo sem internet
- **ImgBB** — todas as imagens do app

**O que isso significa na prática:**
- ✅ Dados sincronizam entre dispositivos, desde que logado na mesma conta
- ✅ Funciona offline com o último estado sincronizado
- ✅ Backup automático — nada depende só do dispositivo
- ⚠️ Ainda assim, use a função de **Exportar** de vez em quando pra ter um backup local em `.json`

---

## 📦 Exportar e Importar Personagens

- **Exportar** — baixa um arquivo `.json` com todos os personagens da conta
- **Importar** — restaura personagens a partir de um `.json` exportado antes
- **Duplicar** — cria uma cópia completa de um personagem, útil pra testar builds sem mexer no original

---

## 💳 Planos e Assinatura

| Plano | Para quem | Inclui |
|---|---|---|
| **Gratuito** | Todo mundo | 1 ficha e 1 campanha |
| **Jogador** | Quem joga | Fichas ilimitadas |
| **Mestre** | Quem mestra | Campanhas ilimitadas no Grimório |
| **Completo** | Os dois | Fichas e campanhas ilimitadas |

---

## 🔒 Segurança

- Sanitização de todo conteúdo renderizado via `innerHTML`
- Validação de dados ao carregar personagens e campanhas (`sanitizarPersonagem`/`sanitizarCampanha`)
- Validação de arquivos `.json` na importação
- Regras de segurança do Firestore restringindo leitura/escrita por vínculo de grupo, amizade e propriedade dos dados

---

## 🎨 Design

Estética de fantasia sombria, com as fontes **Cinzel** e **EB Garamond**, e paleta em dourado, bordô e pergaminho (bege). Os ícones seguem um estilo de linha fina (Tabler Icons).

---

## 📌 Roadmap

- [x] Ficha completa de personagem D&D 5e
- [x] Sistema de magias por círculo (0–9)
- [x] Modo Grimório completo (Lore, Mundo, Compêndio, Forjar, Combate, Iniciativa)
- [x] Sistema de conta e sincronização na nuvem (Firebase)
- [x] Sistema de amigos e grupos
- [x] Perfil customizável com fichas em destaque públicas/privadas
- [x] Dashboard do mestre em tempo real
- [x] Troca de itens jogador↔jogador e mestre→jogador
- [x] Empacotamento Android com Capacitor
- [x] Catálogos do SRD 5.2.1 e leitores de texto
- [x] Evolução com subclasses, Domínios e Combatente do Essstilo
- [x] Relatar bug e excluir conta dentro do app
- [x] Termos de Uso e Política de Privacidade
- [ ] Reorganizar o layout da aba Grupo do mestre
- [ ] Integração de pagamento (RevenueCat + Google Play Billing)
- [ ] Publicação na Google Play Store
- [ ] Suporte a outros sistemas de RPG além de D&D 5e

---

## 🙌 Créditos

- **Vinicius Edney** e **Giovany Queiroz** — criadores do Combatente do Essstilo e do sistema de Domínios
- **Bruna Yukari** — apoio desde o começo e testes
- Todo mundo da mesa que testou, achou bug e deu ideia

Este trabalho inclui material do System Reference Document 5.2.1 ("SRD 5.2.1") da Wizards of the Coast LLC, disponível em https://www.dndbeyond.com/srd. O SRD 5.2.1 está licenciado sob a Creative Commons Attribution 4.0 International License, disponível em https://creativecommons.org/licenses/by/4.0/legalcode.

---

## 📄 Licença

**© 2026 Leonardo José dos Santos. Todos os direitos reservados.**

O código está aqui só para consulta. Não é permitido copiar, modificar, redistribuir, publicar ou vender este projeto, no todo ou em parte, sem autorização por escrito do autor. Veja o arquivo [LICENSE](LICENSE) para os detalhes e para o conteúdo de terceiros (SRD 5.2.1, ícones e fontes), que segue as licenças próprias.

---

## 👨‍💻 Autor

Desenvolvido por **Leonardo José dos Santos**

<div align="center">

*O que começou como um bloco de notas numa mesa de amigos cresceu para o mundo.*

</div>
