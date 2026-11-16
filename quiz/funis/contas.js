/* ===========================================================
   FUNIL "contas" — chegar em janeiro com as contas pagas
   (IPVA, IPTU, material escolar, matrícula, fatura do cartão)
   Link: /quiz/?f=contas
   =========================================================== */
window.QUIZ = {
  id: "contas",
  paginaTitulo: "Quiz Natalê | Chegue em janeiro com as contas pagas",
  marca: { nome: "Natalê", logo: "../assets/img/logo-natale.webp", link: "../" },

  abertura: {
    imagem: "../assets/img/quiz-contas.webp",
    imagemAlt: "Bancada de confeitaria com calculadora, caderno e doces de Natal",
    eyebrow: "🧾 Quiz Natalê · 1 minuto",
    titulo: "Janeiro chega com boleto. <span>E se dezembro chegasse com encomenda?</span>",
    lead: "O <strong>Natalê</strong> te entrega receitas de Natal, preços calculados e cardápios prontos para vender por encomenda. Responda 6 perguntas e veja quantas encomendas pagam as contas do começo do ano."
  },

  perguntas: [
    { id: "conta", eyebrow: "Para começar…", titulo: "Qual conta do começo do ano <em>mais pesa</em> aí?", opcoes: [
      { v: "impostos", ic: "🚗", t: "IPVA e IPTU" },
      { v: "escola", ic: "🎒", t: "Material escolar e matrícula" },
      { v: "cartao", ic: "💳", t: "A fatura do cartão de dezembro" },
      { v: "casa", ic: "🏠", t: "As contas da casa de todo mês" }
    ]},
    { id: "meta", eyebrow: "Fazendo as contas", titulo: "Quanto você precisa <em>a mais</em> para começar o ano tranquila?", opcoes: [
      { v: "800", ic: "🧾", t: "Até R$ 800" },
      { v: "2000", ic: "📄", t: "De R$ 1.000 a R$ 2.500" },
      { v: "4000", ic: "📚", t: "De R$ 2.500 a R$ 5.000" },
      { v: "7000", ic: "🏦", t: "Mais de R$ 5.000" }
    ]},
    { id: "renda", eyebrow: "Sobre a sua renda", titulo: "Hoje, a sua renda vem de onde?", opcoes: [
      { v: "clt", ic: "🏢", t: "Salário de carteira assinada", s: "Mas não sobra nada" },
      { v: "autonoma", ic: "🧰", t: "Trabalho por conta", s: "Não tenho 13º" },
      { v: "casa", ic: "👶", t: "Cuido da casa e dos filhos", s: "Quero uma renda que seja minha" },
      { v: "aposentada", ic: "🌻", t: "Sou aposentada ou pensionista", s: "Quero complementar" }
    ]},
    { id: "vendeu", eyebrow: "Sobre a cozinha", titulo: "Você já vendeu doces ou salgados <em>alguma vez</em>?", opcoes: [
      { v: "muito", ic: "🏆", t: "Sim, já vendo com frequência" },
      { v: "pouco", ic: "🍬", t: "Já vendi um pouco" },
      { v: "nunca", ic: "🏠", t: "Só cozinho para a minha casa", s: "E todo mundo elogia" }
    ]},
    { id: "dificuldade", eyebrow: "Quase lá", titulo: "O que mais te <em>trava</em> para começar a vender?", opcoes: [
      { v: "receitas", ic: "📖", t: "Não sei o que fazer para vender" },
      { v: "preco", ic: "🧮", t: "Não sei quanto cobrar" },
      { v: "divulgar", ic: "📲", t: "Não sei divulgar e achar clientes" },
      { v: "investir", ic: "💰", t: "Tenho medo de gastar e não vender" }
    ]},
    { id: "tempo", eyebrow: "Última pergunta", titulo: "Quanto tempo você tem para <em>produzir</em>?", opcoes: [
      { v: "pouco", ic: "⏰", t: "Algumas horas por semana" },
      { v: "fds", ic: "📅", t: "Só nos fins de semana" },
      { v: "meio", ic: "🌗", t: "Meio período" },
      { v: "integral", ic: "☀️", t: "Tempo integral" }
    ]}
  ],

  lead: { pedir: null, webhook: "" },

  analise: {
    titulo: "{Nome}, estamos montando o seu <em>plano de janeiro</em>…",
    itens: ["Somando as contas do começo do ano", "Calculando quantas encomendas pagam tudo", "Dividindo a meta até o Natal", "Separando as receitas com mais lucro"]
  },

  resultado: {
    titulo: "{nome,}{encomendas} encomendas <span>pagam o seu janeiro</span>",
    prazo: { mes: 12, dia: 24, rotulo: "até o Natal" },
    meta: { por: "meta", padrao: 2000, ticket: 45, rotulo: "O que você precisa juntar {prazo}", unidade: "encomendas de {ticket}", unidadeTempo: "semanas {prazo}", unidadeSemana: "encomendas por semana" },
    perfilPor: "conta",
    perfis: {
      impostos: ["IPVA E IPTU PAGOS", "IPVA e IPTU vencem logo no começo do ano, e quem paga à vista costuma ter desconto. O dinheiro das encomendas entra em dezembro, a tempo."],
      escola: ["VOLTA ÀS AULAS TRANQUILA", "Lista de material e matrícula chegam todo janeiro. Desta vez, quem paga é a ceia dos outros."],
      cartao: ["FATURA SOB CONTROLE", "Dezembro é o mês que mais pesa no cartão. Com as encomendas, a fatura de janeiro já tem dinheiro separado."],
      casa: ["CASA EM DIA", "Uma renda extra em dezembro dá fôlego para começar o ano sem atrasar nada."],
      _padrao: ["JANEIRO EM DIA", "O dinheiro das encomendas entra em dezembro, antes das contas."]
    },
    complementoPor: "renda",
    complementos: {
      clt: "E sem largar o emprego: dá para produzir à noite e no fim de semana.",
      autonoma: "Para quem não tem 13º, o Natal é o 13º que você mesma faz.",
      casa: "E é um dinheiro seu, feito na sua cozinha, no seu horário.",
      aposentada: "Uma renda que respeita o seu ritmo, com receitas que você escolhe."
    },
    tituloPlano: "O seu plano até o Natal",
    blocos: [
      { por: "dificuldade", itens: {
        receitas: { ic: "📖", texto: "<strong>O que vender:</strong> +85 receitas natalinas, doces e salgadas, com rendimento e validade. Escolha as que você já sabe fazer e comece.", destaque: "+85 receitas natalinas doces e salgadas, passo a passo" },
        preco: { ic: "🧮", texto: "<strong>Preço com lucro:</strong> a calculadora mostra custo, preço e lucro de cada receita. Cada venda paga um pedaço da conta.", destaque: "Calculadora automática de preços" },
        divulgar: { ic: "📲", texto: "<strong>Clientes chegando:</strong> cardápios para editar e mensagens de WhatsApp para copiar e mandar hoje mesmo.", destaque: "Cardápios editáveis e mensagens prontas" },
        investir: { ic: "💰", texto: "<strong>Sem gastar antes de vender:</strong> monte o cardápio, receba 50% de sinal no Pix e só então compre os ingredientes daquele pedido.", destaque: "Cardápios editáveis e mensagens prontas" }
      }},
      { por: "tempo", ic: "⏳", titulo: "O seu tempo:", itens: {
        pouco: "comece com 3 ou 4 produtos de base única, como brigadeiros e bolos de pote, que rendem muito por fornada.",
        fds: "produza e entregue no fim de semana, sem atrapalhar a rotina.",
        meio: "dá para um cardápio de 6 a 8 produtos e entregas todos os dias da semana do Natal.",
        integral: "inclua salgados para a ceia e kits para empresas, os pedidos de maior valor."
      }},
      { fixo: { ic: "🎯", texto: "<strong>Meta semanal:</strong> {porSemana} encomendas por semana. Uma caixa de brigadeiros, um chocotone ou um cento de salgados já contam." } }
    ]
  },

  oferta: {
    titulo: "Tudo para começar a vender ainda esta semana, no <em>Natalê</em>",
    imagem: "../assets/img/oferta-mockup.webp",
    imagemAlt: "Tudo que vem no Natalê",
    itens: ["+85 receitas natalinas doces e salgadas, passo a passo", "Cardápios editáveis e mensagens prontas", "Calculadora automática de preços", "Organizador de encomendas", "Etiquetas, legendas e artes de Natal", "+ 5 bônus e acesso vitalício"],
    botao: "QUERO MEU JANEIRO EM DIA",
    garantiaDias: 7,
    garantiaTexto: "Garantia incondicional: use com calma e, se não for para você, devolvemos 100% do seu dinheiro.",
    linkReserva: "../#oferta-final",
    linkVerMais: "../",
    linkVerMaisTexto: "Quero ver tudo que vem no Natalê"
  }
};
