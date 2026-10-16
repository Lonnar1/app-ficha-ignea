/* =====================================================================
   CATALOGO-OP.JS  ·  Catálogo de trilhas e poderes + automação
   Dados transcritos (de forma resumida) a partir de:
     • Ordem Paranormal RPG – Livro de Regras v1.3 (Combatente, p. 24-27)
     • Sobrevivendo ao Horror v1.3 (Combatente, p. 14-21)
   As descrições são RESUMOS em português: o texto completo e as regras
   exatas continuam no livro. Tudo pode ser editado em "Editar regras".

   Efeitos suportados (seguros, sem JavaScript livre):
     { tipo: "recurso", alvo: "pv" | "pe" | "san", valor: N }        → soma N ao máximo
     { tipo: "recurso", alvo: "pv", porNivel: N }                    → soma N × (NEX ÷ 5)
     { tipo: "manual", texto: "..." }                                → só informativo
   ===================================================================== */

const CATALOGO_OP_PADRAO = {
  versao: 1,
  fontes: {
    livro: "Livro de Regras v1.3",
    sah: "Sobrevivendo ao Horror v1.3",
  },

  /* ---------------- TRILHAS ---------------- */
  trilhas: [
    {
      id: "comb.aniquilador", classe: "combatente", nome: "Aniquilador", fonte: "livro", pagina: "26",
      resumo: "Abate alvos com eficiência e velocidade, cuidando muito bem das próprias armas.",
      habilidades: [
        { id: "comb.aniquilador.10", nex: 10, nome: "A Favorita", ativacao: "passiva",
          resumo: "Escolha uma arma favorita (ex.: katana, fuzil de assalto). A categoria dela conta 1 a menos para você.", efeitos: [] },
        { id: "comb.aniquilador.40", nex: 40, nome: "Técnica Secreta", ativacao: "livre", custo: "2 PE (+2 por efeito extra)",
          resumo: "A categoria da favorita cai em II. Ao atacar com ela, gaste PE para somar efeitos ao ataque: Amplo (atinge um alvo adicional adjacente) ou Destruidor (+1 no multiplicador de crítico).", efeitos: [] },
        { id: "comb.aniquilador.65", nex: 65, nome: "Técnica Sublime", ativacao: "livre",
          resumo: "Adiciona à Técnica Secreta: Letal (+2 na margem de ameaça; escolhido 2 vezes, +5) e Perfurante (ignora até 5 de resistência a dano).", efeitos: [] },
        { id: "comb.aniquilador.99", nex: 99, nome: "Máquina de Matar", ativacao: "passiva",
          resumo: "A categoria da favorita cai em III, ela ganha +2 na margem de ameaça e +1 dado de dano do mesmo tipo.", efeitos: [] },
      ],
    },
    {
      id: "comb.comandante", classe: "combatente", nome: "Comandante de Campo", fonte: "livro", pagina: "26-27",
      resumo: "Coordena e auxilia os aliados em combate, tomando decisões rápidas.",
      habilidades: [
        { id: "comb.comandante.10", nex: 10, nome: "Inspirar Confiança", ativacao: "reacao", custo: "2 PE",
          resumo: "Um aliado em alcance curto rola novamente um teste que acabou de fazer.", efeitos: [] },
        { id: "comb.comandante.40", nex: 40, nome: "Estrategista", ativacao: "padrao", custo: "1 PE por aliado",
          resumo: "Direciona aliados em alcance curto (até seu Intelecto): no próximo turno deles, cada um ganha uma ação de movimento adicional.", efeitos: [] },
        { id: "comb.comandante.65", nex: 65, nome: "Brecha na Guarda", ativacao: "reacao", custo: "2 PE", limite: "1 vez por rodada",
          resumo: "Quando um aliado fere um inimigo no seu alcance curto, você ou outro aliado faz um ataque adicional contra ele. Inspirar Confiança e Estrategista passam a alcance médio.", efeitos: [] },
        { id: "comb.comandante.99", nex: 99, nome: "Oficial Comandante", ativacao: "padrao", custo: "5 PE",
          resumo: "Cada aliado que você vê em alcance médio recebe uma ação padrão adicional no próximo turno dele.", efeitos: [] },
      ],
    },
    {
      id: "comb.guerreiro", classe: "combatente", nome: "Guerreiro", fonte: "livro", pagina: "27",
      resumo: "Transforma o próprio corpo em arma, com golpes corpo a corpo devastadores.",
      habilidades: [
        { id: "comb.guerreiro.10", nex: 10, nome: "Técnica Letal", ativacao: "passiva",
          resumo: "+2 na margem de ameaça em todos os ataques corpo a corpo.", efeitos: [] },
        { id: "comb.guerreiro.40", nex: 40, nome: "Revidar", ativacao: "reacao", custo: "2 PE",
          resumo: "Ao bloquear um ataque, faz um ataque corpo a corpo contra o inimigo que o atacou.", efeitos: [] },
        { id: "comb.guerreiro.65", nex: 65, nome: "Força Opressora", ativacao: "livre", custo: "1 PE",
          resumo: "Ao acertar corpo a corpo, faz derrubar ou empurrar como ação livre (empurrar: +5 por 10 de dano causado; derrubar com sucesso permite 1 ataque adicional por 1 PE).", efeitos: [] },
        { id: "comb.guerreiro.99", nex: 99, nome: "Potência Máxima", ativacao: "passiva",
          resumo: "No Ataque Especial com armas corpo a corpo, todos os bônus numéricos são dobrados.", efeitos: [] },
      ],
    },
    {
      id: "comb.opespeciais", classe: "combatente", nome: "Operações Especiais", fonte: "livro", pagina: "27",
      resumo: "Combatente eficaz, que calcula as ações e antevê os movimentos do inimigo.",
      habilidades: [
        { id: "comb.opespeciais.10", nex: 10, nome: "Iniciativa Aprimorada", ativacao: "passiva",
          resumo: "+5 em Iniciativa e uma ação de movimento adicional na primeira rodada.", efeitos: [] },
        { id: "comb.opespeciais.40", nex: 40, nome: "Ataque Extra", ativacao: "livre", custo: "2 PE", limite: "1 vez por rodada",
          resumo: "Ao fazer um ataque, pode fazer um ataque adicional.", efeitos: [] },
        { id: "comb.opespeciais.65", nex: 65, nome: "Surto de Adrenalina", ativacao: "livre", custo: "5 PE", limite: "1 vez por rodada",
          resumo: "Realiza uma ação padrão ou de movimento adicional.", efeitos: [] },
        { id: "comb.opespeciais.99", nex: 99, nome: "Sempre Alerta", ativacao: "passiva",
          resumo: "Recebe uma ação padrão adicional no início de cada cena de combate.", efeitos: [] },
      ],
    },
    {
      id: "comb.tropachoque", classe: "combatente", nome: "Tropa de Choque", fonte: "livro", pagina: "27",
      resumo: "Duro na queda: treinou o corpo para resistir a traumas e proteger os aliados.",
      habilidades: [
        { id: "comb.tropachoque.10", nex: 10, nome: "Casca Grossa", ativacao: "passiva",
          resumo: "+1 PV para cada 5% de NEX. Ao bloquear, soma o Vigor na resistência a dano recebida.",
          efeitos: [{ tipo: "recurso", alvo: "pv", porNivel: 1 }] },
        { id: "comb.tropachoque.40", nex: 40, nome: "Cai Dentro", ativacao: "reacao", custo: "1 PE",
          resumo: "Quando um oponente em alcance curto ataca um aliado, ele faz teste de Vontade (DT Vig); se falhar, ataca você. Quem passa fica imune até o fim da cena.", efeitos: [] },
        { id: "comb.tropachoque.65", nex: 65, nome: "Duro de Matar", ativacao: "reacao", custo: "2 PE",
          resumo: "Ao sofrer dano não paranormal, reduz o dano à metade. A partir do NEX 85% também vale para dano paranormal.", efeitos: [] },
        { id: "comb.tropachoque.99", nex: 99, nome: "Inquebrável", ativacao: "passiva",
          resumo: "Enquanto machucado: +5 na Defesa e resistência a dano 5. Enquanto morrendo, não fica indefeso e ainda pode agir (as regras de morte seguem normais).", efeitos: [] },
      ],
    },

    /* ----- Sobrevivendo ao Horror ----- */
    {
      id: "comb.agentesecreto", classe: "combatente", nome: "Agente Secreto", fonte: "sah", pagina: "15-16",
      resumo: "Agente treinado para operar discretamente a serviço da Ordo Realitas.",
      habilidades: [
        { id: "comb.agentesecreto.10", nex: 10, nome: "Carteirada", ativacao: "passiva",
          resumo: "Treino em Diplomacia ou Enganação (ou +2 nela, se já treinado). No início de cada missão recebe documentos que dão privilégios jurídicos, a critério do mestre.", efeitos: [] },
        { id: "comb.agentesecreto.40", nex: 40, nome: "O Sorriso", ativacao: "livre", custo: "2 PE",
          resumo: "+2 em Diplomacia e Enganação. Ao falhar em um desses testes, repete a rolagem (uma vez por teste) e aceita o novo resultado. 1 vez por cena, Diplomacia para acalmar a si mesmo.", efeitos: [] },
        { id: "comb.agentesecreto.65", nex: 65, nome: "Método Investigativo", ativacao: "livre", custo: "2 PE (+2 a cada uso extra na cena)",
          resumo: "A urgência de qualquer cena de investigação aumenta em 1 rodada. Pode transformar uma rolagem do mestre na tabela de eventos de investigação em \"sem evento\".", efeitos: [] },
        { id: "comb.agentesecreto.99", nex: 99, nome: "Multifacetado", ativacao: "especial", custo: "5 SAN", limite: "1 vez por cena",
          resumo: "Recebe todas as habilidades até NEX 65% de uma trilha de combatente ou especialista à escolha, até o fim da cena (cumprindo os pré-requisitos). Não pode repetir a trilha na mesma missão.", efeitos: [] },
      ],
    },
    {
      id: "comb.cacador", classe: "combatente", nome: "Caçador", fonte: "sah", pagina: "16-17",
      resumo: "Decidiu deixar de ser presa e estuda como caçar as criaturas do Outro Lado.",
      habilidades: [
        { id: "comb.cacador.10", nex: 10, nome: "Rastrear o Paranormal", ativacao: "passiva",
          resumo: "Treino em Sobrevivência (ou +2, se já treinado). Pode usá-la no lugar de Ocultismo para identificar criaturas e no lugar de Investigação e Percepção para achar rastros e pistas paranormais.", efeitos: [] },
        { id: "comb.cacador.40", nex: 40, nome: "Estudar Fraquezas", ativacao: "especial", custo: "ação de interlúdio",
          resumo: "Com uma pista ligada a um ser, estuda-o num interlúdio: recebe uma informação útil e +1 em testes de perícia contra ele até o fim da missão (por pista).", efeitos: [] },
        { id: "comb.cacador.65", nex: 65, nome: "Atacar das Sombras", ativacao: "passiva",
          resumo: "Sem penalidade em Furtividade ao se mover no deslocamento normal; penalidade por atacar com arma silenciosa reduzida; visibilidade inicial em furtividade 1 ponto menor.", efeitos: [] },
        { id: "comb.cacador.99", nex: 99, nome: "Estudar a Presa", ativacao: "passiva",
          resumo: "Ao usar Estudar Fraquezas, pode marcar o tipo do ser como \"presa\": contra ele, +1 dado em perícias, +1 na margem de ameaça e no multiplicador de crítico e resistência a dano 5. Uma presa por vez.", efeitos: [] },
      ],
    },
    {
      id: "comb.monstruoso", classe: "combatente", nome: "Monstruoso", fonte: "sah", pagina: "17-21",
      resumo: "Altera o próprio corpo para que a Entidade o invada com mais intensidade. Usa a Progressão de NEX da regra opcional (p. 98 do SaH). Os efeitos dependem do elemento escolhido (Sangue, Morte, Conhecimento ou Energia): consulte o livro.",
      habilidades: [
        { id: "comb.monstruoso.10", nex: 10, nome: "Ser Amaldiçoado", ativacao: "especial",
          resumo: "Treino em Ocultismo (ou +2). Escolha um elemento (Sangue, Morte, Conhecimento ou Energia) e execute uma etapa ritualística 1 vez por dia para receber os efeitos desse elemento; sem ela, sofre fome e sede. Veja os efeitos no livro.",
          efeitos: [{ tipo: "manual", texto: "Efeitos por elemento: SaH p. 17-19" }] },
        { id: "comb.monstruoso.40", nex: 40, nome: "Ser Macabro", ativacao: "especial",
          resumo: "A resistência a dano da etapa ritualística sobe para 10 e a penalidade em perícias para -2 dados, com efeitos adicionais por elemento. Veja o livro.",
          efeitos: [{ tipo: "manual", texto: "Efeitos por elemento: SaH p. 18-19" }] },
        { id: "comb.monstruoso.65", nex: 65, nome: "Ser Assustador", ativacao: "especial",
          resumo: "A resistência sobe para 15, mas Presença cai 1 permanentemente, com efeitos adicionais por elemento. Veja o livro.",
          efeitos: [{ tipo: "manual", texto: "Presença -1. Efeitos por elemento: SaH p. 19-20" }] },
        { id: "comb.monstruoso.99", nex: 99, nome: "Ser Aterrorizante", ativacao: "especial",
          resumo: "Os efeitos da etapa ritualística tornam-se permanentes, a resistência sobe para 20 e você passa a contar como criatura paranormal, com efeitos finais por elemento. Veja o livro.",
          efeitos: [{ tipo: "manual", texto: "Efeitos por elemento: SaH p. 20-21" }] },
      ],
    },
  ],

  /* ---------------- PODERES ---------------- */
  poderes: [
    /* ----- Livro de Regras: poderes de combatente (p. 25-26) ----- */
    { id: "comb.armamentopesado", classe: "combatente", tipo: "classe", nome: "Armamento Pesado", fonte: "livro", pagina: "25", ativacao: "passiva",
      requisitos: { atributos: { forca: 2 } }, resumo: "Proficiência com armas pesadas.", efeitos: [] },
    { id: "comb.artistamarcial", classe: "combatente", tipo: "classe", nome: "Artista Marcial", fonte: "livro", pagina: "25", ativacao: "passiva",
      resumo: "Ataques desarmados causam 1d6, podem ser letais e viram ágeis. O dano sobe para 1d8 no NEX 35% e 1d10 no NEX 70%.", efeitos: [] },
    { id: "comb.ataqueoportunidade", classe: "combatente", tipo: "classe", nome: "Ataque de Oportunidade", fonte: "livro", pagina: "25", ativacao: "reacao", custo: "1 PE",
      resumo: "Quando um ser sai voluntariamente de um espaço adjacente a você, faz um ataque corpo a corpo contra ele.", efeitos: [] },
    { id: "comb.duasarmas", classe: "combatente", tipo: "classe", nome: "Combater com Duas Armas", fonte: "livro", pagina: "25", ativacao: "especial",
      requisitos: { atributos: { agilidade: 3 }, periciasAny: ["Luta", "Pontaria"] },
      resumo: "Empunhando duas armas (ao menos uma leve), ao agredir faz dois ataques, um com cada arma, com -1 dado nos ataques até o próximo turno.", efeitos: [] },
    { id: "comb.combatedefensivo", classe: "combatente", tipo: "classe", nome: "Combate Defensivo", fonte: "livro", pagina: "25", ativacao: "especial",
      requisitos: { atributos: { intelecto: 2 } },
      resumo: "Ao agredir, pode combater defensivamente: -1 dado nos ataques e +5 na Defesa até o próximo turno.", efeitos: [] },
    { id: "comb.golpedemolidor", classe: "combatente", tipo: "classe", nome: "Golpe Demolidor", fonte: "livro", pagina: "25", ativacao: "livre", custo: "1 PE",
      requisitos: { atributos: { forca: 2 }, periciasAll: ["Luta"] },
      resumo: "Ao quebrar ou atacar um objeto, causa dois dados de dano extra do mesmo tipo da arma.", efeitos: [] },
    { id: "comb.golpepesado", classe: "combatente", tipo: "classe", nome: "Golpe Pesado", fonte: "livro", pagina: "25", ativacao: "passiva",
      resumo: "Empunhando arma corpo a corpo, o dano dela aumenta em mais um dado do mesmo tipo.", efeitos: [] },
    { id: "comb.incansavel", classe: "combatente", tipo: "classe", nome: "Incansável", fonte: "livro", pagina: "25", ativacao: "livre", custo: "2 PE", limite: "1 vez por cena",
      resumo: "Faz uma ação de investigação adicional, usando Força ou Agilidade como atributo-base do teste.", efeitos: [] },
    { id: "comb.presteza", classe: "combatente", tipo: "classe", nome: "Presteza Atlética", fonte: "livro", pagina: "25", ativacao: "livre", custo: "1 PE",
      resumo: "Ao facilitar a investigação, pode usar Força ou Agilidade no lugar do atributo-base. Se passar, o próximo aliado que usar seu bônus recebe +1 dado.", efeitos: [] },
    { id: "comb.protecaopesada", classe: "combatente", tipo: "classe", nome: "Proteção Pesada", fonte: "livro", pagina: "25", ativacao: "passiva",
      requisitos: { nexMin: 30 }, resumo: "Proficiência com proteções pesadas.", efeitos: [] },
    { id: "comb.reflexosdefensivos", classe: "combatente", tipo: "classe", nome: "Reflexos Defensivos", fonte: "livro", pagina: "25", ativacao: "passiva",
      requisitos: { atributos: { agilidade: 2 } }, resumo: "+2 em Defesa e em testes de resistência.",
      efeitos: [{ tipo: "manual", texto: "+2 em Defesa e resistências (some à mão)" }] },
    { id: "comb.saquerapido", classe: "combatente", tipo: "classe", nome: "Saque Rápido", fonte: "livro", pagina: "25", ativacao: "passiva",
      requisitos: { periciasAll: ["Iniciativa"] },
      resumo: "Sacar ou guardar itens vira ação livre. Com a regra opcional de munição, recarrega uma arma de disparo como ação livre uma vez por rodada.", efeitos: [] },
    { id: "comb.segurargatilho", classe: "combatente", tipo: "classe", nome: "Segurar o Gatilho", fonte: "livro", pagina: "25-26", ativacao: "livre", custo: "2 PE por ataque já feito no turno",
      requisitos: { nexMin: 60 }, resumo: "Ao acertar com arma de fogo, pode fazer outro ataque com a mesma arma no mesmo alvo, pagando 2 PE por cada ataque já realizado no turno.", efeitos: [] },
    { id: "comb.sentidotatico", classe: "combatente", tipo: "classe", nome: "Sentido Tático", fonte: "livro", pagina: "26", ativacao: "movimento", custo: "2 PE",
      requisitos: { atributos: { intelecto: 2 }, periciasAll: ["Percepção", "Tática"] },
      resumo: "Analisa o ambiente e recebe bônus em Defesa e testes de resistência igual ao seu Intelecto até o fim da cena.", efeitos: [] },
    { id: "comb.tanquedeguerra", classe: "combatente", tipo: "classe", nome: "Tanque de Guerra", fonte: "livro", pagina: "26", ativacao: "passiva",
      requisitos: { poderes: ["comb.protecaopesada"] }, resumo: "Com proteção pesada, a Defesa e a resistência a dano dela aumentam em +2.", efeitos: [] },
    { id: "comb.tirocerteiro", classe: "combatente", tipo: "classe", nome: "Tiro Certeiro", fonte: "livro", pagina: "26", ativacao: "passiva",
      requisitos: { periciasAll: ["Pontaria"] },
      resumo: "Com arma de disparo, soma Agilidade ao dano e ignora a penalidade contra alvos em combate corpo a corpo.", efeitos: [] },
    { id: "comb.tirocobertura", classe: "combatente", tipo: "classe", nome: "Tiro de Cobertura", fonte: "livro", pagina: "26", ativacao: "padrao", custo: "1 PE",
      resumo: "Dispara para forçar um ser a se proteger: Pontaria contra Vontade. Se vencer, o alvo não sai do lugar e sofre -5 em ataques até o início do seu próximo turno (efeito de medo).", efeitos: [] },
    { id: "comb.transcender", classe: "combatente", tipo: "classe", nome: "Transcender", fonte: "livro", pagina: "26", ativacao: "passiva", repetivel: true,
      resumo: "Escolha um poder paranormal. Você o recebe, mas não ganha Sanidade neste aumento de NEX. Pode ser escolhido várias vezes.", efeitos: [] },
    { id: "comb.treinamentopericia", classe: "combatente", tipo: "classe", nome: "Treinamento em Perícia", fonte: "livro", pagina: "26", ativacao: "passiva", repetivel: true,
      resumo: "Escolha duas perícias para se tornar treinado. A partir do NEX 35% pode escolher perícias treinadas para virar veterano e, do NEX 70%, veteranas para virar expert. Pode ser escolhido várias vezes.", efeitos: [] },

    /* ----- Sobrevivendo ao Horror: novos poderes de combatente (p. 14-15) ----- */
    { id: "comb.sah.apegoangustiado", classe: "combatente", tipo: "classe", nome: "Apego Angustiado", fonte: "sah", pagina: "14", ativacao: "passiva",
      resumo: "Você não fica inconsciente por estar morrendo, mas perde 2 pontos de Sanidade sempre que termina uma rodada consciente nessa condição.", efeitos: [] },
    { id: "comb.sah.caminhoforca", classe: "combatente", tipo: "classe", nome: "Caminho para Forca", fonte: "sah", pagina: "14", ativacao: "livre", custo: "1 PE",
      resumo: "Em perseguição, a ação sacrifício dá +1 dado extra (total +2 dados) aos testes dos outros. Em furtividade, a ação chamar atenção reduz a visibilidade dos aliados próximos em -2.", efeitos: [] },
    { id: "comb.sah.cientecicatrizes", classe: "combatente", tipo: "classe", nome: "Ciente das Cicatrizes", fonte: "sah", pagina: "14", ativacao: "passiva",
      requisitos: { periciasAny: ["Luta", "Pontaria"] },
      resumo: "Em testes para achar pistas sobre armas ou ferimentos, pode usar Luta ou Pontaria no lugar da perícia original.", efeitos: [] },
    { id: "comb.sah.correriadesesperada", classe: "combatente", tipo: "classe", nome: "Correria Desesperada", fonte: "sah", pagina: "14", ativacao: "passiva",
      resumo: "+3 m de deslocamento e +1 dado em testes de perícia para fugir em uma perseguição.", efeitos: [] },
    { id: "comb.sah.engolirchoro", classe: "combatente", tipo: "classe", nome: "Engolir o Choro", fonte: "sah", pagina: "14", ativacao: "passiva",
      resumo: "Não sofre penalidades por condições em testes de perícia para fugir e em testes de Furtividade.", efeitos: [] },
    { id: "comb.sah.instintofuga", classe: "combatente", tipo: "classe", nome: "Instinto de Fuga", fonte: "sah", pagina: "14", ativacao: "passiva",
      requisitos: { periciasAll: ["Intuição"] },
      resumo: "Quando uma cena de perseguição (ou semelhante) começa, recebe +2 em todos os testes de perícia da cena.", efeitos: [] },
    { id: "comb.sah.mochileiro", classe: "combatente", tipo: "classe", nome: "Mochileiro", fonte: "sah", pagina: "14", ativacao: "passiva",
      requisitos: { atributos: { vigor: 2 } },
      resumo: "Seu limite de carga aumenta em 5 espaços e você pode se beneficiar de uma vestimenta adicional.",
      efeitos: [{ tipo: "manual", texto: "+5 espaços de carga e 1 vestimenta adicional (ajuste na capacidade do inventário)" }] },
    { id: "comb.sah.paranoiadefensiva", classe: "combatente", tipo: "classe", nome: "Paranoia Defensiva", fonte: "sah", pagina: "15", ativacao: "especial", custo: "3 PE + 1 rodada", limite: "1 vez por cena",
      resumo: "Você e cada aliado presente escolhem: +5 na Defesa contra o próximo ataque da cena ou +5 em um único teste de perícia até o fim da cena.", efeitos: [] },
    { id: "comb.sah.sacrificarjoelhos", classe: "combatente", tipo: "classe", nome: "Sacrificar os Joelhos", fonte: "sah", pagina: "15", ativacao: "livre", custo: "2 PE", limite: "1 vez por cena de perseguição",
      requisitos: { periciasAll: ["Atletismo"] },
      resumo: "Ao fazer a ação esforço extra em uma perseguição, passa automaticamente no teste de perícia.", efeitos: [] },
    { id: "comb.sah.semtempo", classe: "combatente", tipo: "classe", nome: "Sem Tempo, Irmão", fonte: "sah", pagina: "15", ativacao: "especial", limite: "1 vez por cena de investigação",
      resumo: "Ao facilitar a investigação, passa automaticamente no teste para auxiliar os aliados, mas faz uma rolagem adicional na tabela de eventos de investigação.", efeitos: [] },
    { id: "comb.sah.valentao", classe: "combatente", tipo: "classe", nome: "Valentão", fonte: "sah", pagina: "15", ativacao: "livre", custo: "1 PE", limite: "1 vez por cena",
      resumo: "Pode usar Força no lugar de Presença em Intimidação. Uma vez por cena, faz um teste de Intimidação para assustar como ação livre.", efeitos: [] },
  ],
};

/* liga o catálogo ao conjunto de regras (assim o editor JSON mostra tudo) */
if (typeof REGRAS_OP_PADRAO !== "undefined") REGRAS_OP_PADRAO.catalogo = CATALOGO_OP_PADRAO;

/* =====================================================================
   MOTOR DO CATÁLOGO: trilha automática, poderes com requisitos, efeitos
   ===================================================================== */

let trilhaOP = ""; // id da trilha escolhida (salvo na ficha)

function obterCatalogoOP() {
  return (typeof regrasOPCustom !== "undefined" && regrasOPCustom && regrasOPCustom.catalogo) || CATALOGO_OP_PADRAO;
}

function trilhasDaClasseOP(classe) {
  return obterCatalogoOP().trilhas.filter((t) => t.classe === classe);
}

function buscarTrilhaOP(id) {
  return obterCatalogoOP().trilhas.find((t) => t.id === id) || null;
}

/* tudo que o catálogo conhece por id (habilidades de trilha + poderes) */
function buscarItemCatalogoOP(id) {
  const cat = obterCatalogoOP();
  for (const t of cat.trilhas) {
    const h = (t.habilidades || []).find((x) => x.id === id);
    if (h) return { ...h, classe: t.classe, trilha: t.nome, tipo: "trilha", fonte: h.fonte || t.fonte, pagina: h.pagina || t.pagina };
  }
  return cat.poderes.find((p) => p.id === id) || null;
}

function _fonteTextoOP(item) {
  const f = obterCatalogoOP().fontes?.[item.fonte] || item.fonte || "";
  return f ? `${f}${item.pagina ? `, p. ${item.pagina}` : ""}` : "";
}

/* ---------- poderes que a ficha possui vindos do catálogo ---------- */
function poderesDoCatalogoNaFichaOP() {
  return (typeof poderes !== "undefined" ? poderes : []).filter((p) => p.origemCatalogo);
}

function _possuiPoderCatalogoOP(id) {
  return poderesDoCatalogoNaFichaOP().some((p) => p.origemCatalogo === id);
}

/* ---------- efeitos automáticos (PV/PE/SAN) ---------- */
function somarEfeitosCatalogoOP(nivel) {
  const total = { pv: 0, pe: 0, san: 0 };

  poderesDoCatalogoNaFichaOP().forEach((p) => {
    const item = buscarItemCatalogoOP(p.origemCatalogo);
    (item?.efeitos || []).forEach((e) => {
      if (e.tipo !== "recurso" || !(e.alvo in total)) return;
      const valor = Number(e.valor) || 0;
      const porNivel = (Number(e.porNivel) || 0) * nivel;
      total[e.alvo] += valor + porNivel;
    });
  });

  return total;
}

/* ---------- requisitos ---------- */
function _atributoOP(chave) {
  return typeof get === "function" ? get(chave) : 0;
}

function verificarRequisitosOP(item) {
  const falhas = [];
  const r = item.requisitos || {};
  const nex = Number(document.getElementById("nex")?.value) || 0;
  const nomesAttr = { forca: "Força", agilidade: "Agilidade", intelecto: "Intelecto", presenca: "Presença", vigor: "Vigor" };
  const treinado = (n) => (typeof profs !== "undefined" ? (profs[n] || 0) >= 1 : false);

  if (r.nexMin && nex < r.nexMin) falhas.push(`NEX ${r.nexMin}%`);

  Object.entries(r.atributos || {}).forEach(([a, v]) => {
    if (_atributoOP(a) < v) falhas.push(`${nomesAttr[a] || a} ${v}`);
  });

  (r.periciasAll || []).forEach((p) => {
    if (!treinado(p)) falhas.push(`treinado em ${p}`);
  });

  if (r.periciasAny?.length && !r.periciasAny.some(treinado)) {
    falhas.push(`treinado em ${r.periciasAny.join(" ou ")}`);
  }

  (r.poderes || []).forEach((id) => {
    if (!_possuiPoderCatalogoOP(id)) {
      const p = buscarItemCatalogoOP(id);
      falhas.push(`poder ${p?.nome || id}`);
    }
  });

  return falhas;
}

function _requisitosTextoOP(item) {
  const r = item.requisitos || {};
  const nomesAttr = { forca: "For", agilidade: "Agi", intelecto: "Int", presenca: "Pre", vigor: "Vig" };
  const partes = [];
  if (r.nexMin) partes.push(`NEX ${r.nexMin}%`);
  Object.entries(r.atributos || {}).forEach(([a, v]) => partes.push(`${nomesAttr[a] || a} ${v}`));
  if (r.periciasAll?.length) partes.push(`treinado em ${r.periciasAll.join(" e ")}`);
  if (r.periciasAny?.length) partes.push(`treinado em ${r.periciasAny.join(" ou ")}`);
  (r.poderes || []).forEach((id) => partes.push(buscarItemCatalogoOP(id)?.nome || id));
  return partes.join(" · ");
}

/* ---------- criar o poder na lista de poderes da ficha ---------- */
function _poderDaFichaOP(item, extra = {}) {
  const efeitosAuto = (item.efeitos || []).some((e) => e.tipo === "recurso");
  const manuais = (item.efeitos || []).filter((e) => e.tipo === "manual").map((e) => e.texto);

  let desc = item.resumo || "";
  if (manuais.length) desc += `\n\n✋ Manual: ${manuais.join("; ")}`;
  if (efeitosAuto) desc += `\n\n⚙ Efeito automático aplicado nos máximos de PV/PE/SAN.`;
  const fonte = _fonteTextoOP(item);
  if (fonte) desc += `\n\n📖 ${fonte}`;

  return {
    nome: item.nome,
    categoria: item.tipo === "trilha" ? "trilha" : item.tipo || "classe",
    ativacao: item.ativacao || "passiva",
    custo: item.custo || "",
    limite: item.limite || "",
    requisito: _requisitosTextoOP(item) || (item.nex ? `NEX ${item.nex}%` : ""),
    dano: "",
    alcance: "",
    duracao: "",
    desc,
    temCargas: false,
    maxCargas: 0,
    origemCatalogo: item.id,
    ...extra,
  };
}

/* ---------- trilha: habilidades entram/saem conforme o NEX ---------- */
function sincronizarTrilhaOP() {
  if (typeof poderes === "undefined") return false;

  const nex = Number(document.getElementById("nex")?.value) || 0;
  const trilha = buscarTrilhaOP(trilhaOP);
  const desejadas = new Map();

  if (trilha) {
    (trilha.habilidades || [])
      .filter((h) => Number(h.nex) <= nex)
      .forEach((h) => desejadas.set(h.id, h));
  }

  let mudou = false;

  // remove habilidades de trilha concedidas automaticamente que não valem mais
  for (let i = poderes.length - 1; i >= 0; i--) {
    const p = poderes[i];
    if (p.autoTrilha && !desejadas.has(p.origemCatalogo)) {
      poderes.splice(i, 1);
      mudou = true;
    }
  }

  // adiciona as que faltam
  desejadas.forEach((h, id) => {
    if (poderes.some((p) => p.origemCatalogo === id)) return;
    const item = buscarItemCatalogoOP(id);
    poderes.push(_poderDaFichaOP(item, { autoTrilha: true }));
    mudou = true;
  });

  if (mudou && typeof renderPoderes === "function") renderPoderes();
  return mudou;
}

function atualizarSeletorTrilhaOP() {
  const sel = document.getElementById("trilhaOP");
  if (!sel) return;

  const classe = document.getElementById("classeOP")?.value || "";
  const lista = trilhasDaClasseOP(classe);

  sel.innerHTML =
    `<option value="">${lista.length ? "Sem trilha (escolha no NEX 10%)" : "Sem trilhas cadastradas"}</option>` +
    lista
      .map((t) => `<option value="${esc(t.id)}" ${t.id === trilhaOP ? "selected" : ""}>${esc(t.nome)}${t.fonte === "sah" ? " (SaH)" : ""}</option>`)
      .join("");

  sel.disabled = !lista.length;

  const info = document.getElementById("trilhaInfoOP");
  const t = buscarTrilhaOP(trilhaOP);
  if (info) {
    info.textContent = t ? t.resumo : "";
  }
}

function aoMudarTrilhaOP() {
  trilhaOP = document.getElementById("trilhaOP")?.value || "";
  sincronizarTrilhaOP();
  atualizarSeletorTrilhaOP();
  if (typeof aplicarRecursosAutomaticosOP === "function") aplicarRecursosAutomaticosOP();
  if (typeof atualizarResumoAutoOP === "function") atualizarResumoAutoOP();
  atualizarContadorPoderesClasseOP();
  salvarTudo();
}

/* ---------- poderes de classe: quantos já usou / quantos tem direito ---------- */
function poderesDeClasseDisponiveisOP(classe, nex) {
  const marcos = typeof marcosDaClasseOP === "function" ? marcosDaClasseOP(classe) : [];
  return marcos.filter((m) => m.tipo === "poder" && Number(m.nex) <= nex).length;
}

function poderesDeClasseUsadosOP() {
  return poderesDoCatalogoNaFichaOP().filter((p) => {
    const item = buscarItemCatalogoOP(p.origemCatalogo);
    return item && item.tipo === "classe";
  }).length;
}

function atualizarContadorPoderesClasseOP() {
  const el = document.getElementById("contadorPoderesClasseOP");
  if (!el) return;

  const classe = document.getElementById("classeOP")?.value || "";
  const nex = Number(document.getElementById("nex")?.value) || 0;
  const tem = poderesDeClasseDisponiveisOP(classe, nex);

  el.textContent = tem ? `Poderes de classe: ${poderesDeClasseUsadosOP()} de ${tem}` : "";
}

/* ---------- catálogo de poderes (escolher e adicionar) ---------- */
function abrirCatalogoPoderesOP() {
  const classe = document.getElementById("classeOP")?.value || "";
  if (!classe) {
    alertBonito("Escolha uma classe para ver os poderes disponíveis.");
    return;
  }

  const lista = obterCatalogoOP().poderes.filter((p) => p.classe === classe);
  if (!lista.length) {
    alertBonito("Ainda não há poderes cadastrados para esta classe. Você pode cadastrar em Editar regras.");
    return;
  }

  const nex = Number(document.getElementById("nex")?.value) || 0;
  const tem = poderesDeClasseDisponiveisOP(classe, nex);
  const usados = poderesDeClasseUsadosOP();

  const cartao = (p) => {
    const jaTem = _possuiPoderCatalogoOP(p.id);
    const falhas = verificarRequisitosOP(p);
    const bloqueado = (jaTem && !p.repetivel) || falhas.length > 0;
    const auto = (p.efeitos || []).some((e) => e.tipo === "recurso");
    const req = _requisitosTextoOP(p);

    return `
      <div class="cat-item ${bloqueado ? "bloqueado" : ""}">
        <div class="cat-topo">
          <strong>${esc(p.nome)}</strong>
          <span class="cat-tags">
            ${p.fonte === "sah" ? `<em class="cat-tag">SaH</em>` : ""}
            ${p.ativacao ? `<em class="cat-tag">${esc(_nomeAtivacaoOP(p.ativacao))}</em>` : ""}
            ${p.custo ? `<em class="cat-tag">${esc(p.custo)}</em>` : ""}
            ${auto ? `<em class="cat-tag auto">⚙ automático</em>` : ""}
          </span>
        </div>
        ${req ? `<div class="cat-req">Pré-requisitos: ${esc(req)}</div>` : ""}
        <p class="cat-resumo">${esc(p.resumo || "")}</p>
        ${
          jaTem && !p.repetivel
            ? `<div class="cat-estado">✔ Já adquirido</div>`
            : falhas.length
              ? `<div class="cat-estado falta">Falta: ${esc(falhas.join(", "))}</div>`
              : ""
        }
        <button type="button" class="cat-add" ${bloqueado ? "disabled" : ""} onclick="adquirirPoderCatalogoOP('${esc(p.id)}')">
          ${jaTem && p.repetivel ? "Adquirir de novo" : "Adquirir"}
        </button>
      </div>`;
  };

  const html = `
    <div class="popup-bloco">
      ${tem ? `<div class="cat-contador">Poderes de classe: <b>${usados}</b> de <b>${tem}</b> disponíveis no NEX ${nex}%</div>` : ""}
      <div class="cat-lista">${lista.map(cartao).join("")}</div>
      <small class="evo-dica">Descrições resumidas: o texto completo está no livro (fonte indicada ao adquirir).</small>
    </div>`;

  abrirPopup("Catálogo de poderes", html, true);
}

function _nomeAtivacaoOP(v) {
  return { passiva: "Passiva", padrao: "Ação padrão", movimento: "Movimento", completa: "Completa", livre: "Livre", reacao: "Reação", especial: "Especial" }[v] || v;
}

async function adquirirPoderCatalogoOP(id) {
  const item = obterCatalogoOP().poderes.find((p) => p.id === id);
  if (!item) return;

  const falhas = verificarRequisitosOP(item);
  if (falhas.length) {
    alertBonito(`Requisitos não cumpridos: ${falhas.join(", ")}.`);
    return;
  }
  if (_possuiPoderCatalogoOP(id) && !item.repetivel) return;

  const classe = document.getElementById("classeOP")?.value || "";
  const nex = Number(document.getElementById("nex")?.value) || 0;
  const tem = poderesDeClasseDisponiveisOP(classe, nex);
  if (tem && poderesDeClasseUsadosOP() >= tem) {
    const ok = await confirmBonito(`Você já usou os ${tem} poderes de classe disponíveis no NEX ${nex}%. Adquirir mesmo assim?`);
    if (!ok) return;
  }

  poderes.push(_poderDaFichaOP(item));

  if (typeof renderPoderes === "function") renderPoderes();
  if (typeof aplicarRecursosAutomaticosOP === "function") aplicarRecursosAutomaticosOP();
  if (typeof atualizarResumoAutoOP === "function") atualizarResumoAutoOP();
  atualizarContadorPoderesClasseOP();
  salvarTudo();
  abrirCatalogoPoderesOP();
}

/* ---------- interface injetada ---------- */
function montarBarraCatalogoOP() {
  if (document.getElementById("barraCatalogoOP")) return;
  const lista = document.getElementById("listaPoderesOrdem");
  if (!lista) return;

  const barra = document.createElement("div");
  barra.id = "barraCatalogoOP";
  barra.className = "catalogo-op-barra";
  barra.innerHTML = `
    <button type="button" onclick="abrirCatalogoPoderesOP()">📖 Catálogo de poderes</button>
    <span id="contadorPoderesClasseOP" class="catalogo-op-contador"></span>`;
  lista.insertAdjacentElement("beforebegin", barra);
  atualizarContadorPoderesClasseOP();
}

function montarSeletorTrilhaOP() {
  if (document.getElementById("trilhaOP")) return;
  const toggle = document.querySelector("#opAutoBox .op-auto-toggle");
  if (!toggle) return;

  const bloco = document.createElement("div");
  bloco.className = "op-trilha-bloco";
  bloco.innerHTML = `
    <label for="trilhaOP">Trilha</label>
    <select id="trilhaOP" class="input-personagem" onchange="aoMudarTrilhaOP()"></select>
    <small id="trilhaInfoOP" class="op-trilha-info"></small>`;
  toggle.insertAdjacentElement("afterend", bloco);
  atualizarSeletorTrilhaOP();
}

/* ---------- ligação com a ficha ---------- */
function carregarTrilhaOP(p) {
  trilhaOP = p.trilhaOP || "";
  atualizarSeletorTrilhaOP();
  atualizarContadorPoderesClasseOP();
}

function salvarTrilhaOP(p) {
  p.trilhaOP = trilhaOP || "";
}

function _iniciarCatalogoOP() {
  montarSeletorTrilhaOP();
  montarBarraCatalogoOP();
  document.getElementById("classeOP")?.addEventListener("change", () => {
    const t = buscarTrilhaOP(trilhaOP);
    const classe = document.getElementById("classeOP")?.value || "";
    if (t && t.classe !== classe) {
      trilhaOP = "";
      sincronizarTrilhaOP();
    }
    atualizarSeletorTrilhaOP();
    atualizarContadorPoderesClasseOP();
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(_iniciarCatalogoOP, 0));
else setTimeout(_iniciarCatalogoOP, 0);
