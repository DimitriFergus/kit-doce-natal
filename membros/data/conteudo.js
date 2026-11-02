/* ===========================================================
   KIT DOCE NATAL — conteúdo da área de membros
   {loja}, {whats}, {instagram}, {cidade} e {pix} são trocados pelos dados do "Meu perfil".
   Trechos entre [COLCHETES] o aluno completa na hora de enviar.
   =========================================================== */
var CONTEUDO = window.CONTEUDO = {};

/* ---------------- MENSAGENS PARA WHATSAPP ---------------- */
CONTEUDO.mensagens = [
  { cat: "Divulgação", titulo: "Abertura das encomendas", texto: "🎄 *ENCOMENDAS DE NATAL ABERTAS!* 🎄\n\nOi! Aqui é da {loja} 💛\nJá estou aceitando encomendas de doces para o Natal: chocotones, brigadeiros gourmet, copos da felicidade, presenteáveis e muito mais.\n\nAs vagas são limitadas porque tudo é feito à mão, com muito carinho.\n\n👉 Responda esta mensagem com *EU QUERO* que eu te mando o cardápio completo!" },
  { cat: "Divulgação", titulo: "Envio do cardápio", texto: "Que bom que você quer conhecer! 😍\n\nSegue o cardápio de Natal da {loja} 👇\n\n[ENVIE A IMAGEM DO CARDÁPIO]\n\nPara garantir sua encomenda é só me dizer:\n1️⃣ O que você quer\n2️⃣ A quantidade\n3️⃣ A data de retirada ou entrega\n\nQualquer dúvida, estou por aqui!" },
  { cat: "Divulgação", titulo: "Lembrete para lista de contatos", texto: "Oi, [NOME]! Tudo bem? 😊\n\nPassando para avisar que a agenda de Natal da {loja} está abrindo. Ano passado muita gente ficou sem porque as vagas acabaram rápido, então estou avisando primeiro quem é de casa 💛\n\nQuer que eu te mande o cardápio?" },
  { cat: "Divulgação", titulo: "Presente para empresas", texto: "Olá! Aqui é da {loja} 🎁\n\nEstamos montando *kits de Natal para empresas*: lembrancinhas para equipe, clientes e fornecedores, com embalagem personalizada e cartão com a sua marca.\n\nTrabalhamos com pedidos a partir de [QUANTIDADE MÍNIMA] unidades. Posso te enviar as opções e valores?" },
  { cat: "Divulgação", titulo: "Últimas vagas", texto: "⏰ *ÚLTIMAS VAGAS PARA O NATAL!*\n\nA agenda da {loja} está quase fechada. Restam poucas vagas para entrega no dia [DATA].\n\nSe você ainda não garantiu os doces da sua ceia ou os presentes, me chama agora 👇\n{whats}" },
  { cat: "Divulgação", titulo: "Status: produção do dia", texto: "Bastidores de hoje aqui na {loja} 👩‍🍳✨\n[FOTO OU VÍDEO DA PRODUÇÃO]\n\nCada doce sai daqui feito à mão, com ingredientes de qualidade. Ainda dá tempo de encomendar o seu para o Natal! Me chama no privado 💬" },
  { cat: "Atendimento", titulo: "Primeira resposta", texto: "Oi, [NOME]! Que alegria receber sua mensagem 💛\nAqui é [SEU NOME], da {loja}.\n\nMe conta: é para a ceia, para presentear ou para revender? Assim eu te indico as melhores opções!" },
  { cat: "Atendimento", titulo: "Quando perguntam o preço", texto: "Claro! Os valores estão no cardápio 👇\n[IMAGEM DO CARDÁPIO]\n\nTodos os doces são feitos com chocolate nobre e ingredientes selecionados, e vão embalados prontinhos para presentear 🎁\n\nQual deles chamou mais sua atenção?" },
  { cat: "Atendimento", titulo: "Cliente achou caro", texto: "Entendo, [NOME]! 😊\nO valor reflete o chocolate de qualidade, a produção artesanal e a embalagem de presente, que já chega prontinha.\n\nSe preferir, tenho opções menores que cabem melhor no orçamento: [OPÇÃO MENOR] por [VALOR]. Quer que eu reserve?" },
  { cat: "Atendimento", titulo: "Sugestão de combo", texto: "Uma dica: muita gente está levando o *combo* 😍\n[ITEM 1] + [ITEM 2] por [VALOR DO COMBO], sai mais em conta do que separado e já resolve a sobremesa da ceia e um presente.\n\nQuer aproveitar?" },
  { cat: "Atendimento", titulo: "Pedido personalizado", texto: "Consigo fazer sim! 🙌\nPara personalizar, me conta:\n• Sabor preferido\n• Quantidade\n• Cor da embalagem ou do laço\n• Se vai com cartão (e o que escrever)\n\nCom isso te passo o valor certinho." },
  { cat: "Fechamento", titulo: "Confirmação do pedido", texto: "Pedido anotado! 📝\n\n*Resumo da sua encomenda:*\n[ITENS E QUANTIDADES]\n💰 Total: [VALOR]\n📅 Entrega/retirada: [DATA E HORÁRIO]\n📍 [ENDEREÇO OU RETIRADA]\n\nPara confirmar a reserva, peço um sinal de 50% ([VALOR DO SINAL]) no Pix:\n🔑 {pix}\n\nAssim que enviar o comprovante, sua vaga está garantida 💛" },
  { cat: "Fechamento", titulo: "Recebimento do sinal", texto: "Comprovante recebido, [NOME]! ✅\nSua encomenda está confirmada para [DATA].\n\nO restante ([VALOR]) pode ser pago na retirada/entrega. Obrigada pela confiança! 🎄" },
  { cat: "Fechamento", titulo: "Cliente sumiu depois do orçamento", texto: "Oi, [NOME]! Tudo bem? 😊\nPassando para saber se ficou alguma dúvida sobre a encomenda. Ainda tenho vaga para o dia [DATA], mas a agenda está fechando.\n\nQuer que eu reserve para você?" },
  { cat: "Fechamento", titulo: "Agenda encerrada", texto: "Oi, [NOME]! 💛\nInfelizmente a agenda de Natal da {loja} já está completa. Muito obrigada pelo carinho!\n\nPosso colocar seu nome na *lista de espera*? Se abrir alguma vaga, você é a primeira a saber. E já fica anotado para o Ano Novo 🥂" },
  { cat: "Entrega", titulo: "Lembrete na véspera", texto: "Oi, [NOME]! 🎄\nPassando para lembrar que sua encomenda fica pronta amanhã, [DATA], às [HORÁRIO].\n\n📍 [ENDEREÇO OU RETIRADA]\n💰 Valor restante: [VALOR] (Pix: {pix})\n\nQualquer mudança, me avisa por aqui!" },
  { cat: "Entrega", titulo: "Pedido pronto", texto: "Sua encomenda está pronta! 😍🎁\n[FOTO DO PEDIDO]\n\nPode vir buscar a partir de [HORÁRIO]. Até já!" },
  { cat: "Entrega", titulo: "Instruções de conservação", texto: "Algumas dicas para seus doces ficarem perfeitos 💛\n\n🍫 Mantenha em local fresco, longe do sol\n❄️ Copos e potes: geladeira, consumir em até [DIAS] dias\n🎁 Chocotones e presenteáveis: temperatura ambiente, até [DIAS] dias\n\nBom apetite e Feliz Natal! 🎄" },
  { cat: "Pós-venda", titulo: "Pedido de avaliação", texto: "Oi, [NOME]! E aí, o que acharam dos doces? 😍\n\nSua opinião é muito importante para a {loja}. Se puder, me manda um áudio ou uma foto da sua ceia, vou amar ver! 📸\n\nE se postar, me marca: {instagram} 💛" },
  { cat: "Pós-venda", titulo: "Convite para o Ano Novo", texto: "Oi, [NOME]! 🥂\nQue bom que você gostou do Natal da {loja}! Já abri a agenda de *Ano Novo* com algumas novidades.\n\nComo você já é cliente, tem prioridade na reserva. Quer ver o cardápio?" },
  { cat: "Pós-venda", titulo: "Agradecimento de fim de ano", texto: "🎄 Obrigada por fazer parte do Natal da {loja}! 🎄\n\nCada encomenda foi feita com muito carinho, e saber que nossos doces estiveram na sua mesa é a melhor parte. Que o seu próximo ano seja tão doce quanto este fim de ano 💛\n\nUm abraço,\n[SEU NOME]" },
  { cat: "Cobrança", titulo: "Lembrete de pagamento (gentil)", texto: "Oi, [NOME]! Tudo bem? 😊\nPassando para lembrar do valor pendente da sua encomenda: [VALOR].\n\nPix: {pix}\n\nSe já enviou, me manda o comprovante, por favor. Obrigada! 💛" }
];

/* ---------------- LEGENDAS E IDEIAS DE POST ---------------- */
CONTEUDO.legendas = [
  { tipo: "Feed", titulo: "Abertura da agenda", texto: "A agenda de Natal da {loja} está oficialmente ABERTA! 🎄✨\n\nEste ano preparei um cardápio cheio de novidades: chocotones trufados, brigadeiros gourmet, copos da felicidade e presentes que vão encantar quem você ama.\n\nAs vagas são limitadas porque tudo é feito à mão 💛\n📲 Encomendas pelo WhatsApp {whats}\n\n#docesdenatal #encomendasdenatal #{cidade}" },
  { tipo: "Feed", titulo: "Bastidores", texto: "Por trás de cada doce tem horas de cuidado 👩‍🍳\n\nAqui na {loja} cada brigadeiro é enrolado à mão, cada chocotone é recheado na hora e cada laço é feito com carinho. É assim que o Natal fica mais doce 🎄\n\nGaranta o seu: link na bio ou WhatsApp {whats}" },
  { tipo: "Feed", titulo: "Presente que encanta", texto: "Procurando um presente que todo mundo ama? 🎁\n\nNossas caixas de Natal chegam prontinhas para presentear: é só entregar e ver o sorriso. Ideal para amigo secreto, professores, equipe e família.\n\nEncomende pelo direct ou WhatsApp {whats} 💛" },
  { tipo: "Feed", titulo: "Produto em destaque", texto: "Apresento o queridinho deste Natal: [NOME DO DOCE] 😍\n\n[DESCREVA EM 2 LINHAS O SABOR E A TEXTURA]\n\nDisponível em [TAMANHOS]. Vagas limitadas para entrega até [DATA].\n📲 {whats}" },
  { tipo: "Feed", titulo: "Depoimento de cliente", texto: "Não sou eu que estou dizendo 🥹💛\n\n[PRINT OU FRASE DA CLIENTE, COM AUTORIZAÇÃO]\n\nObrigada pela confiança! Ainda dá tempo de fazer parte do Natal da {loja}: {whats}" },
  { tipo: "Feed", titulo: "Últimas vagas", texto: "⏰ ÚLTIMAS VAGAS ⏰\n\nA agenda de Natal está quase completa! Se você ainda não garantiu a sobremesa da ceia ou os presentes, essa é a hora.\n\nChama no WhatsApp {whats} antes que acabe 🎄" },
  { tipo: "Feed", titulo: "Agenda encerrada", texto: "AGENDA DE NATAL ENCERRADA! 🙌🎄\n\nObrigada a cada cliente que confiou na {loja} este ano. Agora é hora de colocar a mão na massa e entregar tudo com muito carinho.\n\nAinda dá para entrar na lista de espera e na agenda de Ano Novo 🥂 {whats}" },
  { tipo: "Stories", titulo: "Enquete de sabores", texto: "Story com enquete:\n\"Qual sabor não pode faltar no seu Natal?\" 🍫 Brigadeiro | 🍓 Morango\n\nNo story seguinte: \"Os dois estão no cardápio! Me chama para encomendar 💬\"" },
  { tipo: "Stories", titulo: "Caixinha de perguntas", texto: "Caixinha: \"Tire suas dúvidas sobre as encomendas de Natal 🎄\"\n\nResponda nos stories as perguntas sobre prazo, entrega, sabores e pagamento. Cada resposta é uma chance de venda." },
  { tipo: "Stories", titulo: "Contagem regressiva", texto: "Use a figurinha de contagem regressiva:\n\"Encomendas de Natal encerram em…\" (data limite)\n\nQuem ativar o lembrete recebe aviso automático do Instagram." },
  { tipo: "Stories", titulo: "Produção ao vivo", texto: "Sequência de 3 stories:\n1. Ingredientes na bancada: \"Hoje tem produção de [DOCE] 😍\"\n2. Vídeo curto do processo (derretendo chocolate, recheando)\n3. Produto embalado + \"Encomendas pelo link 👆\"" },
  { tipo: "Reels", titulo: "Antes e depois da embalagem", texto: "Reels de 10 a 15 segundos:\nDoce sem embalagem ➜ embalando ➜ caixa fechada com laço.\nTexto na tela: \"Do forno para o presente 🎁\"\nLegenda: \"Presentes de Natal da {loja}. Encomendas: {whats}\"" },
  { tipo: "Reels", titulo: "Corte do chocotone", texto: "Reels em close: faca cortando o chocotone e mostrando o recheio escorrendo.\nTexto na tela: \"O barulho do Natal 🎄\"\nÁudio em alta + legenda curta com chamada para encomenda." },
  { tipo: "Reels", titulo: "Um dia de encomendas", texto: "Reels estilo vlog: \"Um dia de produção de Natal na {loja}\"\nMostre: café da manhã ➜ produção ➜ embalagem ➜ entrega.\nAs pessoas adoram bastidores, e isso gera confiança." }
];

/* ---------------- GUIA DE SABORES (bônus) ---------------- */
CONTEUDO.sabores = [
  { nome: "Ninho com Avelã", base: "Brigadeiro branco de leite em pó", par: "Creme de avelã", uso: "Bolo de pote, chocotone, copo da felicidade" },
  { nome: "Pistache com Frutas Vermelhas", base: "Brigadeiro de pistache", par: "Geleia de frutas vermelhas", uso: "Copos, tortinhas, bombom aberto" },
  { nome: "Doce de Leite com Nozes", base: "Doce de leite cremoso", par: "Nozes caramelizadas", uso: "Panetone, bolo, pavê" },
  { nome: "Prestígio Natalino", base: "Brigadeiro de chocolate", par: "Beijinho com coco queimado", uso: "Copo, bolo de pote, trufas" },
  { nome: "Morango com Chocolate Branco", base: "Ganache de chocolate branco", par: "Morango fresco ou geleia", uso: "Copo da felicidade, mini tortas" },
  { nome: "Maracujá com Chocolate", base: "Mousse de maracujá", par: "Ganache meio amargo", uso: "Copos, tortas, trufas" },
  { nome: "Cereja com Chocolate", base: "Brigadeiro meio amargo", par: "Cereja em calda picada", uso: "Chocotone, trufas, bolo" },
  { nome: "Rabanada Gourmet", base: "Creme de baunilha", par: "Canela e açúcar", uso: "Copo, bolo de pote, brigadeiro de colher" },
  { nome: "Panetone Trufado", base: "Ganache de chocolate ao leite", par: "Frutas cristalizadas em rum ou laranja", uso: "Copo, pavê, bolo de pote" },
  { nome: "Paçoca com Chocolate", base: "Brigadeiro de paçoca", par: "Calda de chocolate", uso: "Copos, brownies recheados" },
  { nome: "Limão Siciliano com Merengue", base: "Creme de limão", par: "Merengue maçaricado", uso: "Tortinhas, copos" },
  { nome: "Café com Doce de Leite", base: "Brigadeiro de café", par: "Doce de leite", uso: "Trufas, bombons, bolo de pote" },
  { nome: "Coco com Abacaxi", base: "Creme de coco", par: "Abacaxi caramelizado", uso: "Pavê, copos, bolo gelado" },
  { nome: "Gengibre e Canela", base: "Massa de biscoito especiada", par: "Glacê real", uso: "Cookies decorados, casinhas, pão de mel" },
  { nome: "Banoffee", base: "Doce de leite", par: "Banana e chantilly com canela", uso: "Torta, copo, potes" },
  { nome: "Churros", base: "Doce de leite", par: "Açúcar com canela", uso: "Copos, bolo de pote, brigadeiro" },
  { nome: "Red Velvet", base: "Massa red velvet", par: "Creme de cream cheese", uso: "Bolo de pote, cupcakes, copos" },
  { nome: "Ovomaltine Crocante", base: "Brigadeiro de chocolate ao leite", par: "Flocos crocantes de malte", uso: "Copos, chocotone, brownies" },
  { nome: "Damasco com Chocolate Branco", base: "Ganache branca", par: "Damasco picado", uso: "Trufas, bombom aberto, panetone" },
  { nome: "Amendoim Caramelizado", base: "Brigadeiro de chocolate", par: "Praliné de amendoim", uso: "Bombons, brownies, copos" },
  { nome: "Chocolate com Laranja", base: "Ganache meio amargo", par: "Raspas e calda de laranja", uso: "Trufas, chocotone, bolo" },
  { nome: "Cookies and Cream", base: "Brigadeiro branco", par: "Biscoito de chocolate triturado", uso: "Copos, bolo de pote, chocotone" }
];

/* ---------------- CHECKLIST DE PRODUÇÃO (bônus) ---------------- */
CONTEUDO.checklist = [
  { grupo: "Antes de abrir as encomendas", itens: ["Escolher de 5 a 10 produtos para o cardápio", "Calcular o preço de cada produto na calculadora", "Definir data limite para pedidos", "Definir quantas encomendas cabem por dia", "Montar o cardápio e baixar a imagem", "Preencher o perfil (nome da loja, WhatsApp e Pix)", "Definir regras de sinal e de entrega"] },
  { grupo: "Compras", itens: ["Fazer a lista de ingredientes pelas encomendas confirmadas", "Comparar preços em atacadistas", "Comprar embalagens, fitas e etiquetas", "Separar ingredientes de reserva (10% a mais)", "Conferir validade de todos os ingredientes"] },
  { grupo: "Véspera da produção", itens: ["Conferir a lista de produção do organizador", "Higienizar bancada, utensílios e potes", "Deixar ingredientes em temperatura ambiente quando necessário", "Preparar recheios que precisam descansar", "Imprimir etiquetas com validade"] },
  { grupo: "Dia da produção", itens: ["Prender o cabelo, usar touca e avental", "Produzir primeiro os itens de maior validade", "Anotar o lote/data de fabricação", "Respeitar o tempo de resfriamento antes de embalar", "Fotografar os produtos prontos para divulgação"] },
  { grupo: "Embalagem e entrega", itens: ["Embalar e etiquetar cada pedido", "Conferir pedido x resumo enviado à cliente", "Enviar lembrete na véspera", "Separar troco ou chave Pix", "Enviar mensagem de pedido pronto"] },
  { grupo: "Pós-venda", itens: ["Pedir avaliação e fotos", "Repostar fotos das clientes (com autorização)", "Anotar o que vendeu mais e o que sobrou", "Convidar clientes para o Ano Novo", "Registrar o lucro total da campanha"] }
];

/* ---------------- CALENDÁRIO DE DIVULGAÇÃO (bônus) ---------------- */
CONTEUDO.calendario = [
  { semana: "8 semanas antes", tema: "Aquecimento", acoes: ["Post: bastidores testando receitas novas", "Stories: enquete \"qual sabor você quer no Natal?\"", "WhatsApp: monte sua lista de transmissão com clientes e conhecidos"] },
  { semana: "7 semanas antes", tema: "Anúncio da agenda", acoes: ["Post: \"Vem aí o cardápio de Natal\" com foto teaser", "Stories: contagem regressiva para a abertura", "WhatsApp: mensagem de lembrete para a lista de contatos"] },
  { semana: "6 semanas antes", tema: "Abertura das encomendas", acoes: ["Post: imagem do cardápio + legenda de abertura", "Stories: cardápio em sequência, um produto por story", "WhatsApp: mensagem \"Encomendas de Natal abertas\""] },
  { semana: "5 semanas antes", tema: "Presentes e empresas", acoes: ["Post: caixas de presente montadas", "Stories: ideias de presente por faixa de preço", "WhatsApp: mensagem para empresas e professores"] },
  { semana: "4 semanas antes", tema: "Prova social", acoes: ["Post: depoimento ou foto de cliente (com autorização)", "Stories: caixinha de perguntas sobre as encomendas", "WhatsApp: follow-up com quem pediu cardápio e não fechou"] },
  { semana: "3 semanas antes", tema: "Produto estrela", acoes: ["Reels: corte do chocotone ou do doce mais vendido", "Stories: bastidores da produção", "WhatsApp: oferta de combo para a ceia"] },
  { semana: "2 semanas antes", tema: "Urgência", acoes: ["Post: \"Últimas vagas\"", "Stories: figurinha de contagem para o fim das encomendas", "WhatsApp: mensagem de últimas vagas"] },
  { semana: "Semana do Natal", tema: "Entrega e encantamento", acoes: ["Stories: pedidos embalados saindo para entrega", "Post: agradecimento + agenda encerrada", "WhatsApp: lembretes de entrega e instruções de conservação"] },
  { semana: "Entre Natal e Ano Novo", tema: "Ano Novo e pós-venda", acoes: ["Post: repost das fotos das clientes", "Stories: cardápio de Ano Novo", "WhatsApp: pedido de avaliação + convite para o Ano Novo"] }
];

/* ---------------- MINI TREINAMENTO (bônus) ---------------- */
CONTEUDO.treinamento = [
  { titulo: "Aula 1 · Escolhendo o que vender", html: "<p>O erro mais comum de quem começa é colocar <strong>produtos demais</strong> no cardápio. Mais itens significam mais ingredientes, mais embalagens e mais chance de erro na correria.</p><ul><li><strong>Comece com 5 a 8 produtos.</strong> Misture itens de entrada (brigadeiro, cookie), itens de ceia (pavê, torta) e presenteáveis (chocotone, caixas).</li><li><strong>Repita bases.</strong> Um mesmo brigadeiro branco pode virar recheio de copo, de chocotone e de bolo de pote. Isso reduz compras e tempo.</li><li><strong>Pense na validade.</strong> Itens com validade maior podem ser produzidos antes e aliviam os últimos dias.</li></ul><p>Use as receitas do kit e marque como favoritas as que vão para o seu cardápio.</p>" },
  { titulo: "Aula 2 · Precificação sem medo", html: "<p>Preço não é chute. A fórmula é simples:</p><p><strong>Preço = (ingredientes + embalagem + gás/energia + sua mão de obra) + margem de lucro</strong></p><ul><li><strong>Ingredientes:</strong> calcule só o que a receita usa, não o pacote inteiro. A calculadora faz isso sozinha.</li><li><strong>Embalagem:</strong> forminha, caixa, fita, etiqueta. Somadas, fazem diferença.</li><li><strong>Gás e energia:</strong> uma taxa de 5% a 10% sobre os ingredientes cobre bem.</li><li><strong>Mão de obra:</strong> o seu tempo vale dinheiro. Defina quanto quer ganhar por hora.</li><li><strong>Margem:</strong> o lucro do negócio, para reinvestir. Entre 30% e 100%, dependendo do produto e do público.</li></ul><p>Depois de calcular, compare com o mercado da sua região. Se ficar muito acima, ajuste o tamanho da porção ou a embalagem, mas não trabalhe no prejuízo.</p>" },
  { titulo: "Aula 3 · Onde encontrar as primeiras clientes", html: "<p>Suas primeiras vendas quase sempre vêm de quem já te conhece.</p><ol><li><strong>Lista de transmissão no WhatsApp</strong> com família, amigos, vizinhos e colegas de trabalho.</li><li><strong>Status do WhatsApp todos os dias</strong>: bastidores, produto pronto, cardápio.</li><li><strong>Grupos do bairro e do condomínio</strong> (respeitando as regras de cada grupo).</li><li><strong>Empresas e escolas</strong>: kits para equipe e professores rendem pedidos grandes.</li><li><strong>Degustação</strong>: leve amostras para o trabalho ou para vizinhos. Quem prova, compra.</li></ol><p>Use as mensagens prontas do kit para cada uma dessas situações.</p>" },
  { titulo: "Aula 4 · Atendimento que fecha venda", html: "<ul><li><strong>Responda rápido.</strong> Quem pergunta o preço geralmente está decidindo naquele momento.</li><li><strong>Faça perguntas.</strong> \"É para a ceia ou para presentear?\" ajuda a indicar o produto certo.</li><li><strong>Ofereça combos.</strong> Aumentam o valor do pedido e facilitam a escolha.</li><li><strong>Peça sinal.</strong> 50% no Pix confirma a reserva e evita desistências.</li><li><strong>Envie o resumo do pedido por escrito.</strong> Evita confusão de sabor, quantidade e data.</li></ul>" },
  { titulo: "Aula 5 · Organizando a produção", html: "<p>Na semana do Natal, organização é o que separa o sucesso do caos.</p><ul><li>Defina um <strong>limite de encomendas por dia</strong> e respeite.</li><li>Use o <strong>organizador de encomendas</strong> do kit: ele soma quantos itens de cada produto você precisa fazer.</li><li>Produza <strong>bases e recheios com antecedência</strong>, respeitando a validade.</li><li>Agrupe pedidos por <strong>data de entrega</strong> e embale por ordem de saída.</li><li>Tenha um <strong>plano B</strong> para ingredientes que podem faltar no mercado.</li></ul>" },
  { titulo: "Aula 6 · Boas práticas e segurança", html: "<ul><li>Higienize bancadas e utensílios antes de começar e use touca e avental.</li><li>Respeite tempos de resfriamento antes de embalar para não formar umidade.</li><li>Coloque etiqueta com <strong>data de fabricação, validade e ingredientes</strong>, inclusive alérgenos (leite, glúten, amendoim, castanhas, ovos).</li><li>Informe a forma correta de conservação para cada produto.</li><li>Consulte as regras da vigilância sanitária e a possibilidade de formalização como MEI na sua cidade.</li></ul>" }
];

/* ---------------- CARDÁPIOS (modelos editáveis) ---------------- */
CONTEUDO.cardapios = [
  { id: "classico", nome: "Clássico Vinho e Dourado" },
  { id: "candy", nome: "Bengala Doce" },
  { id: "kraft", nome: "Kraft Artesanal" },
  { id: "pinheiro", nome: "Pinheiro Verde" },
  { id: "noite", nome: "Noite Estrelada" },
  { id: "neve", nome: "Neve Branca" }
];
CONTEUDO.cardapioPadrao = {
  titulo: "Cardápio de Natal",
  subtitulo: "Encomendas até [DATA]",
  secoes: [
    { nome: "Chocotones", itens: [["Chocotone trufado 500 g", "R$ 00,00"], ["Mini chocotone 100 g", "R$ 00,00"]] },
    { nome: "Docinhos", itens: [["Caixa 9 brigadeiros gourmet", "R$ 00,00"], ["Caixa 16 docinhos sortidos", "R$ 00,00"]] },
    { nome: "Copos e Potes", itens: [["Copo da felicidade", "R$ 00,00"], ["Bolo de pote", "R$ 00,00"]] },
    { nome: "Presentes", itens: [["Guirlanda de chocolate", "R$ 00,00"], ["Caixa presente pão de mel", "R$ 00,00"]] }
  ],
  rodape: "Pedidos com 50% de sinal no Pix"
};

/* ---------------- ARTES DE DATAS (bônus) ---------------- */
CONTEUDO.artes = [
  { id: "encomendas-abertas", titulo: "Encomendas abertas", formato: "story", linha1: "Encomendas de", linha2: "Natal abertas!", linha3: "Garanta já a sua" },
  { id: "ultimas-vagas", titulo: "Últimas vagas", formato: "story", linha1: "Últimas", linha2: "vagas!", linha3: "Agenda quase fechada" },
  { id: "agenda-encerrada", titulo: "Agenda encerrada", formato: "feed", linha1: "Agenda de Natal", linha2: "encerrada", linha3: "Obrigada pelo carinho!" },
  { id: "feliz-natal", titulo: "Feliz Natal", formato: "feed", linha1: "Feliz", linha2: "Natal", linha3: "Que sua mesa seja doce" },
  { id: "feliz-natal-story", titulo: "Feliz Natal (story)", formato: "story", linha1: "Feliz", linha2: "Natal", linha3: "Com carinho" },
  { id: "ano-novo", titulo: "Feliz Ano Novo", formato: "feed", linha1: "Feliz", linha2: "Ano Novo", linha3: "Um ano mais doce para você" },
  { id: "ano-novo-story", titulo: "Ano Novo (story)", formato: "story", linha1: "Encomendas de", linha2: "Ano Novo", linha3: "Chame no WhatsApp" },
  { id: "presente", titulo: "Presente perfeito", formato: "feed", linha1: "O presente", linha2: "mais doce", linha3: "Caixas prontas para presentear" }
];

/* ---------------- ETIQUETAS ---------------- */
CONTEUDO.etiquetas = [
  { id: "redonda", nome: "Tag redonda (laço)" },
  { id: "validade", nome: "Etiqueta de validade" },
  { id: "presente", nome: "Tag de presente" }
];
