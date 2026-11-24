import type { VocabExampleFixMap, VocabExpansionTuple } from './types';

export const VOCAB_EXP_FR: VocabExpansionTuple[] = [
  // ======================== A1 ========================
  // fr-a1-1: Bonjour! Cumprimentos, Tu vs. Vous & Cortesia (existing: Bonjour, Enchanté(e), Bonne journée)
  ['fr-a1-1', 'Bonsoir', '/bɔ̃.swaʁ/', 'Boa noite (ao chegar)', 'Expressão', 'Bonsoir madame, vous avez réservé une table ?', 'Boa noite, senhora, a senhora reservou uma mesa?'],
  ['fr-a1-1', 'S’il vous plaît', '/sil vu plɛ/', 'Por favor (formal)', 'Expressão', 'Un café allongé, s’il vous plaît.', 'Um café longo, por favor.'],
  ['fr-a1-1', 'À bientôt', '/a bjɛ̃.to/', 'Até breve', 'Expressão', 'Merci pour votre aide et à bientôt !', 'Obrigado pela ajuda e até breve!'],

  // fr-a1-2: No Bistrô: Pedidos com "Je voudrais..." (existing: Je voudrais, L’addition, À emporter)
  ['fr-a1-2', 'Une carafe d’eau', '/yn ka.ʁaf do/', 'Uma jarra de água (gratuita)', 'Substantivo', 'Nous voudrions une carafe d’eau avec le repas.', 'Gostaríamos de uma jarra de água com a refeição.'],
  ['fr-a1-2', 'Sur place', '/syʁ plas/', 'Para comer aqui', 'Expressão', 'Ce sera sur place ou à emporter ?', 'Vai ser para comer aqui ou para viagem?'],
  ['fr-a1-2', 'Un croissant', '/œ̃ kʁwa.sɑ̃/', 'Um croissant', 'Substantivo', 'Je prends un croissant chaud et un thé vert.', 'Vou querer um croissant quentinho e um chá verde.'],

  // fr-a1-3: Números, Horas & Rotina Diária (existing: Quatre-vingts, La gare, Se réveiller)
  ['fr-a1-3', 'Soixante-dix', '/swa.sɑ̃t.dis/', 'Setenta (70)', 'Número', 'Le billet de train coûte soixante-dix euros.', 'A passagem de trem custa setenta euros.'],
  ['fr-a1-3', 'Il est quelle heure ?', '/i.lɛ kɛl œʁ/', 'Que horas são?', 'Expressão', 'Excusez-moi, il est quelle heure exactement ?', 'Com licença, que horas são exatamente?'],
  ['fr-a1-3', 'Se coucher', '/sə ku.ʃe/', 'Ir dormir / deitar-se', 'Verbo', 'En semaine, je me couche vers vingt-trois heures.', 'Durante a semana, eu me deito por volta das 23h.'],

  // fr-a1-4: Na Cidade: Direções & Metrô Parisiense (existing: Tout droit, À gauche / À droite, À pied)
  ['fr-a1-4', 'Le carrefour', '/lə kaʁ.fuʁ/', 'O cruzamento', 'Substantivo', 'Tournez à droite juste après le grand carrefour.', 'Vire à direita logo depois do cruzamento grande.'],
  ['fr-a1-4', 'En face de', '/ɑ̃ fas də/', 'Em frente a', 'Locução', 'La boulangerie se trouve en face de la station.', 'A padaria fica em frente à estação.'],
  ['fr-a1-4', 'Le plan de métro', '/lə plɑ̃ də me.tʁo/', 'O mapa do metrô', 'Substantivo', 'Regardons le plan de métro pour choisir la bonne ligne.', 'Vamos olhar o mapa do metrô para escolher a linha certa.'],

  // fr-a1-5: Artigos Partitivos (Du, De la, Des) & Negação (existing: Du / De la / Des, Pas de, Le fromage)
  ['fr-a1-5', 'De l’eau', '/də lo/', 'Água (partitivo)', 'Locução', 'Je bois de l’eau fraîche après le sport.', 'Eu bebo água fresca depois do esporte.'],
  ['fr-a1-5', 'Du pain', '/dy pɛ̃/', 'Pão (partitivo)', 'Substantivo', 'Tu achètes du pain pour le dîner de ce soir ?', 'Você vai comprar pão para o jantar de hoje à noite?'],
  ['fr-a1-5', 'Il n’y a plus de', '/il nja ply də/', 'Não há mais (de)', 'Expressão', 'Désolé, il n’y a plus de tarte aux pommes.', 'Desculpe, não há mais torta de maçã.'],

  // fr-a1-6: Família, Rotina Diária & Horas (existing: Famille, Sœur, Déjeuner)
  ['fr-a1-6', 'Le frère', '/lə fʁɛʁ/', 'O irmão', 'Substantivo', 'Mon frère habite à Lyon avec sa femme.', 'Meu irmão mora em Lyon com a esposa dele.'],
  ['fr-a1-6', 'Les parents', '/le pa.ʁɑ̃/', 'Os pais', 'Substantivo', 'Le dimanche, je rends visite à mes parents.', 'Aos domingos, eu visito meus pais.'],
  ['fr-a1-6', 'Le petit-déjeuner', '/lə pə.ti de.ʒœ.ne/', 'O café da manhã', 'Substantivo', 'Je prends mon petit-déjeuner à sept heures et demie.', 'Eu tomo meu café da manhã às sete e meia.'],

  // fr-a1-7: Compras, Roupas, Cores & Preços (existing: Veste, Chaussures, Carte)
  ['fr-a1-7', 'Ça coûte combien ?', '/sa kut kɔ̃.bjɛ̃/', 'Quanto custa isso?', 'Expressão', 'Pardon madame, ce pull bleu, ça coûte combien ?', 'Com licença, senhora, quanto custa este suéter azul?'],
  ['fr-a1-7', 'En espèces', '/ɑ̃.n‿ɛs.pɛs/', 'Em dinheiro (espécie)', 'Locução', 'Je préfère payer en espèces aujourd’hui.', 'Prefiro pagar em dinheiro hoje.'],
  ['fr-a1-7', 'Le pantalon', '/lə pɑ̃.ta.lɔ̃/', 'A calça', 'Substantivo', 'Ce pantalon noir est très confortable.', 'Esta calça preta é muito confortável.'],

  // fr-a1-8: Clima, Estações do Ano & Previsão do Tempo (existing: Il fait beau, Il pleut, Le printemps)
  ['fr-a1-8', 'Il fait froid', '/il fɛ fʁwa/', 'Está frio', 'Expressão', 'Prends ton manteau, il fait froid ce matin.', 'Pegue seu casaco, está frio esta manhã.'],
  ['fr-a1-8', 'L’été', '/le.te/', 'O verão', 'Substantivo', 'C’est bientôt l’été, les journées sont longues et ensoleillées.', 'Logo é verão, os dias estão longos e ensolarados.'],
  ['fr-a1-8', 'Le parapluie', '/lə pa.ʁa.plɥi/', 'O guarda-chuva', 'Substantivo', 'N’oublie pas ton parapluie, le ciel est gris.', 'Não se esqueça do guarda-chuva, o céu está cinza.'],

  // fr-a1-9: Hobbies, Esportes & Gostos (existing: Les loisirs, La randonnée, Jouer de)
  ['fr-a1-9', 'La natation', '/la na.ta.sjɔ̃/', 'A natação', 'Substantivo', 'Elle fait de la natation deux fois par semaine.', 'Ela faz natação duas vezes por semana.'],
  ['fr-a1-9', 'Je préfère', '/ʒə pʁe.fɛʁ/', 'Eu prefiro', 'Verbo', 'Je préfère lire un roman plutôt que regarder la télé.', 'Eu prefiro ler um romance a assistir à TV.'],
  ['fr-a1-9', 'Le cinéma', '/lə si.ne.ma/', 'O cinema', 'Substantivo', 'On va au cinéma samedi soir ?', 'Vamos ao cinema sábado à noite?'],

  // fr-a1-10: Alfabeto, Nacionalidades & Profissões (existing: Épeler, Le métier, Brésilien(ne))
  ['fr-a1-10', 'La nationalité', '/la na.sjɔ.na.li.te/', 'A nacionalidade', 'Substantivo', 'Quelle est votre nationalité, s’il vous plaît ?', 'Qual é a sua nacionalidade, por favor?'],
  ['fr-a1-10', 'Ingénieur', '/ɛ̃.ʒe.njœʁ/', 'Engenheiro(a)', 'Substantivo', 'Il est ingénieur dans une entreprise à Toulouse.', 'Ele é engenheiro em uma empresa em Toulouse.'],
  ['fr-a1-10', 'Le prénom', '/lə pʁe.nɔ̃/', 'O primeiro nome', 'Substantivo', 'Comment s’écrit votre prénom ?', 'Como se escreve o seu primeiro nome?'],

  // fr-v4-a1-1: Supermercado & Queijaria (existing: Fromagerie, Un morceau, Le ticket de caisse)
  ['fr-v4-a1-1', 'La caisse', '/la kɛs/', 'O caixa (do supermercado)', 'Substantivo', 'Il y a peu de monde à la caisse numéro trois.', 'Há pouca gente no caixa número três.'],
  ['fr-v4-a1-1', 'Un panier', '/œ̃ pa.nje/', 'Uma cestinha de compras', 'Substantivo', 'Je prends juste un panier, j’ai peu d’articles.', 'Vou pegar só uma cestinha, tenho poucos itens.'],
  ['fr-v4-a1-1', 'Peser', '/pə.ze/', 'Pesar', 'Verbo', 'Il faut peser les pommes avant de passer en caisse.', 'É preciso pesar as maçãs antes de passar no caixa.'],

  // fr-v4-a1-2: Farmácia & Pequenos Males (existing: Un comprimé, La fièvre, Une pharmacie)
  ['fr-v4-a1-2', 'Avoir mal à la tête', '/a.vwaʁ mal a la tɛt/', 'Estar com dor de cabeça', 'Expressão', 'J’ai mal à la tête depuis ce matin.', 'Estou com dor de cabeça desde hoje de manhã.'],
  ['fr-v4-a1-2', 'Le sirop', '/lə si.ʁo/', 'O xarope', 'Substantivo', 'Le pharmacien m’a conseillé ce sirop contre la toux.', 'O farmacêutico me recomendou este xarope para a tosse.'],
  ['fr-v4-a1-2', 'Un pansement', '/œ̃ pɑ̃s.mɑ̃/', 'Um curativo / Band-Aid', 'Substantivo', 'Vous avez un pansement pour une petite coupure ?', 'Vocês têm um curativo para um pequeno corte?'],

  // fr-v4-a1-3: Metrô, SNCF & Bilhetes (existing: Un aller-retour, Le quai, La correspondance)
  ['fr-v4-a1-3', 'Un aller simple', '/œ̃.n‿a.le sɛ̃pl/', 'Uma passagem só de ida', 'Substantivo', 'Je voudrais un aller simple pour Marseille, s’il vous plaît.', 'Eu gostaria de uma passagem só de ida para Marselha, por favor.'],
  ['fr-v4-a1-3', 'Composter', '/kɔ̃.pɔs.te/', 'Validar (o bilhete)', 'Verbo', 'N’oubliez pas de composter votre billet avant de monter.', 'Não se esqueça de validar seu bilhete antes de embarcar.'],
  ['fr-v4-a1-3', 'La voie', '/la vwa/', 'A plataforma / via', 'Substantivo', 'Le TGV pour Bordeaux part de la voie quatre.', 'O TGV para Bordeaux parte da plataforma quatro.'],

  // fr-v4-a1-4: Hotel & Senha do Wi-Fi (existing: La réservation, Le mot de passe, La clé)
  ['fr-v4-a1-4', 'La réception', '/la ʁe.sɛp.sjɔ̃/', 'A recepção', 'Substantivo', 'La réception est ouverte vingt-quatre heures sur vingt-quatre.', 'A recepção fica aberta vinte e quatro horas por dia.'],
  ['fr-v4-a1-4', 'La chambre', '/la ʃɑ̃bʁ/', 'O quarto', 'Substantivo', 'Votre chambre est prête au deuxième étage.', 'O seu quarto está pronto no segundo andar.'],
  ['fr-v4-a1-4', 'Le réseau Wi-Fi', '/lə ʁe.zo wi.fi/', 'A rede Wi-Fi', 'Substantivo', 'Quel est le nom du réseau Wi-Fi de l’hôtel ?', 'Qual é o nome da rede Wi-Fi do hotel?'],

  // fr-v4-a1-5: Aeroporto & Embarque (existing: La porte d’embarquement, Le passeport, La valise)
  ['fr-v4-a1-5', 'La carte d’embarquement', '/la kaʁt dɑ̃.baʁ.kə.mɑ̃/', 'O cartão de embarque', 'Substantivo', 'Préparez votre carte d’embarquement pour le contrôle.', 'Prepare seu cartão de embarque para a conferência.'],
  ['fr-v4-a1-5', 'Le bagage à main', '/lə ba.ɡaʒ a mɛ̃/', 'A bagagem de mão', 'Substantivo', 'Ce sac compte comme un bagage à main en cabine.', 'Esta bolsa conta como bagagem de mão na cabine.'],
  ['fr-v4-a1-5', 'L’enregistrement', '/lɑ̃.ʁə.ʒis.tʁə.mɑ̃/', 'O check-in (despacho)', 'Substantivo', 'L’enregistrement des bagages ferme dans vingt minutes.', 'O despacho das bagagens fecha em vinte minutos.'],

  // fr-v4-a1-6: Roupas, Tamanhos & Provador (existing: La taille, La pointure, Essayer)
  ['fr-v4-a1-6', 'La cabine d’essayage', '/la ka.bin dɛ.sɛ.jaʒ/', 'O provador', 'Substantivo', 'La cabine d’essayage est juste au fond à gauche.', 'O provador fica bem no fundo à esquerda.'],
  ['fr-v4-a1-6', 'Échanger', '/e.ʃɑ̃.ʒe/', 'Trocar (produto)', 'Verbo', 'Est-ce que je peux échanger ce pull si la taille ne va pas ?', 'Posso trocar este suéter se o tamanho não servir?'],
  ['fr-v4-a1-6', 'Trop grand', '/tʁo ɡʁɑ̃/', 'Grande demais', 'Adjetivo', 'Cette chemise est un peu trop grande pour moi.', 'Esta camisa está um pouco grande demais para mim.'],

  // fr-v4-a1-7: Emergências (15 / 17 / 18) (existing: Une urgence, Les pompiers, Une ambulance)
  ['fr-v4-a1-7', 'Au secours !', '/o skuʁ/', 'Socorro!', 'Expressão', 'Au secours, quelqu’un vient de tomber dans l’escalier !', 'Socorro, alguém acabou de cair na escada!'],
  ['fr-v4-a1-7', 'La police', '/la pɔ.lis/', 'A polícia', 'Substantivo', 'Il faut appeler la police en composant le dix-sept.', 'É preciso ligar para a polícia discando o 17.'],
  ['fr-v4-a1-7', 'L’adresse', '/la.dʁɛs/', 'O endereço', 'Substantivo', 'Donnez l’adresse exacte aux secours au téléphone.', 'Informe o endereço exato aos socorristas pelo telefone.'],

  // fr-v4-a1-8: Banco & Cartão Bancário (existing: Le distributeur, Retirer de l’argent, Le code secret)
  ['fr-v4-a1-8', 'La carte bancaire', '/la kaʁt bɑ̃.kɛʁ/', 'O cartão bancário', 'Substantivo', 'Ma carte bancaire a été bloquée ce matin.', 'Meu cartão bancário foi bloqueado hoje de manhã.'],
  ['fr-v4-a1-8', 'Le guichet', '/lə ɡi.ʃɛ/', 'O guichê / balcão', 'Substantivo', 'Adressez-vous au guichet pour ouvrir un compte.', 'Dirija-se ao guichê para abrir uma conta.'],
  ['fr-v4-a1-8', 'Les frais bancaires', '/le fʁɛ bɑ̃.kɛʁ/', 'As tarifas bancárias', 'Substantivo', 'Quels sont les frais bancaires pour un virement international ?', 'Quais são as tarifas bancárias para uma transferência internacional?'],

  // fr-v4-a1-9: Cabeleireiro & Serviços do Dia a Dia (existing: Le coiffeur, Prendre rendez-vous, Les pointes)
  ['fr-v4-a1-9', 'Couper court', '/ku.pe kuʁ/', 'Cortar curto', 'Expressão', 'Je ne veux pas couper court, juste rafraîchir la coupe.', 'Não quero cortar curto, só dar uma aparada no corte.'],
  ['fr-v4-a1-9', 'Le shampoing', '/lə ʃɑ̃.pwɛ̃/', 'O xampu / lavagem', 'Substantivo', 'Le shampoing est inclus dans le tarif de la coupe.', 'A lavagem com xampu está incluída no preço do corte.'],
  ['fr-v4-a1-9', 'Le pressing', '/lə pʁɛ.siŋ/', 'A lavanderia (a seco)', 'Substantivo', 'Je dois déposer mon manteau au pressing avant samedi.', 'Preciso deixar meu casaco na lavanderia antes de sábado.'],

  // fr-v4-a1-10: Compromissos & Horários (existing: Un rendez-vous, Être disponible, En retard)
  ['fr-v4-a1-10', 'À l’heure', '/a lœʁ/', 'Na hora / pontual', 'Locução', 'Le train arrive toujours à l’heure le matin.', 'O trem sempre chega na hora de manhã.'],
  ['fr-v4-a1-10', 'Reporter', '/ʁə.pɔʁ.te/', 'Adiar / remarcar', 'Verbo', 'Pouvons-nous reporter notre réunion à jeudi après-midi ?', 'Podemos adiar nossa reunião para quinta-feira à tarde?'],
  ['fr-v4-a1-10', 'Confirmer', '/kɔ̃.fiʁ.me/', 'Confirmar', 'Verbo', 'Je vous appelle pour confirmer notre horaire de demain.', 'Estou ligando para confirmar nosso horário de amanhã.'],

  // ======================== A2 ========================
  // fr-a2-1: Passé Composé: Avoir vs. Être (existing: Hier, Je suis allé(e), J’ai fait)
  ['fr-a2-1', 'Je suis parti(e)', '/ʒə sɥi paʁ.ti/', 'Eu parti / saí', 'Verbo', 'Je suis parti tôt pour éviter les embouteillages.', 'Eu saí cedo para evitar o trânsito.'],
  ['fr-a2-1', 'Il est arrivé', '/i.lɛ.t‿a.ʁi.ve/', 'Ele chegou', 'Verbo', 'Mon collègue est arrivé à Lyon hier soir.', 'Meu colega chegou a Lyon ontem à noite.'],
  ['fr-a2-1', 'Nous avons vu', '/nu.z‿a.vɔ̃ vy/', 'Nós vimos', 'Verbo', 'Nous avons vu une exposition magnifique au musée.', 'Nós vimos uma exposição magnífica no museu.'],

  // fr-a2-2: Imparfait vs. Passé Composé: Memórias (existing: C’était, Il y avait, À l’époque)
  ['fr-a2-2', 'Autrefois', '/o.tʁə.fwa/', 'Antigamente', 'Advérbio', 'Autrefois, ce quartier était beaucoup plus calme.', 'Antigamente, este bairro era muito mais calmo.'],
  ['fr-a2-2', 'D’habitude', '/da.bi.tyd/', 'Costumeiramente / normalmente', 'Advérbio', 'Quand j’étais petit, d’habitude je jouais dans le jardin.', 'Quando eu era pequeno, normalmente eu brincava no jardim.'],
  ['fr-a2-2', 'Soudain', '/su.dɛ̃/', 'De repente', 'Advérbio', 'Il pleuvait fort quand soudain le soleil est revenu.', 'Estava chovendo forte quando de repente o sol voltou.'],

  // fr-a2-3: Futur Proche & Futur Simple: Planos (existing: J’irai (aller), J’aurai (avoir), Avec aisance)
  ['fr-a2-3', 'Je vais partir', '/ʒə vɛ paʁ.tiʁ/', 'Eu vou partir / sair', 'Expressão', 'Je vais partir en vacances dès vendredi soir.', 'Eu vou sair de férias já na sexta-feira à noite.'],
  ['fr-a2-3', 'Il fera beau', '/il fə.ʁa bo/', 'Vai fazer tempo bom', 'Expressão', 'Selon la météo, il fera beau tout le week-end.', 'Segundo a previsão do tempo, fará sol o fim de semana inteiro.'],
  ['fr-a2-3', 'L’année prochaine', '/la.ne pʁɔ.ʃɛn/', 'No próximo ano', 'Locução', 'L’année prochaine, nous déménagerons à Nantes.', 'No próximo ano, vamos nos mudar para Nantes.'],

  // fr-a2-4: Pronomes Y e EN (existing: J’y vais, J’en veux, Dès que)
  ['fr-a2-4', 'J’y pense', '/ʒi pɑ̃s/', 'Eu penso nisso', 'Expressão', 'Ne t’inquiète pas, j’y pense tous les jours.', 'Não se preocupe, eu penso nisso todos os dias.'],
  ['fr-a2-4', 'Il y en a', '/il jɑ̃.n‿a/', 'Há / tem (disso)', 'Expressão', 'Des pommes ? Oui, il y en a encore trois dans le panier.', 'Maçãs? Sim, ainda tem três na cesta.'],
  ['fr-a2-4', 'Je m’en occupe', '/ʒə mɑ̃.n‿ɔ.kyp/', 'Eu cuido disso', 'Expressão', 'Laisse ce dossier ici, je m’en occupe tout de suite.', 'Deixe esta pasta aqui, eu cuido disso imediatamente.'],

  // fr-a2-5: Gastronomia, Bistrô & Culinária Francesa (existing: Addition, Entrée, Saumon)
  ['fr-a2-5', 'Le plat principal', '/lə pla pʁɛ̃.si.pal/', 'O prato principal', 'Substantivo', 'Comme plat principal, je vais prendre le magret de canard.', 'Como prato principal, vou pedir o peito de pato.'],
  ['fr-a2-5', 'À point', '/a pwɛ̃/', 'Ao ponto (carne)', 'Locução', 'Comment voulez-vous votre steak ? — À point, merci.', 'Como o senhor quer o seu bife? — Ao ponto, obrigado.'],
  ['fr-a2-5', 'Le dessert', '/lə de.sɛʁ/', 'A sobremesa', 'Substantivo', 'Vous désirez un dessert ou un café ?', 'O senhor deseja uma sobremesa ou um café?'],

  // fr-a2-6: Saúde, Corpo & Farmácia na França (existing: Médecin, Ordonnance, Fièvre)
  ['fr-a2-6', 'La toux', '/la tu/', 'A tosse', 'Substantivo', 'Cette toux sèche m’empêche de bien dormir.', 'Esta tosse seca está me impedindo de dormir bem.'],
  ['fr-a2-6', 'Se reposer', '/sə ʁə.po.ze/', 'Descansar', 'Verbo', 'Le docteur m’a dit de me reposer pendant trois jours.', 'O médico me disse para descansar durante três dias.'],
  ['fr-a2-6', 'Prendre rendez-vous', '/pʁɑ̃dʁ ʁɑ̃.de.vu/', 'Marcar consulta / horário', 'Expressão', 'Il faut prendre rendez-vous en ligne avant de venir.', 'É preciso marcar consulta online antes de vir.'],

  // fr-a2-7: Moradia, Aluguel & Vizinhança (existing: Loyer, Quartier, Meublé)
  ['fr-a2-7', 'Les charges comprises', '/le ʃaʁʒ kɔ̃.pʁiz/', 'Com encargos / condomínio incluído', 'Locução', 'Cet appartement coûte huit cents euros, charges comprises.', 'Este apartamento custa oitocentos euros, com condomínio incluído.'],
  ['fr-a2-7', 'Le propriétaire', '/lə pʁɔ.pʁi.e.tɛʁ/', 'O proprietário', 'Substantivo', 'Le propriétaire va réparer le chauffage cette semaine.', 'O proprietário vai consertar o aquecedor esta semana.'],
  ['fr-a2-7', 'Lumineux', '/ly.mi.nø/', 'Iluminado / claro', 'Adjetivo', 'Le salon est très lumineux grâce aux grandes fenêtres.', 'A sala é muito iluminada graças às janelas grandes.'],

  // fr-a2-8: Trens (TGV), Aeroporto & Conexões (existing: Quai, Correspondance, Retard)
  ['fr-a2-8', 'Le billet électronique', '/lə bi.jɛ e.lɛk.tʁɔ.nik/', 'O bilhete eletrônico', 'Substantivo', 'Montrez votre billet électronique sur votre téléphone.', 'Mostre seu bilhete eletrônico no seu celular.'],
  ['fr-a2-8', 'Rater le train', '/ʁa.te lə tʁɛ̃/', 'Perder o trem', 'Expressão', 'Dépêchons-nous, sinon nous allons rater le train !', 'Vamos nos apressar, senão vamos perder o trem!'],
  ['fr-a2-8', 'La consigne', '/la kɔ̃.siɲ/', 'O guarda-volumes', 'Substantivo', 'On peut laisser nos sacs à la consigne de la gare.', 'Podemos deixar nossas bolsas no guarda-volumes da estação.'],

  // fr-a2-9: Planos de Viagem, Previsão & Comparações (existing: Meilleur(e), Aussi ... que, Tandis que)
  ['fr-a2-9', 'Moins cher que', '/mwɛ̃ ʃɛʁ kə/', 'Mais barato que', 'Locução', 'Le bus est souvent moins cher que le train.', 'O ônibus costuma ser mais barato que o trem.'],
  ['fr-a2-9', 'Plus rapide que', '/ply ʁa.pid kə/', 'Mais rápido que', 'Locução', 'Le TGV est bien plus rapide que la voiture.', 'O TGV é bem mais rápido que o carro.'],
  ['fr-a2-9', 'L’itinéraire', '/li.ti.ne.ʁɛʁ/', 'O itinerário / roteiro', 'Substantivo', 'Nous avons préparé l’itinéraire de notre voyage en Bretagne.', 'Nós preparamos o roteiro da nossa viagem pela Bretanha.'],

  // fr-a2-10: Serviços, Banco, Correios & Documentos (existing: Un colis, Un timbre, Pièce d’identité)
  ['fr-a2-10', 'Un justificatif', '/œ̃ ʒys.ti.fi.ka.tif/', 'Um comprovante', 'Substantivo', 'Apportez un justificatif de domicile pour votre dossier.', 'Traga um comprovante de residência para o seu processo.'],
  ['fr-a2-10', 'Un formulaire', '/œ̃ fɔʁ.my.lɛʁ/', 'Um formulário', 'Substantivo', 'Veuillez remplir ce formulaire et le signer en bas.', 'Por favor, preencha este formulário e assine embaixo.'],
  ['fr-a2-10', 'Ouvrir un compte', '/u.vʁiʁ œ̃ kɔ̃t/', 'Abrir uma conta', 'Expressão', 'Je souhaite ouvrir un compte courant dans cette agence.', 'Desejo abrir uma conta corrente nesta agência.'],

  // fr-v4-a2-1: Alugar Apartamento & Problemas Domésticos (existing: Le loyer, Tomber en panne, Une fuite d’eau)
  ['fr-v4-a2-1', 'Le chauffage', '/lə ʃo.faʒ/', 'O aquecimento / aquecedor', 'Substantivo', 'Le chauffage ne fonctionne plus dans la chambre.', 'O aquecedor não está mais funcionando no quarto.'],
  ['fr-v4-a2-1', 'La caution', '/la ko.sjɔ̃/', 'O depósito caução', 'Substantivo', 'La caution correspond à un mois de loyer hors charges.', 'O depósito caução corresponde a um mês de aluguel sem encargos.'],
  ['fr-v4-a2-1', 'Le plombier', '/lə plɔ̃.bje/', 'O encanador', 'Substantivo', 'Le plombier passera demain matin pour réparer le robinet.', 'O encanador passará amanhã de manhã para consertar a torneira.'],

  // fr-v4-a2-2: Aluguel de Carro & Pedágios (existing: Le péage, Faire le plein, Le permis de conduire)
  ['fr-v4-a2-2', 'L’assurance tous risques', '/la.sy.ʁɑ̃s tu ʁisk/', 'O seguro total (compreensivo)', 'Substantivo', 'Nous avons choisi l’assurance tous risques pour être tranquilles.', 'Escolhemos o seguro total para ficarmos tranquilos.'],
  ['fr-v4-a2-2', 'Le kilométrage illimité', '/lə ki.lɔ.me.tʁaʒ i.li.mi.te/', 'A quilometragem ilimitada', 'Substantivo', 'Cette offre inclut le kilométrage illimité pendant une semaine.', 'Esta oferta inclui quilometragem ilimitada durante uma semana.'],
  ['fr-v4-a2-2', 'L’autoroute', '/lo.tɔ.ʁut/', 'A rodovia / autoestrada', 'Substantivo', 'L’autoroute entre Paris et Lyon est très fréquentée.', 'A rodovia entre Paris e Lyon é muito movimentada.'],

  // fr-v4-a2-3: Alergias & Restrições no Restaurante (existing: Allergique à, Les ingrédients, Sans gluten)
  ['fr-v4-a2-3', 'Les arachides', '/le.z‿a.ʁa.ʃid/', 'O amendoim', 'Substantivo', 'Ce gâteau contient des arachides ou des noisettes ?', 'Este bolo contém amendoim ou avelãs?'],
  ['fr-v4-a2-3', 'Végétarien(ne)', '/ve.ʒe.ta.ʁjɛ̃/', 'Vegetariano(a)', 'Adjetivo', 'Avez-vous une option végétarienne à la carte ?', 'Vocês têm uma opção vegetariana no cardápio?'],
  ['fr-v4-a2-3', 'Les produits laitiers', '/le pʁɔ.dɥi lɛ.tje/', 'Os laticínios', 'Substantivo', 'Je dois éviter tous les produits laitiers en ce moment.', 'Preciso evitar todos os laticínios no momento.'],

  // fr-v4-a2-4: Bagagem Extraviada no Aeroporto (existing: Le tapis roulant, Une réclamation, L’étiquette)
  ['fr-v4-a2-4', 'Le bureau des objets trouvés', '/lə by.ʁo de.z‿ɔb.ʒɛ tʁu.ve/', 'O setor de achados e perdidos', 'Substantivo', 'Allez au bureau des objets trouvés près de la sortie B.', 'Vá ao setor de achados e perdidos perto da saída B.'],
  ['fr-v4-a2-4', 'Égarer', '/e.ɡa.ʁe/', 'Extraviar / perder', 'Verbo', 'La compagnie aérienne a égaré ma valise lors de l’escale.', 'A companhia aérea extraviou minha mala durante a escala.'],
  ['fr-v4-a2-4', 'Livrer à l’hôtel', '/li.vʁe a lo.tɛl/', 'Entregar no hotel', 'Expressão', 'Pouvez-vous livrer mon bagage à l’hôtel dès qu’il arrive ?', 'Vocês podem entregar minha bagagem no hotel assim que ela chegar?'],

  // fr-v4-a2-5: Correios (La Poste) & Encomendas (existing: Un colis, Un timbre, Le numéro de suivi)
  ['fr-v4-a2-5', 'Une lettre recommandée', '/yn lɛtʁ ʁə.kɔ.mɑ̃.de/', 'Uma carta registrada', 'Substantivo', 'J’envoie une lettre recommandée avec accusé de réception.', 'Vou enviar uma carta registrada com aviso de recebimento.'],
  ['fr-v4-a2-5', 'Affranchir', '/a.fʁɑ̃.ʃiʁ/', 'Selar / franquear', 'Verbo', 'Il faut affranchir cette enveloppe au tarif international.', 'É preciso selar este envelope na tarifa internacional.'],
  ['fr-v4-a2-5', 'L’avis de passage', '/la.vi də pa.saʒ/', 'O aviso de tentativa de entrega', 'Substantivo', 'J’ai trouvé l’avis de passage du facteur dans ma boîte.', 'Encontrei o aviso de tentativa de entrega do carteiro na minha caixa.'],

  // fr-v4-a2-6: Academia & Atividades Físicas (existing: La salle de sport, Sans engagement, Le vestiaire)
  ['fr-v4-a2-6', 'L’abonnement', '/la.bɔn.mɑ̃/', 'A assinatura / mensalidade', 'Substantivo', 'L’abonnement mensuel donne accès à tous les cours collectifs.', 'A mensalidade dá acesso a todas as aulas coletivas.'],
  ['fr-v4-a2-6', 'S’échauffer', '/se.ʃo.fe/', 'Aquecer-se', 'Verbo', 'Il est important de bien s’échauffer avant de courir.', 'É importante aquecer-se bem antes de correr.'],
  ['fr-v4-a2-6', 'Un cours collectif', '/œ̃ kuʁ kɔ.lɛk.tif/', 'Uma aula coletiva', 'Substantivo', 'Je me suis inscrit à un cours collectif de yoga ce soir.', 'Eu me inscrevi em uma aula coletiva de ioga hoje à noite.'],

  // fr-v4-a2-7: Vizinhos & Convivência no Prédio (existing: Le voisin / La voisine, Le bruit, Le gardien)
  ['fr-v4-a2-7', 'Le palier', '/lə pa.lje/', 'O hall / patamar do andar', 'Substantivo', 'Nous sommes voisins sur le même palier au troisième étage.', 'Somos vizinhos no mesmo andar, no terceiro pavimento.'],
  ['fr-v4-a2-7', 'Les parties communes', '/le paʁ.ti kɔ.myn/', 'As áreas comuns', 'Substantivo', 'Merci de garder les parties communes propres et dégagées.', 'Por favor, mantenham as áreas comuns limpas e desobstruídas.'],
  ['fr-v4-a2-7', 'Baisser le volume', '/bɛ.se lə vɔ.lym/', 'Abaixar o volume', 'Expressão', 'Pourriez-vous baisser le volume après vingt-deux heures ?', 'Vocês poderiam abaixar o volume depois das vinte e duas horas?'],

  // fr-v4-a2-8: Atendimento ao Cliente por Telefone (existing: Résilier, La facture, Ne quittez pas)
  ['fr-v4-a2-8', 'Le service client', '/lə sɛʁ.vis kli.jɑ̃/', 'O serviço de atendimento ao cliente', 'Substantivo', 'J’ai contacté le service client pour signaler une coupure internet.', 'Entrei em contato com o atendimento ao cliente para relatar uma queda de internet.'],
  ['fr-v4-a2-8', 'Le numéro de contrat', '/lə ny.me.ʁo də kɔ̃.tʁa/', 'O número do contrato', 'Substantivo', 'Pouvez-vous me communiquer votre numéro de contrat ?', 'O senhor pode me informar o seu número de contrato?'],
  ['fr-v4-a2-8', 'Mettre en attente', '/mɛtʁ ɑ̃.n‿a.tɑ̃t/', 'Colocar em espera', 'Expressão', 'Le conseiller va vous mettre en attente pendant deux minutes.', 'O atendente vai colocá-lo em espera por dois minutos.'],

  // fr-v4-a2-9: Feira Livre & Produtos Locais (existing: Le marché, Mûr / Mûre, Avec ceci ?)
  ['fr-v4-a2-9', 'De saison', '/də sɛ.zɔ̃/', 'Da estação', 'Locução', 'Je préfère acheter des légumes de saison au marché.', 'Prefiro comprar legumes da estação na feira.'],
  ['fr-v4-a2-9', 'Une barquette', '/yn baʁ.kɛt/', 'Uma bandeja / caixinha (de frutas)', 'Substantivo', 'Je vais prendre une barquette de fraises bien sucrées.', 'Vou levar uma caixinha de morangos bem docinhos.'],
  ['fr-v4-a2-9', 'Goûter', '/ɡu.te/', 'Provar / experimentar', 'Verbo', 'Vous voulez goûter ce fromage de chèvre artisanal ?', 'O senhor quer provar este queijo de cabra artesanal?'],

  // fr-v4-a2-10: Cozinhando um Prato Francês (existing: Mélanger, À feu doux, Éplucher)
  ['fr-v4-a2-10', 'Couper en dés', '/ku.pe ɑ̃ de/', 'Cortar em cubos', 'Expressão', 'Il faut couper les carottes en dés avant de les faire revenir.', 'É preciso cortar as cenouras em cubos antes de refogá-las.'],
  ['fr-v4-a2-10', 'Une pincée de sel', '/yn pɛ̃.se də sɛl/', 'Uma pitada de sal', 'Substantivo', 'Ajoutez une pincée de sel et du poivre noir.', 'Adicione uma pitada de sal e pimenta-do-reino.'],
  ['fr-v4-a2-10', 'Préchauffer le four', '/pʁe.ʃo.fe lə fuʁ/', 'Preaquecer o forno', 'Expressão', 'Pensez à préchauffer le four à cent quatre-vingts degrés.', 'Lembre-se de preaquecer o forno a cento e oitenta graus.'],

  // ======================== B1 ========================
  // fr-b1-1: Subjonctif Présent: Emoções & Obrigação (existing: Il faut que, Bien que, À voix haute)
  ['fr-b1-1', 'Pour que', '/puʁ kə/', 'Para que (+ subjuntivo)', 'Conector', 'Je t’explique lentement pour que tu comprennes bien.', 'Estou te explicando devagar para que você entenda bem.'],
  ['fr-b1-1', 'Je souhaite que', '/ʒə swɛt kə/', 'Eu desejo que (+ subjuntivo)', 'Expressão', 'Je souhaite que ce projet réussisse pleinement.', 'Desejo que este projeto tenha pleno sucesso.'],
  ['fr-b1-1', 'À condition que', '/a kɔ̃.di.sjɔ̃ kə/', 'Com a condição de que', 'Conector', 'Tu peux sortir à condition que tu finisses tes devoirs.', 'Você pode sair com a condição de que termine suas tarefas.'],

  // fr-b1-2: Pronomes Relativos (Qui, Que, Où, Dont) (existing: Dont, Maîtriser, Être fier de)
  ['fr-b1-2', 'Lequel / Laquelle', '/lə.kɛl/', 'O qual / A qual', 'Pronome', 'C’est une méthode grâce à laquelle on progresse vite.', 'É um método graças ao qual se progride rápido.'],
  ['fr-b1-2', 'Ce qui', '/sə ki/', 'O que (sujeito)', 'Pronome', 'Ce qui me plaît en France, c’est la diversité culturelle.', 'O que me agrada na França é a diversidade cultural.'],
  ['fr-b1-2', 'Ce que', '/sə kə/', 'O que (objeto)', 'Pronome', 'Dis-moi exactement ce que tu as compris de ce texte.', 'Diga-me exatamente o que você entendeu deste texto.'],

  // fr-b1-3: Trabalho, Carreira & E-mails Profissionais (existing: Ci-joint, L’échéance, Cordialement)
  ['fr-b1-3', 'Veuillez trouver', '/vœ.je tʁu.ve/', 'Queira encontrar / segue em anexo', 'Expressão', 'Veuillez trouver ci-joint le compte rendu de la réunion.', 'Queira encontrar em anexo a ata da reunião.'],
  ['fr-b1-3', 'La pièce jointe', '/la pjɛs ʒwɛ̃t/', 'O anexo (de e-mail)', 'Substantivo', 'Oups, j’ai oublié d’ajouter la pièce jointe à mon message.', 'Ops, esqueci de adicionar o anexo à minha mensagem.'],
  ['fr-b1-3', 'Convenir d’un créneau', '/kɔ̃.və.niʁ dœ̃ kʁe.no/', 'Combinar um horário', 'Expressão', 'Pouvons-nous convenir d’un créneau mardi prochain ?', 'Podemos combinar um horário na próxima terça-feira?'],

  // fr-b1-4: Conectores Lógicos & Expressão de Opinião (existing: Cependant, D’ailleurs, Selon moi)
  ['fr-b1-4', 'En effet', '/ɑ̃.n‿e.fɛ/', 'Com efeito / de fato', 'Conector', 'Le projet avance bien ; en effet, l’équipe est très motivée.', 'O projeto avança bem; de fato, a equipe está muito motivada.'],
  ['fr-b1-4', 'Par conséquent', '/paʁ kɔ̃.se.kɑ̃/', 'Por conseguinte / portanto', 'Conector', 'Il a plu toute la nuit ; par conséquent, la route est glissante.', 'Choveu a noite toda; portanto, a estrada está escorregadia.'],
  ['fr-b1-4', 'À mon avis', '/a mɔ̃.n‿a.vi/', 'Na minha opinião', 'Expressão', 'À mon avis, cette solution est la plus réaliste.', 'Na minha opinião, esta solução é a mais realista.'],

  // fr-b1-5: Trabalho, Entrevista & Carreira Francófona (existing: Entretien, Compétence, Défi)
  ['fr-b1-5', 'Le parcours professionnel', '/lə paʁ.kuʁ pʁɔ.fɛ.sjɔ.nɛl/', 'A trajetória profissional', 'Substantivo', 'Parlez-moi de votre parcours professionnel en trois minutes.', 'Fale-me sobre sua trajetória profissional em três minutos.'],
  ['fr-b1-5', 'Les points forts', '/le pwɛ̃ fɔʁ/', 'Os pontos fortes', 'Substantivo', 'Quels sont vos principaux points forts pour ce poste ?', 'Quais são seus principais pontos fortes para esta vaga?'],
  ['fr-b1-5', 'Le télétravail', '/lə te.le.tʁa.vaj/', 'O trabalho remoto', 'Substantivo', 'L’entreprise propose deux jours de télétravail par semaine.', 'A empresa oferece dois dias de trabalho remoto por semana.'],

  // fr-b1-6: Tecnologia, Startups & Trabalho Remoto (existing: Logiciel, Mot de passe, Écran)
  ['fr-b1-6', 'La visioconférence', '/la vi.zjɔ.kɔ̃.fe.ʁɑ̃s/', 'A videoconferência', 'Substantivo', 'Nous avons une visioconférence avec l’équipe de Montréal à quinze heures.', 'Temos uma videoconferência com a equipe de Montreal às 15h.'],
  ['fr-b1-6', 'Le lien', '/lə ljɛ̃/', 'O link', 'Substantivo', 'Je vous envoie le lien de connexion par messagerie.', 'Vou enviar o link de conexão para vocês por mensagem.'],
  ['fr-b1-6', 'La sauvegarde', '/la sov.ɡaʁd/', 'O backup / cópia de segurança', 'Substantivo', 'Faites une sauvegarde de vos fichiers avant de redémarrer.', 'Faça um backup dos seus arquivos antes de reiniciar.'],

  // fr-b1-7: França vs. Québec: Sotaques & Expressões (existing: Courriel, Fin de semaine, Magasiner)
  ['fr-b1-7', 'Le char', '/lə ʃaʁ/', 'O carro (Québec)', 'Substantivo', 'À Montréal, beaucoup de gens disent « mon char » pour parler de leur voiture.', 'Em Montreal, muita gente diz "mon char" para falar do carro.'],
  ['fr-b1-7', 'Bienvenue', '/bjɛ̃.və.ny/', 'De nada (uso no Québec)', 'Expressão', 'Merci beaucoup pour ton aide ! — Bienvenue !', 'Muito obrigado pela sua ajuda! — De nada!'],
  ['fr-b1-7', 'Le dépanneur', '/lə de.pa.nœʁ/', 'A loja de conveniência (Québec)', 'Substantivo', 'Je passe au dépanneur acheter du lait avant de rentrer.', 'Vou passar na loja de conveniência comprar leite antes de voltar.'],

  // fr-b1-8: Ecologia, Reciclagem & Vida Sustentável (existing: Trier les déchets, Gaspiller, Durable)
  ['fr-b1-8', 'Le recyclage', '/lə ʁə.si.klaʒ/', 'A reciclagem', 'Substantivo', 'Le recyclage du verre permet d’économiser beaucoup d’énergie.', 'A reciclagem do vidro permite economizar muita energia.'],
  ['fr-b1-8', 'Les énergies renouvelables', '/le.z‿e.nɛʁ.ʒi ʁə.nu.və.labl/', 'As energias renováveis', 'Substantivo', 'Il faut investir davantage dans les énergies renouvelables.', 'É preciso investir mais nas energias renováveis.'],
  ['fr-b1-8', 'Réduire sa consommation', '/ʁe.dɥiʁ sa kɔ̃.sɔ.ma.sjɔ̃/', 'Reduzir o consumo', 'Expressão', 'Chacun peut réduire sa consommation d’eau au quotidien.', 'Cada um pode reduzir o consumo de água no dia a dia.'],

  // fr-b1-9: Mídia, Leitura & Redes Sociais (existing: Fiable, Partager, Une rumeur)
  ['fr-b1-9', 'Vérifier les sources', '/ve.ʁi.fje le suʁs/', 'Verificar as fontes', 'Expressão', 'Il faut toujours vérifier les sources avant de relayer un article.', 'É preciso sempre verificar as fontes antes de repassar um artigo.'],
  ['fr-b1-9', 'La presse écrite', '/la pʁɛs e.kʁit/', 'A imprensa escrita', 'Substantivo', 'La presse écrite traverse une période de transformation numérique.', 'A imprensa escrita atravessa um período de transformação digital.'],
  ['fr-b1-9', 'Un abonné', '/œ̃.n‿a.bɔ.ne/', 'Um assinante / seguidor', 'Substantivo', 'Chaque abonné reçoit la lettre d’information chaque matin.', 'Cada assinante recebe o boletim informativo todas as manhãs.'],

  // fr-b1-10: Voluntariado, Solidariedade & Projetos Sociais (existing: Bénévole, Soutien, S’intégrer)
  ['fr-b1-10', 'Une association', '/y.n‿a.sɔ.sja.sjɔ̃/', 'Uma associação / ONG', 'Substantivo', 'Elle donne des cours de français dans une association de quartier.', 'Ela dá aulas de francês em uma associação de bairro.'],
  ['fr-b1-10', 'La solidarité', '/la sɔ.li.da.ʁi.te/', 'A solidariedade', 'Substantivo', 'La solidarité entre voisins a été remarquable cet hiver.', 'A solidariedade entre vizinhos foi notável neste inverno.'],
  ['fr-b1-10', 'Donner de son temps', '/dɔ.ne də sɔ̃ tɑ̃/', 'Doar seu tempo', 'Expressão', 'Chacun peut donner de son temps pour aider son quartier.', 'Cada um pode doar seu tempo para ajudar o seu bairro.'],

  // fr-v4-b1-1: Médico Clínico Geral & Receita Médica (existing: L’ordonnance, Le médecin traitant, Un arrêt de travail)
  ['fr-v4-b1-1', 'La carte Vitale', '/la kaʁt vi.tal/', 'O cartão do seguro saúde francês', 'Substantivo', 'N’oubliez pas d’apporter votre carte Vitale à la consultation.', 'Não se esqueça de trazer seu cartão Vitale à consulta.'],
  ['fr-v4-b1-1', 'Une prise de sang', '/yn pʁiz də sɑ̃/', 'Um exame de sangue', 'Substantivo', 'Le médecin m’a prescrit une prise de sang à faire à jeun.', 'O médico me prescreveu um exame de sangue para fazer em jejum.'],
  ['fr-v4-b1-1', 'Les symptômes', '/le sɛ̃p.tom/', 'Os sintomas', 'Substantivo', 'Pouvez-vous me décrire vos symptômes depuis trois jours ?', 'Pode me descrever seus sintomas nos últimos três dias?'],

  // fr-v4-b1-2: Entrevista de Emprego & Salário (existing: Un entretien d’embauche, Le salaire brut, Un CDI)
  ['fr-v4-b1-2', 'La période d’essai', '/la pe.ʁjɔd dɛ.sɛ/', 'O período de experiência', 'Substantivo', 'La période d’essai est de trois mois renouvelables.', 'O período de experiência é de três meses renováveis.'],
  ['fr-v4-b1-2', 'Les prétentions salariales', '/le pʁe.tɑ̃.sjɔ̃ sa.la.ʁjal/', 'A pretensão salarial', 'Substantivo', 'Quelles sont vos prétentions salariales pour ce poste ?', 'Qual é a sua pretensão salarial para esta vaga?'],
  ['fr-v4-b1-2', 'La fiche de poste', '/la fiʃ də pɔst/', 'A descrição da vaga', 'Substantivo', 'J’ai lu attentivement la fiche de poste avant de postuler.', 'Li atentamente a descrição da vaga antes de me candidatar.'],

  // fr-v4-b1-3: Litígio Bancário & Contestação (existing: Faire opposition, Un prélèvement, Le relevé de compte)
  ['fr-v4-b1-3', 'Un virement frauduleux', '/œ̃ viʁ.mɑ̃ fʁo.dy.lø/', 'Uma transferência fraudulenta', 'Substantivo', 'J’ai repéré un virement frauduleux sur mon compte ce matin.', 'Identifiquei uma transferência fraudulenta na minha conta hoje de manhã.'],
  ['fr-v4-b1-3', 'Le remboursement', '/lə ʁɑ̃.buʁ.sə.mɑ̃/', 'O reembolso / estorno', 'Substantivo', 'Je demande le remboursement immédiat de cette somme.', 'Solicito o reembolso imediato dessa quantia.'],
  ['fr-v4-b1-3', 'Contester une opération', '/kɔ̃.tɛs.te y.n‿ɔ.pe.ʁa.sjɔ̃/', 'Contestar uma transação', 'Expressão', 'Vous avez treize mois pour contester une opération non autorisée.', 'Você tem treze meses para contestar uma transação não autorizada.'],

  // fr-v4-b1-4: Seguro Viagem & Reembolso (existing: Déclarer un sinistre, Les justificatifs, La franchise)
  ['fr-v4-b1-4', 'La couverture médicale', '/la ku.vɛʁ.tyʁ me.di.kal/', 'A cobertura médica', 'Substantivo', 'Vérifiez si votre couverture médicale inclut le rapatriement.', 'Verifique se sua cobertura médica inclui o repatriamento.'],
  ['fr-v4-b1-4', 'Le rapatriement', '/lə ʁa.pa.tʁi.mɑ̃/', 'O repatriamento', 'Substantivo', 'L’assurance prend en charge le rapatriement en cas d’urgence.', 'O seguro cobre o repatriamento em caso de emergência.'],
  ['fr-v4-b1-4', 'Être indemnisé(e)', '/ɛtʁ ɛ̃.dɛm.ni.ze/', 'Ser indenizado(a)', 'Verbo', 'Il faut envoyer les factures originales pour être indemnisé.', 'É preciso enviar as notas fiscais originais para ser indenizado.'],

  // fr-v4-b1-5: Prefeitura & Visto de Residência (existing: Le titre de séjour, Le récépissé, Le justificatif de domicile)
  ['fr-v4-b1-5', 'Le renouvellement', '/lə ʁə.nu.vɛl.mɑ̃/', 'A renovação', 'Substantivo', 'Il faut déposer la demande de renouvellement deux mois avant l’expiration.', 'É preciso protocolar o pedido de renovação dois meses antes do vencimento.'],
  ['fr-v4-b1-5', 'Un timbre fiscal', '/œ̃ tɛ̃bʁ fis.kal/', 'Uma taxa / selo fiscal', 'Substantivo', 'Vous pouvez acheter un timbre fiscal en ligne sur le site officiel.', 'Você pode comprar um selo fiscal online no site oficial.'],
  ['fr-v4-b1-5', 'La préfecture', '/la pʁe.fɛk.tyʁ/', 'A prefeitura / órgão de imigração', 'Substantivo', 'Mon rendez-vous à la préfecture est fixé à neuf heures.', 'Meu agendamento na prefeitura está marcado para as nove horas.'],

  // fr-v4-b1-6: Suporte de TI & Problemas Técnicos (existing: La mise à jour, Le logiciel, Réinitialiser)
  ['fr-v4-b1-6', 'Un ticket d’incident', '/œ̃ ti.kɛ dɛ̃.si.dɑ̃/', 'Um chamado de suporte', 'Substantivo', 'J’ai ouvert un ticket d’incident auprès du support informatique.', 'Abri um chamado de suporte junto à equipe de TI.'],
  ['fr-v4-b1-6', 'La panne de réseau', '/la pan də ʁe.zo/', 'A queda de rede', 'Substantivo', 'Une panne de réseau bloque l’accès au serveur depuis midi.', 'Uma queda de rede está bloqueando o acesso ao servidor desde o meio-dia.'],
  ['fr-v4-b1-6', 'Redémarrer', '/ʁə.de.ma.ʁe/', 'Reiniciar', 'Verbo', 'Essayez de redémarrer votre ordinateur avant d’appeler.', 'Tente reiniciar seu computador antes de ligar.'],

  // fr-v4-b1-7: Voluntariado & Ação Comunitária (existing: Un(e) bénévole, Une collecte, S’engager)
  ['fr-v4-b1-7', 'Une maraude', '/yn ma.ʁod/', 'Uma ação de apoio a pessoas em situação de rua', 'Substantivo', 'Nous organisons une maraude chaque jeudi soir dans le centre.', 'Organizamos uma ação de apoio toda quinta-feira à noite no centro.'],
  ['fr-v4-b1-7', 'Un don', '/œ̃ dɔ̃/', 'Uma doação', 'Substantivo', 'Chaque don alimentaire aide une famille du quartier.', 'Cada doação de alimento ajuda uma família do bairro.'],
  ['fr-v4-b1-7', 'Sensibiliser', '/sɑ̃.si.bi.li.ze/', 'Conscientizar / sensibilizar', 'Verbo', 'Cette campagne vise à sensibiliser les jeunes au tri sélectif.', 'Esta campanha visa conscientizar os jovens sobre a coleta seletiva.'],

  // fr-v4-b1-8: Renovação de Contrato de Aluguel (existing: Le bail, Le préavis, L’échéance)
  ['fr-v4-b1-8', 'La reconduction tacite', '/la ʁə.kɔ̃.dyk.sjɔ̃ ta.sit/', 'A renovação automática', 'Substantivo', 'Le contrat prévoit une reconduction tacite pour trois ans.', 'O contrato prevê uma renovação automática por três anos.'],
  ['fr-v4-b1-8', 'La révision du loyer', '/la ʁe.vi.zjɔ̃ dy lwa.je/', 'O reajuste do aluguel', 'Substantivo', 'La révision du loyer suit l’indice légal publié chaque année.', 'O reajuste do aluguel segue o índice legal publicado todo ano.'],
  ['fr-v4-b1-8', 'Résilier le contrat', '/ʁe.zi.lje lə kɔ̃.tʁa/', 'Rescindir o contrato', 'Expressão', 'Pour résilier le contrat, envoyez un courrier recommandé.', 'Para rescindir o contrato, envie uma carta registrada.'],

  // fr-v4-b1-9: Mudança de Residência & Logística (existing: Le déménagement, L’état des lieux, Un devis)
  ['fr-v4-b1-9', 'Les cartons', '/le kaʁ.tɔ̃/', 'As caixas (de mudança)', 'Substantivo', 'J’ai déjà emballé tous mes livres dans des cartons solides.', 'Já embalei todos os meus livros em caixas resistentes.'],
  ['fr-v4-b1-9', 'Le relevé de compteur', '/lə ʁəl.ve də kɔ̃.tœʁ/', 'A leitura do medidor', 'Substantivo', 'Pensez à noter le relevé de compteur d’électricité le jour du départ.', 'Lembre-se de anotar a leitura do medidor de luz no dia da saída.'],
  ['fr-v4-b1-9', 'Le camion de location', '/lə ka.mjɔ̃ də lɔ.ka.sjɔ̃/', 'O caminhão alugado', 'Substantivo', 'Nous avons réservé un camion de location pour samedi matin.', 'Reservamos um caminhão alugado para sábado de manhã.'],

  // fr-v4-b1-10: Crítica de Cinema & Cultura (existing: Le scénario, La mise en scène, VOSTFR)
  ['fr-v4-b1-10', 'Le jeu d’acteur', '/lə ʒø dak.tœʁ/', 'A atuação', 'Substantivo', 'Le jeu d’acteur dans ce drame est particulièrement émouvant.', 'A atuação neste drama é particularmente emocionante.'],
  ['fr-v4-b1-10', 'La photographie', '/la fɔ.tɔ.ɡʁa.fi/', 'A fotografia (do filme)', 'Substantivo', 'La photographie du film sublime les paysages d’hiver.', 'A fotografia do filme enaltece as paisagens de inverno.'],
  ['fr-v4-b1-10', 'Un rebondissement', '/œ̃ ʁə.bɔ̃.dis.mɑ̃/', 'Uma reviravolta (plot twist)', 'Substantivo', 'Le dernier quart d’heure réserve un rebondissement inattendu.', 'Os últimos quinze minutos reservam uma reviravolta inesperada.'],

  // fr-idioms-b1: Expressões Idiomáticas Francesas (existing: Poser un lapin, Tomber dans les pommes, C’est du gâteau, Avoir le coup de foudre)
  ['fr-idioms-b1', 'Coûter les yeux de la tête', '/ku.te le.z‿jø də la tɛt/', 'Custar os olhos da cara', 'Expressão', 'Ce restaurant gastronomique coûte les yeux de la tête.', 'Este restaurante gastronômico custa os olhos da cara.'],
  ['fr-idioms-b1', 'Avoir la pêche', '/a.vwaʁ la pɛʃ/', 'Estar cheio de energia', 'Expressão', 'Pour avoir la pêche toute la journée, rien de tel qu’un bon sommeil.', 'Para estar cheio de energia o dia todo, nada melhor que dormir bem.'],

  // fr-slang-b1: Argot & Verlan (Gírias Reais) (existing: Ouf (fou), Kiffer, Relou, Un pote)
  ['fr-slang-b1', 'Un truc', '/œ̃ tʁyk/', 'Uma coisa / negócio', 'Gíria', 'J’ai un truc super important à te raconter ce soir.', 'Tenho uma coisa super importante para te contar hoje à noite.'],
  ['fr-slang-b1', 'Galérer', '/ɡa.le.ʁe/', 'Passar perrengue / ter dificuldade', 'Gíria', 'J’ai vraiment galéré pour trouver une place de parking.', 'Eu passei um baita perrengue para achar uma vaga de estacionamento.'],

  // ======================== B2 ========================
  // fr-b2-1: Le Conditionnel et les Hypothèses (existing: Pourriez-vous, Ce serait, Lentement)
  ['fr-b2-1', 'Il faudrait', '/il fo.dʁɛ/', 'Seria necessário / precisaria', 'Verbo', 'Il faudrait vérifier les chiffres avant la réunion.', 'Seria necessário conferir os números antes da reunião.'],
  ['fr-b2-1', 'À ta place', '/a ta plas/', 'No seu lugar', 'Expressão', 'À ta place, j’accepterais cette proposition sans hésiter.', 'No seu lugar, eu aceitaria essa proposta sem hesitar.'],
  ['fr-b2-1', 'Si j’avais su', '/si ʒa.vɛ sy/', 'Se eu soubesse (tivesse sabido)', 'Expressão', 'Si j’avais su, je serais parti plus tôt ce matin.', 'Se eu soubesse, teria saído mais cedo hoje de manhã.'],

  // fr-b2-2: Le Gérondif et le Causatif (existing: En pratiquant, Faire réparer, La confiance)
  ['fr-b2-2', 'En écoutant', '/ɑ̃.n‿e.ku.tɑ̃/', 'Ouvindo / ao ouvir (gerúndio)', 'Verbo', 'On améliore vite son accent en écoutant des podcasts natifs.', 'Melhora-se rápido o sotaque ouvindo podcasts nativos.'],
  ['fr-b2-2', 'Se faire couper les cheveux', '/sə fɛʁ ku.pe le ʃə.vø/', 'Cortar o cabelo (causativo)', 'Expressão', 'Elle va se faire couper les cheveux demain après-midi.', 'Ela vai cortar o cabelo amanhã à tarde.'],
  ['fr-b2-2', 'Tout en travaillant', '/tu.t‿ɑ̃ tʁa.va.jɑ̃/', 'Enquanto trabalha / trabalhando', 'Locução', 'Il suit ses études tout en travaillant à temps partiel.', 'Ele faz seus estudos enquanto trabalha em meio período.'],

  // fr-b2-3: Français de France vs. Québec (existing: Le courriel, Fin de semaine, Déjeuner)
  ['fr-b2-3', 'Le souper', '/lə su.pe/', 'O jantar (Québec / Suíça / Bélgica)', 'Substantivo', 'Au Québec, on prend le souper vers dix-huit heures.', 'No Québec, janta-se por volta das dezoito horas.'],
  ['fr-b2-3', 'Jaser', '/ʒa.ze/', 'Conversar / bater papo (Québec)', 'Verbo', 'On s’est arrêtés au café pour jaser pendant une heure.', 'Paramos no café para bater papo por uma hora.'],
  ['fr-b2-3', 'Un chandail', '/œ̃ ʃɑ̃.daj/', 'Um suéter / blusa de frio (Québec)', 'Substantivo', 'Mets un chandail chaud, il fait frais dehors ce soir.', 'Vista um suéter quente, está fresco lá fora hoje à noite.'],

  // fr-b2-4: Faux Amis : Français vs. Portugais (existing: Entendre, Attendre, Tirer / Pousser)
  ['fr-b2-4', 'Actuellement', '/ak.tɥɛl.mɑ̃/', 'Atualmente (não "atualmente" falso amigo)', 'Advérbio', 'Actuellement, elle travaille comme consultante à Paris.', 'Atualmente, ela trabalha como consultora em Paris.'],
  ['fr-b2-4', 'Supporter', '/sy.pɔʁ.te/', 'Aguentar / tolerar (não "apoiar")', 'Verbo', 'Je ne peux plus supporter ce bruit constant dans la rue.', 'Não aguento mais esse barulho constante na rua.'],
  ['fr-b2-4', 'Embarrassé(e)', '/ɑ̃.ba.ʁa.se/', 'Constrangido(a) / sem graça', 'Adjetivo', 'Il était très embarrassé d’avoir oublié le prénom de son client.', 'Ele ficou muito sem graça por ter esquecido o nome do cliente.'],

  // fr-b2-5: Presse, Culture et Débats B2 (existing: Cependant, Malgré, En revanche)
  ['fr-b2-5', 'Toutefois', '/tut.fwa/', 'Contudo / todavia', 'Conector', 'Le rapport est positif ; toutefois, certains points restent flous.', 'O relatório é positivo; contudo, certos pontos continuam vagos.'],
  ['fr-b2-5', 'Par ailleurs', '/paʁ a.jœʁ/', 'Além disso / por outro lado', 'Conector', 'Par ailleurs, l’étude souligne l’importance de la formation continue.', 'Além disso, o estudo destaca a importância da formação contínua.'],
  ['fr-b2-5', 'Nuancer', '/nɥɑ̃.se/', 'Matizar / ponderar', 'Verbo', 'Il convient de nuancer cette affirmation par des données précises.', 'Convém ponderar essa afirmação com dados precisos.'],

  // fr-b2-6: Négociations et Courriels Formels (existing: Devis, Échéance, Relancer)
  ['fr-b2-6', 'Une contre-proposition', '/yn kɔ̃tʁ.pʁɔ.po.zi.sjɔ̃/', 'Uma contraproposta', 'Substantivo', 'Nous avons soumis une contre-proposition tarifaire au fournisseur.', 'Enviamos uma contraproposta tarifária ao fornecedor.'],
  ['fr-b2-6', 'Je vous prie d’agréer', '/ʒə vu pʁi da.ɡʁe.e/', 'Apresento-lhe (fecho formal)', 'Expressão', 'Je vous prie d’agréer, Madame, mes salutations distinguées.', 'Apresento-lhe, Senhora, minhas cordiais saudações.'],
  ['fr-b2-6', 'Un accord de principe', '/œ̃.n‿a.kɔʁ də pʁɛ̃.sip/', 'Um acordo de princípio', 'Substantivo', 'Les deux directions ont trouvé un accord de principe hier.', 'As duas diretorias chegaram a um acordo de princípio ontem.'],

  // fr-b2-7: Cinéma, Culture et Expressions (existing: Coup de cœur, Chef-d’œuvre, Bande originale)
  ['fr-b2-7', 'Un long-métrage', '/œ̃ lɔ̃.me.tʁaʒ/', 'Um longa-metragem', 'Substantivo', 'Ce premier long-métrage a remporté un prix à Cannes.', 'Este primeiro longa-metragem ganhou um prêmio em Cannes.'],
  ['fr-b2-7', 'Sortir du lot', '/sɔʁ.tiʁ dy lɔ/', 'Destacar-se da maioria', 'Expressão', 'Parmi tous les films de l’année, celui-ci sort vraiment du lot.', 'Entre todos os filmes do ano, este realmente se destaca.'],
  ['fr-b2-7', 'La salle obscure', '/la sal ɔp.skyʁ/', 'A sala de cinema (expressão cultural)', 'Substantivo', 'Rien ne remplace l’émotion d’une salle obscure pleine à craquer.', 'Nada substitui a emoção de uma sala de cinema lotada.'],

  // fr-b2-8: L’Éducation, l’Université et l’Orientation (existing: L’alternance, Une filière, Une bourse)
  ['fr-b2-8', 'Un cursus', '/œ̃ kyʁ.sys/', 'Um currículo / trajetória acadêmica', 'Substantivo', 'Ce cursus universitaire inclut un semestre d’échange à l’étranger.', 'Este curso universitário inclui um semestre de intercâmbio no exterior.'],
  ['fr-b2-8', 'Les débouchés', '/le de.bu.ʃe/', 'As saídas / oportunidades profissionais', 'Substantivo', 'Cette formation offre d’excellents débouchés dans le secteur public.', 'Esta formação oferece excelentes oportunidades no setor público.'],
  ['fr-b2-8', 'Se réorienter', '/sə ʁe.ɔ.ʁjɑ̃.te/', 'Mudar de área / reorientar-se', 'Verbo', 'Il a décidé de se réorienter vers les métiers du numérique.', 'Ele decidiu se reorientar para as profissões da área digital.'],

  // fr-b2-9: L’Urbanisme, la Mobilité et la Ville de Demain (existing: L’aménagement, La périphérie, Piétonnier)
  ['fr-b2-9', 'Les mobilités douces', '/le mɔ.bi.li.te dus/', 'A mobilidade ativa / sustentável', 'Substantivo', 'La mairie investit dans les mobilités douces comme le vélo.', 'A prefeitura investe em mobilidade sustentável, como a bicicleta.'],
  ['fr-b2-9', 'La piste cyclable', '/la pist si.klabl/', 'A ciclovia', 'Substantivo', 'Une nouvelle piste cyclable relie désormais la gare au campus.', 'Uma nova ciclovia liga agora a estação ao campus.'],
  ['fr-b2-9', 'Désengorger', '/de.zɑ̃.ɡɔʁ.ʒe/', 'Desafogar (o trânsito)', 'Verbo', 'Ce tramway permet de désengorger le centre-ville aux heures de pointe.', 'Este VLT permite desafogar o centro nos horários de pico.'],

  // fr-b2-10: La Psychologie du Travail et l’Équilibre de Vie (existing: L’épuisement, Veiller à, La reconnaissance)
  ['fr-b2-10', 'La charge mentale', '/la ʃaʁʒ mɑ̃.tal/', 'A carga mental', 'Substantivo', 'Une meilleure répartition des tâches réduit la charge mentale.', 'Uma melhor divisão das tarefas reduz a carga mental.'],
  ['fr-b2-10', 'Le bien-être au travail', '/lə bjɛ̃.n‿ɛtʁ o tʁa.vaj/', 'O bem-estar no trabalho', 'Substantivo', 'Le bien-être au travail favorise l’engagement des équipes.', 'O bem-estar no trabalho favorece o engajamento das equipes.'],
  ['fr-b2-10', 'Fixer des limites', '/fik.se de li.mit/', 'Estabelecer limites', 'Expressão', 'Il est sain de fixer des limites claires entre vie pro et vie perso.', 'É saudável estabelecer limites claros entre vida profissional e pessoal.'],

  // fr-v4-b2-1: Gestion de Conflits en Équipe (existing: Un différend, Un terrain d’entente, Désamorcer)
  ['fr-v4-b2-1', 'La médiation', '/la me.dja.sjɔ̃/', 'A mediação', 'Substantivo', 'Une médiation neutre a permis de résoudre le blocage.', 'Uma mediação neutra permitiu resolver o impasse.'],
  ['fr-v4-b2-1', 'Reformuler', '/ʁə.fɔʁ.my.le/', 'Reformular', 'Verbo', 'Laisse-moi reformuler ton point de vue pour être sûr de comprendre.', 'Deixe-me reformular seu ponto de vista para ter certeza de que entendi.'],
  ['fr-v4-b2-1', 'Un compromis', '/œ̃ kɔ̃.pʁɔ.mi/', 'Um acordo / meio-termo', 'Substantivo', 'Nous avons trouvé un compromis acceptable pour les deux services.', 'Encontramos um meio-termo aceitável para os dois departamentos.'],

  // fr-v4-b2-2: Éducation aux Médias et Vérification (existing: Recouper les sources, Un biais cognitif, Démentir)
  ['fr-v4-b2-2', 'La désinformation', '/la de.zɛ̃.fɔʁ.ma.sjɔ̃/', 'A desinformação', 'Substantivo', 'La lutte contre la désinformation exige un esprit critique.', 'O combate à desinformação exige espírito crítico.'],
  ['fr-v4-b2-2', 'Une infox', '/y.n‿ɛ̃.fɔks/', 'Uma fake news / notícia falsa', 'Substantivo', 'Cette vidéo virale s’est révélée être une infox complète.', 'Este vídeo viral revelou-se uma notícia completamente falsa.'],
  ['fr-v4-b2-2', 'La crédibilité', '/la kʁe.di.bi.li.te/', 'A credibilidade', 'Substantivo', 'Le journal a renforcé sa crédibilité en publiant ses corrections.', 'O jornal reforçou sua credibilidade ao publicar suas correções.'],

  // fr-v4-b2-3: Logistique Durable et Chaînes d’Approvisionnement (existing: L’empreinte carbone, La traçabilité, Un entrepôt)
  ['fr-v4-b2-3', 'L’approvisionnement', '/la.pʁɔ.vi.zjɔn.mɑ̃/', 'O abastecimento / suprimento', 'Substantivo', 'L’approvisionnement des magasins doit rester agile face aux pénuries.', 'O abastecimento das lojas deve permanecer ágil diante da escassez.'],
  ['fr-v4-b2-3', 'Le circuit court', '/lə siʁ.kɥi kuʁ/', 'A cadeia curta (comércio local)', 'Substantivo', 'Privilégier le circuit court limite les transports longue distance.', 'Priorizar a cadeia curta limita os transportes de longa distância.'],
  ['fr-v4-b2-3', 'La gestion des stocks', '/la ʒɛs.tjɔ̃ de stɔk/', 'A gestão de estoques', 'Substantivo', 'Une gestion des stocks précise évite le surstockage inutile.', 'Uma gestão de estoques precisa evita o excesso desnecessário.'],

  // fr-v4-b2-4: Droits des Consommateurs et Recours (existing: Le droit de rétractation, Une mise en demeure, Le médiateur)
  ['fr-v4-b2-4', 'Une clause abusive', '/yn kloz a.by.ziv/', 'Uma cláusula abusiva', 'Substantivo', 'Le tribunal a annulé une clause abusive dans ce contrat.', 'O tribunal anulou uma cláusula abusiva neste contrato.'],
  ['fr-v4-b2-4', 'La garantie légale', '/la ɡa.ʁɑ̃.ti le.ɡal/', 'A garantia legal', 'Substantivo', 'La garantie légale de conformité couvre les défauts pendant deux ans.', 'A garantia legal de conformidade cobre defeitos durante dois anos.'],
  ['fr-v4-b2-4', 'Un vice caché', '/œ̃ vis ka.ʃe/', 'Um vício oculto', 'Substantivo', 'L’acheteur peut agir en justice s’il découvre un vice caché.', 'O comprador pode recorrer à justiça se descobrir um vício oculto.'],

  // fr-v4-b2-5: Télétravail et Équilibre Professionnel (existing: Le droit à la déconnexion, L’autonomie, La cohésion)
  ['fr-v4-b2-5', 'Le mode hybride', '/lə mɔd i.bʁid/', 'O modelo híbrido', 'Substantivo', 'Le mode hybride combine présence au bureau et travail à distance.', 'O modelo híbrido combina presença no escritório e trabalho remoto.'],
  ['fr-v4-b2-5', 'Asynchrone', '/a.sɛ̃.kʁɔn/', 'Assíncrono', 'Adjetivo', 'La communication asynchrone évite de multiplier les réunions inutiles.', 'A comunicação assíncrona evita multiplicar reuniões desnecessárias.'],
  ['fr-v4-b2-5', 'L’isolement professionnel', '/li.zɔl.mɑ̃ pʁɔ.fɛ.sjɔ.nɛl/', 'O isolamento profissional', 'Substantivo', 'Des rencontres régulières préviennent l’isolement professionnel.', 'Encontros regulares previnem o isolamento profissional.'],

  // fr-v4-b2-6: Logement Urbain et Mixité Sociale (existing: La mixité sociale, Une passoire thermique, L’encadrement des loyers)
  ['fr-v4-b2-6', 'La rénovation énergétique', '/la ʁe.nɔ.va.sjɔ̃ e.nɛʁ.ʒe.tik/', 'A reforma energética (isolamento)', 'Substantivo', 'Des aides publiques financent la rénovation énergétique des immeubles.', 'Subsídios públicos financiam a reforma energética dos prédios.'],
  ['fr-v4-b2-6', 'Un logement social', '/œ̃ lɔʒ.mɑ̃ sɔ.sjal/', 'Uma moradia popular / social', 'Substantivo', 'La commune construit davantage de logements sociaux près des gares.', 'O município constrói mais moradias populares perto das estações.'],
  ['fr-v4-b2-6', 'La densité urbaine', '/la dɑ̃.si.te yʁ.bɛn/', 'A densidade urbana', 'Substantivo', 'La densité urbaine pose la question des espaces verts.', 'A densidade urbana levanta a questão das áreas verdes.'],

  // fr-v4-b2-7: Finances Personnelles et Épargne (existing: L’épargne de précaution, Le rendement, Le pouvoir d’achat)
  ['fr-v4-b2-7', 'Un budget prévisionnel', '/œ̃ byd.ʒɛ pʁe.vi.zjɔ.nɛl/', 'Um orçamento previsto', 'Substantivo', 'Établir un budget prévisionnel aide à anticiper les grosses dépenses.', 'Elaborar um orçamento previsto ajuda a antecipar grandes gastos.'],
  ['fr-v4-b2-7', 'L’inflation', '/lɛ̃.fla.sjɔ̃/', 'A inflação', 'Substantivo', 'L’inflation pèse directement sur les achats alimentaires.', 'A inflação pesa diretamente sobre as compras de alimentos.'],
  ['fr-v4-b2-7', 'Diversifier ses placements', '/di.vɛʁ.si.fje se plas.mɑ̃/', 'Diversificar os investimentos', 'Expressão', 'Il est prudent de diversifier ses placements sur le long terme.', 'É prudente diversificar os investimentos no longo prazo.'],

  // fr-v4-b2-8: Transition Écologique et Sobriété (existing: La sobriété, L’économie circulaire, Durable)
  ['fr-v4-b2-8', 'Le réemploi', '/lə ʁe.ɑ̃.plwa/', 'O reuso / reutilização', 'Substantivo', 'Le réemploi des matériaux réduit les déchets du bâtiment.', 'O reuso de materiais reduz os resíduos da construção civil.'],
  ['fr-v4-b2-8', 'La décarbonation', '/la de.kaʁ.bɔ.na.sjɔ̃/', 'A descarbonização', 'Substantivo', 'La décarbonation des transports est un chantier prioritaire.', 'A descarbonização dos transportes é uma frente prioritária.'],
  ['fr-v4-b2-8', 'L’obsolescence programmée', '/lɔp.sɔ.lɛ.sɑ̃s pʁɔ.ɡʁa.me/', 'A obsolescência programada', 'Substantivo', 'La loi sanctionne désormais l’obsolescence programmée des appareils.', 'A lei agora pune a obsolescência programada dos aparelhos.'],

  // fr-v4-b2-9: Francophonie Comparée : Paris, Montréal, Dakar (existing: La francophonie, Un courriel, Une nuance lexicale)
  ['fr-v4-b2-9', 'Un régionalisme', '/œ̃ ʁe.ʒjɔ.na.lism/', 'Um regionalismo', 'Substantivo', 'Dire « septante » en Belgique est un régionalisme tout à fait standard.', 'Dizer "septante" na Bélgica é um regionalismo totalmente padrão.'],
  ['fr-v4-b2-9', 'L’accentuation', '/lak.sɑ̃.tɥa.sjɔ̃/', 'A entonação / sotaque', 'Substantivo', 'L’accentuation varie sensiblement entre Dakar, Paris et Montréal.', 'A entonação varia sensivelmente entre Dacar, Paris e Montreal.'],
  ['fr-v4-b2-9', 'Un emprunt linguistique', '/œ̃.n‿ɑ̃.pʁœ̃ lɛ̃.ɡɥis.tik/', 'Um empréstimo linguístico', 'Substantivo', 'Le français intègre de nombreux emprunts linguistiques venus d’ailleurs.', 'O francês integra diversos empréstimos linguísticos vindos de fora.'],

  // fr-v4-b2-10: Leadership et Prise de Décision (existing: Fédérer, Un arbitrage, Responsabiliser)
  ['fr-v4-b2-10', 'Déléguer', '/de.le.ɡe/', 'Delegar', 'Verbo', 'Un bon dirigeant sait déléguer les missions stratégiques.', 'Um bom líder sabe delegar missões estratégicas.'],
  ['fr-v4-b2-10', 'Trancher', '/tʁɑ̃.ʃe/', 'Decidir de forma firme / bater o martelo', 'Verbo', 'Après avoir écouté chacun, il a fallu trancher rapidement.', 'Depois de ouvir cada um, foi preciso bater o martelo rapidamente.'],
  ['fr-v4-b2-10', 'La vision stratégique', '/la vi.zjɔ̃ stʁa.te.ʒik/', 'A visão estratégica', 'Substantivo', 'Sa vision stratégique a guidé l’entreprise durant la crise.', 'Sua visão estratégica guiou a empresa durante a crise.'],

  // fr-taboo-register-b2: Registre Familier : Jurons Courants & Alternatives Polies (existing: Putain / Punaise, Merde / Mince, Quelle galère !, Foutre le bordel)
  ['fr-taboo-register-b2', 'Zut !', '/zyt/', 'Puxa! / Caramba! (educado)', 'Expressão', 'Zut, j’ai oublié mes clés à l’intérieur de l’appartement !', 'Puxa, esqueci minhas chaves dentro do apartamento!'],
  ['fr-taboo-register-b2', 'Ça me saoule', '/sa mə sul/', 'Isso me enche o saco (coloquial)', 'Expressão', 'Attendre quarante minutes sous la pluie, franchement ça me saoule.', 'Esperar quarenta minutos na chuva, francamente, isso me enche o saco.'],

  // ======================== C1 ========================
  // fr-c1-1: Style Soutenu et Presse (existing: Néanmoins, En revanche, Un atout)
  ['fr-c1-1', 'Quant à', '/kɑ̃.t‿a/', 'Quanto a', 'Conector', 'Quant à la réforme fiscale, le débat reste vif au Parlement.', 'Quanto à reforma tributária, o debate continua acirrado no Parlamento.'],
  ['fr-c1-1', 'Force est de constater', '/fɔʁs ɛ də kɔ̃s.ta.te/', 'É forçoso constatar', 'Expressão', 'Force est de constater que les inégalités se sont creusées.', 'É forçoso constatar que as desigualdades se aprofundaram.'],
  ['fr-c1-1', 'À l’instar de', '/a lɛ̃s.taʁ də/', 'À semelhança de / assim como', 'Locução', 'À l’instar de ses voisins, le pays accélère sa transition.', 'À semelhança de seus vizinhos, o país acelera sua transição.'],

  // fr-c1-2: Le Discours Rapporté au Passé (existing: Le lendemain, La veille, Aboutir)
  ['fr-c1-2', 'L’avant-veille', '/la.vɑ̃.vɛj/', 'A antevéspera', 'Advérbio', 'Il m’a confié qu’il avait signé le bail l’avant-veille.', 'Ele me confidenciou que havia assinado o contrato na antevéspera.'],
  ['fr-c1-2', 'Le surlendemain', '/lə syʁ.lɑ̃d.mɛ̃/', 'Dois dias depois', 'Advérbio', 'Elle a promis qu’elle rappellerait le surlendemain sans faute.', 'Ela prometeu que ligaria de volta dois dias depois sem falta.'],
  ['fr-c1-2', 'Rapporter des propos', '/ʁa.pɔʁ.te de pʁɔ.po/', 'Relatar declarações', 'Expressão', 'Le journaliste a fidèlement rapporté les propos du ministre.', 'O jornalista relatou fielmente as declarações do ministro.'],

  // fr-c1-3: Expressions Idiomatiques et Nuances (existing: Dans la poche, Du pain sur la planche, Au bout du compte)
  ['fr-c1-3', 'Mettre les pieds dans le plat', '/mɛtʁ le pje dɑ̃ lə pla/', 'Colocar o dedo na ferida / cometer gafe', 'Expressão', 'Il vaut mieux éviter de mettre les pieds dans le plat devant les invités.', 'É melhor evitar colocar o dedo na ferida diante dos convidados.'],
  ['fr-c1-3', 'Avoir voix au chapitre', '/a.vwaʁ vwa o ʃa.pitʁ/', 'Ter voz ativa / poder de decisão', 'Expressão', 'Les salariés veulent avoir voix au chapitre sur l’organisation.', 'Os funcionários querem ter voz ativa sobre a organização.'],
  ['fr-c1-3', 'Tirer son épingle du jeu', '/ti.ʁe sɔ̃.n‿e.pɛ̃ɡl dy ʒø/', 'Sair-se bem (de situação difícil)', 'Expressão', 'Malgré la concurrence, cette jeune entreprise tire son épingle du jeu.', 'Apesar da concorrência, essa jovem empresa se sai muito bem.'],

  // fr-c1-4: Synthèse et Nuances Niveau C1 (existing: Toutefois, En outre, Constat)
  ['fr-c1-4', 'Il n’en demeure pas moins que', '/il nɑ̃ də.mœʁ pa mwɛ̃ kə/', 'Não deixa de ser verdade que', 'Conector', 'Le coût est élevé ; il n’en demeure pas moins que l’investissement s’impose.', 'O custo é alto; não deixa de ser verdade que o investimento se impõe.'],
  ['fr-c1-4', 'En somme', '/ɑ̃ sɔm/', 'Em suma', 'Conector', 'En somme, ce bilan invite à repenser nos priorités.', 'Em suma, este balanço convida a repensar nossas prioridades.'],
  ['fr-c1-4', 'Corroborer', '/kɔ.ʁɔ.bɔ.ʁe/', 'Corroborar', 'Verbo', 'Ces archives viennent corroborer l’hypothèse initiale.', 'Esses arquivos vêm corroborar a hipótese inicial.'],

  // fr-c1-5: Français Parlé et Registre Familier (existing: Bosser, Bouquin, La flemme)
  ['fr-c1-5', 'Un boulot', '/œ̃ bu.lo/', 'Um emprego / trampo', 'Gíria', 'Elle a décroché un super boulot dans une maison d’édition.', 'Ela conseguiu um ótimo emprego em uma editora.'],
  ['fr-c1-5', 'Piger', '/pi.ʒe/', 'Sacar / entender (coloquial)', 'Verbo', 'Tu as pigé comment fonctionne ce nouveau logiciel ?', 'Você sacou como funciona este novo software?'],
  ['fr-c1-5', 'C’est carré', '/sɛ ka.ʁe/', 'Está fechado / tudo certo / impecável', 'Expressão', 'On se retrouve à huit heures devant la gare ? — C’est carré !', 'Nos encontramos às oito na frente da estação? — Fechado!'],

  // fr-c1-6: Rhétorique et Inversions Stylistiques (existing: Aussi (+ inv.), Bâtir, Patrimoine)
  ['fr-c1-6', 'À peine eut-il', '/a pɛn y til/', 'Mal tinha ele (+ inversão)', 'Expressão', 'À peine eut-il achevé son discours que la salle applaudit.', 'Mal tinha ele concluído seu discurso, o auditório aplaudiu.'],
  ['fr-c1-6', 'Peut-être convient-il', '/pø.tɛtʁ kɔ̃.vjɛ̃ til/', 'Talvez convenha (+ inversão)', 'Expressão', 'Peut-être convient-il de réexaminer cette clause avec prudence.', 'Talvez convenha reexaminar esta cláusula com prudência.'],
  ['fr-c1-6', 'Éloquence', '/e.lɔ.kɑ̃s/', 'Eloquência', 'Substantivo', 'Son éloquence a convaincu jusqu’aux membres les plus sceptiques.', 'Sua eloquência convenceu até os membros mais céticos.'],

  // fr-c1-7: Diplomatie et Concordance des Temps (existing: Dont, Partenariat, Consacrer)
  ['fr-c1-7', 'Auquel / Auxquels', '/o.kɛl/', 'Ao qual / Aos quais', 'Pronome', 'C’est un traité auquel plusieurs États ont adhéré récemment.', 'É um tratado ao qual vários Estados aderiram recentemente.'],
  ['fr-c1-7', 'Un compromis diplomatique', '/œ̃ kɔ̃.pʁɔ.mi di.plɔ.ma.tik/', 'Um compromisso diplomático', 'Substantivo', 'Les délégations ont forgé un compromis diplomatique équilibré.', 'As delegações forjaram um compromisso diplomático equilibrado.'],
  ['fr-c1-7', 'Préserver le dialogue', '/pʁe.zɛʁ.ve lə dja.lɔɡ/', 'Preservar o diálogo', 'Expressão', 'Il importe de préserver le dialogue malgré les divergences.', 'Importa preservar o diálogo apesar das divergências.'],

  // fr-c1-8: La Philosophie, l’Éthique et le Progrès Scientifique (existing: La finalité, Nul ne saurait, La délibération)
  ['fr-c1-8', 'Le principe de précaution', '/lə pʁɛ̃.sip də pʁe.ko.sjɔ̃/', 'O princípio da precaução', 'Substantivo', 'Le principe de précaution encadre les innovations à risque incertain.', 'O princípio da precaução regula inovações de risco incerto.'],
  ['fr-c1-8', 'L’éthique', '/le.tik/', 'A ética', 'Substantivo', 'L’éthique scientifique interdit toute manipulation des résultats.', 'A ética científica proíbe qualquer manipulação dos resultados.'],
  ['fr-c1-8', 'Le libre arbitre', '/lə libʁ aʁ.bitʁ/', 'O livre-arbítrio', 'Substantivo', 'Les algorithmes prédictifs interrogent notre conception du libre arbitre.', 'Os algoritmos preditivos questionam nossa concepção de livre-arbítrio.'],

  // fr-c1-9: La Géopolitique, l’Europe et les Institutions (existing: Ratifier, Un socle commun, À l’issue de)
  ['fr-c1-9', 'La souveraineté', '/la suv.ʁɛn.te/', 'A soberania', 'Substantivo', 'La souveraineté numérique devient un enjeu stratégique majeur.', 'A soberania digital torna-se uma questão estratégica central.'],
  ['fr-c1-9', 'Un sommet européen', '/œ̃ sɔ.mɛ ø.ʁɔ.pe.ɛ̃/', 'Uma cúpula europeia', 'Substantivo', 'Les dirigeants se réunissent lors d’un sommet européen à Bruxelles.', 'Os líderes reúnem-se em uma cúpula europeia em Bruxelas.'],
  ['fr-c1-9', 'La subsidiarité', '/la syb.zi.dja.ʁi.te/', 'A subsidiariedade', 'Substantivo', 'Le principe de subsidiarité privilégie l’échelon local quand il est efficace.', 'O princípio da subsidiariedade privilegia o nível local quando eficaz.'],

  // fr-c1-10: La Critique Littéraire, le Style et l’Ironie (existing: La litote, Ciselé(e), Dénué(e) de)
  ['fr-c1-10', 'L’antiphrase', '/lɑ̃.ti.fʁaz/', 'A antífrase / ironia verbal', 'Substantivo', 'Dire « quel génie ! » après une erreur manifeste relève de l’antiphrase.', 'Dizer "que gênio!" após um erro evidente é um exemplo de antífrase.'],
  ['fr-c1-10', 'La prose', '/la pʁoz/', 'A prosa', 'Substantivo', 'Sa prose sobre et rythmée captive le lecteur dès la première page.', 'Sua prosa sóbria e ritmada cativa o leitor desde a primeira página.'],
  ['fr-c1-10', 'L’ironie mordante', '/li.ʁɔ.ni mɔʁ.dɑ̃t/', 'A ironia mordaz', 'Substantivo', 'L’auteur manie l’ironie mordante pour critiquer les mœurs de son époque.', 'O autor maneja a ironia mordaz para criticar os costumes de sua época.'],

  // fr-v4-c1-1: Communication de Crise et Maîtrise du Discours (existing: À titre conservatoire, Saisir (une autorité), La portée)
  ['fr-v4-c1-1', 'Un communiqué sobre', '/œ̃ kɔ.my.ni.ke sɔbʁ/', 'Um comunicado sóbrio', 'Substantivo', 'La direction a publié un communiqué sobre pour rassurer les usagers.', 'A diretoria publicou um comunicado sóbrio para tranquilizar os usuários.'],
  ['fr-v4-c1-1', 'Assumer sa responsabilité', '/a.sy.me sa ʁɛs.pɔ̃.sa.bi.li.te/', 'Assumir sua responsabilidade', 'Expressão', 'L’entreprise doit assumer sa responsabilité sans éluder les faits.', 'A empresa deve assumir sua responsabilidade sem esquivar-se dos fatos.'],
  ['fr-v4-c1-1', 'Endiguer la crise', '/ɑ̃.di.ɡe la kʁiz/', 'Conter a crise', 'Expressão', 'Des mesures immédiates ont été prises pour endiguer la crise.', 'Medidas imediatas foram tomadas para conter a crise.'],

  // fr-v4-c1-2: Conjoncture Macroéconomique et Politiques Budgétaires (existing: La conjoncture, Le taux directeur, En dépit de)
  ['fr-v4-c1-2', 'La politique budgétaire', '/la pɔ.li.tik byd.ʒe.tɛʁ/', 'A política orçamentária / fiscal', 'Substantivo', 'La politique budgétaire vise à contenir le déficit public.', 'A política orçamentária visa conter o déficit público.'],
  ['fr-v4-c1-2', 'La relance économique', '/la ʁə.lɑ̃s e.kɔ.nɔ.mik/', 'A retomada econômica', 'Substantivo', 'Ce plan d’investissement soutient la relance économique.', 'Este plano de investimentos sustenta a retomada econômica.'],
  ['fr-v4-c1-2', 'Le déficit public', '/lə de.fi.sit py.blik/', 'O déficit público', 'Substantivo', 'Réduire le déficit public sans freiner la croissance reste délicat.', 'Reduzir o déficit público sem frear o crescimento continua delicado.'],

  // fr-v4-c1-3: Clauses Juridiques et Rédaction Contractuelle (existing: Sous réserve de, Le cas échéant, À défaut)
  ['fr-v4-c1-3', 'La force majeure', '/la fɔʁs ma.ʒœʁ/', 'A força maior', 'Substantivo', 'Les obligations sont suspendues en cas de force majeure dûment prouvée.', 'As obrigações ficam suspensas em caso de força maior devidamente comprovada.'],
  ['fr-v4-c1-3', 'La confidentialité', '/la kɔ̃.fi.dɑ̃.sja.li.te/', 'A confidencialidade', 'Substantivo', 'La clause de confidentialité demeure valable après la fin du contrat.', 'A cláusula de confidencialidade permanece válida após o término do contrato.'],
  ['fr-v4-c1-3', 'Stipuler', '/sti.py.le/', 'Estipular', 'Verbo', 'L’article quatre stipule les délais exacts de livraison.', 'O artigo quarto estipula os prazos exatos de entrega.'],

  // fr-v4-c1-4: Relecture Académique et Style Scientifique (existing: Corroborer, Infirmer, Un échantillon)
  ['fr-v4-c1-4', 'La problématique', '/la pʁɔ.ble.ma.tik/', 'A problemática (questão de pesquisa)', 'Substantivo', 'L’introduction pose clairement la problématique de cette thèse.', 'A introdução apresenta claramente a problemática desta tese.'],
  ['fr-v4-c1-4', 'Le protocole expérimental', '/lə pʁɔ.tɔ.kɔl ɛk.spe.ʁi.mɑ̃.tal/', 'O protocolo experimental', 'Substantivo', 'Le protocole expérimental garantit la reproductibilité des mesures.', 'O protocolo experimental garante a reprodutibilidade das medições.'],
  ['fr-v4-c1-4', 'Postuler', '/pɔs.ty.le/', 'Postular / pressupor', 'Verbo', 'Cette théorie postule un lien direct entre les deux variables.', 'Esta teoria postula uma relação direta entre as duas variáveis.'],

  // fr-v4-c1-5: Débat Citoyen et Argumentation Dialectique (existing: Un clivage, La concertation, Prévaloir)
  ['fr-v4-c1-5', 'La dialectique', '/la dja.lɛk.tik/', 'A dialética', 'Substantivo', 'Une approche dialectique permet de dépasser les oppositions simplistes.', 'Uma abordagem dialética permite superar oposições simplistas.'],
  ['fr-v4-c1-5', 'L’intérêt général', '/lɛ̃.te.ʁɛ ʒe.ne.ʁal/', 'O interesse geral / público', 'Substantivo', 'La décision finale doit privilégier l’intérêt général.', 'A decisão final deve privilegiar o interesse geral.'],
  ['fr-v4-c1-5', 'Faire consensus', '/fɛʁ kɔ̃.sɑ̃.sys/', 'Gerar consenso', 'Expressão', 'Cette proposition modérée finit par faire consensus.', 'Esta proposta moderada acaba gerando consenso.'],

  // fr-v4-c1-6: Cybersécurité et Gouvernance des Données (existing: L’hameçonnage, Le chiffrement, Un rançongiciel)
  ['fr-v4-c1-6', 'La conformité RGPD', '/la kɔ̃.fɔʁ.mi.te ɛʁ.ʒe.pe.de/', 'A conformidade com o RGPD', 'Substantivo', 'L’audit vérifie la conformité RGPD de chaque base de données.', 'A auditoria verifica a conformidade RGPD de cada banco de dados.'],
  ['fr-v4-c1-6', 'Une faille de sécurité', '/yn faj də se.ky.ʁi.te/', 'Uma falha de segurança', 'Substantivo', 'Le correctif corrige une faille de sécurité critique.', 'A atualização corrige uma falha de segurança crítica.'],
  ['fr-v4-c1-6', 'La résilience numérique', '/la ʁe.zi.ljɑ̃s ny.me.ʁik/', 'A resiliência digital', 'Substantivo', 'Des exercices réguliers renforcent la résilience numérique de l’organisation.', 'Exercícios regulares reforçam a resiliência digital da organização.'],

  // fr-v4-c1-7: Rhétorique et Registres Soutenus (existing: Nullement, La litote, Toujours est-il que)
  ['fr-v4-c1-7', 'L’euphémisme', '/lø.fe.mism/', 'O eufemismo', 'Substantivo', 'L’euphémisme « départ volontaire » masque parfois un licenciement.', 'O eufemismo "saída voluntária" às vezes mascara uma demissão.'],
  ['fr-v4-c1-7', 'Il va sans dire que', '/il va sɑ̃ diʁ kə/', 'Nem é preciso dizer que', 'Expressão', 'Il va sans dire que la rigueur reste notre priorité absolue.', 'Nem é preciso dizer que o rigor continua sendo nossa prioridade absoluta.'],
  ['fr-v4-c1-7', 'L’emphase', '/lɑ̃.faz/', 'A ênfase', 'Substantivo', 'L’emphase de son discours a profondément marqué l’auditoire.', 'A ênfase do seu discurso marcou profundamente o auditório.'],

  // fr-v4-c1-8: Négociation Diplomatique et Multilatéralisme (existing: Prendre acte de, Souscrire à, Pourvu que)
  ['fr-v4-c1-8', 'Le multilatéralisme', '/lə myl.ti.la.te.ʁa.lism/', 'O multilateralismo', 'Substantivo', 'Le multilatéralisme demeure indispensable face aux crises climatiques.', 'O multilateralismo permanece indispensável diante das crises climáticas.'],
  ['fr-v4-c1-8', 'Formuler des réserves', '/fɔʁ.my.le de ʁe.zɛʁv/', 'Formular ressalvas / reservas', 'Expressão', 'Plusieurs délégations ont formulé des réserves sur l’alinéa trois.', 'Várias delegações formularam ressalvas sobre o parágrafo três.'],
  ['fr-v4-c1-8', 'Un traité contraignant', '/œ̃ tʁɛ.te kɔ̃.tʁɛ.ɲɑ̃/', 'Um tratado vinculante', 'Substantivo', 'Les signataires négocient un traité contraignant sur les océans.', 'Os signatários negociam um tratado vinculante sobre os oceanos.'],

  // fr-v4-c1-9: Éthique de l’Intelligence Artificielle (existing: L’explicabilité, La garantie humaine, À ceci près que)
  ['fr-v4-c1-9', 'La transparence algorithmique', '/la tʁɑ̃s.pa.ʁɑ̃s al.ɡɔ.ʁit.mik/', 'A transparência algorítmica', 'Substantivo', 'La transparence algorithmique permet aux citoyens de comprendre les décisions.', 'A transparência algorítmica permite aos cidadãos compreender as decisões.'],
  ['fr-v4-c1-9', 'Les biais automatisés', '/le bjɛ o.tɔ.ma.ti.ze/', 'Os vieses automatizados', 'Substantivo', 'Il faut auditer les jeux de données pour corriger les biais automatisés.', 'É preciso auditar os conjuntos de dados para corrigir os vieses automatizados.'],
  ['fr-v4-c1-9', 'Le contrôle humain', '/lə kɔ̃.tʁol y.mɛ̃/', 'O controle humano', 'Substantivo', 'Le contrôle humain reste obligatoire pour toute décision médicale critique.', 'O controle humano continua obrigatório para qualquer decisão médica crítica.'],

  // fr-v4-c1-10: Critique Littéraire et Analyse Stylistique (existing: Épuré / Épurée, La cadence, L’ellipse)
  ['fr-v4-c1-10', 'La voix narrative', '/la vwa na.ʁa.tiv/', 'A voz narrativa', 'Substantivo', 'La voix narrative oscille entre ironie et mélancolie tout au long du roman.', 'A voz narrativa oscila entre ironia e melancolia ao longo do romance.'],
  ['fr-v4-c1-10', 'La polyphonie', '/la pɔ.li.fɔ.ni/', 'A polifonia (múltiplas vozes)', 'Substantivo', 'La polyphonie du récit donne à chaque personnage une vérité propre.', 'A polifonia da narrativa dá a cada personagem uma verdade própria.'],
  ['fr-v4-c1-10', 'L’esthétique', '/lɛs.te.tik/', 'A estética', 'Substantivo', 'L’esthétique minimaliste de cette œuvre frappe par sa justesse.', 'A estética minimalista desta obra impressiona por sua precisão.'],
];

export const VOCAB_FIXES_FR: VocabExampleFixMap = {
  'voc-fr-a1-3-1': {
    exampleEn: 'Mon grand-père a quatre-vingts ans aujourd’hui.',
    examplePt: 'Meu avô faz oitenta anos hoje.',
  },
  'voc-fr-a1-9-1': {
    exampleEn: 'Pendant mes loisirs, j’aime faire du vélo et lire.',
    examplePt: 'Durante meu tempo livre, gosto de andar de bicicleta e ler.',
  },
  'voc-fr-a1-10-2': {
    exampleEn: 'Quel est le métier de votre sœur à Lyon ?',
    examplePt: 'Qual é a profissão da sua irmã em Lyon?',
  },
  'voc-fr-v4-a1-1-1': {
    exampleEn: 'J’achète toujours du comté dans cette fromagerie.',
    examplePt: 'Eu sempre compro queijo comté nesta queijaria.',
  },
  'voc-fr-v4-a1-1-3': {
    exampleEn: 'Gardez le ticket de caisse si vous voulez échanger un article.',
    examplePt: 'Guarde o cupom fiscal se quiser trocar algum item.',
  },
  'voc-fr-v4-a1-2-3': {
    exampleEn: 'Il y a une pharmacie ouverte juste au coin de la rue.',
    examplePt: 'Há uma farmácia aberta bem na esquina da rua.',
  },
  'voc-fr-v4-a1-8-3': {
    exampleEn: 'Ne notez jamais le code secret sur votre carte bancaire.',
    examplePt: 'Nunca anote a senha no seu cartão bancário.',
  },
  'voc-fr-v4-a1-9-1': {
    exampleEn: 'Je vais chez le coiffeur vendredi matin à dix heures.',
    examplePt: 'Vou ao cabeleireiro na sexta-feira de manhã às dez horas.',
  },
  'voc-fr-a2-1-2': {
    exampleEn: 'Je suis allé au marché ce matin pour acheter des fruits frais.',
    examplePt: 'Eu fui à feira hoje de manhã para comprar frutas frescas.',
  },
  'voc-fr-a2-1-3': {
    exampleEn: 'J’ai fait mes exercices de français avant le dîner.',
    examplePt: 'Eu fiz meus exercícios de francês antes do jantar.',
  },
  'voc-fr-a2-4-2': {
    exampleEn: 'Ces fraises ont l’air délicieuses, j’en veux une barquette !',
    examplePt: 'Esses morangos parecem deliciosos, eu quero uma caixinha!',
  },
  'voc-fr-a2-5-1': {
    exampleEn: 'Pouvons-nous régler notre addition au comptoir, s’il vous plaît ?',
    examplePt: 'Podemos pagar nossa conta no balcão, por favor?',
  },
  'voc-fr-v4-a2-2-3': {
    exampleEn: 'Présentez votre passeport et le permis de conduire au comptoir.',
    examplePt: 'Apresente seu passaporte e a carteira de motorista no balcão.',
  },
  'voc-fr-v4-a2-3-2': {
    exampleEn: 'Pouvez-vous me confirmer les ingrédients de cette sauce ?',
    examplePt: 'Pode me confirmar os ingredientes deste molho?',
  },
  'voc-fr-v4-a2-4-3': {
    exampleEn: 'L’étiquette sur ma valise indique mon nom et mon numéro de vol.',
    examplePt: 'A etiqueta na minha mala indica meu nome e o número do meu voo.',
  },
  'voc-fr-v4-a2-6-1': {
    exampleEn: 'Je vais à la salle de sport trois fois par semaine après le travail.',
    examplePt: 'Vou à academia três vezes por semana depois do trabalho.',
  },
  'voc-fr-v4-a2-9-1': {
    exampleEn: 'Le marché du dimanche matin propose d’excellents fromages locaux.',
    examplePt: 'A feira de domingo de manhã oferece excelentes queijos locais.',
  },
  'voc-fr-b1-2-3': {
    exampleEn: 'Tu peux être fier de tes progrès en français cette année.',
    examplePt: 'Você pode ter orgulho do seu progresso em francês este ano.',
  },
  'voc-fr-b1-5-1': {
    exampleEn: 'J’ai préparé mon entretien avec la responsable des ressources humaines.',
    examplePt: 'Preparei minha entrevista com a responsável de recursos humanos.',
  },
  'voc-fr-b1-7-1': {
    exampleEn: 'Au Québec, on envoie un courriel plutôt qu’un e-mail.',
    examplePt: 'No Québec, envia-se um "courriel" em vez de um e-mail.',
  },
  'voc-fr-b1-8-3': {
    exampleEn: 'Cette entreprise privilégie un développement durable et local.',
    examplePt: 'Esta empresa prioriza um desenvolvimento sustentável e local.',
  },
  'voc-fr-b1-9-3': {
    exampleEn: 'Une rumeur infondée a circulé rapidement sur les réseaux sociaux.',
    examplePt: 'Um boato infundado circulou rapidamente nas redes sociais.',
  },
  'voc-fr-v4-b1-1-1': {
    exampleEn: 'Le pharmacien a vérifié l’ordonnance avant de me donner le traitement.',
    examplePt: 'O farmacêutico conferiu a receita médica antes de me entregar o tratamento.',
  },
  'voc-fr-v4-b1-1-2': {
    exampleEn: 'Il faut déclarer le médecin traitant auprès de l’Assurance Maladie.',
    examplePt: 'É preciso declarar o médico clínico de referência junto ao seguro saúde.',
  },
  'voc-fr-v4-b1-2-1': {
    exampleEn: 'Elle a réussi un entretien d’embauche très exigeant hier matin.',
    examplePt: 'Ela foi aprovada em uma entrevista de emprego muito exigente ontem de manhã.',
  },
  'voc-fr-v4-b1-2-2': {
    exampleEn: 'L’offre précise le salaire brut annuel ainsi que les primes.',
    examplePt: 'A proposta especifica o salário bruto anual, bem como os bônus.',
  },
  'voc-fr-v4-b1-7-3': {
    exampleEn: 'De nombreux citoyens souhaitent s’engager dans la vie associative.',
    examplePt: 'Muitos cidadãos desejam engajar-se na vida associativa.',
  },
  'voc-fr-v4-b1-8-3': {
    exampleEn: 'Il faut envoyer le courrier avant l’échéance fixée dans le bail.',
    examplePt: 'É preciso enviar a carta antes do prazo final fixado no contrato.',
  },
  'voc-fr-idioms-b1-3': {
    exampleEn: 'Cet exercice de grammaire, c’est du gâteau pour toi !',
    examplePt: 'Este exercício de gramática é moleza para você!',
  },
  'voc-fr-idioms-b1-4': {
    exampleEn: 'Ils ont eu le coup de foudre dès leur première rencontre à Paris.',
    examplePt: 'Foi amor à primeira vista logo no primeiro encontro deles em Paris.',
  },
  'voc-fr-b2-1-3': {
    exampleEn: 'Parlez plus lentement si vous souhaitez que tout le monde suive.',
    examplePt: 'Fale mais devagar se quiser que todos acompanhem.',
  },
  'voc-fr-b2-2-2': {
    exampleEn: 'J’ai dû faire réparer mon ordinateur portable avant le séminaire.',
    examplePt: 'Tive que mandar consertar meu notebook antes do seminário.',
  },
  'voc-fr-b2-2-3': {
    exampleEn: 'La confiance en soi se construit progressivement par la pratique.',
    examplePt: 'A autoconfiança constrói-se progressivamente por meio da prática.',
  },
  'voc-fr-b2-6-2': {
    exampleEn: 'Nous devons respecter cette échéance pour éviter toute pénalité.',
    examplePt: 'Devemos respeitar esse prazo limite para evitar qualquer multa.',
  },
  'voc-fr-b2-6-3': {
    exampleEn: 'Il faudra relancer le client par téléphone s’il ne répond pas demain.',
    examplePt: 'Será preciso cobrar um retorno do cliente por telefone se ele não responder amanhã.',
  },
  'voc-fr-b2-8-2': {
    exampleEn: 'Elle a choisi une filière scientifique très demandée à l’université.',
    examplePt: 'Ela escolheu uma área científica muito procurada na universidade.',
  },
  'voc-fr-b2-8-3': {
    exampleEn: 'Grâce à une bourse d’études, il a pu suivre son master à Lyon.',
    examplePt: 'Graças a uma bolsa de estudos, ele pôde fazer seu mestrado em Lyon.',
  },
  'voc-fr-b2-9-1': {
    exampleEn: 'L’aménagement du quartier inclut désormais de larges zones piétonnes.',
    examplePt: 'O planejamento do bairro inclui agora amplas zonas de pedestres.',
  },
  'voc-fr-v4-b2-1-3': {
    exampleEn: 'Une écoute active permet de désamorcer la tension dès le début.',
    examplePt: 'Uma escuta ativa permite desarmar a tensão logo no início.',
  },
  'voc-fr-v4-b2-2-2': {
    exampleEn: 'Le biais de confirmation est un biais cognitif très fréquent en ligne.',
    examplePt: 'O viés de confirmação é um viés cognitivo muito frequente online.',
  },
  'voc-fr-v4-b2-2-3': {
    exampleEn: 'Le porte-parole a dû démentir ces allégations dans la presse.',
    examplePt: 'O porta-voz teve que desmentir essas alegações na imprensa.',
  },
  'voc-fr-v4-b2-4-2': {
    exampleEn: 'Après deux relances sans réponse, elle a envoyé une mise en demeure.',
    examplePt: 'Após duas cobranças sem resposta, ela enviou uma notificação extrajudicial.',
  },
  'voc-fr-v4-b2-6-2': {
    exampleEn: 'Ce studio mal isolé est une véritable passoire thermique en hiver.',
    examplePt: 'Este estúdio mal isolado é uma verdadeira peneira térmica no inverno.',
  },
  'voc-fr-v4-b2-7-1': {
    exampleEn: 'L’épargne de précaution doit couvrir au moins trois mois de dépenses.',
    examplePt: 'A reserva de emergência deve cobrir pelo menos três meses de despesas.',
  },
  'voc-fr-v4-b2-8-3': {
    exampleEn: 'Adopter un modèle durable suppose de repenser nos chaînes de production.',
    examplePt: 'Adotar um modelo sustentável pressupõe repensar nossas cadeias produtivas.',
  },
  'voc-fr-v4-b2-9-3': {
    exampleEn: 'Il existe une nuance lexicale claire entre l’usage québécois et l’usage parisien.',
    examplePt: 'Existe uma nuance lexical clara entre o uso quebequense e o uso parisiense.',
  },
  'voc-fr-taboo-register-b2-4': {
    exampleEn: 'Arrêtez de foutre le bordel dans le salon avant l’arrivée des invités.',
    examplePt: 'Parem de fazer bagunça na sala antes da chegada dos convidados.',
  },
  'voc-fr-c1-1-3': {
    exampleEn: 'Maîtriser trois langues constitue un atout majeur sur le marché du travail.',
    examplePt: 'Dominar três idiomas constitui um trunfo importante no mercado de trabalho.',
  },
  'voc-fr-v4-c1-6-1': {
    exampleEn: 'L’hameçonnage reste la première porte d’entrée des cyberattaques.',
    examplePt: 'O phishing continua sendo a principal porta de entrada dos ciberataques.',
  },
  'voc-fr-v4-c1-7-2': {
    exampleEn: 'Dire « ce n’est pas mauvais » pour louer un plat illustre bien la litote.',
    examplePt: 'Dizer "não está nada mal" para elogiar um prato ilustra bem a lítotes.',
  },
  'voc-fr-v4-c1-9-1': {
    exampleEn: 'L’explicabilité des modèles d’IA est indispensable dans le secteur médical.',
    examplePt: 'A explicabilidade dos modelos de IA é indispensável no setor médico.',
  },
  'voc-fr-v4-c1-9-3': {
    exampleEn: 'Le système fonctionne bien, à ceci près que les cas rares exigent une relecture humaine.',
    examplePt: 'O sistema funciona bem, com a ressalva de que os casos raros exigem revisão humana.',
  },
  'voc-fr-v4-c1-10-2': {
    exampleEn: 'La cadence régulière de ses phrases confère au récit une musicalité singulière.',
    examplePt: 'A cadência regular de suas frases confere à narrativa uma musicalidade singular.',
  },
};
