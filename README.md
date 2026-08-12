<div align="center">

# 🔥 Ficha Ígnea

**A ficha de RPG digital que nasceu numa mesa de amigos — e cresceu para o mundo**

[![Plataforma](https://img.shields.io/badge/Plataforma-Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](#-android--google-play-store)
[![Play Store](https://img.shields.io/badge/Play%20Store-em%20breve-4285F4?style=for-the-badge&logo=googleplay&logoColor=white)](#-planos-e-assinatura)
[![Modelo](https://img.shields.io/badge/Modelo-Freemium-C4A95B?style=for-the-badge)](#-planos-e-assinatura)
[![Backend](https://img.shields.io/badge/Backend-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](#%EF%B8%8F-tecnologias)
[![Stack](https://img.shields.io/badge/Stack-Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#%EF%B8%8F-tecnologias)
[![Empacotamento](https://img.shields.io/badge/Empacotamento-Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](#-android--google-play-store)
[![Licença MIT](https://img.shields.io/badge/Licença-MIT-blue?style=for-the-badge)](LICENSE)

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
- **Raça** via dropdown, com 10 raças predefinidas e opção de **raça personalizada** (veja [Raças Disponíveis](#-raças-disponíveis))
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
- **Pontos de Domínio** — checkboxes configuráveis pra habilidades de usos limitados
- **Exaustão** — 7 níveis (0 a 6), com descrição do efeito de cada nível
- **Pontos de Morte** — 3 sucessos e 3 falhas em checkboxes
- **Resistências** — campo livre pra resistências, imunidades e vulnerabilidades

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

---

### 🔨 Forjar

Criador de conteúdo com **6 tipos**, cada um com formulário próprio:

| Tipo | Campos principais |
|---|---|
| **Monstro** | Tipo, região, idade, localização, 6 atributos, HP/CA, lore, habilidades especiais, ataques, reações, resistências, diálogos |
| **Boss** | Tudo do Monstro + título/epíteto, fases, mecânicas especiais, fraquezas, reações lendárias |
| **NPC** | Raça, classe, idade, religião, região, atributos, perícias, personalidade, relações, segredo, dados de combate completos |
| **Item** | Tipo, raridade (normal/incomum/raro/relíquia), sintonização, efeito, descrição, história e origem |
| **Mapa** | Nome, descrição/notas do mestre, imagem |
| **Encontro** | Região, localização, dificuldade, envolvidos, objetivo, gatilho, ambiente, consequências, loot, notas |

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

## 🧬 Raças Disponíveis

10 raças predefinidas do D&D 5e, mais a opção de criar uma raça totalmente personalizada:

| Raça | Raça | Raça |
|---|---|---|
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
| **ImgBB** | Hospedagem de todas as imagens (personagens, monstros, itens, mapas, perfil) |
| **Capacitor** | Empacotamento do app como Android nativo pra Google Play Store |
| **Service Worker + Web App Manifest** | Suporte a instalação como PWA |
| **Google Fonts** | Tipografia — Cinzel e EB Garamond |

> Sem npm, sem etapa de build — o app roda a partir de `index.html` + `script.js`.

---

## 📁 Estrutura do Projeto

```
app-ficha-ignea/
├── index.html                    # Estrutura HTML completa (login, Jornada e Grimório)
├── script.js                     # Toda a lógica da aplicação
├── css/
│   ├── 00-base.css               # Reset e estilos base
│   ├── 01-player-ficha.css       # Estilos da ficha (modo Jornada)
│   ├── 02-login.css              # Tela de login/cadastro
│   ├── 03-master-grimorio.css    # Estrutura do modo Grimório
│   ├── 04-jornada-modo.css       # Tela de escolha de caminho
│   ├── 05-grimorio-componentes.css # Componentes visuais do Grimório
│   ├── 06-final-overrides.css    # Ajustes e sobrescritas finais
│   ├── 07-paleta-master.css      # Paleta de cores do Grimório
│   └── 08-campanhas-master.css   # Tela de campanhas
├── sw.js                         # Service Worker (cache/PWA)
├── manifest.json                 # Configuração do PWA
├── icon-192.png / icon-512.png   # Ícones do app
└── assets/                       # Imagens e recursos estáticos
```

> A nomeação exata dos arquivos CSS pode variar conforme o estado atual do seu projeto — ajuste essa lista pra bater com a estrutura real da sua pasta antes de publicar.

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

Estética de fantasia sombria, com as fontes **Cinzel** e **EB Garamond**, e paleta em dourado, bordô e pergaminho (bege). Sem emojis na interface do app em si — os ícones seguem um estilo consistente de linha fina.

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
- [ ] Reorganizar o layout da aba Grupo do mestre
- [ ] Portar o sistema social completo pra versão web
- [ ] Integração de pagamento (RevenueCat + Google Play Billing)
- [ ] Publicação na Google Play Store
- [ ] Suporte a outros sistemas de RPG além de D&D 5e

---

## 📄 Licença

Este projeto está sob a licença **MIT** — use, modifique e distribua livremente, mantendo os créditos.

---

## 👨‍💻 Autor

Desenvolvido por **Leonardo**

<div align="center">

*O que começou como um bloco de notas numa mesa de amigos cresceu para o mundo.*

</div>
