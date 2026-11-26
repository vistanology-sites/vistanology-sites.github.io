(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const whatsappNumber = '5513920032932';
  const media = 'assets/media/';
  const photoVariants = {
    'brand-perfume.webp': [480, 800],
    'room-wide.webp': [480, 800, 1200, 1599],
    'room-marble.webp': [480, 800, 1200, 1600],
    'inauguration-interior.webp': [480, 800, 1200, 1280],
    'inauguration-facade.webp': [480, 800, 1200, 1280],
    'care-e-profile.webp': [480, 610],
    'care-f-profile.webp': [480, 800, 1086],
    'care-g-profile.webp': [480, 800, 1086],
    'care-i-profile.webp': [480, 800, 1086],
    'care-i-front.webp': [480, 800, 900],
    'care-i-front-2.webp': [480, 800, 900],
    'care-i-profile-2.webp': [480, 800, 900],
    'care-j-profile.webp': [480, 800, 900],
    'care-j-reclined.webp': [480, 800, 900],
    'care-k-front.webp': [480, 720],
    'lips-a-angle-2.webp': [480, 800, 1200, 1600],
    'lips-a-profile.webp': [480, 800, 907],
    'lips-b-close.webp': [480, 800, 1152],
    'face-b-branded.webp': [480, 800, 1200, 1254],
    'care-k-branded.webp': [480, 800, 1200, 1600],
    'perfume-products.webp': [480, 800, 1086]
  };
  const photoRatios = {
    'room-wide.webp': 1599 / 899, 'room-marble.webp': 16 / 9,
    'inauguration-interior.webp': 16 / 9, 'inauguration-facade.webp': 16 / 9,
    'brand-perfume.webp': 2 / 3, 'lips-a-angle-2.webp': 1, 'face-b-branded.webp': 1254 / 1600,
    'care-k-branded.webp': 1, 'care-k-front.webp': 720 / 1280, 'care-e-profile.webp': 610 / 1356
  };

  const rasterRatios = {
    'case-gluteo-montage': 1200 / 2133, 'case-labios-imediato': 0.75, 'case-labios-montage': 1200 / 2117,
    'case-labios-par-up': 2117 / 1200, 'case-labios-before-pos': 1200 / 680, 'case-labios-up': 1600 / 1200, 'case-rino-pos': 1200 / 1209,
    'case-perfil-antes': 0.75, 'case-perfil-depois': 0.75, 'case-perfil-a-antes': 0.75, 'case-perfil-a-depois': 1200 / 2133
  };

  // Files named <path>/<name>-<width>.jpg ship their own responsive ladder.
  function rasterInfo(file) {
    const match = /^((?:editorial|official)\/.*)-(\d+)\.jpg$/.exec(file);
    if (!match) return null;
    const base = match[1];
    const widths = [320, 640, 1200];
    return {
      url: width => `${media}${base}-${width}.jpg`,
      widths,
      ratio: rasterRatios[base.split('/').pop()] || 1.5
    };
  }

  function hasVariants(file) {
    return file.endsWith('.webp') && Boolean(photoVariants[file]);
  }

  function photoUrl(file, width) {
    const raster = rasterInfo(file);
    if (raster) return raster.url(width);
    if (!hasVariants(file)) return media + file;
    return `${media}optimized/${file.replace('.webp', '')}-v2-${width}.webp`;
  }

  function ladder(file) {
    const raster = rasterInfo(file);
    if (raster) return { widths: raster.widths, ratio: raster.ratio };
    if (hasVariants(file)) return { widths: photoVariants[file], ratio: photoRatios[file] || .75 };
    return { widths: null, ratio: raster ? raster.ratio : .75 };
  }

  function setResponsiveImage(image, file, sizes = '(max-width: 700px) 92vw, 800px') {
    const step = ladder(file);
    if (!step.widths) {
      image.src = media + file;
      image.removeAttribute('srcset');
      image.sizes = sizes;
      return;
    }
    const largest = step.widths.at(-1);
    image.src = photoUrl(file, largest);
    image.srcset = step.widths.map(width => `${photoUrl(file, width)} ${width}w`).join(', ');
    image.sizes = sizes;
    image.width = largest;
    image.height = Math.round(largest / step.ratio);
  }

  // O acervo vertical enquadra a paciente deitada: o assunto está no terço inferior,
  // então a janela do box 3:2 precisa descer até ele em vez de cortar o resultado.
  function cropFocusStyle(file) {
    return ladder(file).ratio < 1 ? 'style="object-position:50% 78%"' : '';
  }

  function photoMarkup(file, alt, className = '', eager = false, sizes = '(max-width: 700px) 92vw, 800px', style = '') {    const step = ladder(file);
    const attrs = `class="${className}" alt="${alt}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}${style ? ` ${style}` : ''}`;
    if (!step.widths) {
      return `<img ${attrs} src="${media}${file}" width="1200" height="800">`;
    }
    const width = step.widths.at(-1);
    return `<img ${attrs} src="${photoUrl(file, width)}" srcset="${step.widths.map(item => `${photoUrl(file, item)} ${item}w`).join(', ')}" sizes="${sizes}" width="${width}" height="${Math.round(width / step.ratio)}">`;
  }

  const careData = {
    todos: {
      kicker: 'Explore', title: 'Cinco áreas, o mesmo cuidado.', regions: [],
      description: 'Pele, lábios, rosto, olhar e corpo. Escolha uma área para ver o que se conversa por ali, ou percorra o catálogo completo — cada cartão abre a explicação da Aline.',
      mapNote: 'O mapa ilumina as regiões do rosto. Comece por ele, ou use as áreas abaixo como filtro do catálogo.',
      services: [], faq: [], cta: 'Conversar com a Aline'
    },
    pele: {
      kicker: 'Pele', title: 'Cuidado que começa pela escuta.',
      description: 'Conheça as possibilidades de cuidado para a pele e entenda como a avaliação orienta o atendimento.',
      services: [
        { name: 'Limpeza de pele', slug: 'limpeza-de-pele' },
        { name: 'Peeling facial', slug: 'peeling-facial' },
        { name: 'Microagulhamento', slug: 'microagulhamento' },
        { name: 'Bioestética', slug: 'bioestetica' }
      ],
      faq: [
        ['Como saber o que minha pele precisa?', 'A avaliação individual é o momento para conversar sobre sua pele, suas expectativas e as possibilidades apresentadas pela Aline.'],
        ['O site define um protocolo?', 'Não. As informações são gerais e não substituem avaliação, diagnóstico ou orientação profissional.']
      ],
      cta: 'Conversar sobre pele', regions: ['pele'], mapNote: 'A pele é o ponto de partida: textura, conforto e saúde vêm antes de qualquer decisão sobre procedimento.'
    },
    labios: {
      kicker: 'Lábios', title: 'Sua expressão, com delicadeza.',
      description: 'Contorno, hidratação e harmonia labial podem ser conversados com respeito à sua fisionomia e às suas expectativas.',
      services: [
        { name: 'Preenchimento labial', slug: 'preenchimento-labial' },
        { name: 'Micropigmentação labial', slug: 'micropigmentacao-labial' },
        { name: 'Harmonização facial', slug: 'harmonizacao-facial' }
      ],
      faq: [
        ['Preciso decidir um formato antes?', 'Não é necessário chegar com uma escolha fechada. A conversa e a avaliação ajudam a entender o que faz sentido para você.'],
        ['As imagens mostram resultados garantidos?', 'Não. Cada resposta é individual e as imagens do acervo não representam promessa de resultado.']
      ],
      cta: 'Conversar sobre lábios', regions: ['labios'], mapNote: 'Contorno e hidratação se conversam a partir da sua expressão, nunca de um formato padrão.'
    },
    rosto: {
      kicker: 'Rosto', title: 'Harmonia sem perder quem você é.',
      description: 'Procedimentos faciais são apresentados como possibilidades, não como um pacote padrão. O planejamento começa pela avaliação.',
      services: [
        { name: 'Botox', slug: 'botox' },
        { name: 'Harmonização facial', slug: 'harmonizacao-facial' },
        { name: 'Rinomodelação', slug: 'rinomodelacao' },
        { name: 'Fios PDO', slug: 'fios-pdo' },
        { name: 'Bioestimulador de colágeno', slug: 'bioestimulador' },
        { name: 'Radiofrequência', slug: 'radiofrequencia' },
        { name: 'Jato de Plasma', slug: 'jato-de-plasma' }
      ],
      faq: [
        ['Harmonização é um protocolo único?', 'Não existe aqui um protocolo padrão anunciado. A conversa sobre possibilidades depende da avaliação individual.'],
        ['Posso combinar procedimentos?', 'A compatibilidade e o planejamento devem ser avaliados diretamente com a profissional responsável.']
      ],
      cta: 'Conversar sobre o rosto', regions: ['fronte', 'malar'], mapNote: 'As duas regiões iluminadas — fronte e maçãs — abrem conversas sobre expressão e sobre o conjunto do rosto.'
    },
    olhar: {
      kicker: 'Olhar', title: 'Um olhar para o seu bem-estar.',
      description: 'A região dos olhos pode fazer parte de uma conversa estética mais ampla, sempre com avaliação e limites explicados com clareza.',
      services: [
        { name: 'Preenchimento de olheiras', slug: 'preenchimento-olheiras' },
        { name: 'Botox', slug: 'botox' },
        { name: 'Jato de Plasma', slug: 'jato-de-plasma' }
      ],
      faq: [
        ['O mapa indica um tratamento?', 'Não. Ele apenas organiza as áreas de conversa e não simula diagnóstico, medição ou resultado.'],
        ['Quais informações devo levar?', 'Conte suas dúvidas e preferências. Informações clínicas devem ser tratadas diretamente na avaliação, não neste site.']
      ],
      cta: 'Conversar sobre o olhar', regions: ['olhar'], mapNote: 'O olhar é a região mais fina do rosto. A avaliação considera sombra, qualidade da pele e o que é realista ali.'
    },
    corpo: {
      kicker: 'Corpo', title: 'Tempo, toque e cuidado.',
      description: 'Massagem, drenagem e práticas corporais são apresentadas com atenção à individualidade e à orientação de cada caso.',
      services: [
        { name: 'Massagem modeladora', slug: 'massagem-modeladora' },
        { name: 'Drenagem linfática', slug: 'drenagem-linfatica' },
        { name: 'Massagem Ortomolecular', slug: 'massagem-ortomolecular' },
        { name: 'Tapping Terapêutico', slug: 'tapping-terapeutico' },
        { name: 'Harmonização glútea', slug: 'harmonizacao-glutea' },
        { name: 'Bioestimulador de colágeno', slug: 'bioestimulador' }
      ],
      faq: [
        ['A drenagem substitui acompanhamento médico?', 'Não. O atendimento respeita as orientações do profissional responsável e não substitui acompanhamento clínico.'],
        ['Preciso enviar dados de saúde pelo site?', 'Não. O site não solicita dados clínicos. Converse diretamente com a profissional sobre condições e necessidades específicas.']
      ],
      cta: 'Conversar sobre o corpo', regions: [], mapNote: 'O mapa cobre apenas o rosto. Os cuidados corporais estão listados no catálogo abaixo, com a mesma organização.'
    }
  };

  const careToRegion = { fronte: 'rosto', malar: 'rosto', olhar: 'olhar', labios: 'labios', pele: 'pele' };

  const procedures = {
    'limpeza-de-pele': {
      title: 'Limpeza de pele', category: 'pele', image: 'care-a-detail.webp', imageAlt: 'Detalhe de atendimento facial do acervo',
      summary: 'Cuidado e limpeza da pele, com conduta definida após avaliação.',
      description: 'Serviço confirmado pela Aline Rodrigues. A limpeza de pele é apresentada como um cuidado facial, com etapas e indicação conversadas na avaliação individual.',
      topics: ['Conversa sobre a pele e suas necessidades', 'Avaliação das possibilidades e limites do atendimento', 'Orientações específicas fornecidas no atendimento'],
      note: 'O site não descreve produtos, técnicas, número de sessões ou resultados. Essas informações dependem da avaliação e não são padronizadas aqui.',
      faq: [
        ['Com que frequência deve ser feita?', 'A frequência não é definida pelo site. A profissional orienta de acordo com a avaliação e as necessidades de cada pessoa.'],
        ['Existe preparo?', 'Se houver orientações específicas, elas serão informadas diretamente antes do atendimento.']
      ]
    },
    'preenchimento-labial': {
      title: 'Preenchimento labial', category: 'labios', image: 'face-a-profile.webp', imageAlt: 'Lábios após preenchimento, paciente em repouso no espaço da clínica — acervo real', plate: { label: 'Lábios — antes e pós imediato', order: 'Antes → Pós imediato', note: 'A própria publicação identifica o segundo registro como pós imediato. Ele pode mostrar edema inicial e não representa o resultado definitivo.', images: [{ src: 'official/case-labios-before-pos-1200.jpg', alt: 'Comparação publicada pela clínica reorganizada na ordem correta: Antes à esquerda e Pós imediato à direita, com rótulos originais preservados' }] },
      summary: 'Procedimento injetável voltado à harmonia labial.',
      description: 'Procedimento injetável confirmado no portfólio da marca. A conversa envolve expectativas, características labiais e avaliação profissional, sem prometer um formato ou resultado.',
      topics: ['Entender a expectativa e a expressão desejada', 'Avaliar a região labial individualmente', 'Conversar sobre possibilidades, limites e cuidados'],
      note: 'O site não informa doses, volumes, marcas, duração ou garantias. Esses dados não foram validados para publicação e não devem ser presumidos.',
      faq: [
        ['O resultado é igual para todas?', 'Não. A resposta depende da avaliação, do produto utilizado e da individualidade de cada pessoa.'],
        ['Posso enviar uma foto pelo site?', 'O site não recebe fotos ou dados clínicos. O contato e a avaliação são feitos diretamente com a Aline.']
      ]
    },
    'micropigmentacao-labial': {
      title: 'Micropigmentação labial', category: 'labios', image: 'editorial/editorial-micropigmentacao-labial-1200.jpg', imageAlt: 'Lábios com tom uniforme recebendo pigmento com pincel fino — imagem editorial', illustrated: true,
      summary: 'Realce de contorno e cor dos lábios por pigmentação.',
      description: 'Serviço publicado pelo perfil oficial da clínica, com registros próprios de antes e depois. Nesta página a imagem é apenas editorial: tom, traço e condução são definidos na avaliação, sem promessa de efeito ou de duração.',
      topics: ['Conversar sobre cor, contorno e o efeito desejado', 'Avaliar a região labial e o que faz sentido para ela', 'Orientar os cuidados do período, caso a caso'],
      note: 'Não publicamos cor, técnica, número de sessões, duração do pigmento nem resultado esperado — nada disso foi validado para esta página.',
      faq: [
        ['É diferente do preenchimento labial?', 'São caminhos diferentes: um trabalha pigmento e contorno, o outro trabalha volume. O que combina com o seu caso é conversado na avaliação.'],
        ['A imagem desta página é um resultado?', 'Não. O material é editorial e não representa lábios reais nem evolução de atendimento.']
      ]
    },
    botox: {
      title: 'Botox', category: 'rosto', image: 'editorial/editorial-botox-testa-1200.jpg', imageAlt: 'Testa com pontos de marcação e mão com luva repousando sobre a têmpora — imagem editorial', illustrated: true,
      summary: 'Procedimento injetável apresentado pela clínica para finalidade estética.',
      description: 'O Botox integra os serviços confirmados da marca. Aplicação, indicação, limitações e orientações são definidas em avaliação profissional individual.',
      topics: ['Conversa sobre a região e a expectativa', 'Avaliação antes de qualquer aplicação', 'Explicação de cuidados e acompanhamento no atendimento'],
      note: 'Esta página é informativa. Não há promessa de efeito, duração, ausência de riscos ou adequação para todas as pessoas.',
      faq: [
        ['O site informa quanto tempo dura?', 'Não. A duração varia e deve ser conversada na avaliação, sem garantias.'],
        ['Existem contraindicações?', 'Condições de saúde e contraindicações devem ser avaliadas diretamente pela profissional, não por esta página.']
      ]
    },
    'jato-de-plasma': {
      title: 'Jato de Plasma', category: 'rosto', image: 'editorial/editorial-jato-de-plasma-1200.jpg', imageAlt: 'Ponteira de plasma frio próxima à pele durante atendimento estético — imagem editorial', illustrated: true,
      summary: 'Técnica estética que integra o portfólio confirmado da Aline.',
      description: 'Técnica estética oferecida pela marca. A explicação sobre funcionamento, candidatura, etapas e cuidados acontece na avaliação individual.',
      topics: ['Avaliação da região e da necessidade apresentada', 'Conversa sobre a técnica e suas limitações', 'Orientações específicas antes e depois'],
      note: 'Não há no site protocolo, sessão, prazo de recuperação ou resultado prometido. A imagem é registro de atendimento, não demonstração da técnica.',
      faq: [
        ['A imagem comprova a técnica utilizada?', 'Não. As imagens do site contextualizam o atendimento e não comprovam uma técnica ou indicação específica.'],
        ['Como saber se é adequado para mim?', 'A adequação depende de avaliação profissional e não pode ser definida pelo site.']
      ]
    },
    'fios-pdo': {
      title: 'Fios PDO', category: 'rosto', image: 'care-k-front.webp', imageAlt: 'Mãos com luvas posicionando fio PDO sob a pele durante atendimento — acervo real',
      variants: [
        ['Fios PDO tração', 'R$ 300 o par'],
        ['Fios PDO bomb', 'R$ 400 o par'],
        ['Fios PDO mesh', 'R$ 400 o par'],
        ['Fios PDO liso', 'R$ 800 a face completa']
      ],
      summary: 'Fios lisos e rinomodelação, conforme avaliação e planejamento.',
      description: 'A marca confirma o atendimento com fios lisos e rinomodelação. O planejamento e a explicação técnica são individualizados.',
      topics: ['Avaliação facial e conversa sobre expectativas', 'Apresentação das modalidades oferecidas', 'Orientações e acompanhamento definidos no atendimento'],
      note: 'Não são publicados quantidades, marcas, trajetos, efeitos ou prazos. O material visual é contextual e não comprova o procedimento retratado.',
      faq: [
        ['Fios lisos e rinomodelação são a mesma coisa?', 'A marca apresenta ambas as possibilidades. A diferença e a adequação são explicadas na avaliação.'],
        ['O site mostra um planejamento padrão?', 'Não. Não existe um planejamento universal publicado nesta página.']
      ]
    },
    'harmonizacao-facial': {
      title: 'Harmonização facial', category: 'rosto', image: 'face-b-branded.webp', imageAlt: 'Perfil com identidade visual da marca',
      summary: 'Um planejamento individual, sem protocolo padrão ou excessos.',
      description: 'Uma conversa sobre o conjunto da face, respeitando expressão e individualidade. O termo não significa que todos precisam dos mesmos procedimentos.',
      topics: ['Escuta sobre o que você deseja conhecer', 'Avaliação do conjunto facial', 'Planejamento explicado sem excessos ou promessas'],
      note: 'A página não anuncia pacotes, combinações ou resultados. Qualquer possibilidade depende de avaliação e conversa profissional.',
      faq: [
        ['É obrigatório combinar vários procedimentos?', 'Não. A necessidade de combinação não é presumida; tudo depende da avaliação individual.'],
        ['O objetivo é mudar a identidade?', 'A apresentação da marca valoriza delicadeza e respeito à expressão de cada pessoa.']
      ]
    },
    bioestetica: {
      title: 'Bioestética', category: 'pele', image: 'care-c-story.webp', imageAlt: 'Eletrodo adesivo aplicado na face durante atendimento estético — acervo real',
      summary: 'Cuidado estético com escopo definido na conversa e na avaliação.',
      description: 'Serviço confirmado pela marca. Como o escopo pode variar, o site não atribui técnicas, equipamentos ou protocolos que não foram validados.',
      topics: ['Conversa sobre a necessidade apresentada', 'Definição do escopo no atendimento', 'Explicação das etapas e orientações aplicáveis'],
      note: 'A descrição é intencionalmente ampla. Para conhecer o que a Aline oferece em Bioestética, envie sua pergunta pelo fluxo de contato.',
      faq: [
        ['Quais técnicas fazem parte?', 'As técnicas e o escopo devem ser confirmados diretamente com a Aline.'],
        ['Existe indicação no site?', 'Não. O site não faz diagnóstico nem indica tratamento.']
      ]
    },
    'peeling-facial': {
      title: 'Peeling facial', category: 'pele', image: 'editorial/editorial-peeling-facial-1200.jpg', imageAlt: 'Textura de pele cuidada com grânulos finos e gesto de renovação — imagem editorial', illustrated: true,
      summary: 'Renovação celular para uniformizar textura, tom e luminosidade.',
      description: 'Protocolo publicado pela clínica entre os cuidados pensados para cada tipo de pele. A escolha do tipo de renovação, a profundidade e o intervalo dependem da avaliação individual.',
      topics: ['Conversa sobre textura, tom e o que incomoda na pele', 'Avaliação do momento certo para renovar', 'Orientações de cuidado antes e depois'],
      note: 'O site não publica ativos, marcas, número de sessões nem resultado prometido. Peeling não é indicado para toda pele em toda fase, e isso se define na avaliação.',
      faq: [
        ['É preciso evitar sol?', 'Qualquer orientação de fotoproteção é passada no atendimento, de acordo com a pele avaliada.'],
        ['Posso combinar com outro protocolo?', 'A compatibilidade entre procedimentos é conversada com a profissional, não presumida pelo site.']
      ]
    },
    'radiofrequencia': {
      title: 'Radiofrequência', category: 'rosto', image: 'editorial/editorial-radiofrequencia-1200.jpg', imageAlt: 'Aplicador de radiofrequência em contato com a pele da face e colo — imagem editorial', illustrated: true,
      summary: 'Estímulo de colágeno para firmeza, sem procedimento invasivo.',
      description: 'Protocolo publicado pela clínica como tecnologia de firmeza. A região atendida, a sensação durante a sessão e o intervalo são definidos na avaliação, sem promessa de efeito comparável a cirurgia.',
      topics: ['Conversa sobre firmeza, contorno e expectativa', 'Avaliação da região e do momento adequado', 'Explicação da sessão e dos cuidados no atendimento'],
      note: 'O site não informa equipamento, marca, parâmetros, duração nem resultado garantido. Tecnologia estética não substitui avaliação médica quando há condição de saúde envolvida.',
      faq: [
        ['A sessão é dolorida?', 'A percepção é individual; a condução é ajustada durante o atendimento.'],
        ['Quantas sessões são necessárias?', 'Não há protocolo padronizado publicado. O planejamento é definido na avaliação.']
      ]
    },
    'microagulhamento': {
      title: 'Microagulhamento', category: 'pele', image: 'editorial/editorial-microagulhamento-1200.jpg', imageAlt: 'Ponteira esterilizada de microagulhas em contato com a pele da face — imagem editorial', illustrated: true,
      summary: 'Indução de colágeno para cicatrizes, poros e linhas finas.',
      description: 'Protocolo publicado pela clínica. O material é de uso único e a condução depende da avaliação da pele, do histórico e do momento de cada pessoa.',
      topics: ['Conversa sobre cicatrizes, poros e linhas', 'Avaliação da pele e das condições para induzir colágeno', 'Orientações de recuperação passadas no atendimento'],
      note: 'O site não publica profundidade de agulha, marcas de ativo, número de sessões nem promessa de correção. Pele com atividade inflamatória no momento pode não ser atendida.',
      faq: [
        ['Dá para voltar à rotina no mesmo dia?', 'A orientação é individual e é passada no atendimento, junto com os cuidados dos primeiros dias.'],
        ['O site mostra fotos de recuperação?', 'Não. O material desta página é editorial e não representa pele real em tratamento.']
      ]
    },
    'massagem-modeladora': {
      title: 'Massagem modeladora', category: 'corpo', image: 'editorial/editorial-massagem-modeladora-1200.jpg', imageAlt: 'Mãos em deslizamento firme sobre o contorno do quadril, corpo envolto em tecido — imagem editorial', illustrated: true,
      summary: 'Técnica manual que trabalha contornos corporais com conforto.',
      description: 'Protocolo publicado pela clínica. É uma massagem manual de contorno, conduzida com respeito ao corpo de cada pessoa e com escopo definido na avaliação.',
      topics: ['Conversa sobre a região e a expectativa', 'Avaliação do corpo e do momento adequado', 'Orientações de frequência passadas no atendimento'],
      note: 'O site não promete emagrecimento, redução de medida ou resultado estético. A técnica é manual e a finalidade é conversada diretamente com a profissional.',
      faq: [
        ['Substitui acompanhamento de saúde?', 'Não. O site não faz indicação clínica, nutricional ou médica.'],
        ['Como é o cuidado com a privacidade?', 'O atendimento é conduzido com o corpo envolto e com apenas a região trabalhada exposta.']
      ]
    },
    'bioestimulador': {
      title: 'Bioestimulador de colágeno', category: 'rosto', image: 'editorial/editorial-bioestimulador-1200.jpg', imageAlt: 'Seringa sem rótulo próxima à pele da face em atendimento estético — imagem editorial', illustrated: true,
      summary: 'Quatro opções publicadas em sessão, definidas na avaliação.',
      description: 'A clínica publica bioestimuladores com valor por sessão: Radiess, Diamond, Eleva 210 mg e Eleva 630 mg. A escolha do produto, da região e da quantidade é definida na avaliação individual, a partir do que a pele sustenta e do contorno que faz sentido para você.',
      variants: [
        ['Bioestimulador Radiess', 'R$ 1.800 por sessão'],
        ['Bioestimulador Diamond', 'R$ 1.200 por sessão'],
        ['Eleva 210 mg', 'R$ 1.800 por sessão'],
        ['Eleva 630 mg', 'R$ 4.000 por sessão']
      ],
      topics: ['Conversa sobre firmeza, sustentação e contorno perdido', 'Avaliação da pele e da região a estimular', 'Apresentação das opções publicadas, sem prescrever uma delas'],
      note: 'O site não indica qual bioestimulador é adequado para você, não informa quantidade de ampolas nem promete produção de colágeno em prazo determinado.',
      faq: [
        ['Qual a diferença entre as opções?', 'São produtos distintos, com indicação própria. A explicação acontece na avaliação, a partir do seu caso.'],
        ['O resultado é imediato?', 'A resposta é individual e gradual. Esta página não faz promessa de prazo nem de efeito.']
      ]
    },
    'massagem-ortomolecular': {
      title: 'Massagem Ortomolecular', category: 'corpo', image: 'editorial/editorial-massagem-ortomolecular-1200.jpg', imageAlt: 'Mãos em deslizamento sobre a região dorsal durante massagem — imagem editorial', illustrated: true,
      summary: 'Massagem oferecida pela marca, com técnica e duração explicadas no atendimento.',
      description: 'Prática corporal confirmada pela Aline Rodrigues. A apresentação no site é institucional; técnica, duração e orientações são confirmadas no atendimento.',
      topics: ['Conversa sobre preferências e necessidades', 'Explicação da prática pela profissional', 'Orientações para o atendimento'],
      note: 'O site não atribui finalidade terapêutica, cura ou resultado clínico à massagem.',
      faq: [
        ['Qual é a duração da sessão?', 'A duração é confirmada diretamente com a Aline e não está padronizada no site.'],
        ['Preciso de algum preparo?', 'As orientações aplicáveis são passadas antes do atendimento.']
      ]
    },
    'drenagem-linfatica': {
      title: 'Drenagem linfática', category: 'corpo', image: 'editorial/editorial-drenagem-linfatica-1200.jpg', imageAlt: 'Manobra ritmada das mãos sobre a perna durante drenagem — imagem editorial', illustrated: true,
      summary: 'Massagem terapêutica que reduz o inchaço e devolve a sensação de leveza.',
      description: 'Protocolo publicado pela clínica. A técnica é manual, trabalha o percurso linfático e é apresentada após avaliação. Quando o atendimento acontece no pós-operatório, ele segue as orientações da equipe responsável pela cirurgia.',
      topics: ['Conversa sobre a necessidade e o momento do corpo', 'Avaliação individual antes da primeira sessão', 'Orientações e cuidados passados no atendimento'],
      note: 'O site não promete aceleração de recuperação, número de sessões ou resultado clínico. Em contexto pós-cirúrgico, a liberação da equipe responsável é condição para o atendimento.',
      faq: [
        ['Posso agendar logo após uma cirurgia?', 'O atendimento respeita a liberação e as recomendações do profissional responsável pelo procedimento cirúrgico.'],
        ['O site informa número de sessões?', 'Não. O planejamento é individual e confirmado no atendimento.']
      ]
    },
    'tapping-terapeutico': {
      title: 'Tapping Terapêutico', category: 'corpo', image: 'editorial/editorial-tapping-terapeutico-1200.jpg', imageAlt: 'Pontas dos dedos em percussão leve sobre o ombro — imagem editorial', illustrated: true,
      summary: 'Uma das práticas oferecidas pela Aline, apresentada com escuta e individualidade.',
      description: 'Prática confirmada no portfólio da marca. A explicação sobre a experiência e sua finalidade é feita diretamente com a profissional.',
      topics: ['Conversa sobre o que você espera do atendimento', 'Apresentação da prática pela Aline', 'Espaço para esclarecer dúvidas antes'],
      note: 'O site não apresenta a prática como substituição de psicoterapia, tratamento médico ou acompanhamento de saúde mental.',
      faq: [
        ['O site faz promessa de bem-estar?', 'Não. A experiência é individual e não há resultado garantido.'],
        ['Preciso contar algo pessoal pelo site?', 'Não. O fluxo de contato não solicita dados de saúde ou histórias pessoais.']
      ]
    },
    'preenchimento-olheiras': {
      title: 'Preenchimento de olheiras', category: 'olhar', image: 'editorial/editorial-olheiras-1200.jpg', imageAlt: 'Região do olhar e contorno inferior do olho em luz suave — imagem editorial', illustrated: true,
      summary: 'Procedimento injetável da região infraorbital, confirmado no portfólio.',
      description: 'Serviço confirmado e com preço publicado pela clínica. A região dos olhos é tratada individualmente: a avaliação considera a qualidade da pele, a sombra existente e o que é realista ali.',
      topics: ['Conversa sobre o que incomoda no olhar', 'Avaliação individual da região infraorbital', 'Possibilidades, limites e cuidados apresentados pela Aline'],
      note: 'O site não informa técnica, produto, volume, duração ou garantia. Não há promessa de correção de olheira de causa genética, pigmentar ou vascular — a indicação é definida na avaliação.',
      faq: [
        ['Serve para qualquer olheira?', 'Não. Olheiras têm causas diferentes e nem todas respondem ao mesmo cuidado. A avaliação individual define o que se aplica ao seu caso.'],
        ['Preciso parar minhas atividades?', 'O retorno à rotina não é padronizado pelo site. A orientação é dada no atendimento.']
      ]
    },
    'rinomodelacao': {
      title: 'Rinomodelação', category: 'rosto', image: 'official/case-rino-pos-640.jpg', imageAlt: 'Perfil nasal publicado pela clínica como registro de rinomodelação',
      plate: { label: 'Pós rino com queixo', note: 'Publicado pela clínica com as legendas Antes e Depois, ao lado da legenda “Pós rino com queixo — resultado real de harmonização facial”. Resposta individual.', images: [{ src: 'official/case-perfil-antes-1200.jpg', alt: 'Perfil antes, publicado pela clínica com a legenda Antes' }, { src: 'official/case-perfil-depois-1200.jpg', alt: 'Mesmo perfil após, publicado pela clínica com a legenda Depois' }] },
      summary: 'Modelagem nasal sem cirurgia, com e sem associação de fios PDO.',
      description: 'Serviço confirmado, com duas versões publicadas pela clínica: rinomodelação sem fios e rinomodelação com fios PDO. O registro publicado é de perfil, após o atendimento.',
      topics: ['Conversa sobre o perfil e o que você observa', 'Avaliação da região nasal', 'Apresentação das duas possibilidades publicadas'],
      note: 'O site não descreve técnica, produto, duração ou resultado garantido. Não há comparação antes/depois publicada para este registro — ele é apresentado apenas como pós.',
      faq: [
        ['É cirurgia?', 'Não. A clínica apresenta a rinomodelação como procedimento injetável de modelagem, sem corte. Indicação e limites são definidos na avaliação.'],
        ['Por que não há imagem de antes?', 'A fonte publicada traz apenas o registro de pós. Preferimos sinalizar a ausência a montar uma comparação que não existe.']
      ]
    },
    'harmonizacao-glutea': {
      title: 'Harmonização glútea', category: 'corpo', image: 'editorial/editorial-gluteo-contorno-1200.jpg', imageAlt: 'Contorno corporal envolto em tecido champagne, sem exposição — imagem editorial', illustrated: true,
      summary: 'Procedimento corporal confirmado, com registro publicado pela clínica.',
      description: 'Serviço confirmado e com preço publicado (130 ml). A clínica divulga um antes e pós da região glútea; por se tratar de conteúdo corporal íntimo, o registro fica em área separada e discreta.',
      topics: ['Conversa sobre expectativa e proporção', 'Avaliação individual da região', 'Encaminhamento para a área corporal discreta, se você desejar ver o registro'],
      note: 'O site não descreve produto, técnica, número de sessões ou resultado garantido. O registro publicado não tem rótulos na própria imagem; o contexto é fornecido ao redor dele, nunca sobre o corpo da paciente.',
      faq: [
        ['Onde vejo o registro publicado?', 'Na seção Resultados, dentro da área corporal discreta. O acesso é uma escolha sua, nunca automático.'],
        ['O resultado é o mesmo para todas?', 'Não. A imagem é de uma paciente e não representa resultado esperado para outras pessoas.']
      ]
    }
  };

  const caseData = {
    labios: {
      title: 'Lábios', source: 'Publicado pela própria clínica na seção de resultados.',
      intro: 'Mesma pessoa, mesmo enquadramento, mesma luz. O segundo registro é o pós imediato que a clínica rotulou como tal.',
      images: [
        { src: 'official/case-labios-before-pos-1200.jpg', alt: 'Antes à esquerda e Pós imediato à direita, como publicado pela clínica, com rótulos originais preservados' },
        { src: 'official/case-labios-up-1200.jpg', alt: 'Pós imediato publicado pela clínica: detalhe da região labial' }
      ]
    },
    perfil: {
      title: 'Perfil · pós rino com queixo', source: 'Publicado pela clínica com as legendas Antes e Depois.',
      intro: 'A legenda da própria publicação é “Pós rino com queixo — resultado real de harmonização facial”.',
      images: [
        { src: 'official/case-perfil-antes-1200.jpg', alt: 'Perfil antes, publicado pela clínica com a legenda Antes' },
        { src: 'official/case-perfil-depois-1200.jpg', alt: 'Mesmo perfil depois, publicado pela clínica com a legenda Depois' },
        { src: 'official/case-rino-pos-1200.jpg', alt: 'Registro de perfil publicado como pós de rinomodelação com queixo' }
      ]
    },
    bastidor: {
      title: 'Bastidor do atendimento', source: 'Acervo real da clínica.',
      intro: 'O gesto técnico e o repouso depois de um cuidado facial. Não são comparações de resultado.',
      images: [
        { src: 'care-k-front.webp', alt: 'Mãos com luvas posicionando fio PDO sob a pele durante atendimento' },
        { src: 'care-a-detail.webp', alt: 'Detalhe de atendimento facial com luminária de exame' }
      ]
    },
    corpo: {
      title: 'Bumbum brasileiro', source: 'Publicado pela clínica.', sensitive: true,
      intro: 'Antes e depois da região glútea, na ordem em que foi publicado. Conteúdo corporal: abre quando você escolhe ver.',
      images: [
        { src: 'official/case-gluteo-montage-1200.jpg', alt: 'Antes e depois da região glútea, publicado pela clínica' }
      ]
    }
  };
  const videoData = {
    labios: { title: 'Lábios em contexto', src: 'video-labios.mp4', poster: 'optimized/lips-b-close-v2-800.webp', description: 'Sequência de atendimento labial do acervo. O vídeo é contextual e não diagnosticado pelo site.', sensitive: false },
    procedimento: { title: 'Procedimento em contexto', src: 'video-procedimento.mp4', poster: 'poster-procedimento.jpg', description: 'Registro de procedimento facial. Imagens podem ser sensíveis para algumas pessoas.', sensitive: true, gate: 'O vídeo contém imagens de procedimento facial. Você escolhe se deseja assistir; o carregamento começa apenas após sua confirmação.' },
    corpo: { title: 'Conteúdo corporal separado', src: 'video-corpo.mp4', poster: 'poster-corpo.jpg', description: 'Registro corporal íntimo fornecido ao acervo. Sem promessa de resultado ou correspondência cronológica.', sensitive: true, gate: 'A próxima área contém imagens corporais íntimas. Entre apenas se desejar visualizar esse conteúdo.' }
  };

  const flowState = {
    step: 1, interest: '', intro: '', transport: '', name: '', origin: '', period: '', question: '', coordinates: null, includeLocation: false, message: ''
  };

  let lastContentFocused = null;
  let lastFlowFocused = null;
  let activeCase = null;
  let caseIndex = 0;
  let toastTimer;
  const contentDialog = $('#content-dialog');
  const flowDialog = $('#flow-dialog');

  function toast(message) {
    const element = $('#toast');
    clearTimeout(toastTimer);
    element.textContent = message;
    element.hidden = false;
    toastTimer = setTimeout(() => { element.hidden = true; }, 2800);
  }

  function finishLoader() {
    const loader = $('#loader');
    loader.classList.add('is-hidden');
    document.body.classList.remove('loader-open');
    setTimeout(() => loader.setAttribute('aria-hidden', 'true'), reducedMotion ? 0 : 750);
  }

  function initLoader() {
    const loaderBar = $('#loader-bar');
    const phrases = ['Um espaço para você.', 'Escuta, cuidado e beleza.', 'Sua experiência está pronta.'];
    let progress = 8;
    let finished = false;
    document.body.classList.add('loader-open');
    loaderBar.style.width = `${progress}%`;
    const interval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 8, 88);
      loaderBar.style.width = `${progress}%`;
      const phrase = phrases[Math.min(phrases.length - 1, Math.floor(progress / 31))];
      $('#loader-phrase').textContent = phrase;
    }, 240);
    const complete = () => {
      if (finished) return;
      finished = true;
      clearInterval(interval);
      loaderBar.style.width = '100%';
      setTimeout(finishLoader, reducedMotion ? 0 : 280);
    };
    const heroImage = $('#hero-image');
    const heroReady = heroImage.decode ? heroImage.decode().catch(() => {}) : Promise.resolve();
    const fontReady = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.race([
      Promise.all([heroReady, fontReady, new Promise(resolve => setTimeout(resolve, 700))]),
      new Promise(resolve => setTimeout(resolve, 2400))
    ]).then(complete);
    $('#loader-skip').addEventListener('click', complete);
  }

  function initHeader() {
    const header = $('#site-header');
    const toggle = $('#menu-toggle');
    const nav = $('#site-nav');
    const setMenu = open => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      if (open) nav.querySelector('a')?.focus({ preventScroll: true });
    };
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    $$('a', nav).forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('click', event => {
      if (!header.contains(event.target)) setMenu(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    const fab = $('.whatsapp-float');
    const footer = $('.site-footer');
    // As camadas de atmosfera também têm data-tone e são fixas: só varremos
    // blocos de conteúdo, senão a primeira camada casaria sempre.
    const toneBlocks = $$('section[data-tone], footer[data-tone]');
    let toneAt = 0;
    const updateTone = () => {
      const now = performance.now();
      if (now - toneAt < 120) return;
      toneAt = now;
      const probe = header.offsetHeight * 0.5;
      let noir = false;
      for (const block of toneBlocks) {
        const box = block.getBoundingClientRect();
        if (box.top <= probe && box.bottom > probe) { noir = block.dataset.tone === 'noir'; break; }
      }
      header.classList.toggle('is-on-noir', noir);
    };
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      // O flutuante só entra depois da primeira tela: no hero ele pisava em
      // cima dos números em resoluções curtas.
      const footerVisible = footer && footer.getBoundingClientRect().top < innerHeight - 24;
      if (fab) fab.classList.toggle('is-shown', window.scrollY > innerHeight * 0.5 && !footerVisible);
      updateTone();
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  function initReveal() {
    const elements = $$('.reveal');
    if (reducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach(element => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px' });
    elements.forEach(element => observer.observe(element));
  }

  function setupTabs(selector, onSelect) {
    const tabs = $$(selector);
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => onSelect(tab.dataset.care || tab.dataset.region, tab));
      tab.addEventListener('keydown', event => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        tabs[next].focus();
        onSelect(tabs[next].dataset.care || tabs[next].dataset.region, tabs[next]);
      });
    });
  }

  let activeCare = 'pele';

  function selectCare(key) {
    const data = careData[key];
    if (!data) return;
    activeCare = key;
    $('#care-kicker').textContent = data.kicker;
    $('#care-title').textContent = data.title;
    $('#care-description').textContent = data.description;
    $('#care-cta').textContent = data.cta;
    $('#care-map-note').textContent = data.mapNote;
    $('.care-lead-label').hidden = data.services.length === 0;
    $('#care-services').hidden = data.services.length === 0;
    $('#care-faq').hidden = data.faq.length === 0;
    $('#care-services').replaceChildren(...data.services.map(service => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'care-service';
      button.textContent = service.name;
      button.addEventListener('click', () => openProcedure(service.slug));
      return button;
    }));
    $('#care-faq').replaceChildren(...data.faq.map(([question, answer]) => {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = question;
      const paragraph = document.createElement('p');
      paragraph.textContent = answer;
      details.append(summary, paragraph);
      return details;
    }));
    $$('.care-tab').forEach(tab => {
      const selected = tab.dataset.care === key;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    $('#care-panel').setAttribute('aria-labelledby', `tab-${key}`);
    $$('.map-region, .map-tag').forEach(element => {
      const active = data.regions.includes(element.dataset.region);
      element.classList.toggle('is-active', active);
      if (element.classList.contains('map-tag') || element.classList.contains('map-region')) element.setAttribute('aria-pressed', String(active));
    });
    $('#care-map').classList.toggle('is-muted', !data.regions.length);
    activeFilter = key === 'todos' ? 'todos' : key;
    applyProcedureFilter();
  }

  function initCares() {
    setupTabs('.care-tab', selectCare);
    const mapColumn = $('.care-map-column');
    const mapMount = $('#mobile-face-mount');
    const carePanel = $('#care-panel');
    const placeMobileFace = () => {
      if (!mapColumn || !mapMount || !carePanel) return;
      if (window.matchMedia('(max-width: 760px)').matches) mapMount.append(mapColumn);
      else carePanel.insertBefore(mapColumn, $('.care-content', carePanel));
    };
    placeMobileFace();
    window.addEventListener('resize', placeMobileFace, { passive: true });
    $('#care-cta').addEventListener('click', () => openFlow(careData[activeCare].cta));
    $$('.map-region, .map-tag').forEach(element => {
      const care = careToRegion[element.dataset.region] || 'rosto';
      element.addEventListener('click', () => {
        selectCare(care);
        if (window.matchMedia('(max-width: 760px)').matches) $('[data-open-mobile-care]')?.click();
      });
      element.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        selectCare(care);
        if (window.matchMedia('(max-width: 760px)').matches) $('[data-open-mobile-care]')?.click();
      });
    });
    const requestedCare = new URLSearchParams(window.location.search).get('categoria');
    selectCare(careData[requestedCare] ? requestedCare : 'pele');
    $('[data-open-mobile-care]')?.addEventListener('click', () => {
      const areas = ['pele', 'labios', 'rosto', 'olhar', 'corpo'];
      const areaNames = { pele: 'Pele', labios: 'Lábios', rosto: 'Rosto', olhar: 'Olhar', corpo: 'Corpo' };
      const renderMobileCare = key => {
        const data = careData[key];
        const services = data.services.map(service => `<li>${service.name}</li>`).join('');
        $('#mobile-care-detail').innerHTML = `<p class="eyebrow">${data.kicker}</p><h3>${data.title}</h3><p>${data.description}</p>${services ? `<ul>${services}</ul>` : ''}<button class="button button-dark" type="button" data-mobile-care-cta="${key}">${data.cta}</button>`;
        $$('.mobile-care-area').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mobileCareArea === key)));
      };
      openContent(`<div class="mobile-care-dialog-content"><p class="eyebrow">Cuidados para conversar</p><h2 id="dialog-title">Escolha uma área</h2><div class="mobile-care-area-list" role="group" aria-label="Áreas de cuidado">${areas.map(key => `<button type="button" class="mobile-care-area" data-mobile-care-area="${key}" aria-pressed="${key === activeCare}">${areaNames[key]}</button>`).join('')}</div><div id="mobile-care-detail"></div></div>`, 'mobile-care-dialog', () => renderMobileCare(activeCare));
    });
    $('#dialog-content').addEventListener('click', event => {
      const area = event.target.closest('[data-mobile-care-area]');
      if (area && $('#content-dialog').classList.contains('mobile-care-dialog')) {
        selectCare(area.dataset.mobileCareArea);
        const data = careData[activeCare];
        const services = data.services.map(service => `<li>${service.name}</li>`).join('');
        $('#mobile-care-detail').innerHTML = `<p class="eyebrow">${data.kicker}</p><h3>${data.title}</h3><p>${data.description}</p>${services ? `<ul>${services}</ul>` : ''}<button class="button button-dark" type="button" data-mobile-care-cta="${activeCare}">${data.cta}</button>`;
        $$('.mobile-care-area').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mobileCareArea === activeCare)));
      }
      const cta = event.target.closest('[data-mobile-care-cta]');
      if (cta && $('#content-dialog').classList.contains('mobile-care-dialog')) openFlow(careData[cta.dataset.mobileCareCta].cta, cta);
    });
  }

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  let activeFilter = 'todos';
  function applyProcedureFilter() {
    const query = normalize($('#procedure-search').value);
    let visible = 0;
    $$('.procedure-card').forEach(card => {
      const procedure = procedures[card.dataset.procedure];
      const matchesCategory = activeFilter === 'todos' || procedure.category === activeFilter;
      const haystack = normalize(`${procedure.title} ${procedure.summary} ${procedure.category}`);
      const matchesQuery = !query || haystack.includes(query);
      card.hidden = !(matchesCategory && matchesQuery);
      if (!card.hidden) visible++;
    });
    $('#procedure-empty').hidden = visible !== 0;
    // URLs limpas: filtros e busca não alteram o endereço da home.
  }

  function renderProcedureGrid() {
    const grid = $('#procedure-grid');
    if (!grid) return;
    grid.replaceChildren(...Object.entries(procedures).map(([slug, data]) => {
      const price = publishedPrices[slug];
      const card = document.createElement('article');
      card.className = 'procedure-card';
      card.dataset.procedure = slug;
      card.dataset.category = data.category;
      card.innerHTML = `
        <button type="button" class="procedure-card-inner" aria-label="Abrir detalhes de ${data.title}">
          <span class="procedure-card-media">
            ${photoMarkup(data.image, data.imageAlt || data.title, 'procedure-card-image', false, '(max-width: 600px) 92vw, (max-width: 820px) 46vw, 30vw', cropFocusStyle(data.image))}
            <span class="card-badge">${data.illustrated ? 'Imagem editorial' : 'Acervo publicado'}</span>
          </span>
          <span class="procedure-card-body">
            <span class="card-category">${categoryLabel[data.category] || ''}</span>
            <strong class="card-title">${data.title}</strong>
            <span class="card-summary">${data.summary}</span>
            <span class="card-foot">
              ${price ? `<span class="card-price">${price}</span>` : '<span class="card-price card-price--ask">Valor na avaliação</span>'}
              <span class="card-open" aria-hidden="true">Ver</span>
            </span>
          </span>
        </button>`;
      return card;
    }));
  }

  function initProcedures() {
    renderProcedureGrid();
    const params = new URLSearchParams(window.location.search);
    $('#procedure-search').value = params.get('busca') || '';
    const requested = params.get('categoria');
    if (careData[requested]) selectCare(requested);
    $$('.procedure-card').forEach(card => card.addEventListener('click', () => {
      openProcedure(card.dataset.procedure);
    }));
    $('#procedure-search').addEventListener('input', applyProcedureFilter);
    $('#clear-search').addEventListener('click', () => {
      $('#procedure-search').value = '';
      selectCare('todos');
      $('#procedure-search').focus();
    });
    applyProcedureFilter();
    const deepLink = params.get('procedimento');
    if (deepLink && procedures[deepLink]) setTimeout(() => openProcedure(deepLink), 650);
  }

  function openContent(html, className = '', onOpen) {
    if (flowDialog.open) {
      const inheritedFocus = lastFlowFocused;
      flowDialog.close();
      lastContentFocused = inheritedFocus || document.activeElement;
    } else lastContentFocused = document.activeElement;
    if (contentDialog.open) contentDialog.close();
    contentDialog.className = `content-dialog ${className}`.trim();
    $('#dialog-content').innerHTML = html;
    contentDialog.showModal();
    document.body.classList.add('is-locked');
    document.documentElement.classList.add('is-locked');
    if (onOpen) onOpen();
    const heading = contentDialog.querySelector('#dialog-title');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    } else contentDialog.querySelector('.dialog-close').focus();
  }

  const publishedPrices = {
    botox: 'R$ 850 · 3 regiões, com retoque',
    'preenchimento-labial': 'R$ 600 · seringa 1 ml',
    'preenchimento-olheiras': 'R$ 550 · seringa 1 ml',
    'rinomodelacao': 'R$ 900 sem fios · R$ 1.400 com fios PDO',
    'harmonizacao-facial': 'a partir de R$ 3.200',
    'harmonizacao-glutea': 'R$ 5.600 · 130 ml',
    'bioestimulador': 'R$ 1.200 a R$ 4.000 por sessão, conforme a opção publicada',
    'fios-pdo': 'R$ 300 a R$ 800, conforme tipo e região',
    'limpeza-de-pele': 'R$ 150'
  };

  const categoryLabel = { pele: 'Pele', labios: 'Lábios', rosto: 'Rosto', olhar: 'Olhar', corpo: 'Corpo' };

  function openProcedure(slug) {
    const data = procedures[slug];
    if (!data) return;
    data.price = publishedPrices[slug];
    const topics = data.topics.map(topic => `<li>${topic}</li>`).join('');
    const faq = data.faq.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('');
    const variants = data.variants ? `
      <section class="procedure-variants">
        <p class="eyebrow">Opções publicadas</p><h3>O que a clínica divulga como valor</h3>
        <dl>${data.variants.map(([name, value]) => `<div><dt>${name}</dt><dd>${value}</dd></div>`).join('')}</dl>
        <p class="fine-print">Valores publicados pela clínica. A escolha entre as opções acontece na avaliação, não por esta página.</p>
      </section>` : '';
    const plate = data.plate ? `
      <section class="procedure-related">
        <div class="published-record-head"><div><p class="eyebrow">Registro publicado pela clínica</p><h3>${data.plate.label}</h3></div>${data.plate.order ? `<ol class="published-order" aria-label="Ordem cronológica do registro"><li><span>01</span>Antes</li><li class="order-arrow" aria-hidden="true">→</li><li><span>02</span>Pós imediato</li></ol>` : ''}</div>
        <div class="published-record-body"><figure class="published-plate${data.plate.images.length > 1 ? ' plate-pair' : ''}">${data.plate.images.map(image => photoMarkup(image.src, image.alt, 'plate-image', false, '(max-width: 700px) 92vw, 640px', `style="--ar:${(ladder(image.src).ratio || 1.5).toFixed(3)}"`)).join('')}<figcaption>Comparação em ordem cronológica · fonte: publicação da clínica</figcaption></figure><aside class="published-record-context"><span class="record-context-mark" aria-hidden="true">i</span><div><strong>Como ler este registro</strong><p>${data.plate.note}</p></div></aside></div>
      </section>` : '';
    const message = data.whatsapp || `Olá, Aline! Gostaria de conversar sobre ${data.title} e entender como funciona a avaliação.`;
    openContent(`
      <div class="dialog-hero concept-hero">${photoMarkup(data.image, data.imageAlt, '', true)}<span class="concept-badge${data.illustrated ? '' : ' badge-real'}">${data.illustrated ? 'Imagem editorial' : 'Acervo real da clínica'}</span><div class="dialog-hero-copy"><p class="eyebrow">${categoryLabel[data.category]}</p><h2 id="dialog-title">${data.title}</h2><p>${data.summary}</p></div></div>
      <div class="dialog-body procedure-detail">
        <div class="procedure-intro"><p class="eyebrow">Informação com cuidado</p><p>${data.description}</p>${data.price ? `<p class="procedure-price"><span>Investimento publicado</span><strong>${data.price}</strong></p>` : '<p class="procedure-price"><span>Investimento</span><strong>definido na avaliação</strong></p>'}</div>
        <div class="procedure-sections">
          <section><span>01</span><h3>Como a conversa acontece</h3><ul>${topics}</ul></section>
          <section><span>02</span><h3>Cuidados e limitações</h3><p>${data.note}</p></section>
        </div>
        ${variants}
        ${plate}
        <section class="procedure-faq"><p class="eyebrow">Perguntas frequentes</p><h3>Antes de conversar</h3><div class="dialog-faq">${faq}</div></section>
        <p class="fine-print procedure-disclaimer">Resultados são individuais e dependem de avaliação profissional. Esta página apresenta o serviço confirmado pela marca e não faz promessa de resultado.</p>
        <div class="dialog-actions"><button class="button button-dark" type="button" data-dialog-interest="${data.title}" data-dialog-message="${message}">Preparar mensagem para a Aline ↗</button><button class="button button-ghost" type="button" data-dialog-close>Continuar explorando</button></div>
      </div>
    `);
  }

  function initDialogs() {
    $$('[data-dialog-close]').forEach(button => button.addEventListener('click', () => contentDialog.close()));
    contentDialog.addEventListener('close', () => {
      $$('video', contentDialog).forEach(video => { video.pause(); video.removeAttribute('src'); video.load(); });
      $$('canvas', contentDialog).forEach(canvas => canvas.remove());
      if (flowDialog.open) return;
      document.body.classList.remove('is-locked');
      document.documentElement.classList.remove('is-locked');
      if (lastContentFocused && document.contains(lastContentFocused)) lastContentFocused.focus({ preventScroll: true });
    });
    contentDialog.addEventListener('click', event => {
      if (event.target !== contentDialog) return;
      const rect = contentDialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) contentDialog.close();
    });
    document.addEventListener('click', event => {
      const close = event.target.closest('[data-dialog-close]');
      if (close && contentDialog.contains(close)) contentDialog.close();
      const interest = event.target.closest('[data-dialog-interest]');
      if (interest) openFlow(interest.dataset.dialogInterest, document.activeElement, interest.dataset.dialogMessage || '');
    });
  }

  function initResults() {
    $$('[data-result-filter]').forEach(button => button.addEventListener('click', () => {
      $$('[data-result-filter]').forEach(item => {
        item.classList.toggle('is-active', item === button);
        item.setAttribute('aria-pressed', String(item === button));
      });
      $$('[data-result-category]').forEach(card => { card.hidden = button.dataset.resultFilter !== 'todos' && card.dataset.resultCategory !== button.dataset.resultFilter; });
    }));
  }

  function lightboxMarkup(data, index) {
    const image = data.images[index];
    return `<div class="lightbox-layout"><div class="lightbox-media" id="lightbox-media">${photoMarkup(image.src, image.alt, '', index === 0)}</div><div class="lightbox-info"><span class="lightbox-count" aria-live="polite">Registro ${index + 1} de ${data.images.length}</span><h2 id="dialog-title">${data.title}</h2><p>${data.intro}</p><p>${data.source} As imagens não substituem avaliação e não representam promessa de resultado.</p><div class="lightbox-controls"><button type="button" data-lightbox-prev aria-label="Registro anterior">←</button><button type="button" data-lightbox-next aria-label="Próximo registro">→</button></div></div></div>`;
  }

  function renderLightbox() {
    const data = caseData[activeCase];
    $('#dialog-content').innerHTML = lightboxMarkup(data, caseIndex);
    $('[data-lightbox-prev]', contentDialog).addEventListener('click', () => changeCase(-1));
    $('[data-lightbox-next]', contentDialog).addEventListener('click', () => changeCase(1));
    let touchX = null;
    const mediaElement = $('#lightbox-media', contentDialog);
    mediaElement.addEventListener('touchstart', event => { touchX = event.changedTouches[0].clientX; }, { passive: true });
    mediaElement.addEventListener('touchend', event => {
      if (touchX === null) return;
      const delta = event.changedTouches[0].clientX - touchX;
      if (Math.abs(delta) > 45) changeCase(delta > 0 ? -1 : 1);
      touchX = null;
    }, { passive: true });
  }

  function changeCase(direction) {
    const images = caseData[activeCase].images;
    caseIndex = (caseIndex + direction + images.length) % images.length;
    renderLightbox();
    toast(`Registro ${caseIndex + 1} de ${images.length}`);
  }

  function openCase(key) {
    activeCase = key;
    caseIndex = 0;
    openContent('', 'lightbox', renderLightbox);
  }

  function initCases() {
    $$('[data-case]').forEach(button => button.addEventListener('click', () => openCase(button.dataset.case)));
    document.addEventListener('keydown', event => {
      if (!contentDialog.open || !contentDialog.classList.contains('lightbox')) return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); changeCase(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); changeCase(1); }
    });
    $$('[data-open-body]').forEach(button => button.addEventListener('click', () => {
      openContent(`<div class="sensitive-gate"><span class="gate-symbol" aria-hidden="true">18</span><h2 id="dialog-title">Conteúdo corporal íntimo</h2><p>Esta área separada contém imagens corporais íntimas fornecidas ao acervo. Não há comparação validada nem promessa de resultado. Entre apenas se desejar visualizar.</p><div class="dialog-actions"><button class="button button-dark" type="button" data-confirm-body>Desejo visualizar</button><button class="button button-ghost" type="button" data-dialog-close>Não entrar</button></div></div>`, '', () => {
        $('[data-confirm-body]', contentDialog).addEventListener('click', () => {
          $('#dialog-content').innerHTML = `<div class="dialog-body intimate-body-dialog"><p class="eyebrow">Área corporal discreta</p><h2 id="dialog-title">Harmonização glútea</h2><p>Registro publicado pela clínica. A imagem não traz rótulos na moldura; a ordem original é mantida.</p><figure class="official-montage"><img src="${media}official/case-gluteo-montage-640.jpg" alt="Registro corporal de harmonização glútea publicado pela clínica" loading="lazy"><figcaption><span>Imagem publicada pela clínica</span></figcaption></figure><p class="fine-print">Registro individual. Não representa resultado esperado para outras pessoas.</p><div class="dialog-actions"><button class="button button-ghost" type="button" data-dialog-close>Fechar</button></div></div>`;
        });
      });
    }));
  }

  function renderVideo(key) {
    const data = videoData[key];
    if (!data) return;
    $('#dialog-content').innerHTML = `<video controls muted playsinline preload="none" poster="${media}${data.poster}" aria-label="${data.title}"><source src="${media}${data.src}" type="video/mp4">Seu navegador não oferece suporte ao vídeo.</video><div class="dialog-video-copy"><p class="eyebrow">Vídeo do acervo</p><h2 id="dialog-title">${data.title}</h2><p>${data.description}</p><p class="fine-print">Reprodução começa sem áudio. O conteúdo não é utilizado para diagnóstico ou promessa.</p></div>`;
    contentDialog.classList.add('dialog-video');
    contentDialog.classList.toggle('dialog-video-portrait', key === 'labios');
  }

  function initVideos() {
    $$('[data-video]').forEach(button => button.addEventListener('click', () => {
      const key = button.dataset.video;
      const data = videoData[key];
      if (!data) return;
      if (data.sensitive) {
        openContent(`<div class="sensitive-gate"><span class="gate-symbol" aria-hidden="true">▷</span><p class="eyebrow">Aviso de conteúdo</p><h2 id="dialog-title">${data.title}</h2><p>${data.gate}</p><div class="dialog-actions"><button class="button button-dark" type="button" data-confirm-video="${key}">Assistir agora</button><button class="button button-ghost" type="button" data-dialog-close>Voltar</button></div></div>`, '', () => {
          $('[data-confirm-video]', contentDialog).addEventListener('click', () => renderVideo(key));
        });
      } else openContent('', 'dialog-video', () => renderVideo(key));
    }));
  }

  const journeySteps = [
    {
      no: '01', title: 'Primeiro contato', where: 'Começa no celular.',
      text: 'Você chama a Aline pelo WhatsApp e conta o que deseja conhecer. Nenhuma informação de saúde é pedida por aqui.',
      motif: '<rect class="journey-motif" x="104" y="96" width="112" height="208" rx="24"/><path class="journey-motif" d="M145 112h30M128 146h64a9 9 0 0 1 9 9v26a9 9 0 0 1-9 9h-27l-14 12v-12h-23a9 9 0 0 1-9-9v-26a9 9 0 0 1 9-9zM136 162h37M136 176h25M128 220h48a9 9 0 0 1 9 9v20a9 9 0 0 1-9 9h-17l-12 10v-10h-19a9 9 0 0 1-9-9v-20a9 9 0 0 1 9-9z"/><path class="journey-motif-accent" d="M137 237h6m8 0h6m8 0h6"/><circle class="journey-dot-mark" cx="160" cy="282" r="5"/>'
    },
    {
      no: '02', title: 'Escuta', where: 'Antes de qualquer plano.',
      text: 'O que incomoda, o que já foi feito, o que você teme. Nenhuma agulha é mencionada antes disso.',
      motif: '<path class="journey-motif" d="M176 292c-24-13-39-40-39-69v-29c0-40 25-69 61-69 31 0 53 21 53 49 0 21-10 37-29 47-12 7-17 15-17 28v16"/><path class="journey-motif" d="M177 164c-16 7-25 20-25 37v17c0 14-6 24-18 32M247 167c12 12 18 27 18 44s-6 32-18 44M263 150c18 17 28 38 28 61s-10 44-28 61"/><path class="journey-motif-accent" d="M143 300c20-5 36-18 46-36"/><circle class="journey-dot-mark" cx="216" cy="220" r="4"/>'
    },
    {
      no: '03', title: 'Avaliação', where: 'Na maca, com espelho.',
      text: 'Leitura do rosto, da pele e da história de cada região. É aqui que o catálogo deixa de ser catálogo.',
      image: 'care-a-detail.webp', imageAlt: 'Detalhe de atendimento facial com luminária de exame — acervo da clínica',
      tag: 'Acervo real da clínica'
    },
    {
      no: '04', title: 'Plano', where: 'Você decide o ritmo.',
      text: 'Uma proposta com etapas, possibilidades, valores e o que fica para depois. Você aprova no seu tempo.',
      motif: '<rect class="journey-motif" x="94" y="90" width="132" height="220" rx="16"/><path class="journey-motif" d="M94 142h132M124 78v25M196 78v25M134 169h69M134 201h69M134 233h48M134 265h48"/><rect class="journey-motif" x="110" y="158" width="14" height="14" rx="3"/><rect class="journey-motif" x="110" y="190" width="14" height="14" rx="3"/><rect class="journey-motif" x="110" y="222" width="14" height="14" rx="3"/><path class="journey-motif-accent" d="m111 197 5 5 9-11m-14 43 5 5 9-11"/><circle class="journey-dot-mark" cx="117" cy="165" r="3"/>'
    },
    {
      no: '05', title: 'Procedimento', where: 'Sessão individual.',
      text: 'Execução com produto apresentado a você, ambiente preparado e acompanhamento durante todo o tempo.',
      image: 'care-k-front.webp', imageAlt: 'Mãos com luvas posicionando fio PDO sob a pele durante atendimento — acervo da clínica',
      tag: 'Acervo real da clínica'
    },
    {
      no: '06', title: 'Pós e retorno', where: 'O plano continua.',
      text: 'Orientações do que é esperado nos primeiros dias, canal direto com a clínica e reavaliação para ajustar o que precisar.',
      motif: '<rect class="journey-motif" x="94" y="105" width="132" height="168" rx="15"/><path class="journey-motif" d="M94 150h132M126 94v24M194 94v24M115 171h19m12 0h19m12 0h19M115 196h19m12 0h19m12 0h19M115 221h19m12 0h19m12 0h19"/><path class="journey-motif-accent" d="M150 221l8 8 16-18M184 286c21 0 37-16 37-36 0-12-5-22-14-29m14 2v-16m0 16h-16"/><circle class="journey-dot-mark" cx="126" cy="171" r="5"/>'
    }
  ];

  function initJourney() {
    const rail = $('#journey-rail');
    const panel = $('#journey-panel');
    const progress = $('#journey-progress');
    const journey = $('.journey');
    const mobileTrigger = $('[data-journey-open]');
    const mobileDialog = $('#journey-mobile-dialog');
    const mobileContent = $('#journey-mobile-content');
    const mobileKicker = $('#journey-mobile-kicker');
    const mobileProgress = $('#journey-mobile-progress');
    if (!rail || !panel) return;
    const tabs = $$('.journey-step', rail);
    let active = 0;

    const stepMedia = step => step.image
      ? `<span class="journey-media is-photo"><img src="${media}${step.image}" alt="${step.imageAlt}" loading="lazy"><span class="journey-tag">${step.tag}</span></span>`
      : `<span class="journey-media"><svg viewBox="0 0 320 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Ilustração conceitual da etapa ${step.no} — ${step.title}"><g transform="translate(160 200) scale(1.35) translate(-160 -200)">${step.motif}</g></svg></span>`;

    const renderMobile = index => {
      if (!mobileContent) return;
      const step = journeySteps[index];
      const extraMotifs = {
        2: '<path class="journey-motif" d="M160 300c-38-24-58-68-58-120 0-52 24-88 58-88s58 36 58 88c0 52-20 96-58 120Z"/><path class="journey-motif" d="M132 178c12-10 24-10 36 0m-28 16c8 8 18 8 26 0m-20 24 18 0M244 100v150m-18-18 18 18 18-18"/><circle class="journey-dot-mark" cx="160" cy="218" r="6"/>' ,
        4: '<path class="journey-motif" d="M96 220c0-54 28-86 64-86s64 32 64 86v68H96z"/><path class="journey-motif" d="M136 140v-24m48 24v-24M112 210h96M128 232h64M132 288v24m56-24v24"/><path class="journey-motif-accent" d="M151 252c-12-8-20-20-20-34v-20m58 54c12-8 20-20 20-34v-20"/><circle class="journey-dot-mark" cx="160" cy="194" r="5"/>'
      };
      const motif = step.motif || extraMotifs[index];
      mobileKicker.textContent = `Etapa ${step.no} de 06`;
      mobileProgress.style.width = `${((index + 1) / journeySteps.length) * 100}%`;
      mobileContent.innerHTML = `<div class="journey-mobile-art" aria-hidden="true"><svg viewBox="0 0 320 400"><g transform="translate(160 200) scale(1.2) translate(-160 -200)">${motif}</g></svg></div><div class="journey-mobile-copy"><h2 id="journey-mobile-title">${step.title}</h2><p>${step.text}</p><p class="journey-mobile-where">${step.where}</p></div><div class="journey-mobile-dots" role="group" aria-label="Escolher etapa">${journeySteps.map((item, i) => `<button type="button" data-journey-mobile-step="${i}" aria-label="Etapa ${item.no}: ${item.title}" ${i === index ? 'aria-current="step"' : ''}></button>`).join('')}</div><div class="journey-mobile-controls"><button type="button" data-journey-mobile="prev" ${index === 0 ? 'disabled' : ''}>← Anterior</button><span>${step.no} / 06</span><button type="button" data-journey-mobile="next" ${index === journeySteps.length - 1 ? 'disabled' : ''}>Próxima →</button></div>`;
    };

    const render = (index, focusRail = true) => {
      active = index;
      const step = journeySteps[index];
      journey.dataset.step = String(index);
      progress.style.setProperty('--p', `${(index / (journeySteps.length - 1)) * 100}%`);
      tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        tab.classList.toggle('is-done', i < index);
      });
      panel.setAttribute('aria-labelledby', `journey-tab-${index}`);
      panel.innerHTML = `<div class="journey-body">${stepMedia(step)}<div class="journey-copy"><span class="journey-num" aria-hidden="true">${step.no}</span><p class="journey-kicker">Etapa ${step.no} de 06</p><h3 class="journey-title">${step.title}</h3><p class="journey-desc">${step.text}</p><p class="journey-where">${step.where}</p><div class="journey-nav"><button type="button" data-journey="prev" ${index === 0 ? 'disabled' : ''}>← Anterior</button><button type="button" data-journey="next" ${index === journeySteps.length - 1 ? 'disabled' : ''}>Próxima →</button><span class="journey-count">${step.no} / 06</span></div></div></div>`;
      if (focusRail) centerTab(tabs[index]);
      if (mobileDialog?.open) renderMobile(index);
    };

    // Rolagem só dentro da trilha. scrollIntoView com block:'nearest' também
    // rola a página: no load a abertura pulava direto para a jornada.
    function centerTab(tab) {
      if (!tab || rail.scrollWidth <= rail.clientWidth + 4) return;
      const box = rail.getBoundingClientRect();
      const me = tab.getBoundingClientRect();
      rail.scrollTo({ left: rail.scrollLeft + (me.left - box.left) - (box.width - me.width) / 2, behavior: 'smooth' });
    }

    rail.addEventListener('click', event => {
      const tab = event.target.closest('.journey-step');
      if (tab) render(Number(tab.dataset.step));
    });
    rail.addEventListener('keydown', event => {
      const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (event.key in keys) {
        event.preventDefault();
        const next = Math.min(journeySteps.length - 1, Math.max(0, active + keys[event.key]));
        render(next);
        tabs[next].focus();
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : journeySteps.length - 1;
        render(next);
        tabs[next].focus();
      }
    });
    panel.addEventListener('click', event => {
      const button = event.target.closest('[data-journey]');
      if (!button || button.disabled) return;
      render(active + (button.dataset.journey === 'next' ? 1 : -1));
      tabs[active].focus();
    });
    mobileTrigger?.addEventListener('click', () => {
      renderMobile(active);
      mobileDialog.showModal();
      document.body.classList.add('is-locked');
      document.documentElement.classList.add('is-locked');
    });
    mobileDialog?.addEventListener('click', event => {
      if (event.target === mobileDialog || event.target.closest('[data-journey-close]')) {
        mobileDialog.close();
        return;
      }
      const dot = event.target.closest('[data-journey-mobile-step]');
      if (dot) {
        render(Number(dot.dataset.journeyMobileStep), false);
        return;
      }
      const control = event.target.closest('[data-journey-mobile]');
      if (control && !control.disabled) render(active + (control.dataset.journeyMobile === 'next' ? 1 : -1), false);
    });
    mobileDialog?.addEventListener('close', () => {
      document.body.classList.remove('is-locked');
      document.documentElement.classList.remove('is-locked');
    });
    render(0);
  }

  function openLocation() {    openContent(`<div class="location-layout">${photoMarkup('inauguration-facade.webp', 'Fachada real da Aline Rodrigues')}<div class="location-copy"><p class="eyebrow">Praia Grande · São Paulo</p><h2 id="dialog-title">Reconheça o espaço.</h2><p>Esta é a fachada registrada no acervo da Aline Rodrigues.</p><p class="address-line"><strong>Av. Presidente Kennedy, 13049</strong><br>Caiçara · Praia Grande — SP · CEP 11707-000</p><p class="notice">Segunda a sábado, das 09h às 18h. Domingos a clínica não abre. Atendimento com hora marcada.</p><div class="dialog-actions"><a class="button button-dark" href="https://www.google.com/maps/dir/?api=1&amp;destination=Aline%20Rodrigues%20est%C3%A9tica%20humanizada%20Praia%20Grande" target="_blank" rel="noopener">Abrir rota no Google Maps ↗</a><button class="button button-ghost" type="button" data-dialog-interest="Confirmar horário e preparar visita">Conversar sobre um horário</button></div></div></div>`);
  }

  function initLocation() {
    $$('[data-open-location]').forEach(button => button.addEventListener('click', openLocation));
  }

  function openFlow(initialInterest = '', opener = document.activeElement, intro = '') {
    if (contentDialog.open) {
      const inheritedFocus = lastContentFocused;
      contentDialog.close();
      lastFlowFocused = inheritedFocus || opener;
    } else lastFlowFocused = opener;
    if (flowDialog.open) flowDialog.close();
    flowState.interest = initialInterest || 'Conversar com a Aline';
    flowState.intro = intro;
    flowState.message = '';
    updateFlowSelections();
    $('[data-flow-step="1"] [data-flow-next]').disabled = !flowState.interest;
    flowDialog.showModal();
    document.body.classList.add('is-locked');
    document.documentElement.classList.add('is-locked');
    goFlowStep(1);
  }

  function updateFlowSelections() {
    $$('[data-flow-step="1"] [data-flow-value], [data-flow-step="2"] [data-flow-value]').forEach(button => {
      const value = button.dataset.flowValue;
      const selected = value === (button.closest('[data-flow-step="1"]') ? flowState.interest : flowState.transport);
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function goFlowStep(step) {
    flowState.step = step;
    $$('[data-flow-step]').forEach(section => { section.hidden = Number(section.dataset.flowStep) !== step; });
    $('#flow-progress-bar').style.width = `${step / 6 * 100}%`;
    $('#flow-step-label').textContent = `Passo ${step} de 6`;
    const title = $(`[data-flow-step="${step}"] h2`);
    title.id = `flow-step-title-${step}`;
    flowDialog.setAttribute('aria-labelledby', title.id);
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
    flowDialog.scrollTop = 0;
    if (step === 5) renderFlowSummary();
    if (step === 6) buildFlowMessage(false);
  }

  function renderFlowSummary() {
    const location = flowState.includeLocation && flowState.coordinates ? `${flowState.coordinates.lat.toFixed(5)}, ${flowState.coordinates.lon.toFixed(5)}` : 'Não incluída';
    const entries = [
      ['Interesse', flowState.interest], ['Transporte', flowState.transport], ['Nome', flowState.name || 'Não informado'],
      ['Origem', flowState.origin || 'Não informada'], ['Período', flowState.period || 'Não informado'],
      ['Localização', location], ['Dúvida', flowState.question || 'Nenhuma'], ['Destino', 'Av. Presidente Kennedy, 13049 · Caiçara, Praia Grande (SP)']
    ];
    $('#flow-summary').replaceChildren(...entries.map(([label, value]) => {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = label;
      description.textContent = value;
      row.append(term, description);
      return row;
    }));
  }

  function buildFlowMessage(reset = true) {
    const interestMessages = {
      'Conhecer tratamentos': 'Gostaria de conhecer os tratamentos.',
      'Cuidados faciais': 'Gostaria de conversar sobre cuidados faciais.',
      'Cuidados corporais': 'Gostaria de conversar sobre cuidados corporais.',
      Perfumaria: 'Gostaria de saber mais sobre a perfumaria.',
      'Conversar com a Aline': 'Gostaria de conversar com você para entender melhor o atendimento.'
    };
    const transportMessages = {
      carro: 'Vou de carro.', 'a pé': 'Vou a pé.', ônibus: 'Vou de ônibus.',
      aplicativo: 'Vou de aplicativo.', 'Ainda não sei': 'Ainda não defini como vou chegar.'
    };
    const interestMessage = flowState.interest
      ? interestMessages[flowState.interest] || `Gostaria de conversar sobre ${flowState.interest.toLocaleLowerCase('pt-BR')}.`
      : 'Gostaria de conversar com você.';
    const lines = [
      'Olá, Aline! Tudo bem?', '',
      flowState.intro || interestMessage,
      transportMessages[flowState.transport] || 'Ainda não defini como vou chegar.'
    ];
    if (flowState.name) lines.push(`Meu nome é ${flowState.name}.`);
    if (flowState.origin) lines.push(`Saio de ${flowState.origin}.`);
    if (flowState.includeLocation && flowState.coordinates) lines.push(`Incluí minha localização nesta mensagem: ${flowState.coordinates.lat.toFixed(5)}, ${flowState.coordinates.lon.toFixed(5)}.`);
    if (flowState.period) lines.push(`Prefiro o período: ${flowState.period}.`);
    if (flowState.question) lines.push(`Minha dúvida é: ${flowState.question}`);
    lines.push('', 'Podemos conversar sobre um horário? Sei que o atendimento é de segunda a sábado, das 09h às 18h.');
    const message = lines.join('\n');
    if (reset) flowState.message = message;
    $('#flow-message').value = message;
    $('#flow-preview-message').textContent = message;
    updateWhatsAppLink(message);
  }

  function updateWhatsAppLink(message) {
    $('#flow-send').href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function initFlow() {
    const stepOneNavigation = document.createElement('div');
    stepOneNavigation.className = 'flow-navigation';
    stepOneNavigation.innerHTML = '<button class="button button-dark" type="button" data-flow-next disabled>Continuar</button>';
    $('[data-flow-step="1"]').append(stepOneNavigation);
    const stepTwoNavigation = $('[data-flow-step="2"] .flow-navigation');
    const nextTwo = document.createElement('button');
    nextTwo.className = 'button button-dark';
    nextTwo.type = 'button';
    nextTwo.dataset.flowNext = '';
    nextTwo.disabled = true;
    nextTwo.textContent = 'Continuar';
    stepTwoNavigation.append(nextTwo);

    $$('[data-flow-value]').forEach(button => button.addEventListener('click', () => {
      if (button.closest('[data-flow-step="1"]')) {
        flowState.interest = button.dataset.flowValue;
        flowState.intro = '';
      } else flowState.transport = button.dataset.flowValue;
      updateFlowSelections();
      $('[data-flow-step="1"] [data-flow-next]').disabled = !flowState.interest;
      stepTwoNavigation.querySelector('[data-flow-next]').disabled = !flowState.transport;
    }));
    $$('[data-flow-next]').forEach(button => button.addEventListener('click', () => {
      if (flowState.step === 1 && !flowState.interest) return;
      if (flowState.step === 2 && !flowState.transport) return;
      goFlowStep(flowState.step + 1);
    }));
    $$('[data-flow-back]').forEach(button => button.addEventListener('click', () => goFlowStep(Math.max(1, flowState.step - 1))));
    $$('[data-flow-close]').forEach(button => button.addEventListener('click', () => flowDialog.close()));
    $$('dialog a[href^="#"]').forEach(link => link.addEventListener('click', () => {
      const dialog = link.closest('dialog');
      if (dialog.open) dialog.close();
    }));
    $('#flow-next-origin').addEventListener('click', () => {
      flowState.name = $('#flow-name').value.trim();
      flowState.origin = $('#flow-origin').value.trim();
      flowState.period = $('#flow-period').value.trim();
      flowState.question = $('#flow-question').value.trim();
      if ($('#flow-geolocation').checked && !flowState.coordinates) {
        $('#geo-status').textContent = 'Aguarde a localização ou desmarque a opção para continuar sem ela.';
        return;
      }
      goFlowStep(4);
    });
    ['#flow-name', '#flow-origin', '#flow-period', '#flow-question'].forEach(selector => $(selector).addEventListener('input', event => {
      const keys = { '#flow-name': 'name', '#flow-origin': 'origin', '#flow-period': 'period', '#flow-question': 'question' };
      flowState[keys[selector]] = event.target.value.trim();
    }));
    $('#flow-geolocation').addEventListener('change', async event => {
      flowState.includeLocation = event.target.checked;
      if (!flowState.includeLocation) {
        flowState.coordinates = null;
        $('#geo-status').textContent = 'Localização não será incluída.';
        return;
      }
      if (!navigator.geolocation) {
        $('#geo-status').textContent = 'Geolocalização indisponível. Desmarque a opção para continuar sem ela.';
        event.target.checked = false;
        flowState.includeLocation = false;
        return;
      }
      $('#geo-status').textContent = 'Solicitando sua permissão ao navegador…';
      navigator.geolocation.getCurrentPosition(position => {
        flowState.coordinates = { lat: position.coords.latitude, lon: position.coords.longitude };
        $('#geo-status').textContent = 'Localização obtida. Ela será incluída apenas na mensagem que você revisar.';
      }, error => {
        event.target.checked = false;
        flowState.includeLocation = false;
        flowState.coordinates = null;
        $('#geo-status').textContent = error.code === 1 ? 'Permissão não concedida. Você pode continuar sem localização.' : 'Não foi possível obter a localização. Continue sem ela ou tente novamente.';
      }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
    });
    $('#flow-message').addEventListener('input', event => {
      flowState.message = event.target.value;
      $('#flow-preview-message').textContent = event.target.value || 'Sua mensagem aparecerá aqui.';
      updateWhatsAppLink(event.target.value);
    });
    $('#flow-send').addEventListener('click', () => toast('Revise a mensagem no WhatsApp antes de enviar.'));
    flowDialog.addEventListener('close', () => {
      if (contentDialog.open) return;
      document.body.classList.remove('is-locked');
      document.documentElement.classList.remove('is-locked');
      if (lastFlowFocused && document.contains(lastFlowFocused)) lastFlowFocused.focus({ preventScroll: true });
    });
    flowDialog.addEventListener('click', event => {
      if (event.target !== flowDialog) return;
      const rect = flowDialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) flowDialog.close();
    });
    flowDialog.addEventListener('cancel', event => {
      event.preventDefault();
      flowDialog.close();
    });
    $$('[data-open-flow]').forEach(button => button.addEventListener('click', event => openFlow(button.dataset.openFlow || '', event.currentTarget)));
  }

  function initAtmosphere() {
    const root = document.documentElement;
    const zones = $$('section[data-tone]');
    if (!zones.length) return;
    const tones = [...new Set(zones.map(zone => zone.dataset.tone))];
    let frame = 0;
    const render = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const height = Math.max(1, document.documentElement.scrollHeight - viewport);
      const progress = Math.min(1, Math.max(0, window.scrollY / height));
      root.style.setProperty('--scroll', progress.toFixed(4));
      if (reducedMotion) return;
      const eye = window.scrollY + viewport * 0.52;
      const sum = {};
      tones.forEach(tone => { sum[tone] = 0; });
      zones.forEach(zone => {
        const rect = zone.getBoundingClientRect();
        const centre = window.scrollY + rect.top + rect.height / 2;
        const reach = Math.max(rect.height, viewport) * 0.95;
        const weight = Math.max(0, 1 - Math.abs(centre - eye) / reach);
        sum[zone.dataset.tone] += weight * weight;
      });
      const total = tones.reduce((acc, tone) => acc + sum[tone], 0) || 1;
      tones.forEach(tone => root.style.setProperty(`--tone-${tone}`, (sum[tone] / total).toFixed(3)));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(render); };
    render();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  initLoader();
  initAtmosphere();
  initHeader();
  initReveal();
  initCares();
  initProcedures();
  initDialogs();
  initResults();
  initCases();
  initVideos();
  initJourney();
  initLocation();
  initFlow();
})();
