import type { MockExam } from '../../types/exams';

export const EXAMS_PORTUGUESE: MockExam[] = [
  // =========================================================================
  // CELPE-Bras (pt) — 4 Official Mock Simulations
  // =========================================================================
  {
    id: 'celpebras-sim-1',
    examTypeId: 'celpebras',
    languageCode: 'pt',
    simulationNumber: 1,
    title: 'CELPE-Bras Intermediário — Simulado 1: Trabalho & Vida Urbana',
    targetCefr: 'B1',
    durationMinutes: 60,
    questions: [
      {
        id: 'celpe-1-q1',
        section: 'reading',
        passageTitle: 'Bicicletas Compartilhadas nas Capitais Brasileiras',
        passageText:
          'Nos últimos cinco anos, o sistema de bicicletas compartilhadas ganhou espaço em cidades como São Paulo, Recife e Curitiba. Segundo levantamento da Associação Nacional de Mobilidade, cerca de 42% dos usuários utilizam as bicicletas não apenas para lazer nos fins de semana, mas também para integrar o trajeto diário até estações de metrô e terminais de ônibus.',
        prompt: 'De acordo com o texto, qual é um dos principais usos das bicicletas compartilhadas atualmente?',
        options: [
          'Apenas passeios turísticos durante as férias escolares.',
          'Integração com o transporte público no deslocamento diário.',
          'Substituição total dos trens urbanos em longas distâncias.',
          'Entregas comerciais realizadas exclusivamente à noite.',
        ],
        correctIndex: 1,
        explanation:
          'O texto informa que cerca de 42% dos usuários utilizam as bicicletas para integrar o trajeto diário até estações de metrô e terminais de ônibus.',
      },
      {
        id: 'celpe-1-q2',
        section: 'reading',
        passageTitle: 'Bicicletas Compartilhadas nas Capitais Brasileiras',
        passageText:
          'Nos últimos cinco anos, o sistema de bicicletas compartilhadas ganhou espaço em cidades como São Paulo, Recife e Curitiba. Segundo levantamento da Associação Nacional de Mobilidade, cerca de 42% dos usuários utilizam as bicicletas não apenas para lazer nos fins de semana, mas também para integrar o trajeto diário até estações de metrô e terminais de ônibus.',
        prompt: 'O dado de 42% mencionado na reportagem refere-se a:',
        options: [
          'Estações de metrô que oferecem estacionamento gratuito.',
          'Usuários que combinam a bicicleta com o transporte coletivo.',
          'Cidades brasileiras que já possuem ciclovias iluminadas.',
          'Bicicletas elétricas disponíveis nos fins de semana.',
        ],
        correctIndex: 1,
        explanation:
          'O levantamento aponta que 42% dos usuários empregam o sistema não só para lazer, mas para o trajeto diário integrado ao transporte público.',
      },
      {
        id: 'celpe-1-q3',
        section: 'listening',
        audioText:
          'Atenção, passageiros da linha azul do metrô: devido a uma manutenção preventiva nos trilhos entre as estações Paraíso e Ana Rosa, os trens estão circulando com velocidade reduzida neste trecho. A previsão de normalização é para as dez horas e trinta minutos. Agradecemos a compreensão.',
        audioPlaysLimit: 2,
        prompt: 'O que o aviso sonoro informa aos passageiros da linha azul?',
        options: [
          'A estação Paraíso permanecerá fechada durante todo o dia.',
          'Os trens circulam mais devagar em um trecho por causa de manutenção.',
          'O serviço será retomado apenas na manhã seguinte.',
          'É necessário pagar uma tarifa adicional até as 10h30.',
        ],
        correctIndex: 1,
        explanation:
          'O comunicado explica que os trens circulam com velocidade reduzida entre Paraíso e Ana Rosa por manutenção preventiva até as 10h30.',
      },
      {
        id: 'celpe-1-q4',
        section: 'listening',
        audioText:
          'Oi, Lucas! Aqui é a Camila, da coordenação de eventos. Queria confirmar se você ainda pode apresentar a oficina de fotografia na sexta-feira à tarde. Se precisar de projetor ou caixa de som, me avise até amanhã ao meio-dia para eu reservar o auditório menor.',
        audioPlaysLimit: 2,
        prompt: 'Por que Camila pediu que Lucas responda até amanhã ao meio-dia?',
        options: [
          'Para cancelar a oficina de fotografia caso chova.',
          'Para reservar os equipamentos e o auditório necessários.',
          'Para alterar a data do evento para o próximo mês.',
          'Para enviar as fotos impressas aos participantes.',
        ],
        correctIndex: 1,
        explanation:
          'Camila precisa saber se Lucas precisará de projetor ou caixa de som para reservar o auditório menor.',
      },
      {
        id: 'celpe-1-q5',
        section: 'language_use',
        prompt: 'Complete a frase com a forma verbal adequada: "Quando eu ___ o curso de português, pretendo trabalhar em uma empresa multinacional."',
        options: ['concluir', 'concluo', 'concluí', 'concluía'],
        correctIndex: 0,
        explanation:
          'Após a conjunção temporal "quando" com sentido de futuro, usa-se o futuro do subjuntivo ("concluir").',
      },
      {
        id: 'celpe-1-q6',
        section: 'language_use',
        prompt: 'Assinale a opção que completa corretamente o diálogo: "Você já entregou o formulário?" — "Ainda não, mas vou entregá-___ hoje à tarde."',
        options: ['lo', 'lhe', 'o', 'ele'],
        correctIndex: 0,
        explanation:
          'Quando o pronome oblíquo "o" se liga a um infinitivo terminado em "-r", o "-r" cai e o pronome assume a forma "-lo" ("entregá-lo").',
      },
    ],
    writingTask: {
      prompt:
        'Você mora em um bairro onde muitas pessoas usam bicicletas para trabalhar, mas faltam ciclovias sinalizadas. Escreva uma carta formal (entre 100 e 140 palavras) à Secretaria de Transportes da sua cidade relatando o problema, citando os riscos para ciclistas e pedestres, e sugerindo duas melhorias concretas.',
      minWords: 90,
      rubricCriteria: [
        'Adequação ao gênero carta formal (saudação, vocativo e despedida respeitosos)',
        'Apresentação clara do problema e de dois argumentos ou riscos concretos',
        'Proposta objetiva de duas melhorias viárias',
        'Coesão textual e uso adequado dos tempos verbais e conectores',
      ],
      expectedKeywords: ['ciclovia', 'segurança', 'trânsito', 'sugiro', 'atenciosamente'],
      modelAnswer:
        'Prezados senhores da Secretaria de Transportes,\n\nEscrevo na qualidade de morador do bairro Jardim das Flores para solicitar atenção urgente à infraestrutura cicloviária da região. Diariamente, centenas de trabalhadores utilizam bicicletas na Avenida Central; contudo, a ausência de ciclovias sinalizadas obriga os ciclistas a dividirem a pista com ônibus e automóveis em alta velocidade, gerando riscos constantes de acidentes tanto para quem pedala quanto para os pedestres.\n\nDiante disso, sugiro a implantação de uma ciclofaixa exclusiva ao longo da avenida e a instalação de placas de sinalização e bicicletários próximos ao terminal de ônibus. Essas medidas simples contribuirão para um trânsito mais seguro e sustentável.\n\nAgradeço antecipadamente pela atenção e aguardo um retorno.\n\nAtenciosamente,\nRafael Mendes',
    },
    speakingTask: {
      title: 'CELPE-Bras Interação Oral — Cotidiano e Mobilidade',
      instructionsPt:
        'Responda às três partes da prova oral com naturalidade, desenvolvendo suas ideias com exemplos pessoais e justificativas claras.',
      parts: [
        {
          id: 'celpe-1-sp1',
          partLabel: 'Parte 1 — Conversa Inicial',
          prepSeconds: 20,
          speakSeconds: 60,
          prompt:
            'Fale sobre a cidade onde você mora atualmente: como é o transporte público e o que você costuma fazer nos fins de semana?',
          bulletPoints: [
            'Meios de transporte que você utiliza',
            'Pontos positivos e desafios do seu bairro',
            'Atividades de lazer habituais',
          ],
          evaluationCriteria: [
            'Fluência e naturalidade na apresentação pessoal',
            'Uso correto do presente e do pretérito perfeito',
            'Vocabulário variado sobre rotina urbana',
          ],
        },
        {
          id: 'celpe-1-sp2',
          partLabel: 'Parte 2 — Elemento Provocador (Cartaz Comunitário)',
          prepSeconds: 30,
          speakSeconds: 90,
          prompt:
            'Imagine que você viu um cartaz na associação de moradores convidando voluntários para o "Domingo Sem Carro" no parque municipal. Comente por que iniciativas como essa são úteis e como você participaria.',
          bulletPoints: [
            'Impacto ambiental e convivência comunitária',
            'Possíveis dificuldades para comerciantes ou moradores',
            'Sua sugestão de atividade para o evento',
          ],
          evaluationCriteria: [
            'Capacidade de interpretar e comentar um tema social',
            'Uso de conectores de causa e consequência',
            'Clareza na pronúncia e entonação',
          ],
        },
        {
          id: 'celpe-1-sp3',
          partLabel: 'Parte 3 — Aprofundamento e Opinião',
          prepSeconds: 20,
          speakSeconds: 90,
          prompt:
            'Na sua opinião, as prefeituras devem investir mais em transporte coletivo gratuito ou na ampliação de avenidas para carros? Justifique sua resposta.',
          bulletPoints: [
            'Comparação entre transporte público e individual',
            'Benefícios de longo prazo para a população',
            'Um exemplo de cidade que você admira',
          ],
          evaluationCriteria: [
            'Sustentação de ponto de vista com argumentos coerentes',
            'Emprego adequado do subjuntivo em expressões de opinião',
            'Domínio lexical de nível B1/B2',
          ],
        },
      ],
    },
  },
  {
    id: 'celpebras-sim-2',
    examTypeId: 'celpebras',
    languageCode: 'pt',
    simulationNumber: 2,
    title: 'CELPE-Bras Intermediário Superior — Simulado 2: Cultura & Consumo',
    targetCefr: 'B2',
    durationMinutes: 60,
    questions: [
      {
        id: 'celpe-2-q1',
        section: 'reading',
        passageTitle: 'Feiras Livres e Economia Solidária',
        passageText:
          'Mais do que pontos de venda de frutas e hortaliças, as feiras livres em Portugal e no Brasil funcionam como espaços de sociabilidade e preservação da agricultura familiar. Com o avanço do comércio eletrônico, produtores locais passaram a combinar o atendimento presencial com encomendas semanais por aplicativos de mensagens, reduzindo o desperdício de alimentos.',
        prompt: 'Segundo o texto, de que maneira os produtores locais têm lidado com a era digital?',
        options: [
          'Substituindo totalmente as feiras presenciais por grandes supermercados.',
          'Associando a venda presencial nas feiras a pedidos feitos por aplicativos.',
          'Abandonando o cultivo de hortaliças para vender produtos industrializados.',
          'Restringindo o atendimento apenas a restaurantes de luxo.',
        ],
        correctIndex: 1,
        explanation:
          'O texto destaca que os produtores combinaram o atendimento presencial com encomendas semanais por aplicativos de mensagens.',
      },
      {
        id: 'celpe-2-q2',
        section: 'reading',
        passageTitle: 'Feiras Livres e Economia Solidária',
        passageText:
          'Mais do que pontos de venda de frutas e hortaliças, as feiras livres em Portugal e no Brasil funcionam como espaços de sociabilidade e preservação da agricultura familiar. Com o avanço do comércio eletrônico, produtores locais passaram a combinar o atendimento presencial com encomendas semanais por aplicativos de mensagens, reduzindo o desperdício de alimentos.',
        prompt: 'Qual benefício direto é atribuído ao sistema de encomendas semanais?',
        options: [
          'A redução do desperdício de alimentos.',
          'O aumento do preço das frutas importadas.',
          'A eliminação da agricultura familiar.',
          'O fechamento das feiras nos bairros residenciais.',
        ],
        correctIndex: 0,
        explanation:
          'Ao final do parágrafo, afirma-se que essa prática vem "reduzindo o desperdício de alimentos".',
      },
      {
        id: 'celpe-2-q3',
        section: 'listening',
        audioText:
          'Olá, ouvintes da Rádio Cultura. Neste sábado, o Museu da Língua Portuguesa recebe a mostra gratuita "Palavras Viajantes", que reúne cartas, canções e objetos cotidianos de comunidades lusófonas da África, Europa, Ásia e América. Os ingressos devem ser retirados pelo site a partir das nove horas.',
        audioPlaysLimit: 2,
        prompt: 'O que é necessário fazer para visitar a exposição "Palavras Viajantes"?',
        options: [
          'Pagar a taxa de entrada na bilheteria do museu.',
          'Retirar o ingresso gratuitamente pelo site a partir das 9h.',
          'Enviar uma carta pessoal para a curadoria do evento.',
          'Comparecer exclusivamente na sexta-feira à noite.',
        ],
        correctIndex: 1,
        explanation:
          'O locutor informa que a mostra é gratuita e que os ingressos devem ser retirados pelo site a partir das nove horas.',
      },
      {
        id: 'celpe-2-q4',
        section: 'listening',
        audioText:
          'Entrevistador: Professora Helena, por que o consumo de sebos e livrarias independentes voltou a crescer entre os jovens? Helena: Eu diria que, embora a leitura digital seja prática, muitos leitores buscam hoje a experiência tátil do livro físico e a curadoria afetiva dos livreiros, além de preços mais acessíveis nos exemplares usados.',
        audioPlaysLimit: 2,
        prompt: 'Segundo a professora Helena, o que atrai os jovens às livrarias independentes e sebos?',
        options: [
          'A obrigatoriedade escolar de comprar livros raros.',
          'A experiência tátil, a curadoria dos livreiros e os preços mais acessíveis.',
          'A ausência de bibliotecas públicas nas grandes cidades.',
          'A distribuição gratuita de leitores digitais.',
        ],
        correctIndex: 1,
        explanation:
          'Helena cita a experiência tátil do livro físico, a curadoria afetiva dos livreiros e os preços acessíveis dos livros usados.',
      },
      {
        id: 'celpe-2-q5',
        section: 'language_use',
        prompt: 'Assinale a alternativa que completa adequadamente a frase: "Embora o orçamento ___ limitado, a equipe conseguiu organizar um festival memorável."',
        options: ['fosse', 'era', 'será', 'foi'],
        correctIndex: 0,
        explanation:
          'A conjunção concessiva "embora" exige o modo subjuntivo; em correlação com o pretérito perfeito ("conseguiu"), usa-se o imperfeito do subjuntivo ("fosse").',
      },
      {
        id: 'celpe-2-q6',
        section: 'language_use',
        prompt: 'Escolha a forma correta para manter a norma padrão: "As medidas ___ o relatório se refere entrarão em vigor em outubro."',
        options: ['a que', 'que', 'onde', 'cujo'],
        correctIndex: 0,
        explanation:
          'Quem se refere, refere-se "a" algo. Portanto, a preposição "a" deve anteceder o pronome relativo "que" ("a que o relatório se refere").',
      },
    ],
    writingTask: {
      prompt:
        'Você leu uma matéria sobre o aumento do consumo consciente e da troca de roupas usadas entre jovens. Escreva um artigo de opinião (130 a 170 palavras) para o jornal de uma universidade, analisando as razões econômicas e ambientais dessa tendência e avaliando se ela pode transformar a indústria da moda.',
      minWords: 110,
      rubricCriteria: [
        'Tese clara sobre o consumo consciente e a economia circular',
        'Articulação de argumentos econômicos e ambientais com conectores (contudo, além disso, portanto)',
        'Uso adequado do subjuntivo e de estruturas de impessoalidade',
        'Registro semi-formal compatível com artigo jornalístico universitário',
      ],
      expectedKeywords: ['sustentabilidade', 'consumo', 'moda', 'ambiente', 'portanto'],
      modelAnswer:
        'Nos últimos anos, a busca por brechós e plataformas de troca de roupas deixou de ser apenas uma alternativa econômica para se consolidar como uma escolha cultural entre jovens universitários. Esse movimento reflete tanto a necessidade de equilibrar o orçamento diante da inflação quanto a preocupação crescente com os impactos ambientais da indústria têxtil, responsável por alto consumo de água e geração de resíduos.\n\nAlém de prolongar a vida útil das peças, a economia circular estimula uma relação mais crítica com a publicidade e com o descarte acelerado imposto pela moda rápida. Embora grandes redes ainda dominem o mercado, a pressão de consumidores mais conscientes já leva algumas marcas a adotarem programas de reciclagem e transparência produtiva.\n\nPortanto, caso essa mentalidade continue se expandindo, o consumo colaborativo terá força para redefinir os padrões de produção e valorizar a durabilidade acima da quantidade.',
    },
    speakingTask: {
      title: 'CELPE-Bras Interação Oral — Consumo e Cultura Local',
      instructionsPt:
        'Apresente suas ideias com clareza, estabelecendo comparações entre a realidade do seu país e a dos países lusófonos.',
      parts: [
        {
          id: 'celpe-2-sp1',
          partLabel: 'Parte 1 — Hábitos de Consumo',
          prepSeconds: 20,
          speakSeconds: 60,
          prompt:
            'Como você costuma fazer suas compras do dia a dia? Você prefere mercados tradicionais de bairro ou compras pela internet?',
          bulletPoints: [
            'Frequência e tipo de compras',
            'Vantagens do comércio local versus digital',
            'Mudanças nos seus hábitos nos últimos anos',
          ],
          evaluationCriteria: [
            'Precisão lexical ao descrever hábitos e preferências',
            'Uso correto de comparativos e marcadores temporais',
            'Ritmo de fala natural',
          ],
        },
        {
          id: 'celpe-2-sp2',
          partLabel: 'Parte 2 — Elemento Provocador (Campanha de Desperdício Zero)',
          prepSeconds: 30,
          speakSeconds: 90,
          prompt:
            'Uma campanha publicitária traz a frase: "O alimento que sobra no seu prato pode fazer falta na mesa de alguém. Planeje suas compras." Comente a mensagem e diga que ações práticas reduzem o desperdício em casa.',
          bulletPoints: [
            'Interpretação crítica do slogan',
            'Estratégias de planejamento alimentar',
            'Papel das escolas e dos supermercados',
          ],
          evaluationCriteria: [
            'Capacidade de análise e síntese a partir de estímulo visual/textual',
            'Uso de estruturas de recomendação e hipótese',
            'Coesão discursiva',
          ],
        },
        {
          id: 'celpe-2-sp3',
          partLabel: 'Parte 3 — Debate Cultural',
          prepSeconds: 20,
          speakSeconds: 90,
          prompt:
            'Você acredita que a globalização ameaça as tradições culinárias e culturais locais ou ajuda a divulgá-las para o mundo? Defenda seu ponto de vista.',
          bulletPoints: [
            'Exemplos de pratos ou festas tradicionais',
            'Benefícios da troca cultural',
            'Cuidados para preservar a identidade local',
          ],
          evaluationCriteria: [
            'Argumentação equilibrada com contra-argumento',
            'Emprego de conectores concessivos e explicativos',
            'Fluência sustentada por 90 segundos',
          ],
        },
      ],
    },
  },
  {
    id: 'celpebras-sim-3',
    examTypeId: 'celpebras',
    languageCode: 'pt',
    simulationNumber: 3,
    title: 'CELPE-Bras Intermediário Superior — Simulado 3: Tecnologia & Educação',
    targetCefr: 'B2',
    durationMinutes: 60,
    questions: [
      {
        id: 'celpe-3-q1',
        section: 'reading',
        passageTitle: 'Inteligência Artificial na Sala de Aula',
        passageText:
          'Escolas e universidades têm debatido como incorporar ferramentas de inteligência artificial sem comprometer o desenvolvimento do pensamento crítico. Especialistas em pedagogia defendem que, em vez de proibir o uso dessas tecnologias, os docentes devem propor atividades em que os estudantes avaliem, corrijam e aprofundem respostas geradas automaticamente.',
        prompt: 'Qual é a recomendação dos especialistas em pedagogia apresentada no texto?',
        options: [
          'Proibir o acesso à internet durante todo o período letivo.',
          'Substituir os professores por tutores automatizados.',
          'Usar a tecnologia de forma crítica, levando o aluno a revisar e aprofundar conteúdos.',
          'Eliminar as provas escritas em todas as disciplinas.',
        ],
        correctIndex: 2,
        explanation:
          'Os especialistas defendem que os docentes proponham atividades em que os estudantes avaliem, corrijam e aprofundem as respostas geradas.',
      },
      {
        id: 'celpe-3-q2',
        section: 'reading',
        passageTitle: 'Inteligência Artificial na Sala de Aula',
        passageText:
          'Escolas e universidades têm debatido como incorporar ferramentas de inteligência artificial sem comprometer o desenvolvimento do pensamento crítico. Especialistas em pedagogia defendem que, em vez de proibir o uso dessas tecnologias, os docentes devem propor atividades em que os estudantes avaliem, corrijam e aprofundem respostas geradas automaticamente.',
        prompt: 'A expressão "em vez de" no texto estabelece uma relação de:',
        options: [
          'Alternância ou substituição de uma atitude por outra.',
          'Causa imediata de um problema técnico.',
          'Consequência inevitável do uso de computadores.',
          'Dúvida sobre a eficácia da escola pública.',
        ],
        correctIndex: 0,
        explanation:
          '"Em vez de" indica substituição: no lugar de proibir, deve-se propor atividades críticas.',
      },
      {
        id: 'celpe-3-q3',
        section: 'listening',
        audioText:
          'Comunicado da Biblioteca Central: informamos que, durante o período de exames finais, o salão principal funcionará até as vinte e três horas. Para trabalhos em grupo, pedimos aos estudantes que utilizem exclusivamente as salas reservadas do segundo andar, preservando o silêncio na área de leitura individual.',
        audioPlaysLimit: 2,
        prompt: 'Onde os alunos devem realizar trabalhos em grupo durante o período de exames?',
        options: [
          'No salão principal de leitura.',
          'Nas salas reservadas do segundo andar.',
          'No pátio externo após as 23 horas.',
          'Na recepção do térreo.',
        ],
        correctIndex: 1,
        explanation:
          'O comunicado orienta que trabalhos em grupo sejam feitos exclusivamente nas salas reservadas do segundo andar.',
      },
      {
        id: 'celpe-3-q4',
        section: 'listening',
        audioText:
          'Marina: Professor, terminei a revisão bibliográfica, mas notei que dois artigos recentes contradizem nossa hipótese inicial. O senhor acha melhor reescrever a introdução agora? Professor: Não se apresse, Marina. Vamos analisar a metodologia desses artigos na reunião de quarta-feira antes de alterar qualquer seção.',
        audioPlaysLimit: 2,
        prompt: 'O que o professor aconselha Marina a fazer?',
        options: [
          'Descartar os dois artigos recentes imediatamente.',
          'Reescrever toda a introdução antes de quarta-feira.',
          'Aguardar a análise metodológica na reunião de quarta-feira.',
          'Trocar o tema da pesquisa com outro colega.',
        ],
        correctIndex: 2,
        explanation:
          'O professor pede que ela não se apresse e que analisem a metodologia dos artigos na reunião de quarta-feira antes de fazer alterações.',
      },
      {
        id: 'celpe-3-q5',
        section: 'language_use',
        prompt: 'Indique a frase em que a crase foi empregada corretamente:',
        options: [
          'O curso destina-se à profissionais da área de saúde.',
          'A pesquisa foi submetida à aprovação do comitê de ética.',
          'Entregamos os certificados à todos os palestrantes.',
          'Eles começaram à discutir o projeto pela manhã.',
        ],
        correctIndex: 1,
        explanation:
          'Ocorre crase antes do substantivo feminino "aprovação" regido por "submetida a". Não há crase antes de plural masculino, de "todos" ou de verbo no infinitivo.',
      },
      {
        id: 'celpe-3-q6',
        section: 'language_use',
        prompt: 'Complete com o infinitivo pessoal adequado: "Os tutores pediram para nós ___ os exercícios antes da aula prática."',
        options: ['revisarmos', 'revisar', 'revisarem', 'revisarmos-nos'],
        correctIndex: 0,
        explanation:
          'Com o sujeito explícito "nós", o infinitivo pessoal flexiona-se na 1.ª pessoa do plural ("revisarmos").',
      },
    ],
    writingTask: {
      prompt:
        'A escola de idiomas onde você estuda está avaliando substituir parte das aulas presenciais por módulos totalmente gravados. Escreva um e-mail formal (130 a 170 palavras) à diretoria pedagógica expondo sua opinião: destaque vantagens do formato digital, aponte riscos para a prática oral e proponha um modelo híbrido equilibrado.',
      minWords: 110,
      rubricCriteria: [
        'Tom respeitoso e propositivo adequado ao destinatário institucional',
        'Equilíbrio entre benefícios do ensino digital e necessidade de interação presencial',
        'Uso correto de pronomes, regência verbal e pontuação',
        'Sugestão concreta de modelo híbrido',
      ],
      expectedKeywords: ['híbrido', 'interação', 'flexibilidade', 'oralidade', 'sugestão'],
      modelAnswer:
        'Prezada Diretoria Pedagógica,\n\nGostaria de compartilhar minha perspectiva sobre a proposta de substituição parcial das aulas presenciais por módulos gravados. Reconheço que o formato digital oferece maior flexibilidade de horários e permite que cada estudante revise conteúdos gramaticais no próprio ritmo.\n\nNo entanto, acredito que a redução excessiva dos encontros ao vivo pode prejudicar o desenvolvimento da oralidade e da escuta espontânea, habilidades que dependem de interação imediata com professores e colegas. Sem o diálogo em tempo real, muitos alunos tendem a perder a motivação.\n\nComo sugestão, proponho a adoção de um modelo híbrido equilibrado: as explicações teóricas poderiam ficar disponíveis em vídeo, enquanto o tempo presencial seria integralmente dedicado à conversação, debates e correção colaborativa. Dessa forma, uniríamos autonomia e prática comunicativa.\n\nAtenciosamente,\nBeatriz Almeida',
    },
    speakingTask: {
      title: 'CELPE-Bras Interação Oral — Educação e Futuro Digital',
      instructionsPt:
        'Desenvolva respostas estruturadas, demonstrando domínio de vocabulário acadêmico e profissional em português.',
      parts: [
        {
          id: 'celpe-3-sp1',
          partLabel: 'Parte 1 — Trajetória de Aprendizagem',
          prepSeconds: 20,
          speakSeconds: 60,
          prompt:
            'Conte como tem sido sua experiência aprendendo português: quais estratégias ou recursos digitais mais ajudaram você até hoje?',
          bulletPoints: [
            'Motivação para estudar português',
            'Ferramentas ou métodos favoritos',
            'Maior desafio superado',
          ],
          evaluationCriteria: [
            'Uso de tempos compostos e marcadores de duração',
            'Clareza na exposição de experiências',
            'Pronúncia clara de vogais nasais',
          ],
        },
        {
          id: 'celpe-3-sp2',
          partLabel: 'Parte 2 — Elemento Provocador (Infográfico sobre Trabalho Remoto)',
          prepSeconds: 30,
          speakSeconds: 90,
          prompt:
            'Um estudo mostra que 65% dos profissionais em teletrabalho valorizam a economia de tempo no deslocamento, mas 48% relatam dificuldade em separar a vida pessoal do expediente. Analise esses dados.',
          bulletPoints: [
            'Leitura crítica da tensão entre flexibilidade e exaustão',
            'Impactos na saúde mental e produtividade',
            'Boas práticas para equipes remotas',
          ],
          evaluationCriteria: [
            'Capacidade de comentar dados estatísticos',
            'Uso de conectores de oposição e consequência',
            'Precisão lexical',
          ],
        },
        {
          id: 'celpe-3-sp3',
          partLabel: 'Parte 3 — Perspectivas Profissionais',
          prepSeconds: 20,
          speakSeconds: 90,
          prompt:
            'Que competências humanas você considera impossíveis de serem substituídas pela inteligência artificial no mercado de trabalho dos próximos dez anos?',
          bulletPoints: [
            'Criatividade, empatia e negociação',
            'Papel da formação contínua',
            'Relação entre ética e tecnologia',
          ],
          evaluationCriteria: [
            'Argumentação abstrata e bem fundamentada',
            'Uso natural do subjuntivo e do futuro do pretérito',
            'Coerência e ritmo',
          ],
        },
      ],
    },
  },
  {
    id: 'celpebras-sim-4',
    examTypeId: 'celpebras',
    languageCode: 'pt',
    simulationNumber: 4,
    title: 'CELPE-Bras Avançado — Simulado 4: Meio Ambiente & Políticas Públicas',
    targetCefr: 'C1',
    durationMinutes: 60,
    questions: [
      {
        id: 'celpe-4-q1',
        section: 'reading',
        passageTitle: 'Infraestrutura Verde e Resiliência Climática',
        passageText:
          'Diante da intensificação de eventos climáticos extremos, urbanistas contemporâneos defendem a substituição gradual do concreto impermeável por soluções baseadas na natureza, como parques alagáveis, jardins de chuva e corredores arborizados. Embora o investimento inicial pareça elevado, estudos demonstram que tais intervenções reduzem drasticamente os custos com drenagem emergencial e mitigam ilhas de calor urbanas.',
        prompt: 'Qual é a tese central defendida pelos urbanistas mencionados no texto?',
        options: [
          'A construção de grandes muros de concreto é a única forma de conter enchentes.',
          'Soluções baseadas na natureza são financeiramente inviáveis em metrópoles.',
          'A infraestrutura verde previne danos climáticos e gera economia a médio e longo prazo.',
          'Os parques urbanos devem ser fechados durante o período chuvoso.',
        ],
        correctIndex: 2,
        explanation:
          'O texto mostra que, apesar do custo inicial, parques alagáveis e jardins de chuva reduzem custos com drenagem emergencial e mitigam ilhas de calor.',
      },
      {
        id: 'celpe-4-q2',
        section: 'reading',
        passageTitle: 'Infraestrutura Verde e Resiliência Climática',
        passageText:
          'Diante da intensificação de eventos climáticos extremos, urbanistas contemporâneos defendem a substituição gradual do concreto impermeável por soluções baseadas na natureza, como parques alagáveis, jardins de chuva e corredores arborizados. Embora o investimento inicial pareça elevado, estudos demonstram que tais intervenções reduzem drasticamente os custos com drenagem emergencial e mitigam ilhas de calor urbanas.',
        prompt: 'No contexto do parágrafo, o verbo "mitigam" pode ser substituído, sem perda de sentido, por:',
        options: [
          'agravam',
          'atenuam',
          'multiplicam',
          'ignoram',
        ],
        correctIndex: 1,
        explanation:
          '"Mitigar" significa suavizar, diminuir ou atenuar os efeitos negativos das ilhas de calor.',
      },
      {
        id: 'celpe-4-q3',
        section: 'listening',
        audioText:
          'Em audiência pública realizada hoje na Assembleia Legislativa, representantes de cooperativas de reciclagem ressaltaram que a coleta seletiva só alcançará escala satisfatória quando houver remuneração justa pelo serviço ambiental prestado pelos catadores, aliada a campanhas contínuas de separação correta nas residências.',
        audioPlaysLimit: 2,
        prompt: 'Segundo os representantes das cooperativas, o que é indispensável para ampliar a coleta seletiva?',
        options: [
          'A privatização imediata de todos os aterros sanitários.',
          'Remuneração justa aos catadores combinada com educação ambiental residencial.',
          'A proibição de embalagens recicláveis no comércio varejista.',
          'A transferência da coleta exclusivamente para empresas estrangeiras.',
        ],
        correctIndex: 1,
        explanation:
          'O áudio aponta duas condições: remuneração justa pelo serviço ambiental dos catadores e campanhas contínuas de separação nas residências.',
      },
      {
        id: 'celpe-4-q4',
        section: 'listening',
        audioText:
          'Comentário editorial: Ao analisarmos a transição energética na América Latina, seria ingênuo supor que a simples instalação de usinas solares resolva desigualdades históricas. Sem políticas de capacitação local e proteção às comunidades tradicionais, corre-se o risco de reproduzir antigos modelos extrativistas sob um rótulo sustentável.',
        audioPlaysLimit: 2,
        prompt: 'Que alerta o comentarista faz sobre a transição energética na América Latina?',
        options: [
          'A energia solar não tem potencial técnico na região.',
          'Sem inclusão local e proteção social, projetos verdes podem repetir desigualdades antigas.',
          'As comunidades tradicionais rejeitam qualquer tipo de eletricidade.',
          'O custo dos painéis solares impede o desenvolvimento industrial europeu.',
        ],
        correctIndex: 1,
        explanation:
          'O editorial alerta que, sem capacitação local e proteção às comunidades tradicionais, pode-se reproduzir modelos extrativistas sob rótulo sustentável.',
      },
      {
        id: 'celpe-4-q5',
        section: 'language_use',
        prompt: 'Assinale a opção que preenche corretamente a lacuna segundo a norma culta: "Se o conselho ___ os estudos de impacto ambiental no prazo previsto, a obra já teria sido licenciada."',
        options: [
          'tivesse apreciado',
          'apreciaria',
          'aprecie',
          'houver apreciado',
        ],
        correctIndex: 0,
        explanation:
          'Condicional irreal no passado exige mais-que-perfeito composto do subjuntivo ("tivesse apreciado") em correlação com "teria sido licenciada".',
      },
      {
        id: 'celpe-4-q6',
        section: 'language_use',
        prompt: 'Em qual alternativa a concordância verbal com o verbo "haver" ou "tratar-se" está rigorosamente correta?',
        options: [
          'Devem haver alternativas viáveis para a descarbonização do setor.',
          'Tratavam-se de medidas emergenciais previstas no decreto.',
          'Houve avanços expressivos, conquanto persistam entraves regulatórios.',
          'Fazem décadas que o acordo climático vem sendo renegociado.',
        ],
        correctIndex: 2,
        explanation:
          '"Haver" no sentido de existir é impessoal ("Houve avanços"), e "conquanto" rege corretamente o subjuntivo ("persistam").',
      },
    ],
    writingTask: {
      prompt:
        'Em resposta a um edital de consulta pública municipal sobre adaptação climática, redija uma carta aberta (160 a 220 palavras) dirigida ao Conselho Municipal de Meio Ambiente. Analise a vulnerabilidade das áreas urbanas periféricas às enchentes e defenda a criação de um fundo participativo voltado à infraestrutura verde.',
      minWords: 140,
      rubricCriteria: [
        'Registro culto, impessoal e persuasivo próprio de carta aberta institucional',
        'Articulação sofisticada entre justiça socioambiental e políticas urbanas',
        'Domínio de períodos complexos, subjuntivo, crase e colocação pronominal',
        'Proposta clara de financiamento e participação comunitária',
      ],
      expectedKeywords: ['resiliência', 'infraestrutura', 'vulnerabilidade', 'participativo', 'conquanto'],
      modelAnswer:
        'Ao Conselho Municipal de Meio Ambiente,\n\nDiante da recorrência de chuvas extremas que atingem nosso município, vimos manifestar apoio à inclusão de critérios de justiça socioambiental no Plano de Adaptação Climática. É notório que as regiões periféricas sofrem de maneira desproporcional com enchentes e deslizamentos, não apenas por fatores topográficos, mas sobretudo pela histórica carência de saneamento e cobertura vegetal.\n\nConquanto obras de macrodrenagem sejam frequentemente priorizadas, evidências técnicas demonstram que soluções baseadas na natureza — tais como parques lineares, recuperação de nascentes e pavimentação permeável — ampliam a resiliência urbana com menor impacto fiscal. Todavia, para que essas intervenções não se restrinjam às áreas centrais, torna-se imperativo instituir um fundo municipal de gestão participativa.\n\nPor meio desse mecanismo, associações de moradores e especialistas locais poderiam definir prioridades em cada subprefeitura, garantindo transparência na aplicação dos recursos. Investir em infraestrutura verde nos bairros mais vulneráveis não é apenas uma medida ecológica, mas um compromisso inadiável com a dignidade urbana.\n\nRespeitosamente,\nColetivo Cidades Sustentáveis',
    },
    speakingTask: {
      title: 'CELPE-Bras Interação Oral — Políticas Públicas e Sustentabilidade',
      instructionsPt:
        'Sustente posições críticas com vocabulário preciso, nuances modais e exemplificação pertinente ao contexto lusófono ou global.',
      parts: [
        {
          id: 'celpe-4-sp1',
          partLabel: 'Parte 1 — Diagnóstico Socioambiental',
          prepSeconds: 20,
          speakSeconds: 60,
          prompt:
            'Qual é hoje o maior desafio ambiental enfrentado pela sua região e de que forma ele afeta o cotidiano da população?',
          bulletPoints: [
            'Caracterização do problema (água, ar, resíduos ou clima)',
            'Grupos sociais mais impactados',
            'Iniciativas já existentes',
          ],
          evaluationCriteria: [
            'Precisão terminológica e fluência espontânea',
            'Uso de expressões de causa e impacto',
            'Naturalidade prosódica',
          ],
        },
        {
          id: 'celpe-4-sp2',
          partLabel: 'Parte 2 — Elemento Provocador (Charge sobre Responsabilidade Compartilhada)',
          prepSeconds: 30,
          speakSeconds: 90,
          prompt:
            'Imagine uma charge em que um cidadão separa cuidadosamente o lixo reciclável em casa, enquanto ao fundo uma fábrica despeja resíduos sem tratamento no rio. Comente a crítica social implícita nessa imagem.',
          bulletPoints: [
            'Desproporção entre ação individual e responsabilidade corporativa/estatal',
            'Importância de políticas de fiscalização',
            'Como evitar o ceticismo sem isentar grandes poluidores',
          ],
          evaluationCriteria: [
            'Leitura inferencial e crítica de ironia/charge',
            'Uso de orações concessivas e condicionais complexas',
            'Coesão argumentativa de nível C1',
          ],
        },
        {
          id: 'celpe-4-sp3',
          partLabel: 'Parte 3 — Síntese e Proposição de Políticas',
          prepSeconds: 20,
          speakSeconds: 90,
          prompt:
            'Como conciliar crescimento econômico, geração de empregos e preservação ambiental em países em desenvolvimento? Apresente critérios concretos.',
          bulletPoints: [
            'Bioeconomia e inovação tecnológica',
            'Incentivos fiscais para práticas limpas',
            'Papel da cooperação internacional',
          ],
          evaluationCriteria: [
            'Sofisticação sintática e lexical (C1)',
            'Capacidade de ponderar interesses divergentes',
            'Clareza conclusiva',
          ],
        },
      ],
    },
  },
];
