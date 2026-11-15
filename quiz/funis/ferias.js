/* ===========================================================
   FUNIL "ferias" — renda extra para pagar as férias / a viagem de janeiro
   Link: /quiz/?f=ferias
   =========================================================== */
window.QUIZ = {
  id: "ferias",
  paginaTitulo: "Quiz Natalê | Quanto falta para as suas férias saírem do forno?",
  marca: { nome: "Natalê", logo: "../assets/img/logo-natale.webp", link: "../" },

  abertura: {
    imagem: "../assets/img/oferta2-hero.webp",
    imagemAlt: "Confeiteira mostrando uma caixa de doces de Natal",
    eyebrow: "Férias pagas, sem cartão",
    titulo: "E se as suas férias de janeiro <span>saíssem da sua cozinha?</span>",
    lead: "Responda 6 perguntas e descubra quantas encomendas de Natal pagam a sua viagem, com uma meta semana a semana.",
    selos: ["⏱️ Leva 1 minuto", "🏖️ Meta para as férias", "🎄 Vendas de Natal"],
    botao: "CALCULAR MINHAS FÉRIAS"
  },

  perguntas: [
    { id: "destino", eyebrow: "Para começar…", titulo: "Como seriam as <em>férias dos seus sonhos</em> em janeiro?", opcoes: [
      { v: "praia", ic: "🏖️", t: "Uns dias de praia com a família" },
      { v: "viagem", ic: "✈️", t: "Uma viagem de verdade", s: "Avião, hotel, passeio" },
      { v: "parentes", ic: "🚗", t: "Visitar a família em outra cidade" },
      { v: "casa", ic: "🏡", t: "Ficar em casa, mas sem aperto", s: "Passeios e lazer com as crianças" }
    ]},
    { id: "meta", eyebrow: "Fazendo as contas", titulo: "Quanto você precisa <em>juntar até o fim do ano</em>?", opcoes: [
      { v: "800", ic: "🧳", t: "Até R$ 800" },
      { v: "2000", ic: "🌴", t: "De R$ 1.000 a R$ 2.500" },
      { v: "4000", ic: "✈️", t: "De R$ 2.500 a R$ 5.000" },
      { v: "7000", ic: "🌎", t: "Mais de R$ 5.000" }
    ]},
    { id: "hoje", eyebrow: "Seja sincera", titulo: "Hoje, como você pagaria essas férias?", opcoes: [
      { v: "cartao", ic: "💳", t: "No cartão, parcelado", s: "E pagaria o ano inteiro" },
      { v: "13", ic: "💸", t: "Com o 13º", s: "Que já tem destino certo…" },
      { v: "nao", ic: "😔", t: "Do jeito que está, não vou viajar" },
      { v: "guardando", ic: "🐷", t: "Estou guardando, mas falta" }
    ]},
    { id: "vendeu", eyebrow: "Sobre a cozinha", titulo: "Você já vendeu doces ou salgados <em>alguma vez</em>?", opcoes: [
      { v: "muito", ic: "🏆", t: "Sim, já vendo com frequência" },
      { v: "pouco", ic: "🍬", t: "Já vendi um pouco", s: "Para família, amigos e vizinhos" },
      { v: "nunca", ic: "🏠", t: "Só cozinho para a minha casa", s: "E todo mundo elogia" }
    ]},
    { id: "dificuldade", eyebrow: "Quase lá", titulo: "O que mais te <em>trava</em> para começar a vender?", opcoes: [
      { v: "receitas", ic: "📖", t: "Não sei o que fazer para vender" },
      { v: "preco", ic: "🧮", t: "Não sei quanto cobrar" },
      { v: "divulgar", ic: "📲", t: "Não sei divulgar e achar clientes" },
      { v: "organizar", ic: "📋", t: "Tenho medo de me perder com os pedidos" }
    ]},
    { id: "tempo", eyebrow: "Última pergunta", titulo: "Quanto tempo você tem para <em>produzir</em> até o Réveillon?", opcoes: [
      { v: "pouco", ic: "⏰", t: "Algumas horas por semana" },
      { v: "fds", ic: "📅", t: "Só nos fins de semana" },
      { v: "meio", ic: "🌗", t: "Meio período" },
      { v: "integral", ic: "☀️", t: "Tempo integral" }
    ]}
  ],

  lead: { pedir: null, webhook: "" },

  analise: {
    titulo: "{Nome}, estamos calculando as suas <em>férias</em>…",
    itens: ["Somando o custo das férias", "Calculando quantas encomendas pagam a viagem", "Dividindo a meta até o Réveillon", "Separando as receitas que mais rendem"]
  },

  resultado: {
    titulo: "{nome,}as suas férias custam <span>{encomendas} encomendas</span>",
    prazo: { mes: 12, dia: 31, rotulo: "até o Réveillon" },
    meta: { por: "meta", padrao: 2000, ticket: 45, rotulo: "O que você precisa juntar {prazo}", unidade: "encomendas de {ticket}", unidadeTempo: "semanas {prazo}", unidadeSemana: "encomendas por semana" },
    perfilPor: "hoje",
    perfis: {
      cartao: ["FÉRIAS SEM PARCELA", "Parcelar as férias é pagar janeiro até outubro. Com {porSemana} encomendas por semana, a viagem fica paga antes de começar."],
      "13": ["13º LIVRE", "O 13º já tem destino: contas, IPVA, material escolar. As encomendas de Natal pagam as férias e deixam o 13º em paz."],
      nao: ["FÉRIAS POSSÍVEIS", "Dá, sim. Dezembro é o mês em que mais gente compra doces e salgados. São {porSemana} encomendas por semana até o Réveillon."],
      guardando: ["FALTA POUCO", "Você já começou a guardar. As encomendas de Natal completam o que falta em poucas semanas."],
      _padrao: ["FÉRIAS POSSÍVEIS", "Dezembro é o mês em que mais gente compra doces e salgados."]
    },
    tituloPlano: "O seu plano até as férias",
    blocos: [
      { por: "dificuldade", itens: {
        receitas: { ic: "📖", texto: "<strong>O que vender:</strong> +85 receitas natalinas, doces e salgadas, com rendimento e validade. Escolha 4 ou 5 e monte o cardápio hoje.", destaque: "+85 receitas natalinas doces e salgadas, passo a passo" },
        preco: { ic: "🧮", texto: "<strong>Preço que paga a viagem:</strong> a calculadora mostra custo, preço e lucro de cada receita. Nada de trabalhar de graça.", destaque: "Calculadora automática de preços" },
        divulgar: { ic: "📲", texto: "<strong>Clientes chegando:</strong> cardápios prontos para editar e mensagens de WhatsApp para copiar e mandar.", destaque: "Cardápios editáveis e mensagens prontas" },
        organizar: { ic: "📋", texto: "<strong>Sem se perder:</strong> o organizador de encomendas soma o que produzir em cada dia de entrega.", destaque: "Organizador de encomendas" }
      }},
      { por: "tempo", ic: "⏳", titulo: "O seu tempo:", itens: {
        pouco: "comece com 3 ou 4 produtos de base única, como brigadeiros e bolos de pote, que rendem muito por fornada.",
        fds: "produza e entregue no fim de semana. Em {semanas} semanas, são {semanas} fins de semana de vendas.",
        meio: "dá para um cardápio de 6 a 8 produtos e entregas todos os dias da semana do Natal e do Réveillon.",
        integral: "inclua salgados para a ceia e kits para empresas, os pedidos de maior valor."
      }},
      { fixo: { ic: "🎯", texto: "<strong>Meta semanal:</strong> {porSemana} encomendas por semana. Uma caixa de brigadeiros, um chocotone ou um cento de salgados já contam." } },
      { fixo: { ic: "🏖️", texto: "<strong>Dica:</strong> peça 50% de sinal no Pix ao fechar cada pedido. O dinheiro da viagem já vai entrando antes da entrega." } }
    ]
  },

  oferta: {
    titulo: "Tudo para as suas férias saírem do forno, no <em>Natalê</em>",
    imagem: "../assets/img/oferta-mockup.webp",
    imagemAlt: "Tudo que vem no Natalê",
    itens: ["+85 receitas natalinas doces e salgadas, passo a passo", "Cardápios editáveis e mensagens prontas", "Calculadora automática de preços", "Organizador de encomendas", "Etiquetas, legendas e artes de Natal e Ano Novo", "+ 5 bônus e acesso vitalício"],
    botao: "QUERO PAGAR MINHAS FÉRIAS",
    garantiaDias: 7,
    garantiaTexto: "Garantia incondicional: use com calma e, se não for para você, devolvemos 100% do seu dinheiro.",
    linkReserva: "../#oferta-final",
    linkVerMais: "../",
    linkVerMaisTexto: "Quero ver tudo que vem no Natalê"
  }
};
