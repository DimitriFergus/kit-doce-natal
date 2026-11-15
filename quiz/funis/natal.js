/* ===========================================================
   FUNIL "natal" — renda extra vendendo doces e salgados no Natal
   Link: /quiz/   ou   /quiz/?f=natal
   Tokens que funcionam nos textos: {nome} {Nome} {nome,} {meta} {ticket}
   {encomendas} {porSemana} {semanas} {dias} {prazo} {marca}
   =========================================================== */
window.QUIZ = {
  id: "natal",
  paginaTitulo: "Quiz Natalê | Quanto você pode faturar com doces e salgados neste Natal?",
  marca: { nome: "Natalê", logo: "../assets/img/logo-natale.webp", link: "../" },

  abertura: {
    imagem: "../assets/img/oferta2-hero.webp",
    imagemAlt: "Confeiteira mostrando uma caixa de doces de Natal",
    titulo: "Quanto você pode faturar <span>vendendo doces e salgados neste Natal?</span>",
    lead: "Responda 6 perguntas rápidas e receba a sua meta de encomendas até o dia 24, com um plano feito para o seu tempo e a sua cozinha.",
    selos: ["⏱️ Leva 1 minuto", "🎄 Focado no Natal", "💰 Renda extra"],
    botao: "COMEÇAR MEU DIAGNÓSTICO"
  },

  perguntas: [
    { id: "vendeu", eyebrow: "Para começar…", titulo: "Você já vendeu doces ou salgados <em>alguma vez</em>?", opcoes: [
      { v: "muito", ic: "🏆", t: "Sim, já vendo com frequência", s: "Tenho clientes que compram de mim" },
      { v: "pouco", ic: "🍬", t: "Já vendi um pouco", s: "Para família, amigos e vizinhos" },
      { v: "quer", ic: "✨", t: "Nunca vendi, mas quero começar", s: "Este é o meu Natal de estreia" },
      { v: "nunca", ic: "🏠", t: "Só cozinho para a minha casa", s: "E todo mundo elogia" }
    ]},
    { id: "motivo", eyebrow: "O que te move", titulo: "Para que você quer <em>esse dinheiro extra</em>?", opcoes: [
      { v: "contas", ic: "🧾", t: "Chegar em janeiro com as contas pagas", s: "IPVA, IPTU, material escolar, cartão…" },
      { v: "presentes", ic: "🎁", t: "Dar um Natal bonito para a família", s: "Presentes e ceia sem apertar o orçamento" },
      { v: "ferias", ic: "🏖️", t: "Viajar ou curtir as férias", s: "Sem entrar janeiro no vermelho" },
      { v: "negocio", ic: "🚀", t: "Começar o meu próprio negócio", s: "E não depender só do salário" }
    ]},
    { id: "meta", eyebrow: "Agora, a sua meta", titulo: "Quanto você gostaria de <em>faturar até o dia 24</em>?", opcoes: [
      { v: "800", ic: "🎁", t: "Até R$ 800", s: "Um respiro no orçamento" },
      { v: "2000", ic: "🎄", t: "De R$ 1.000 a R$ 2.500", s: "Para fechar o ano no azul" },
      { v: "4000", ic: "⭐", t: "De R$ 2.500 a R$ 5.000", s: "Uma renda extra de verdade" },
      { v: "7000", ic: "👑", t: "Mais de R$ 5.000", s: "Quero transformar isso em negócio" }
    ]},
    { id: "dificuldade", eyebrow: "Seja sincera", titulo: "Hoje, o que mais te <em>trava</em>?", opcoes: [
      { v: "receitas", ic: "📖", t: "Não sei o que fazer para vender", s: "Nem tenho receitas testadas" },
      { v: "preco", ic: "🧮", t: "Não sei quanto cobrar", s: "Medo de cobrar caro ou ter prejuízo" },
      { v: "divulgar", ic: "📲", t: "Não sei divulgar e achar clientes", s: "Falta cardápio bonito e o que postar" },
      { v: "organizar", ic: "📋", t: "Tenho medo de me perder com os pedidos", s: "Datas, sabores, quantidades…" }
    ]},
    { id: "tempo", eyebrow: "Quase lá", titulo: "Quanto tempo você tem para <em>produzir</em>?", opcoes: [
      { v: "pouco", ic: "⏰", t: "Algumas horas por semana", s: "Trabalho fora ou cuido da casa" },
      { v: "fds", ic: "📅", t: "Só nos fins de semana" },
      { v: "meio", ic: "🌗", t: "Meio período" },
      { v: "integral", ic: "☀️", t: "Tempo integral" }
    ]},
    { id: "pronta", eyebrow: "Última pergunta", titulo: "Com receitas, cardápio e preço prontos, você começaria <em>ainda esta semana</em>?", opcoes: [
      { v: "ja", ic: "🔥", t: "Sim, quero começar agora", s: "Só falta o passo a passo" },
      { v: "medo", ic: "🙈", t: "Sim, mas tenho medo de não dar certo" },
      { v: "talvez", ic: "🤷", t: "Talvez, preciso pensar" },
      { v: "nao", ic: "💤", t: "Ainda não", s: "Só estou pesquisando" }
    ]}
  ],

  /* contato antes do resultado: troque pedir para "whatsapp" ou "email" e cole o webhook (Make, Zapier, n8n, planilha…) */
  lead: { pedir: null, webhook: "" },

  analise: {
    titulo: "{Nome}, estamos montando o seu <em>diagnóstico</em>…",
    itens: ["Analisando o seu momento", "Calculando quantas encomendas você precisa", "Montando a sua meta semana a semana", "Separando as ferramentas certas para você"]
  },

  resultado: {
    titulo: "{nome,}a sua meta é <span>{meta} {prazo}</span>",
    prazo: { mes: 12, dia: 24, rotulo: "até o Natal" },
    meta: { por: "meta", padrao: 2000, ticket: 45, rotulo: "A sua meta de faturamento {prazo}", unidade: "encomendas de {ticket}", unidadeTempo: "semanas {prazo}", unidadeSemana: "encomendas por semana" },
    perfilPor: "vendeu",
    perfis: {
      muito: ["CONFEITEIRA EM ASCENSÃO", "Você já provou que a sua comida vende. Agora é cobrar o preço certo e dar conta de mais pedidos sem se perder."],
      pouco: ["CONFEITEIRA COM POTENCIAL", "Você já tem quem compra de você. Com cardápio, preço e divulgação certos, a venda para conhecidos vira renda de verdade."],
      quer: ["ESTREANTE DE NATAL", "Dezembro é a melhor época do ano para começar: as pessoas já estão procurando doces e salgados para a ceia e para presentear."],
      nunca: ["TALENTO ESCONDIDO", "Quem cozinha para a família já tem o mais difícil. Falta transformar isso em produto, com receita testada e preço calculado."],
      _padrao: ["ESTREANTE DE NATAL", "Dezembro é a melhor época do ano para começar."]
    },
    complementoPor: "motivo",
    complementos: {
      contas: "E o melhor: o dinheiro entra em dezembro, antes dos boletos de janeiro.",
      presentes: "Com essa meta, os presentes e a ceia saem do seu forno, não do cartão.",
      ferias: "Com essa meta batida, as férias de janeiro ficam pagas antes de começar.",
      negocio: "O Natal é o melhor teste para um negócio: em poucas semanas você descobre o que vende na sua região."
    },
    tituloPlano: "O seu plano para chegar lá",
    blocos: [
      { por: "dificuldade", itens: {
        receitas: { ic: "📖", texto: "<strong>O que vender:</strong> +85 receitas natalinas, doces e salgadas, testadas, com rendimento e validade. Você só escolhe o que entra no cardápio.", destaque: "+85 receitas natalinas doces e salgadas, passo a passo" },
        preco: { ic: "🧮", texto: "<strong>Preço sem medo:</strong> a calculadora soma ingredientes, embalagem e lucro e mostra o preço certo de cada receita.", destaque: "Calculadora automática de preços" },
        divulgar: { ic: "📲", texto: "<strong>Divulgação pronta:</strong> cardápios editáveis, mensagens de WhatsApp e legendas para você só copiar e postar.", destaque: "Cardápios editáveis e mensagens prontas" },
        organizar: { ic: "📋", texto: "<strong>Pedidos organizados:</strong> o organizador soma quantas unidades de cada sabor você precisa fazer por dia de entrega.", destaque: "Organizador de encomendas" }
      }},
      { por: "tempo", ic: "⏳", titulo: "O seu tempo:", itens: {
        pouco: "com poucas horas, comece com 3 ou 4 produtos de base única, como brigadeiros e bolos de pote, que rendem muito por fornada.",
        fds: "concentre a produção no fim de semana e entregue no sábado e no domingo, sem atrapalhar a rotina.",
        meio: "meio período dá para um cardápio de 6 a 8 produtos e entregas todos os dias da semana do Natal.",
        integral: "com tempo integral você pode incluir salgados para a ceia e kits para empresas, os pedidos de maior valor."
      }},
      { fixo: { ic: "🎯", texto: "<strong>Meta semanal:</strong> {porSemana} encomendas por semana. Uma caixa de brigadeiros, um chocotone ou um cento de salgados já contam." } },
      { por: "pronta", itens: { medo: { ic: "💛", texto: "<strong>Sobre o medo de não dar certo:</strong> você tem 7 dias de garantia. Se não for para você, devolvemos 100% do valor." } } }
    ]
  },

  oferta: {
    titulo: "O que você precisa está no <em>Natalê</em>",
    imagem: "../assets/img/oferta-mockup.webp",
    imagemAlt: "Tudo que vem no Natalê",
    itens: ["+85 receitas natalinas doces e salgadas, passo a passo", "Cardápios editáveis e mensagens prontas", "Calculadora automática de preços", "Organizador de encomendas", "Etiquetas, legendas e artes de Natal", "+ 5 bônus e acesso vitalício"],
    botao: "QUERO BATER MINHA META",
    garantiaDias: 7,
    garantiaTexto: "Garantia incondicional: use com calma e, se não for para você, devolvemos 100% do seu dinheiro.",
    linkReserva: "../#oferta-final",
    linkVerMais: "../",
    linkVerMaisTexto: "Quero ver tudo que vem no Natalê"
    /* checkout: "",  vazio = usa checkoutQuiz (ou checkoutOferta1) de assets/js/kit.js */
  }
};
