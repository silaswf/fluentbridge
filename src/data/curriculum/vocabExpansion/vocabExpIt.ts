import type { VocabExampleFixMap, VocabExpansionTuple } from './types';

export const VOCAB_EXP_IT: VocabExpansionTuple[] = [
  // it-a1-1: Cumprimentos, Lei vs. Tu & Falsi Amici (existing: Buongiorno, Caldo, Burro)
  ['it-a1-1', 'Arrivederci', '/ar.ri.veˈder.tʃi/', 'Até logo (formal/neutro)', 'Espressione', 'Grazie di tutto, arrivederci a domani!', 'Obrigado por tudo, até logo e até amanhã!'],
  ['it-a1-1', 'Salire', '/saˈli.re/', 'Subir (falso amigo: não é sair)', 'Verbo', 'Per andare in ufficio devo salire al terzo piano.', 'Para ir ao escritório preciso subir ao terceiro andar.'],
  ['it-a1-1', 'Piacere', '/pjaˈtʃe.re/', 'Prazer (ao se apresentar)', 'Espressione', 'Piacere di conoscerla, signora Conti.', 'Prazer em conhecê-la, senhora Conti.'],

  // it-a1-2: Pronúncia Italiana: C, G, GL, GN, SC & Doppie (existing: Chiave, Famiglia, Notte)
  ['it-a1-2', 'Gnocchi', '/ˈɲɔk.ki/', 'Nhoque (som de gn = nh)', 'Sostantivo', 'La domenica mia nonna prepara gli gnocchi fatti in casa.', 'Aos domingos minha avó prepara nhoque feito em casa.'],
  ['it-a1-2', 'Pesce', '/ˈpeʃ.ʃe/', 'Peixe (som de sc + e = x)', 'Sostantivo', 'In questo ristorante cucinano il pesce fresco ogni giorno.', 'Neste restaurante cozinham peixe fresco todos os dias.'],
  ['it-a1-2', 'Carro', '/ˈkar.ro/', 'Carroça / vagão (duplo r vs. caro)', 'Sostantivo', 'Nel film antico si vede un carro trainato da due cavalli.', 'No filme antigo vê-se uma carroça puxada por dois cavalos.'],

  // it-a1-3: Essere, Avere & Os Artigos (existing: Zaino, Studente, Appunti)
  ['it-a1-3', 'Specchio', '/ˈspɛk.kjo/', 'Espelho (usa artigo lo/gli)', 'Sostantivo', 'Lo specchio del bagno è molto grande e luminoso.', 'O espelho do banheiro é muito grande e iluminado.'],
  ['it-a1-3', 'Orologio', '/o.roˈlɔ.dʒo/', 'Relógio (usa artigo l’)', 'Sostantivo', 'Questo orologio della stazione segna le otto in punto.', 'O relógio da estação marca oito horas em ponto.'],
  ['it-a1-3', 'Amico', '/aˈmi.ko/', 'Amigo (plural: gli amici)', 'Sostantivo', 'Marco è il mio migliore amico dai tempi della scuola.', 'Marco é o meu melhor amigo desde os tempos da escola.'],

  // it-a1-4: No Bar & Trattoria: Café e Massas (existing: Conto, Banco, Vorrei)
  ['it-a1-4', 'Coperto', '/koˈpɛr.to/', 'Taxa de serviço de mesa / couvert', 'Sostantivo', 'In questa trattoria il coperto costa due euro a persona.', 'Nesta trattoria o couvert custa dois euros por pessoa.'],
  ['it-a1-4', 'Cornetto', '/korˈnet.to/', 'Croissant italiano (pão doce matinal)', 'Sostantivo', 'Al bar prendo sempre un cappuccino e un cornetto alla crema.', 'No bar sempre peço um cappuccino e um croissant de creme.'],
  ['it-a1-4', 'Cameriere', '/ka.meˈrjɛ.re/', 'Garçom', 'Sostantivo', 'Scusi cameriere, possiamo avere un’altra bottiglia d’acqua?', 'Com licença garçom, podemos pedir outra garrafa de água?'],

  // it-a1-5: Números, Horas, Datas & Preços (existing: Lunedì, Biglietto, Mezzogiorno)
  ['it-a1-5', 'Orario', '/oˈra.rjo/', 'Horário', 'Sostantivo', 'Qual è un orario comodo per visitare il museo oggi?', 'Qual é o horário de funcionamento do museu hoje?'],
  ['it-a1-5', 'Prezzo', '/ˈprɛt.tso/', 'Preço', 'Sostantivo', 'Il prezzo del biglietto include anche la visita guidata.', 'O preço do ingresso inclui também a visita guiada.'],
  ['it-a1-5', 'Mezzanotte', '/mɛd.dzaˈnɔt.te/', 'Meia-noite', 'Sostantivo', 'L’ultimo autobus parte dal centro a mezzanotte.', 'O último ônibus sai do centro à meia-noite.'],

  // it-a1-6: Família, Casa & Possessivos (existing: Genitori, Camera, Sorella)
  ['it-a1-6', 'Fratello', '/fraˈtɛl.lo/', 'Irmão', 'Sostantivo', 'Mio fratello vive a Torino da quasi cinque anni.', 'Meu irmão mora em Turim há quase cinco anos.'],
  ['it-a1-6', 'Cucina', '/kuˈtʃi.na/', 'Cozinha', 'Sostantivo', 'La nostra cucina è piccola ma molto accogliente.', 'Nossa cozinha é pequena, mas muito acolhedora.'],
  ['it-a1-6', 'Cugino', '/kuˈdʒi.no/', 'Primo', 'Sostantivo', 'Mio cugino viene a trovarci questo fine settimana.', 'Meu primo vem nos visitar neste fim de semana.'],

  // it-a1-7: Rotina Diária & Verbos Reflexivos (existing: Svegliarsi, Colazione, Riposarsi)
  ['it-a1-7', 'Alzarsi', '/alˈtsar.si/', 'Levantar-se', 'Verbo', 'Durante la settimana devo alzarsi presto? No, posso alzarmi alle sette.', 'Preciso levantar cedo durante a semana? Não, posso me levantar às sete.'],
  ['it-a1-7', 'Vestirsi', '/veˈstir.si/', 'Vestir-se', 'Verbo', 'Dopo la doccia è ora di vestirsi per andare al lavoro.', 'Depois do banho é hora de se vestir para ir trabalhar.'],
  ['it-a1-7', 'Addormentarsi', '/ad.dor.menˈtar.si/', 'Adormecer / pegar no sono', 'Verbo', 'Quando leggo a letto riesco ad addormentarmi in dieci minuti.', 'Quando leio na cama consigo pegar no sono em dez minutos.'],

  // it-a1-8: Clima, Estações & Lazer (existing: Piove, Primavera, Tempo libero)
  ['it-a1-8', 'Estate', '/eˈsta.te/', 'Verão', 'Sostantivo', 'In estate vado spesso al mare con gli amici.', 'No verão vou frequentemente à praia com os amigos.'],
  ['it-a1-8', 'Nuvoloso', '/nu.voˈlo.zo/', 'Nublado', 'Aggettivo', 'Oggi il cielo è nuvoloso, ma non fa freddo.', 'Hoje o céu está nublado, mas não faz frio.'],
  ['it-a1-8', 'Passeggiata', '/pas.sedˈdʒa.ta/', 'Passeio / caminhada', 'Sostantivo', 'Nel pomeriggio facciamo una bella passeggiata nel parco.', 'À tarde fazemos uma bela caminhada no parque.'],

  // it-a1-9: No Supermercado, Feira & Quantidades (existing: Etto, Spesa, Fragole)
  ['it-a1-9', 'Chilo', '/ˈki.lo/', 'Quilo', 'Sostantivo', 'Vorrei un chilo di pomodori maturi, per favore.', 'Gostaria de um quilo de tomates maduros, por favor.'],
  ['it-a1-9', 'Carrello', '/karˈrɛl.lo/', 'Carrinho de compras', 'Sostantivo', 'Prendo un carrello perché oggi devo comprare molte cose.', 'Vou pegar um carrinho porque hoje preciso comprar muitas coisas.'],
  ['it-a1-9', 'Cassa', '/ˈkas.sa/', 'Caixa (pagamento)', 'Sostantivo', 'C’è poca fila alla cassa numero tre.', 'Há pouca fila no caixa número três.'],

  // it-a1-10: Cidade, Lugares & Pedindo Informações (existing: Dritto, Accanto a, Ufficio postale)
  ['it-a1-10', 'Piazza', '/ˈpjat.tsa/', 'Praça', 'Sostantivo', 'La cattedrale si trova proprio al centro della piazza.', 'A catedral fica bem no centro da praça.'],
  ['it-a1-10', 'Incrocio', '/inˈkro.tʃo/', 'Cruzamento', 'Sostantivo', 'Al prossimo incrocio giri a destra e poi continui dritto.', 'No cruzamento vire à direita e depois siga reto.'],
  ['it-a1-10', 'Farmacia', '/far.maˈtʃi.a/', 'Farmácia', 'Sostantivo', 'Scusi, sa dov’è la farmacia più vicina?', 'Com licença, o senhor sabe onde fica a farmácia mais próxima?'],

  // it-v4-a1-1: Supermercado & Balcão de Frios (existing: Etto, Busta, Scontrino)
  ['it-v4-a1-1', 'Prosciutto', '/proˈʃut.to/', 'Presunto', 'Sostantivo', 'Mi dà due etti di prosciutto crudo tagliato fine?', 'Pode me dar duzentos gramas de presunto cru fatiado fino?'],
  ['it-v4-a1-1', 'Formaggio', '/forˈmad.dʒo/', 'Queijo', 'Sostantivo', 'Vorrei assaggiare quel formaggio stagionato prima di comprarlo.', 'Gostaria de experimentar aquele queijo curado antes de comprá-lo.'],
  ['it-v4-a1-1', 'Fetta', '/ˈfet.ta/', 'Fatia', 'Sostantivo', 'Preferisco il pane tagliato a fette sottili.', 'Prefiro o pão cortado em fatias finas.'],

  // it-v4-a1-2: Farmácia & Sintomas Leves (existing: Ricetta, Compressa, Raffreddore)
  ['it-v4-a1-2', 'Tosse', '/ˈtos.se/', 'Tosse', 'Sostantivo', 'Ho una tosse secca da tre giorni e vorrei uno sciroppo.', 'Estou com uma tosse seca há três dias e gostaria de um xarope.'],
  ['it-v4-a1-2', 'Febbre', '/ˈfɛb.bre/', 'Febre', 'Sostantivo', 'Stamattina ho misurato la febbre e avevo trentotto.', 'Hoje de manhã medi a febre e estava com trinta e oito.'],
  ['it-v4-a1-2', 'Sciroppo', '/ʃiˈrɔp.po/', 'Xarope', 'Sostantivo', 'Il farmacista mi ha consigliato questo sciroppo naturale.', 'O farmacêutico me recomendou este xarope natural.'],

  // it-v4-a1-3: Trem, Ônibus & Bilhetes (existing: Binario, Convalidare, Fermata)
  ['it-v4-a1-3', 'Coincidenza', '/ko.in.tʃiˈdɛn.tsa/', 'Conexão / baldeação', 'Sostantivo', 'Devo fare attenzione a non perdere la coincidenza a Bologna.', 'Preciso prestar atenção para não perder a conexão em Bolonha.'],
  ['it-v4-a1-3', 'Macchinetta', '/mak.kiˈnet.ta/', 'Máquina de autoatendimento / validação', 'Sostantivo', 'Puoi comprare i biglietti direttamente alla macchinetta automatica.', 'Você pode comprar as passagens diretamente na máquina automática.'],
  ['it-v4-a1-3', 'Capolinea', '/ka.poˈli.ne.a/', 'Ponto final (ônibus/metrô)', 'Sostantivo', 'Scendiamo al capolinea, è l’ultima fermata della linea.', 'Descemos no ponto final, é a última parada da linha.'],

  // it-v4-a1-4: Hotel & Check-in (existing: Prenotazione, Colazione, Deposito bagagli)
  ['it-v4-a1-4', 'Chiave', '/ˈkja.ve/', 'Chave', 'Sostantivo', 'Ecco la chiave della sua camera al secondo piano.', 'Aqui está a chave do seu quarto no segundo andar.'],
  ['it-v4-a1-4', 'Ascensore', '/aʃ.ʃenˈso.re/', 'Elevador', 'Sostantivo', 'Un ascensore comodo si trova in fondo al corridoio a sinistra.', 'O elevador fica no fundo do corredor à esquerda.'],
  ['it-v4-a1-4', 'Reception', '/reˈsɛp.ʃon/', 'Recepção', 'Sostantivo', 'La reception è aperta ventiquattro ore su ventiquattro.', 'A recepção fica aberta vinte e quatro horas por dia.'],

  // it-v4-a1-5: Aeroporto & Embarque (existing: Carta d’imbarco, Finestrino, Corridoio)
  ['it-v4-a1-5', 'Bagaglio', '/baˈɡaʎ.ʎo/', 'Bagagem', 'Sostantivo', 'Posso portare questo zaino come bagaglio a mano?', 'Posso levar esta mochila como bagagem de mão?'],
  ['it-v4-a1-5', 'Imbarco', '/imˈbar.ko/', 'Embarque', 'Sostantivo', 'Il nostro imbarco per il volo su Roma inizia tra venti minuti.', 'O embarque para o voo para Roma começa em vinte minutos.'],
  ['it-v4-a1-5', 'Passaporto', '/pas.saˈpɔr.to/', 'Passaporte', 'Sostantivo', 'Tenga pronto il passaporto per il controllo alla frontiera.', 'Mantenha o passaporte pronto para o controle na fronteira.'],

  // it-v4-a1-6: Roupas, Cores & Tamanhos (existing: Taglia, Camerino, Stretto)
  ['it-v4-a1-6', 'Largo', '/ˈlar.ɡo/', 'Largo / folgado', 'Aggettivo', 'Questo cappotto è troppo largo sulle spalle, provo una taglia in meno.', 'Este casaco está muito largo nos ombros, vou provar um tamanho menor.'],
  ['it-v4-a1-6', 'Maglione', '/maʎˈʎo.ne/', 'Suéter / blusa de frio', 'Sostantivo', 'Mi piace molto questo maglione blu di lana.', 'Gosto muito deste suéter azul de lã.'],
  ['it-v4-a1-6', 'Provare', '/proˈva.re/', 'Provar / experimentar', 'Verbo', 'Scusi, posso provare questi pantaloni nel camerino?', 'Com licença, posso experimentar esta calça no provador?'],

  // it-v4-a1-7: Emergências (112 / 118) (existing: Emergenza, Ambulanza, Indirizzo)
  ['it-v4-a1-7', 'Aiuto', '/aˈju.to/', 'Socorro / ajuda', 'Sostantivo', 'Aiuto, per favore! Qualcuno chiami subito i soccorsi!', 'Socorro, por favor! Alguém chame o resgate imediatamente!'],
  ['it-v4-a1-7', 'Polizia', '/po.litˈtsi.a/', 'Polícia', 'Sostantivo', 'Ho chiamato la polizia per segnalare il furto della borsa.', 'Chamei a polícia para registrar o furto da bolsa.'],
  ['it-v4-a1-7', 'Pronto soccorso', '/ˈpronto sokˈkor.so/', 'Pronto-socorro', 'Sostantivo', 'Dobbiamo andare subito al pronto soccorso più vicino.', 'Precisamos ir imediatamente ao pronto-socorro mais próximo.'],

  // it-v4-a1-8: Banco & Caixa Eletrônico (existing: Bancomat, Prelevare, Contanti)
  ['it-v4-a1-8', 'Sportello', '/sporˈtɛl.lo/', 'Guichê / caixa de atendimento', 'Sostantivo', 'Per cambiare le banconote deve rivolgersi allo sportello due.', 'Para trocar as cédulas deve se dirigir ao guichê dois.'],
  ['it-v4-a1-8', 'Carta di credito', '/ˈkar.ta di ˈkre.di.to/', 'Cartão de crédito', 'Sostantivo', 'Accettate pagamenti con carta di credito o solo contanti?', 'Vocês aceitam pagamentos com cartão de crédito ou só dinheiro?'],
  ['it-v4-a1-8', 'Resto', '/ˈrɛ.sto/', 'Troco', 'Sostantivo', 'Ecco i cinquanta euro, tenga pure il resto.', 'Aqui estão os cinquenta euros, pode ficar com o troco.'],

  // it-v4-a1-9: Barbearia, Salão & Serviços (existing: Taglio, Stirare, Appuntamento)
  ['it-v4-a1-9', 'Lavanderia', '/la.van.deˈri.a/', 'Lavanderia', 'Sostantivo', 'Devo portare il completo grigio in lavanderia prima di venerdì.', 'Preciso levar o terno cinza à lavanderia antes de sexta-feira.'],
  ['it-v4-a1-9', 'Barba', '/ˈbar.ba/', 'Barba', 'Sostantivo', 'Vorrei fare sia il taglio dei capelli sia la barba.', 'Gostaria de fazer tanto o corte de cabelo quanto a barba.'],
  ['it-v4-a1-9', 'Riparazione', '/ri.pa.ratˈtsjo.ne/', 'Conserto / reparo', 'Sostantivo', 'Quanto tempo ci vuole per la riparazione di queste scarpe?', 'Quanto tempo leva para o conserto destes sapatos?'],

  // it-v4-a1-10: Compromissos, Horários & Atrasos (existing: In orario, Ritardo, Spostare)
  ['it-v4-a1-10', 'Puntuale', '/punˈtu.a.le/', 'Pontual', 'Aggettivo', 'Cerco sempre di essere puntuale agli incontri di lavoro.', 'Procuro sempre ser pontual nas reuniões de trabalho.'],
  ['it-v4-a1-10', 'Avvisare', '/av.viˈza.re/', 'Avisar', 'Verbo', 'Se arrivi tardi, ricordati di avvisare con un messaggio.', 'Se você chegar atrasado, lembre-se de avisar com uma mensagem.'],
  ['it-v4-a1-10', 'Confermare', '/kon.ferˈma.re/', 'Confirmar', 'Verbo', 'Ti scrivo per confermare il nostro appuntamento di giovedì.', 'Estou escrevendo para confirmar nosso compromisso de quinta-feira.'],

  // it-a2-1: Passato Prossimo: Avere vs. Essere (existing: Ieri, Partire, Rimanere)
  ['it-a2-1', 'Tornare', '/torˈna.re/', 'Voltar (usa essere no passato)', 'Verbo', 'I miei amici sono dovuti tornare a casa prima di cena.', 'Meus amigos tiveram que voltar para casa antes do jantar.'],
  ['it-a2-1', 'Arrivare', '/ar.riˈva.re/', 'Chegar (usa essere no passato)', 'Verbo', 'Il treno è riuscito ad arrivare in stazione con dieci minuti di anticipo.', 'O trem conseguiu chegar à estação com dez minutos de antecedência.'],
  ['it-a2-1', 'Stamattina', '/sta.matˈti.na/', 'Hoje de manhã', 'Avverbio', 'Stamattina ho bevuto un caffè veloce e sono uscito subito.', 'Hoje de manhã tomei um café rápido e saí logo.'],

  // it-a2-2: Compras, Moda & Tamanhos em Milão (existing: Taglia, Saldi, Scontrino)
  ['it-a2-2', 'Vetrina', '/veˈtri.na/', 'Vitrine', 'Sostantivo', 'Ho visto una giacca bellissima nella vetrina di quel negozio.', 'Vi uma jaqueta lindíssima na vitrine daquela loja.'],
  ['it-a2-2', 'Commesso', '/komˈmes.so/', 'Vendedor / atendente', 'Sostantivo', 'Il commesso è stato molto gentile e mi ha cercato un’altra taglia.', 'O vendedor foi muito simpático e procurou outro tamanho para mim.'],
  ['it-a2-2', 'Sconto', '/ˈskon.to/', 'Desconto', 'Sostantivo', 'Con la tessera fedeltà c’è uno sconto del venti per cento.', 'Com o cartão fidelidade há um desconto de vinte por cento.'],

  // it-a2-3: Transportes, Trens Trenitalia & Direções (existing: Binario, Sinistra, Ritardo)
  ['it-a2-3', 'Andata e ritorno', '/anˈda.ta e riˈtor.no/', 'Ida e volta', 'Espressione', 'Vorrei un biglietto di andata e ritorno per Firenze.', 'Gostaria de uma passagem de ida e volta para Florença.'],
  ['it-a2-3', 'Sottopassaggio', '/sot.to.pasˈsad.dʒo/', 'Passagem subterrânea', 'Sostantivo', 'Per raggiungere il binario cinque bisogna prendere il sottopassaggio.', 'Para chegar à plataforma cinco é preciso pegar a passagem subterrânea.'],
  ['it-a2-3', 'Destra', '/ˈdɛ.stra/', 'Direita', 'Sostantivo', 'La biglietteria si trova subito dopo l’ingresso, sulla destra.', 'A bilheteria fica logo depois da entrada, à direita.'],

  // it-a2-4: Preposizioni Articolate (existing: Nel, Sul, Scrivania)
  ['it-a2-4', 'Dal', '/dal/', 'Do / na casa de / no consultório de (da + il)', 'Preposizione', 'Oggi pomeriggio vado dal dentista per un controllo.', 'Hoje à tarde vou ao dentista para uma consulta de rotina.'],
  ['it-a2-4', 'Degli', '/ˈdeʎ.ʎi/', 'Dos (di + gli)', 'Preposizione', 'I libri degli studenti sono rimasti nell’aula magna.', 'Os livros dos estudantes ficaram no auditório principal.'],
  ['it-a2-4', 'Sulla', '/ˈsul.la/', 'Sobre a / na (su + la)', 'Preposizione', 'Ho lasciato le chiavi della macchina sulla sedia in cucina.', 'Deixei as chaves do carro sobre a cadeira na cozinha.'],

  // it-a2-5: Imperfetto: Memórias, Hábitos & Descrições (existing: Mentre, Nonni, Tramonto)
  ['it-a2-5', 'Infanzia', '/inˈfan.tsja/', 'Infância', 'Sostantivo', 'Durante la mia infanzia passavo tutte le estati in campagna.', 'Durante a minha infância passava todos os verões no campo.'],
  ['it-a2-5', 'Abitudine', '/a.biˈtu.di.ne/', 'Hábito / costume', 'Sostantivo', 'Avevamo questa bella abitudine di cenare tutti insieme alle otto.', 'Tínhamos o hábito de jantar todos juntos às oito.'],
  ['it-a2-5', 'Di solito', '/di ˈsɔ.li.to/', 'Geralmente / de costume', 'Espressione', 'Da bambino di solito giocavo in cortile dopo la scuola.', 'Quando criança geralmente brincava no pátio depois da escola.'],

  // it-a2-6: Saúde, Corpo & Farmácia na Itália (existing: Gola, Ricetta, Raffreddore)
  ['it-a2-6', 'Mal di testa', '/mal di ˈtɛ.sta/', 'Dor de cabeça', 'Espressione', 'Ho un forte mal di testa perché ho dormito poco stanotte.', 'Estou com uma forte dor de cabeça porque dormi pouco esta noite.'],
  ['it-a2-6', 'Stomaco', '/ˈstɔ.ma.ko/', 'Estômago', 'Sostantivo', 'Dopo quella cena pesante mi fa ancora male lo stomaco.', 'Depois daquele jantar pesado meu estômago ainda dói.'],
  ['it-a2-6', 'Visita', '/ˈvi.zi.ta/', 'Consulta médica', 'Sostantivo', 'Ho prenotato una visita medica per martedì mattina.', 'Agendei uma consulta médica para terça-feira de manhã.'],

  // it-a2-7: Futuro Semplice: Planos, Clima & Previsões (existing: Gita, Tra, Appena)
  ['it-a2-7', 'Previsioni', '/pre.viˈzjo.ni/', 'Previsão (do tempo)', 'Sostantivo', 'Secondo le previsioni del tempo domani pioverà tutto il giorno.', 'Segundo a previsão do tempo amanhã choverá o dia inteiro.'],
  ['it-a2-7', 'Progetto', '/proˈdʒɛt.to/', 'Projeto / plano', 'Sostantivo', 'L’anno prossimo inizierò un nuovo progetto lavorativo a Milano.', 'No ano que vem começarei um novo projeto de trabalho em Milão.'],
  ['it-a2-7', 'Partenza', '/parˈtɛn.tsa/', 'Partida / saída', 'Sostantivo', 'La nostra partenza per le vacanze sarà sabato mattina presto.', 'Nossa partida para as férias será sábado bem cedo.'],

  // it-a2-8: Pronomi Diretti, Indiretti & Particelle CI / NE (existing: Volentieri, Prenotare, Abbastanza)
  ['it-a2-8', 'Consigliare', '/kon.siʎˈʎa.re/', 'Aconselhar / recomendar', 'Verbo', 'Se cerchi un buon libro, posso consigliare questo romanzo.', 'Se você procura um bom livro, posso recomendar este romance.'],
  ['it-a2-8', 'Regalare', '/re.ɡaˈla.re/', 'Presentear / dar de presente', 'Verbo', 'Non so ancora cosa regalare a mia sorella per il compleanno.', 'Ainda não sei o que dar de presente para minha irmã no aniversário.'],
  ['it-a2-8', 'Aspettare', '/a.spetˈta.re/', 'Esperar', 'Verbo', 'Ti conviene aspettare ancora cinque minuti prima di chiamarlo.', 'Convém esperar mais cinco minutos antes de ligar para ele.'],

  // it-a2-9: Hotel, Check-in & Imprevistos de Viagem (existing: Matrimoniale, Asciugamano, Rumoroso)
  ['it-a2-9', 'Singola', '/ˈsin.ɡo.la/', 'Quarto de solteiro', 'Sostantivo', 'Viaggio da solo, quindi ho prenotato una camera singola.', 'Viajo sozinho, então reservei um quarto de solteiro.'],
  ['it-a2-9', 'Aria condizionata', '/ˈa.rja kon.dit.tsjoˈna.ta/', 'Ar-condicionado', 'Sostantivo', 'Scusi, abbiamo bisogno di aria condizionata perché in camera fa troppo caldo.', 'Com licença, o ar-condicionado do meu quarto não está funcionando bem.'],
  ['it-a2-9', 'Cambiare', '/kamˈbja.re/', 'Trocar / mudar', 'Verbo', 'Possiamo cambiare camera? Questa dà su una strada troppo trafficata.', 'Podemos trocar de quarto? Este dá para uma rua muito movimentada.'],

  // it-a2-10: Festas, Tradições Italianas & Convites (existing: Volentieri, Ferragosto, Festeggiare)
  ['it-a2-10', 'Capodanno', '/ka.poˈdan.no/', 'Ano Novo / Réveillon', 'Sostantivo', 'A Capodanno in Italia è tradizione mangiare le lenticchie a mezzanotte.', 'No Ano Novo na Itália é tradição comer lentilhas à meia-noite.'],
  ['it-a2-10', 'Invito', '/inˈvi.to/', 'Convite', 'Sostantivo', 'Grazie mille per questo invito alla tua festa di laurea!', 'Muito obrigado pelo convite para a sua festa de formatura!'],
  ['it-a2-10', 'Brindisi', '/ˈbrin.di.zi/', 'Brinde', 'Sostantivo', 'Alziamo i calici per fare un brindisi alla nostra amicizia.', 'Levantemos as taças para fazer um brinde à nossa amizade.'],

  // it-v4-a2-1: Aluguel de Casa & Defeitos (existing: Caldaia, Guasto, Idraulico)
  ['it-v4-a2-1', 'Perdita', '/ˈpɛr.di.ta/', 'Vazamento', 'Sostantivo', 'C’è una perdita d’acqua sotto il lavandino della cucina.', 'Há um vazamento de água embaixo da pia da cozinha.'],
  ['it-v4-a2-1', 'Riscaldamento', '/ri.skal.daˈmen.to/', 'Aquecimento (calefação)', 'Sostantivo', 'Il riscaldamento centralizzato si accende alle sei del mattino.', 'O aquecimento central liga às seis da manhã.'],
  ['it-v4-a2-1', 'Proprietario', '/pro.prjeˈta.rjo/', 'Proprietário / senhorio', 'Sostantivo', 'Ho mandato subito una foto del problema al proprietario di casa.', 'Mandei imediatamente uma foto do problema para o proprietário da casa.'],

  // it-v4-a2-2: Aluguel de Carro & Rodovia (existing: Casello, Pieno, Multa)
  ['it-v4-a2-2', 'Pedaggio', '/peˈdad.dʒo/', 'Pedágio', 'Sostantivo', 'Puoi pagare il pedaggio autostradale con la carta o in contanti.', 'Você pode pagar o pedágio da rodovia com cartão ou em dinheiro.'],
  ['it-v4-a2-2', 'Patente', '/paˈtɛn.te/', 'Carteira de motorista (CNH)', 'Sostantivo', 'Per noleggiare l’auto devi presentare la patente valida.', 'Para alugar o carro você precisa apresentar a carteira de motorista válida.'],
  ['it-v4-a2-2', 'Parcheggio', '/parˈked.dʒo/', 'Estacionamento', 'Sostantivo', 'Abbiamo trovato un parcheggio gratuito proprio vicino al centro.', 'Encontramos um estacionamento gratuito bem perto do centro.'],

  // it-v4-a2-3: Alergias & Restrições no Restaurante (existing: Senza glutine, Lattosio, Ingredienti)
  ['it-v4-a2-3', 'Allergico', '/alˈlɛr.dʒi.ko/', 'Alérgico', 'Aggettivo', 'Sono molto allergico alle noci e alle arachidi.', 'Sou muito alérgico a nozes e amendoim.'],
  ['it-v4-a2-3', 'Intolleranza', '/in.tol.leˈran.tsa/', 'Intolerância alimentar', 'Sostantivo', 'Mia figlia ha una lieve intolleranza ai latticini.', 'Minha filha tem uma leve intolerância a laticínios.'],
  ['it-v4-a2-3', 'Sostituire', '/so.sti.tuˈi.re/', 'Substituir', 'Verbo', 'Sarebbe possibile sostituire il burro con l’olio d’oliva?', 'Seria possível substituir a manteiga por azeite de oliva?'],

  // it-v4-a2-4: Bagagem Extraviada (existing: Smarrito, Nastro, Ricevuta)
  ['it-v4-a2-4', 'Valigia', '/vaˈli.dʒa/', 'Mala', 'Sostantivo', 'La mia valigia blu non è ancora uscita sul nastro.', 'Minha mala azul ainda não saiu na esteira.'],
  ['it-v4-a2-4', 'Etichetta', '/e.tiˈket.ta/', 'Etiqueta (de bagagem)', 'Sostantivo', 'Conservi sempre questa etichetta adesiva attaccata alla carta d’imbarco.', 'Guarde sempre a etiqueta adesiva colada no cartão de embarque.'],
  ['it-v4-a2-4', 'Consegna', '/konˈseɲ.ɲa/', 'Entrega', 'Sostantivo', 'La compagnia aerea organizzerà la consegna della valigia in albergo.', 'A companhia aérea organizará a entrega da mala no hotel.'],

  // it-v4-a2-5: Poste Italiane & Encomendas (existing: Raccomandata, Mittente, Destinatario)
  ['it-v4-a2-5', 'Pacco', '/ˈpak.ko/', 'Pacote / encomenda', 'Sostantivo', 'Devo spedire un pacco urgente a mia sorella a Napoli.', 'Preciso enviar um pacote urgente para minha irmã em Nápoles.'],
  ['it-v4-a2-5', 'Francobollo', '/fran.koˈbol.lo/', 'Selo postal', 'Sostantivo', 'Quanto costa un francobollo per spedire una cartolina in Brasile?', 'Quanto custa um selo para enviar um cartão-postal ao Brasil?'],
  ['it-v4-a2-5', 'Modulo', '/ˈmɔ.du.lo/', 'Formulário', 'Sostantivo', 'Prima di andare allo sportello, compili questo modulo in stampatello.', 'Antes de ir ao guichê, preencha este formulário em letra de forma.'],

  // it-v4-a2-6: Academia & Bem-Estar (existing: Palestra, Abbonamento, Allenamento)
  ['it-v4-a2-6', 'Certificato medico', '/tʃer.ti.fiˈka.to ˈmɛ.di.ko/', 'Atestado médico', 'Sostantivo', 'In Italia serve il certificato medico sportivo per iscriversi in palestra.', 'Na Itália é necessário o atestado médico esportivo para se matricular na academia.'],
  ['it-v4-a2-6', 'Spogliatoio', '/spoʎ.ʎaˈto.jo/', 'Vestiário', 'Sostantivo', 'Gli armadietti dello spogliatoio si chiudono con un lucchetto.', 'Os armários do vestiário fecham com um cadeado.'],
  ['it-v4-a2-6', 'Istruttore', '/i.strutˈto.re/', 'Instrutor', 'Sostantivo', 'Un nuovo istruttore mi ha preparato una scheda per questa settimana.', 'O instrutor preparou uma ficha nova para mim esta semana.'],

  // it-v4-a2-7: Vizinhos de Condomínio (existing: Vicino di casa, Condominio, Raccolta differenziata)
  ['it-v4-a2-7', 'Amministratore', '/am.mi.ni.straˈto.re/', 'Síndico / administrador do condomínio', 'Sostantivo', 'Per il guasto al portone bisogna parlare con il nuovo amministratore del palazzo.', 'Para o defeito no portão é preciso avisar o síndico do prédio.'],
  ['it-v4-a2-7', 'Rumore', '/ruˈmo.re/', 'Barulho / ruído', 'Sostantivo', 'Dopo le dieci di sera è vietato fare rumore nel condominio.', 'Depois das dez da noite é proibido fazer barulho no condomínio.'],
  ['it-v4-a2-7', 'Pianerottolo', '/pja.neˈrɔt.to.lo/', 'Patamar (da escada/elevador)', 'Sostantivo', 'Non lasciate le scarpe o i sacchi della spazzatura sul pianerottolo.', 'Não deixem sapatos ou sacos de lixo no patamar.'],

  // it-v4-a2-8: Atendimento ao Cliente por Telefone (existing: Pronto, Bolletta, Rimborso)
  ['it-v4-a2-8', 'Operatore', '/o.pe.raˈto.re/', 'Atendente / operador', 'Sostantivo', 'Per parlare con un operatore prema il tasto nove.', 'Para falar com um atendente pressione a tecla nove.'],
  ['it-v4-a2-8', 'Reclamo', '/reˈkla.mo/', 'Reclamação', 'Sostantivo', 'Voglio aprire un reclamo formale per l’addebito doppio sulla bolletta.', 'Quero abrir uma reclamação formal pela cobrança dupla na fatura.'],
  ['it-v4-a2-8', 'Codice', '/ˈkɔ.di.tʃe/', 'Código / número de protocolo', 'Sostantivo', 'Può darmi il codice della pratica per seguire la richiesta?', 'Pode me dar o código do protocolo para acompanhar o pedido?'],

  // it-v4-a2-9: Feira de Bairro (existing: Di stagione, Bancarella, Maturo)
  ['it-v4-a2-9', 'Guanti', '/ˈɡwan.ti/', 'Luvas (descartáveis para pegar frutas)', 'Sostantivo', 'Per toccare la frutta e la verdura indossi sempre i guanti.', 'Para tocar nas frutas e verduras use sempre as luvas.'],
  ['it-v4-a2-9', 'Assaggio', '/asˈsad.dʒo/', 'Prova / degustação', 'Sostantivo', 'Il venditore ci ha offerto un assaggio di formaggio pecorino.', 'O vendedor nos ofereceu uma prova de queijo pecorino.'],
  ['it-v4-a2-9', 'Fresco', '/ˈfre.sko/', 'Fresco (alimento)', 'Aggettivo', 'Al mercato rionale trovi sempre pesce fresco appena pescato.', 'Na feira de bairro você sempre encontra peixe fresco recém-pescado.'],

  // it-v4-a2-10: Cozinha Italiana Cotidiana & Receitas (existing: Scolare, Soffriggere, Condire)
  ['it-v4-a2-10', 'Bollire', '/bolˈli.re/', 'Ferver', 'Verbo', 'Appena l’acqua inizia a bollire, aggiungi il sale grosso.', 'Assim que a água começar a ferver, adicione o sal grosso.'],
  ['it-v4-a2-10', 'Pentola', '/ˈpɛn.to.la/', 'Panela', 'Sostantivo', 'Metti una pentola capiente sul fuoco per cuocere la pasta.', 'Coloque uma panela grande no fogo para cozinhar o macarrão.'],
  ['it-v4-a2-10', 'Al dente', '/al ˈdɛn.te/', 'Al dente (ponto firme da massa)', 'Espressione', 'Gli spaghetti vanno scolati quando sono ancora al dente.', 'O espaguete deve ser escorrido quando ainda está al dente.'],

  // it-b1-1: Condizionale & Cortesia Profissional (existing: Preventivo, Fattura, Gentilezza)
  ['it-b1-1', 'Disponibilità', '/di.spo.ni.bi.liˈta/', 'Disponibilidade', 'Sostantivo', 'Potrebbe confermarmi la sua disponibilità per una riunione domani?', 'Poderia me confirmar sua disponibilidade para uma reunião amanhã?'],
  ['it-b1-1', 'Cortesia', '/kor.teˈzi.a/', 'Cortesia / gentileza', 'Sostantivo', 'La ringrazio per la cortesia e per la risposta rapida.', 'Agradeço pela cortesia e pela resposta rápida.'],
  ['it-b1-1', 'Allegare', '/al.leˈɡa.re/', 'Anexar', 'Verbo', 'Dovrebbe allegare il documento firmato alla sua email.', 'O senhor deveria anexar o documento assinado ao seu e-mail.'],

  // it-b1-2: Trabalho, Entrevista & Design / Tech na Itália (existing: Colloquio, Azienda, Squadra)
  ['it-b1-2', 'Competenza', '/kom.peˈtɛn.tsa/', 'Competência / habilidade', 'Sostantivo', 'La conoscenza delle lingue è una competenza molto richiesta.', 'O conhecimento de idiomas é uma competência muito procurada.'],
  ['it-b1-2', 'Assunzione', '/as.sunˈtsjo.ne/', 'Contratação', 'Sostantivo', 'Dopo lo stage di sei mesi hanno confermato la mia assunzione.', 'Após o estágio de seis meses me propuseram a contratação.'],
  ['it-b1-2', 'Lavoro da remoto', '/laˈvo.ro da reˈmɔ.to/', 'Trabalho remoto', 'Espressione', 'La nostra azienda offre due giorni di lavoro da remoto a settimana.', 'Nossa empresa oferece dois dias de trabalho remoto por semana.'],

  // it-b1-3: Imperativo & Pronomi Combinati (existing: Prestare, Sbagliare, Subito)
  ['it-b1-3', 'Mandare', '/manˈda.re/', 'Mandar / enviar', 'Verbo', 'Appena ricevi il file, cerca di mandare subito una copia a tutti.', 'Assim que receber o arquivo, procure enviar logo uma cópia a todos.'],
  ['it-b1-3', 'Spiegare', '/spjeˈɡa.re/', 'Explicar', 'Verbo', 'Se non è chiaro, posso provare a spiegare meglio il passaggio.', 'Se não está claro, posso tentar explicar melhor a etapa.'],
  ['it-b1-3', 'Portare', '/porˈta.re/', 'Levar / trazer', 'Verbo', 'Domani devi portare assolutamente i documenti firmati in ufficio.', 'Amanhã você precisa levar sem falta os documentos assinados ao escritório.'],

  // it-b1-4: Comparativi, Superlativi & Gerundio (existing: Migliore, Meglio, Comodo)
  ['it-b1-4', 'Peggiore', '/pedˈdʒo.re/', 'Pior (adjetivo)', 'Aggettivo', 'Il traffico di questa mattina è il peggiore della settimana.', 'O trânsito desta manhã é o pior da semana.'],
  ['it-b1-4', 'Vantaggioso', '/van.tadˈdʒo.zo/', 'Vantajoso', 'Aggettivo', 'Questo abbonamento annuale è molto più vantaggioso rispetto al mensile.', 'Esta assinatura anual é muito mais vantajosa em comparação à mensal.'],
  ['it-b1-4', 'Stare facendo', '/ˈsta.re faˈtʃɛn.do/', 'Estar fazendo (gerúndio)', 'Espressione', 'Non devi stare facendo rumore mentre gli altri studiano.', 'Não o atrapalhe agora: ele está fazendo uma ligação importante.'],

  // it-b1-5: Moradia, Aluguel & Vida na Itália (existing: Affitto, Bilocale, Noleggiare)
  ['it-b1-5', 'Caparra', '/kaˈpar.ra/', 'Caução / depósito de garantia', 'Sostantivo', 'Alla firma del contratto bisogna versare due mensilità di caparra.', 'Na assinatura do contrato é preciso depositar dois meses de caução.'],
  ['it-b1-5', 'Spese condominiali', '/ˈspe.ze kon.do.miˈnja.li/', 'Taxa de condomínio', 'Sostantivo', 'Nel prezzo dell’affitto non sono incluse le spese condominiali.', 'No preço do aluguel não estão incluídas as taxas de condomínio.'],
  ['it-b1-5', 'Quartiere', '/kwarˈtjɛ.re/', 'Bairro', 'Sostantivo', 'Cerco un appartamento in un quartiere tranquillo e ben collegato.', 'Procuro um apartamento em um bairro tranquilo e bem conectado.'],

  // it-b1-6: Pronomi Relativi (existing: Cui, Argomento, Puntuale)
  ['it-b1-6', 'Motivo', '/moˈti.vo/', 'Motivo / razão', 'Sostantivo', 'Non ho ancora capito il motivo per cui la riunione è stata annullata.', 'Ainda não entendi o motivo pelo qual a reunião foi cancelada.'],
  ['it-b1-6', 'Soluzione', '/so.lutˈtsjo.ne/', 'Solução', 'Sostantivo', 'La soluzione di cui abbiamo parlato ieri mi sembra la più efficace.', 'A solução da qual falamos ontem me parece a mais eficaz.'],
  ['it-b1-6', 'Proverbio', '/proˈvɛr.bjo/', 'Provérbio / ditado', 'Sostantivo', 'Conosci il proverbio che dice «Chi dorme non piglia pesci»?', 'Você conhece o provérbio que diz «Quem dorme não pega peixe»?'],

  // it-b1-7: Viagens, Arte & Cultura (existing: Capolavoro, Mostra, Fila)
  ['it-b1-7', 'Affresco', '/afˈfre.sko/', 'Afresco (pintura mural)', 'Sostantivo', 'Questo affresco rinascimentale è stato restaurato di recente.', 'Este afresco renascentista foi restaurado recentemente.'],
  ['it-b1-7', 'Guida turistica', '/ˈɡwi.da tuˈri.sti.ka/', 'Guia turístico / livro-guia', 'Sostantivo', 'Abbiamo prenotato una guida turistica per visitare il Colosseo.', 'Reservamos um guia turístico para visitar o Coliseu.'],
  ['it-b1-7', 'Patrimonio', '/pa.triˈmɔ.njo/', 'Patrimônio', 'Sostantivo', 'Il centro storico di Venezia è patrimonio mondiale dell’umanità.', 'O centro histórico de Veneza é patrimônio mundial da humanidade.'],

  // it-b1-8: Meio Ambiente, Reciclagem & Sustentabilidade (existing: Raccolta differenziata, Spreco, Rinnovabile)
  ['it-b1-8', 'Riciclaggio', '/ri.tʃiˈklad.dʒo/', 'Reciclagem', 'Sostantivo', 'Il riciclaggio della carta riduce il taglio di nuovi alberi.', 'A reciclagem de papel reduz o corte de novas árvores.'],
  ['it-b1-8', 'Plastica', '/ˈpla.sti.ka/', 'Plástico', 'Sostantivo', 'Dobbiamo ridurre il consumo di bottiglie di plastica monouso.', 'Precisamos reduzir o consumo de garrafas de plástico descartáveis.'],
  ['it-b1-8', 'Sostenibile', '/so.steˈni.bi.le/', 'Sustentável', 'Aggettivo', 'Muoversi in bicicletta è una scelta economica e sostenibile.', 'Locomover-se de bicicleta é uma escolha econômica e sustentável.'],

  // it-b1-9: Mídia, Redes Sociais & Atualidades (existing: Condividere, Fonte, Aggiornato)
  ['it-b1-9', 'Notizia', '/noˈtit.tsja/', 'Notícia', 'Sostantivo', 'Prima di credere a una notizia, controllo sempre chi l’ha pubblicata.', 'Antes de acreditar em uma notícia, sempre verifico quem a publicou.'],
  ['it-b1-9', 'Riservatezza', '/ri.zer.vaˈtet.tsa/', 'Privacidade / confidencialidade', 'Sostantivo', 'È importante proteggere la propria riservatezza sui social network.', 'É importante proteger a própria privacidade nas redes sociais.'],
  ['it-b1-9', 'Opinione', '/o.piˈnjo.ne/', 'Opinião', 'Sostantivo', 'Rispetto la tua opinione, ma su questo tema non sono d’accordo.', 'Respeito a sua opinião, mas sobre este tema não concordo.'],

  // it-b1-10: Culinária Regional, Vinhos & Gastronomia (existing: Soffriggere, Condire, Di stagione)
  ['it-b1-10', 'Denominazione', '/de.no.mi.natˈtsjo.ne/', 'Denominação (DOP/IGP)', 'Sostantivo', 'Questo olio ha ottenuto la denominazione di origine protetta.', 'Este azeite obteve a denominação de origem protegida.'],
  ['it-b1-10', 'Cantina', '/kanˈti.na/', 'Vinícola / adega', 'Sostantivo', 'In Toscana abbiamo visitato una cantina storica del Chianti.', 'Na Toscana visitamos uma vinícola histórica do Chianti.'],
  ['it-b1-10', 'Ricetta tipica', '/riˈtʃɛt.ta ˈti.pi.ka/', 'Receita típica', 'Sostantivo', 'La carbonara è una ricetta tipica della cucina romana.', 'A carbonara é uma receita típica da culinária romana.'],

  // it-v4-b1-1: Médico de Família & Receita Eletrônica (existing: Medico di base, Impegnativa, Tessera sanitaria)
  ['it-v4-b1-1', 'Codice fiscale', '/ˈkɔ.di.tʃe fiˈska.le/', 'CPF italiano', 'Sostantivo', 'In farmacia ti chiedono il codice fiscale per la ricetta elettronica.', 'Na farmácia pedem seu código fiscal para a receita eletrônica.'],
  ['it-v4-b1-1', 'Esame del sangue', '/eˈza.me del ˈsan.ɡwe/', 'Exame de sangue', 'Sostantivo', 'Il dottore mi ha prescritto un esame del sangue per controllare il ferro.', 'O médico me prescreveu um exame de sangue para verificar o ferro.'],
  ['it-v4-b1-1', 'Prenotazione', '/pre.no.tatˈtsjo.ne/', 'Agendamento / reserva', 'Sostantivo', 'Ho fatto la prenotazione della visita tramite il portale regionale.', 'Fiz o agendamento da consulta através do portal regional.'],

  // it-v4-b1-2: Entrevista de Emprego & Salário (existing: RAL, Buoni pasto, Tempo indeterminato)
  ['it-v4-b1-2', 'Stipendio', '/stiˈpɛn.djo/', 'Salário mensal', 'Sostantivo', 'Lo stipendio viene accreditato sul conto ogni ventisette del mese.', 'O salário é creditado na conta todo dia vinte e sete do mês.'],
  ['it-v4-b1-2', 'Tredicesima', '/tre.diˈtʃɛ.zi.ma/', 'Décimo terceiro salário', 'Sostantivo', 'A dicembre tutti i dipendenti ricevono anche la tredicesima.', 'Em dezembro todos os funcionários recebem também o décimo terceiro.'],
  ['it-v4-b1-2', 'Periodo di prova', '/peˈri.o.do di ˈprɔ.va/', 'Período de experiência', 'Sostantivo', 'Il contratto prevede un periodo di prova di tre mesi.', 'O contrato prevê um período de experiência de três meses.'],

  // it-v4-b1-3: Contestação de Cartão & Fraude Bancária (existing: Addebito, Storno, Disconoscere)
  ['it-v4-b1-3', 'Bloccare', '/blokˈka.re/', 'Bloquear', 'Verbo', 'Appena ti accorgi della truffa, devi bloccare subito la carta.', 'Assim que perceber a fraude, você deve bloquear o cartão imediatamente.'],
  ['it-v4-b1-3', 'Estratto conto', '/eˈstrat.to ˈkon.to/', 'Extrato bancário', 'Sostantivo', 'Controllo il mio estratto conto ogni settimana dall’app della banca.', 'Verifico o extrato bancário toda semana pelo aplicativo do banco.'],
  ['it-v4-b1-3', 'Movimento sospetto', '/mo.viˈmen.to soˈspɛt.to/', 'Movimentação suspeita', 'Sostantivo', 'La banca mi ha avvisato di un movimento sospetto effettuato all’estero.', 'O banco me avisou sobre uma movimentação suspeita feita no exterior.'],

  // it-v4-b1-4: Seguro Viagem & Sinistros (existing: Polizza, Franchigia, Sinistro)
  ['it-v4-b1-4', 'Copertura', '/ko.perˈtu.ra/', 'Cobertura (de seguro)', 'Sostantivo', 'Questa polizza offre una copertura completa per le spese mediche.', 'Esta apólice oferece uma cobertura completa para despesas médicas.'],
  ['it-v4-b1-4', 'Cancellazione', '/kan.tʃel.latˈtsjo.ne/', 'Cancelamento', 'Sostantivo', 'In caso di cancellazione del volo, l’assicurazione rimborsa l’hotel.', 'Em caso de cancelamento do voo, o seguro reembolsa o hotel.'],
  ['it-v4-b1-4', 'Indennizzo', '/in.denˈnid.dzo/', 'Indenização', 'Sostantivo', 'Ho inviato tutti i documenti necessari per ottenere questo indennizzo.', 'Enviei todos os documentos necessários para obter a indenização.'],

  // it-v4-b1-5: Questura & Permesso di Soggiorno (existing: Permesso di soggiorno, Marca da bollo, Rinnovo)
  ['it-v4-b1-5', 'Impronte digitali', '/imˈprɔn.te di.dʒiˈta.li/', 'Impressões digitais', 'Sostantivo', 'All’appuntamento in Questura prendono le impronte digitali.', 'No agendamento na Questura colhem as impressões digitais.'],
  ['it-v4-b1-5', 'Kit postale', '/kit poˈsta.le/', 'Kit dos correios (para visto)', 'Sostantivo', 'Puoi ritirare gratuitamente il kit postale allo sportello amico.', 'Você pode retirar gratuitamente o kit dos correios no guichê dedicado.'],
  ['it-v4-b1-5', 'Ricevuta', '/ri.tʃeˈvu.ta/', 'Comprovante / protocolo', 'Sostantivo', 'Conserva la ricevuta delle poste finché non ritiri il documento.', 'Guarde o comprovante dos correios até retirar o documento.'],

  // it-v4-b1-6: Suporte Técnico & Conectividade (existing: Riavviare, Aggiornamento, Lampeggiare)
  ['it-v4-b1-6', 'Connessione', '/kon.nesˈsjo.ne/', 'Conexão', 'Sostantivo', 'Stamattina la connessione a internet è molto lenta in ufficio.', 'Hoje de manhã a conexão com a internet está muito lenta no escritório.'],
  ['it-v4-b1-6', 'Segnalazione', '/seɲ.ɲa.latˈtsjo.ne/', 'Chamado / registro de problema', 'Sostantivo', 'Ho aperto una segnalazione al supporto tecnico per l’errore di sistema.', 'Abri um chamado no suporte técnico por causa do erro de sistema.'],
  ['it-v4-b1-6', 'Modem', '/ˈmɔ.dem/', 'Modem / roteador', 'Sostantivo', 'Provi a spegnere il modem per trenta secondi e poi riaccenderlo.', 'Tente desligar o modem por trinta segundos e depois ligá-lo novamente.'],

  // it-v4-b1-7: Voluntariado & Impacto Comunitário (existing: Volontariato, Turno, Dare una mano)
  ['it-v4-b1-7', 'Associazione', '/as.so.tʃatˈtsjo.ne/', 'Associação / ONG', 'Sostantivo', 'Collaboro con questa associazione locale che aiuta gli anziani.', 'Colaboro com uma associação local que ajuda idosos.'],
  ['it-v4-b1-7', 'Raccolta fondi', '/rakˈkɔl.ta ˈfon.di/', 'Arrecadação de fundos', 'Sostantivo', 'Sabato organizziamo una raccolta fondi per la biblioteca del quartiere.', 'No sábado organizamos uma arrecadação de fundos para a biblioteca do bairro.'],
  ['it-v4-b1-7', 'Impegno', '/imˈpeɲ.ɲo/', 'Compromisso / dedicação', 'Sostantivo', 'Il suo impegno costante ha migliorato la vita di molte famiglie.', 'Sua dedicação constante melhorou a vida de muitas famílias.'],

  // it-v4-b1-8: Renovação de Contrato de Aluguel (existing: Canone, Preavviso, Disdetta)
  ['it-v4-b1-8', 'Cedolare secca', '/tʃeˈdo.la.re ˈsek.ka/', 'Regime fiscal fixo de aluguel (sem reajuste ISTAT)', 'Sostantivo', 'Con la cedolare secca il canone rimane bloccato per tutta la durata.', 'Com o regime de cedolare secca o valor do aluguel fica congelado por toda a duração.'],
  ['it-v4-b1-8', 'Locatore', '/lo.kaˈto.re/', 'Locador', 'Sostantivo', 'Il locatore deve registrare il contratto entro trenta giorni.', 'O locador deve registrar o contrato em até trinta dias.'],
  ['it-v4-b1-8', 'Scadenza', '/skaˈdɛn.tsa/', 'Vencimento / prazo final', 'Sostantivo', 'La scadenza naturale del contratto 4+4 è il prossimo ottobre.', 'O vencimento natural do contrato 4+4 é em outubro próximo.'],

  // it-v4-b1-9: Mudança Residencial (Trasloco) (existing: Trasloco, Preventivo, Voltura)
  ['it-v4-b1-9', 'Scatolone', '/ska.toˈlo.ne/', 'Caixa de papelão grande', 'Sostantivo', 'Ho già riempito dieci scatoloni con i libri e i piatti.', 'Já enchi dez caixas grandes com os livros e os pratos.'],
  ['it-v4-b1-9', 'Furgone', '/furˈɡo.ne/', 'Furgão / van de carga', 'Sostantivo', 'Abbiamo noleggiato un furgone per trasportare i mobili sabato.', 'Alugamos um furgão para transportar os móveis no sábado.'],
  ['it-v4-b1-9', 'Utenze', '/uˈtɛn.tse/', 'Contas de consumo (luz, gás, água)', 'Sostantivo', 'Subito dopo il trasloco dobbiamo attivare le utenze di luce e gas.', 'Logo após a mudança precisamos ativar as contas de luz e gás.'],

  // it-v4-b1-10: Resenha de Filmes e Livros (existing: Trama, Regia, Coinvolgente)
  ['it-v4-b1-10', 'Colonna sonora', '/koˈlɔn.na soˈnɔ.ra/', 'Trilha sonora', 'Sostantivo', 'La colonna sonora di Morricone rende ogni scena indimenticabile.', 'A trilha sonora de Morricone torna cada cena inesquecível.'],
  ['it-v4-b1-10', 'Recitazione', '/re.tʃi.tatˈtsjo.ne/', 'Atuação', 'Sostantivo', 'La recitazione del protagonista è stata applaudita dalla critica.', 'A atuação do protagonista foi aplaudida pela crítica.'],
  ['it-v4-b1-10', 'Colpo di scena', '/ˈkol.po di ˈʃɛ.na/', 'Reviravolta na trama', 'Espressione', 'Il finale del romanzo sorprende tutti con un colpo di scena inatteso.', 'O final do romance surpreende a todos com uma reviravolta inesperada.'],

  // it-idioms-b1: Modi di Dire Italiani (existing: In bocca al lupo, Non vedere l’ora, Costare un occhio, Acqua in bocca!) -> needs 2
  ['it-idioms-b1', 'Avere le mani in pasta', '/aˈve.re le ˈma.ni in ˈpa.sta/', 'Estar envolvido em algo / ter influência', 'Espressione', 'Se vuoi organizzare l’evento, chiedi a Marco: sa avere le mani in pasta ovunque.', 'Se quiser organizar o evento, peça a Marco: ele sabe estar envolvido em tudo.'],
  ['it-idioms-b1', 'Cadere dalle nuvole', '/kaˈde.re ˈdal.le ˈnu.vo.le/', 'Ficar surpreso / cair das nuvens', 'Espressione', 'Quando glielo hanno detto, sembrava cadere dalle nuvole.', 'Quando lhe contaram, ele parecia cair das nuvens de surpresa.'],

  // it-slang-b1: Gírias Italianas do Dia a Dia (existing: Boh!, Magari!, Che figata!, Dai!) -> needs 2
  ['it-slang-b1', 'Figurati!', '/fiˈɡu.ra.ti/', 'Imagina! / De nada! / Nem pensar!', 'Esclamazione', '«Grazie mille per il passaggio!» «Ma figurati, è stato un piacere!»', '«Muito obrigado pela carona!» «Imagina, foi um prazer!»'],
  ['it-slang-b1', 'Ci sta', '/tʃi sta/', 'Faz sentido / tudo bem / combina', 'Espressione', 'Andare al cinema dopo cena? Sì, secondo me ci sta benissimo!', 'Ir ao cinema depois do jantar? Sim, para mim faz todo sentido!'],

  // it-b2-1: Il Congiuntivo Presente (existing: Benché, Scadenza, Ritenere)
  ['it-b2-1', 'Sebbene', '/sebˈbɛ.ne/', 'Embora / apesar de que (exige subjuntivo)', 'Connettivo', 'Sebbene piova molto, abbiamo deciso di uscire lo stesso.', 'Embora esteja chovendo muito, decidimos sair mesmo assim.'],
  ['it-b2-1', 'Purché', '/purˈke/', 'Contanto que / desde que (exige subjuntivo)', 'Connettivo', 'Ti presto volentieri la macchina, purché tu la riporti entro sera.', 'Empresto o carro com prazer, contanto que você o devolva até a noite.'],
  ['it-b2-1', 'Dubbio', '/ˈdub.bjo/', 'Dúvida', 'Sostantivo', 'Ho il dubbio che il treno possa subire un leggero ritardo.', 'Tenho dúvida se o trem pode sofrer um leve atraso.'],

  // it-b2-2: Periodo Ipotetico (existing: Inquinamento, Borsa di studio, Risorse)
  ['it-b2-2', 'Qualora', '/kwaˈlo.ra/', 'Caso / na hipótese de que', 'Connettivo', 'Qualora aveste bisogno di chiarimenti, non esitate a contattarmi.', 'Caso precisem de esclarecimentos, não hesitem em me contatar.'],
  ['it-b2-2', 'Opportunità', '/op.por.tu.niˈta/', 'Oportunidade', 'Sostantivo', 'Se ricevessi quell’offerta, coglierei al volo questa grande opportunità.', 'Se eu recebesse essa oferta, não perderia uma oportunidade dessas.'],
  ['it-b2-2', 'Impegno', '/imˈpeɲ.ɲo/', 'Compromisso / dedicação', 'Sostantivo', 'Senza il tuo impegno costante, non avremmo raggiunto questo traguardo.', 'Sem a sua dedicação constante, não teríamos alcançado essa meta.'],

  // it-b2-3: Forma Passiva e Si Impersonale (existing: Attestato, Artigianale, Richiedere)
  ['it-b2-3', 'Normativa', '/nor.maˈti.va/', 'Normativa / regulamentação', 'Sostantivo', 'La nuova normativa viene applicata a tutte le aziende del settore.', 'A nova normativa é aplicada a todas as empresas do setor.'],
  ['it-b2-3', 'Emettere', '/eˈmet.te.re/', 'Emitir', 'Verbo', 'La banca deve emettere la fattura elettronica subito dopo il pagamento.', 'A nota fiscal eletrônica é emitida automaticamente após o pagamento.'],
  ['it-b2-3', 'Rilasciare', '/ri.laʃˈʃa.re/', 'Expedir / emitir (documento)', 'Verbo', 'Il certificato si può rilasciare direttamente allo sportello comunale.', 'O certificado pode ser emitido diretamente no guichê municipal.'],

  // it-b2-4: Connettivi, Stampa e Dibattito B2 (existing: Tuttavia, Pertanto, Nonostante)
  ['it-b2-4', 'Inoltre', '/iˈnol.tre/', 'Além disso', 'Connettivo', 'Il piano riduce i costi; inoltre, migliora la qualità del servizio.', 'O plano reduz os custos; além disso, melhora a qualidade do serviço.'],
  ['it-b2-4', 'Ciononostante', '/tʃo.no.noˈstan.te/', 'Apesar disso / contudo', 'Connettivo', 'I dati erano complessi; ciononostante, il relatore li ha spiegati chiaramente.', 'Os dados eram complexos; contudo, o palestrante os explicou claramente.'],
  ['it-b2-4', 'D’altra parte', '/ˈdal.tra ˈpar.te/', 'Por outro lado', 'Connettivo', 'La proposta è costosa; d’altra parte, garantisce risultati duraturi.', 'A proposta é cara; por outro lado, garante resultados duradouros.'],

  // it-b2-5: Negoziazione ed Email Aziendali (existing: Riscontro, Allegato, Bonifico)
  ['it-b2-5', 'Sollecito', '/solˈle.tʃi.to/', 'Cobrança / lembrete formal', 'Sostantivo', 'Le invio un cortese sollecito riguardo alla fattura scaduta lunedì.', 'Envio-lhe um cortês lembrete a respeito da fatura vencida na segunda-feira.'],
  ['it-b2-5', 'Controproposta', '/kon.tro.proˈpo.sta/', 'Contraproposta', 'Sostantivo', 'Dopo aver valutato il budget, abbiamo preparato una controproposta.', 'Após avaliar o orçamento, preparamos uma contraproposta.'],
  ['it-b2-5', 'Acconto', '/akˈkon.to/', 'Sinal / entrada (pagamento parcial)', 'Sostantivo', 'Per confermare l’ordine richiediamo un acconto del trenta per cento.', 'Para confirmar o pedido solicitamos um sinal de trinta por cento.'],

  // it-b2-6: Cinema, Musica e Modi di Dire (existing: In bocca al lupo, Non vedo l’ora, Pellicola)
  ['it-b2-6', 'Sceneggiatura', '/ʃe.ned.dʒaˈtu.ra/', 'Roteiro', 'Sostantivo', 'La sceneggiatura del film è tratta da un celebre romanzo italiano.', 'O roteiro do filme é adaptado de um célebre romance italiano.'],
  ['it-b2-6', 'Capolavoro', '/ka.po.laˈvo.ro/', 'Obra-prima', 'Sostantivo', 'Questo film è considerato un autentico capolavoro del neorealismo.', 'Este filme é considerado uma autêntica obra-prima do neorrealismo.'],
  ['it-b2-6', 'Sottotitoli', '/sot.toˈti.to.li/', 'Legendas', 'Sostantivo', 'Preferisco guardare i film in lingua originale con i sottotitoli.', 'Prefiro assistir aos filmes no idioma original com legendas.'],

  // it-b2-7: Discorso Indiretto al Passato (existing: Dichiarare, Assicurare, Stanziare)
  ['it-b2-7', 'Sostenere', '/so.steˈne.re/', 'Sustentar / afirmar', 'Verbo', 'Il ministro ha voluto sostenere che la riforma entrerà in vigore presto.', 'O ministro quis afirmar que a reforma entrará em vigor em breve.'],
  ['it-b2-7', 'Smentire', '/smenˈti.re/', 'Desmentir', 'Verbo', 'L’azienda ha deciso di smentire le voci sulla chiusura dello stabilimento.', 'A empresa decidiu desmentir os boatos sobre o fechamento da fábrica.'],
  ['it-b2-7', 'Riferire', '/ri.feˈri.re/', 'Relatar / transmitir (o que foi dito)', 'Verbo', 'Mi ha chiesto di riferire che sarebbe arrivato con mezz’ora di ritardo.', 'Pediu-me para relatar que chegaria com meia hora de atraso.'],

  // it-b2-8: Verbi Pronominali Idiomatici (existing: Farcela, Cavarsela, Prendersela)
  ['it-b2-8', 'Andarsene', '/anˈdar.se.ne/', 'Ir embora', 'Verbo', 'Era ormai tardi, quindi ha preferito salutare tutti e andarsene.', 'Já estava tarde, então preferi cumprimentar a todos e ir embora.'],
  ['it-b2-8', 'Avercela', '/aˈver.tʃe.la/', 'Estar chateado/bravo com alguém', 'Verbo', 'Spero che tu non voglia avercela con me per quel malinteso.', 'Espero que você não fique chateado comigo por aquele mal-entendido.'],
  ['it-b2-8', 'Sentirsela', '/senˈtir.se.la/', 'Sentir-se disposto / com coragem para', 'Verbo', 'Se non dovessi sentirsela di guidare stasera, prendiamo il taxi.', 'Caso você não se sinta disposto a dirigir hoje à noite, pegamos um táxi.'],

  // it-b2-9: Alterati, Prefissi e Sfumature (existing: Figuraccia, Acquazzone, Paesino)
  ['it-b2-9', 'Cagnolino', '/kaɲ.ɲoˈli.no/', 'Cachorrinho (diminutivo)', 'Sostantivo', 'La signora porta sempre a spasso il suo piccolo cagnolino al parco.', 'A senhora sempre leva seu cachorrinho para passear no parque.'],
  ['it-b2-9', 'Librone', '/liˈbro.ne/', 'Livraço / livro enorme (aumentativo)', 'Sostantivo', 'Ho comprato un librone illustrato sulla storia di Firenze.', 'Comprei um livraço ilustrado sobre a história de Florença.'],
  ['it-b2-9', 'Tempaccio', '/temˈpat.tʃo/', 'Tempo horrível / mau tempo (pejorativo)', 'Sostantivo', 'Con questo tempaccio è meglio restare al caldo in casa.', 'Com esse tempo horrível é melhor ficar no quentinho em casa.'],

  // it-b2-10: Burocrazia, Servizi e Diritti del Consumatore (existing: Pratica, Recesso, Disservizio)
  ['it-b2-10', 'Anagrafe', '/aˈna.ɡra.fe/', 'Cartório de registro civil municipal', 'Sostantivo', 'Devo contattare questo ufficio anagrafe del Comune per cambiare la residenza.', 'Preciso ir ao registro civil da Prefeitura para mudar a residência.'],
  ['it-b2-10', 'Delega', '/ˈdɛ.le.ɡa/', 'Procuração / autorização', 'Sostantivo', 'Puoi ritirare il pacco per conto mio presentando questa delega firmata.', 'Você pode retirar o pacote por mim apresentando esta autorização assinada.'],
  ['it-b2-10', 'Autocertificazione', '/au.to.tʃer.ti.fi.katˈtsjo.ne/', 'Autodeclaração formal', 'Sostantivo', 'Per molti uffici pubblici basta compilare questa autocertificazione.', 'Para muitos órgãos públicos basta preencher uma autodeclaração.'],

  // it-v4-b2-1: Gestione dei Conflitti in Azienda (existing: Mediazione, Attrito, Compromesso)
  ['it-v4-b2-1', 'Divergenza', '/di.verˈdʒɛn.tsa/', 'Divergência', 'Sostantivo', 'C’è stata una divergenza sulle priorità tra il team tecnico e il marketing.', 'Houve uma divergência sobre as prioridades entre a equipe técnica e o marketing.'],
  ['it-v4-b2-1', 'Ascolto attivo', '/aˈskol.to atˈti.vo/', 'Escuta ativa', 'Espressione', 'Praticare il vero ascolto attivo aiuta a disinnescare le tensioni in riunione.', 'Praticar a escuta ativa ajuda a desarmar as tensões na reunião.'],
  ['it-v4-b2-1', 'Convergenza', '/kon.verˈdʒɛn.tsa/', 'Convergência / consenso', 'Sostantivo', 'Dopo un confronto aperto abbiamo trovato un punto di convergenza.', 'Após um debate aberto encontramos um ponto de convergência.'],

  // it-v4-b2-2: Alfabetizzazione Mediatica e Verifica (existing: Attendibilità, Riscontro, Fuorviante)
  ['it-v4-b2-2', 'Sensazionalismo', '/sen.sat.tsjo.naˈliz.mo/', 'Sensacionalismo', 'Sostantivo', 'Molti titoli online puntano sul sensazionalismo per ottenere più clic.', 'Muitas manchetes online apostam no sensacionalismo para obter mais cliques.'],
  ['it-v4-b2-2', 'Verifica', '/veˈri.fi.ka/', 'Verificação / checagem', 'Sostantivo', 'La verifica dei fatti è essenziale prima di pubblicare un’inchiesta.', 'A checagem dos fatos é essencial antes de publicar uma reportagem investigativa.'],
  ['it-v4-b2-2', 'Disinformazione', '/di.zin.for.matˈtsjo.ne/', 'Desinformação', 'Sostantivo', 'La disinformazione si diffonde rapidamente quando non si controllano le fonti.', 'A desinformação se espalha rapidamente quando não se conferem as fontes.'],

  // it-v4-b2-3: Filiere Sostenibili ed Economia Circolare (existing: Filiera, Imballaggio, Economia circolare)
  ['it-v4-b2-3', 'Tracciabilità', '/trat.tʃa.bi.liˈta/', 'Rastreabilidade', 'Sostantivo', 'L’etichetta digitale garantisce la tracciabilità di ogni lotto prodotto.', 'A etiqueta digital garante a rastreabilidade de cada lote produzido.'],
  ['it-v4-b2-3', 'Smaltimento', '/zmal.tiˈmen.to/', 'Descarte / destinação final', 'Sostantivo', 'Dobbiamo ridurre i costi ambientali legati allo smaltimento dei rifiuti.', 'Precisamos reduzir os custos ambientais ligados ao descarte de resíduos.'],
  ['it-v4-b2-3', 'Riutilizzo', '/ri.u.tiˈlid.dzo/', 'Reutilização', 'Sostantivo', 'Il riutilizzo dei materiali riduce il fabbisogno di materie prime.', 'A reutilização de materiais reduz a necessidade de matérias-primas.'],

  // it-v4-b2-4: Tutela dei Consumatori e Diritti (existing: PEC, Diritto di recesso, Conformità)
  ['it-v4-b2-4', 'Diffida', '/difˈfi.da/', 'Notificação extrajudicial / intimação formal', 'Sostantivo', 'Dopo l’ennesimo rinvio, il cliente ha inviato una diffida formale via PEC.', 'Após mais um adiamento, o cliente enviou uma notificação formal via PEC.'],
  ['it-v4-b2-4', 'Garanzia', '/ɡa.ranˈtsi.a/', 'Garantia', 'Sostantivo', 'Per legge la garanzia sui beni di consumo dura almeno due anni.', 'Por lei a garantia sobre bens de consumo dura pelo menos dois anos.'],
  ['it-v4-b2-4', 'Clausola', '/ˈklau.zo.la/', 'Cláusula', 'Sostantivo', 'Legga attentamente ogni clausola prima di sottoscrivere il contratto.', 'Leia atentamente cada cláusula antes de assinar o contrato.'],

  // it-v4-b2-5: Lavoro Agile e Diritto alla Disconnessione (existing: Lavoro agile, Asincrono, Reperibilità)
  ['it-v4-b2-5', 'Disconnessione', '/di.skon.nesˈsjo.ne/', 'Desconexão', 'Sostantivo', 'Il diritto alla disconnessione tutela il riposo fuori dall’orario lavorativo.', 'O direito à desconexão protege o descanso fora do horário de trabalho.'],
  ['it-v4-b2-5', 'Flessibilità', '/fles.si.bi.liˈta/', 'Flexibilidade', 'Sostantivo', 'La flessibilità oraria permette di conciliare meglio lavoro e famiglia.', 'A flexibilidade de horário permite conciliar melhor trabalho e família.'],
  ['it-v4-b2-5', 'Obiettivo', '/ob.jetˈti.vo/', 'Objetivo / meta', 'Sostantivo', 'Lavorare per obiettivi aumenta l’autonomia di ciascun collaboratore.', 'Trabalhar por objetivos aumenta a autonomia de cada colaborador.'],

  // it-v4-b2-6: Politiche Abitative e Città Sostenibili (existing: Canone calmierato, Rigenerazione urbana, Coesione sociale)
  ['it-v4-b2-6', 'Edilizia sociale', '/e.diˈlit.tsja soˈtʃa.le/', 'Habitação social', 'Sostantivo', 'Il piano comunale prevede nuovi alloggi di edilizia sociale per giovani coppie.', 'O plano municipal prevê novas moradias de habitação social para casais jovens.'],
  ['it-v4-b2-6', 'Caro-affitti', '/ˈka.ro afˈfit.ti/', 'Crise dos aluguéis altos', 'Sostantivo', 'Il caro-affitti nelle grandi città rende difficile trovare casa agli studenti.', 'O alto custo dos aluguéis nas grandes cidades dificulta que estudantes encontrem moradia.'],
  ['it-v4-b2-6', 'Periferia', '/pe.ri.feˈri.a/', 'Periferia / subúrbio', 'Sostantivo', 'I nuovi collegamenti metropolitani valorizzano anche la periferia.', 'As novas ligações de metrô valorizam também a periferia.'],

  // it-v4-b2-7: Finanza Personale e Gestione del Rischio (existing: Potere d’acquisto, Diversificazione, Rata)
  ['it-v4-b2-7', 'Inflazione', '/in.flatˈtsjo.ne/', 'Inflação', 'Sostantivo', 'Questa inflazione elevata riduce nel tempo il valore dei risparmi fermi.', 'A inflação elevada reduz com o tempo o valor das economias paradas.'],
  ['it-v4-b2-7', 'Tasso fisso', '/ˈtas.so ˈfis.so/', 'Taxa fixa', 'Sostantivo', 'Abbiamo scelto un mutuo a tasso fisso per avere sempre la stessa rata.', 'Escolhemos um financiamento a taxa fixa para ter sempre a mesma parcela.'],
  ['it-v4-b2-7', 'Fondo d’emergenza', '/ˈfon.do de.merˈdʒɛn.tsa/', 'Reserva de emergência', 'Sostantivo', 'È prudente mantenere un fondo d’emergenza pari a sei mesi di spese.', 'É prudente manter uma reserva de emergência equivalente a seis meses de despesas.'],

  // it-v4-b2-8: Transizione Ecologica ed Energie Rinnovabili (existing: Decarbonizzazione, Efficientamento, Rinnovabile)
  ['it-v4-b2-8', 'Emissioni', '/e.misˈsjo.ni/', 'Emissões', 'Sostantivo', 'L’obiettivo europeo è dimezzare le emissioni entro il prossimo decennio.', 'O objetivo europeu é reduzir as emissões pela metade na próxima década.'],
  ['it-v4-b2-8', 'Fotovoltaico', '/fo.to.volˈta.i.ko/', 'Fotovoltaico (energia solar)', 'Aggettivo', 'Abbiamo installato un impianto fotovoltaico sul tetto del capannone.', 'Instalamos um sistema fotovoltaico no telhado do galpão.'],
  ['it-v4-b2-8', 'Rete elettrica', '/ˈre.te eˈlɛt.tri.ka/', 'Rede elétrica', 'Sostantivo', 'Occorre modernizzare la rete elettrica per integrare l’energia eolica.', 'É preciso modernizar a rede elétrica para integrar a energia eólica.'],

  // it-v4-b2-9: Varietà Regionali e Registri Linguistici (existing: Geosinonimo, Registro, Sfumatura)
  ['it-v4-b2-9', 'Dialetto', '/djaˈlɛt.to/', 'Dialeto', 'Sostantivo', 'Molti anziani parlano ancora il dialetto locale nelle conversazioni familiari.', 'Muitos idosos ainda falam o dialeto local nas conversas em família.'],
  ['it-v4-b2-9', 'Colloquiale', '/kol.loˈkwa.le/', 'Coloquial / informal', 'Aggettivo', 'In una mail al direttore bisogna evitare un tono troppo colloquiale.', 'Em um e-mail ao diretor é preciso evitar um tom coloquial demais.'],
  ['it-v4-b2-9', 'Cadenza', '/kaˈdɛn.tsa/', 'Sotaque / cadência regional', 'Sostantivo', 'Dalla cadenza si capisce subito che è originario della Toscana.', 'Pelo sotaque percebe-se logo que ele é originário da Toscana.'],

  // it-v4-b2-10: Leadership, Delega e Feedback Efficace (existing: Delega, Microgestione, Tempestivo)
  ['it-v4-b2-10', 'Autonomia', '/au.to.noˈmi.a/', 'Autonomia', 'Sostantivo', 'Dare maggiore autonomia al team stimola il senso di responsabilità.', 'Dar maior autonomia à equipe estimula o senso de responsabilidade.'],
  ['it-v4-b2-10', 'Riscontro', '/riˈskon.tro/', 'Retorno / feedback', 'Sostantivo', 'Un riscontro costruttivo e puntuale aiuta il collega a crescere.', 'Um feedback construtivo e pontual ajuda o colega a crescer.'],
  ['it-v4-b2-10', 'Fiducia', '/fiˈdu.tʃa/', 'Confiança', 'Sostantivo', 'Senza fiducia reciproca la delega resta soltanto formale.', 'Sem confiança mútua a delegação continua sendo apenas formal.'],

  // it-taboo-register-b2: Registro Informale: Parolacce Comuni e Alternative (existing: Cazzo / Cavolo, Che palle!, Accidenti!, Vaffanculo) -> needs 2
  ['it-taboo-register-b2', 'Mannaggia!', '/manˈnad.dʒa/', 'Poxa! / Droga! (eufemismo seguro)', 'Esclamazione', 'Mannaggia! Ho dimenticato di nuovo l’ombrello sul treno.', 'Poxa! Esqueci de novo o guarda-chuva no trem.'],
  ['it-taboo-register-b2', 'Porca miseria!', '/ˈpɔr.ka miˈzɛ.rja/', 'Caramba! / Que droga! (informal aceitável)', 'Esclamazione', 'Porca miseria, si è spento il computer proprio prima di salvare!', 'Caramba, o computador desligou bem antes de salvar!'],

  // it-c1-1: Irrealtà nel Passato (3° Tipo) (existing: Coincidenza, Intesa, Coinvolgere)
  ['it-c1-1', 'Rimpianto', '/rimˈpjan.to/', 'Arrependimento / pesar', 'Sostantivo', 'Se avessimo agito diversamente, oggi non avremmo alcun rimpianto.', 'Se tivéssemos agido diferente, hoje não teríamos nenhum arrependimento.'],
  ['it-c1-1', 'Prevedere', '/pre.veˈde.re/', 'Prever / antecipar', 'Verbo', 'Nessuno avrebbe potuto prevedere un cambiamento così repentino.', 'Ninguém poderia ter previsto uma mudança tão repentina.'],
  ['it-c1-1', 'Tempestivamente', '/tem.pe.sti.vaˈmen.te/', 'Tempestivamente / a tempo', 'Avverbio', 'Se ci avessero avvisati tempestivamente, avremmo evitato il disguido.', 'Se tivessem nos avisado a tempo, teríamos evitado o transtorno.'],

  // it-c1-2: Livello C1: Registro Formale e Sintassi (existing: Verbale, Esito, Padronanza)
  ['it-c1-2', 'Ove', '/ˈo.ve/', 'Onde / caso (registro formal)', 'Connettivo', 'Ove sussistessero dubbi interpretativi, prevale il testo originale.', 'Caso subsistissem dúvidas interpretativas, prevalece o texto original.'],
  ['it-c1-2', 'Cui', '/kwi/', 'Ao qual / do qual (relativo formal)', 'Pronome', 'La relazione in cui si illustrano i risultati è stata già approvata.', 'O relatório no qual se ilustram os resultados já foi aprovado.'],
  ['it-c1-2', 'Stante', '/ˈstan.te/', 'Diante de / tendo em vista (formal)', 'Preposizione', 'Stante l’urgenza della pratica, si dispone l’esame immediato.', 'Diante da urgência do processo, determina-se o exame imediato.'],

  // it-c1-3: Varianti Regionali: Italia e Ticino (existing: Bensì, Tratto, Arricchire)
  ['it-c1-3', 'Riservazione', '/ri.zer.vatˈtsjo.ne/', 'Reserva (variante suíço-italiana de prenotazione)', 'Sostantivo', 'Nel Canton Ticino si usa spesso «riservazione» al posto di prenotazione.', 'No Cantão do Ticino usa-se frequentemente «riservazione» no lugar de prenotazione.'],
  ['it-c1-3', 'Natel', '/naˈtɛl/', 'Celular (variante suíço-italiana)', 'Sostantivo', 'A Lugano molti chiedono il numero del natel invece del cellulare.', 'Em Lugano muitos pedem o número do celular usando a palavra natel.'],
  ['it-c1-3', 'Azione', '/atˈtsjo.ne/', 'Promoção / oferta (no Ticino)', 'Sostantivo', 'Nei supermercati svizzeri i prodotti scontati sono segnalati come «azione».', 'Nos supermercados suíços os produtos em promoção são sinalizados como «azione».'],

  // it-c1-4: Passato Remoto e Letteratura (existing: Nacque, Impronta, Divenne)
  ['it-c1-4', 'Compose', '/komˈpo.ze/', 'Compôs / escreveu (passato remoto)', 'Verbo', 'Il poeta compose i suoi versi più celebri durante l’esilio.', 'O poeta compôs seus versos mais célebres durante o exílio.'],
  ['it-c1-4', 'Vicenda', '/viˈtʃɛn.da/', 'Acontecimento / história / enredo', 'Sostantivo', 'La vicenda narrata nel romanzo attraversa tre generazioni.', 'A história narrada no romance atravessa três gerações.'],
  ['it-c1-4', 'Eredità', '/e.re.diˈta/', 'Herança / legado', 'Sostantivo', 'L’opera ci lasciò una grande eredità culturale di valore inestimabile.', 'A obra nos deixou um legado cultural de valor inestimável.'],

  // it-c1-5: Italiano Parlato e Segnali Discorsivi (existing: Magari, Mica, Insomma)
  ['it-c1-5', 'Cioè', '/tʃoˈɛ/', 'Ou seja / quer dizer', 'Espressione', 'Domani partiamo presto, cioè verso le sei del mattino.', 'Amanhã saímos cedo, quer dizer, por volta das seis da manhã.'],
  ['it-c1-5', 'Diciamo', '/diˈtʃa.mo/', 'Digamos (marcador discursivo)', 'Espressione', 'Il progetto, diciamo, richiede ancora qualche piccolo ritocco.', 'O projeto, digamos, ainda requer alguns pequenos ajustes.'],
  ['it-c1-5', 'Allora', '/alˈlo.ra/', 'Então / pois bem', 'Espressione', 'Allora, da dove vogliamo cominciare la discussione di oggi?', 'Então, por onde queremos começar a discussão de hoje?'],

  // it-c1-6: Economia, Innovazione e Presentazioni (existing: Fatturato, Ripresa, Svolta)
  ['it-c1-6', 'Margine', '/ˈmar.dʒi.ne/', 'Margem (de lucro)', 'Sostantivo', 'Nonostante l’aumento dei costi, il margine operativo resta positivo.', 'Apesar do aumento dos custos, a margem operacional permanece positiva.'],
  ['it-c1-6', 'Investimento', '/in.ve.stiˈmen.to/', 'Investimento', 'Sostantivo', 'Questo investimento in ricerca e sviluppo darà frutti nel medio termine.', 'O investimento em pesquisa e desenvolvimento dará frutos no médio prazo.'],
  ['it-c1-6', 'Tendenza', '/tenˈdɛn.tsa/', 'Tendência', 'Sostantivo', 'I grafici mostrano una chiara tendenza alla crescita delle esportazioni.', 'Os gráficos mostram uma clara tendência de crescimento das exportações.'],

  // it-c1-7: Retorica, Diplomazia e Stile C1 (existing: Ribadire, Portata, Fondamento)
  ['it-c1-7', 'Auspicio', '/auˈspi.tʃo/', 'Voto / desejo formal / expectativa', 'Sostantivo', 'Il nostro auspicio è giungere presto a un accordo condiviso.', 'O desejo da delegação é chegar a um acordo compartilhado.'],
  ['it-c1-7', 'Sottolineare', '/sot.to.li.neˈa.re/', 'Ressaltar / enfatizar', 'Verbo', 'Occorre sottolineare l’importanza di mantenere aperto il dialogo.', 'É preciso ressaltar a importância de manter o diálogo aberto.'],
  ['it-c1-7', 'Sintesi', '/ˈsin.te.zi/', 'Síntese', 'Sostantivo', 'In sintesi, la nostra posizione rimane aperta al confronto costruttivo.', 'Em síntese, nossa posição permanece aberta ao debate construtivo.'],

  // it-c1-8: Usi Sfumati del Congiuntivo C1 (existing: Malinteso, Ovunque, Fraintendere)
  ['it-c1-8', 'Comunque', '/koˈmun.kwe/', 'De qualquer forma / seja como for', 'Connettivo', 'Comunque vadano le cose, abbiamo fatto tutto il possibile.', 'Seja como for que as coisas aconteçam, fizemos todo o possível.'],
  ['it-c1-8', 'Magari', '/maˈɡa.ri/', 'Quem dera / oxalá (com congiuntivo)', 'Avverbio', 'Magari avessimo avuto più tempo per approfondire la questione!', 'Quem dera tivéssemos tido mais tempo para aprofundar a questão!'],
  ['it-c1-8', 'Qualunque', '/kwaˈlun.kwe/', 'Qualquer (exige congiuntivo)', 'Aggettivo', 'Qualunque sia la decisione finale, dovremo rispettarla.', 'Qualquer que seja a decisão final, teremos que respeitá-la.'],

  // it-c1-9: Architettura, Restauro e Patrimonio (existing: Soprintendenza, Fruizione, Affresco)
  ['it-c1-9', 'Tutela', '/tuˈtɛ.la/', 'Tutela / proteção patrimonial', 'Sostantivo', 'La tutela dei monumenti storici richiede interventi costanti e mirati.', 'A proteção dos monumentos históricos requer intervenções constantes e direcionadas.'],
  ['it-c1-9', 'Conservazione', '/kon.ser.vatˈtsjo.ne/', 'Conservação / preservação', 'Sostantivo', 'Le nuove tecniche di conservazione preservano i pigmenti originali.', 'As novas técnicas de conservação preservam os pigmentos originais.'],
  ['it-c1-9', 'Manufatto', '/ma.nuˈfat.to/', 'Artefato / peça histórica', 'Sostantivo', 'Ogni manufatto archeologico viene catalogato prima dell’esposizione.', 'Cada artefato arqueológico é catalogado antes da exposição.'],

  // it-c1-10: Etica Digitale, IA e Responsabilità (existing: Tracciabilità, Salvaguardia, Distorsione)
  ['it-c1-10', 'Trasparenza', '/tra.spaˈrɛn.tsa/', 'Transparência', 'Sostantivo', 'La trasparenza algoritmica è fondamentale nei processi decisionali pubblici.', 'A transparência algorítmica é fundamental nos processos decisórios públicos.'],
  ['it-c1-10', 'Equità', '/e.kwiˈta/', 'Equidade / imparcialidade', 'Sostantivo', 'Occorre verificare la piena equità dei modelli per evitare discriminazioni.', 'É preciso verificar a equidade dos modelos para evitar discriminações.'],
  ['it-c1-10', 'Responsabilità', '/re.spon.sa.bi.liˈta/', 'Responsabilidade', 'Sostantivo', 'La responsabilità finale delle scelte automatizzate resta in capo all’uomo.', 'A responsabilidade final pelas escolhas automatizadas permanece com o ser humano.'],

  // it-v4-c1-1: Comunicazione di Crisi e Gestione Stampa (existing: Rammarico, Accertare, Presidio)
  ['it-v4-c1-1', 'Reticenza', '/re.tiˈtʃɛn.tsa/', 'Reticência / omissão', 'Sostantivo', 'In una crisi aziendale ogni reticenza alimenta la sfiducia del pubblico.', 'Em uma crise empresarial qualquer omissão alimenta a desconfiança do público.'],
  ['it-v4-c1-1', 'Smentita', '/zmenˈti.ta/', 'Desmentido oficial', 'Sostantivo', 'L’ufficio stampa ha diffuso una smentita immediata per chiarire i fatti.', 'A assessoria de imprensa divulgou um desmentido imediato para esclarecer os fatos.'],
  ['it-v4-c1-1', 'Credibilità', '/kre.di.bi.liˈta/', 'Credibilidade', 'Sostantivo', 'La credibilità di un’istituzione si misura soprattutto nei momenti difficili.', 'A credibilidade de uma instituição mede-se sobretudo nos momentos difíceis.'],

  // it-v4-c1-2: Analisi Macroeconomica e Politica Monetaria (existing: Congiuntura, Attestarsi, Contrazione)
  ['it-v4-c1-2', 'Produttività', '/pro.dut.ti.viˈta/', 'Produtividade', 'Sostantivo', 'Senza investimenti tecnologici la produttività del lavoro fatica a crescere.', 'Sem investimentos tecnológicos a produtividade do trabalho tem dificuldade para crescer.'],
  ['it-v4-c1-2', 'Bilancia commerciale', '/biˈlan.tʃa kom.merˈtʃa.le/', 'Balança comercial', 'Sostantivo', 'Il calo delle importazioni ha migliorato il saldo della bilancia commerciale.', 'A queda das importações melhorou o saldo da balança comercial.'],
  ['it-v4-c1-2', 'Stagflazione', '/staɡ.flatˈtsjo.ne/', 'Estagflação', 'Sostantivo', 'Le banche centrali intervengono sui tassi per scongiurare il rischio di stagflazione.', 'Os bancos centrais intervêm nos juros para afastar o risco de estagflação.'],

  // it-v4-c1-3: Clausole Contrattuali e Diritto Commerciale (existing: Inadempimento, Manleva, In deroga a)
  ['it-v4-c1-3', 'Forza maggiore', '/ˈfɔr.tsa madˈdʒo.re/', 'Força maior', 'Sostantivo', 'Nessuna delle parti risponde dei ritardi dovuti a cause di forza maggiore.', 'Nenhuma das partes responde pelos atrasos devidos a causas de força maior.'],
  ['it-v4-c1-3', 'Foro competente', '/ˈfɔ.ro kom.peˈtɛn.te/', 'Foro competente', 'Sostantivo', 'Per ogni controversia il foro competente è esclusivamente quello di Milano.', 'Para qualquer controvérsia o foro competente é exclusivamente o de Milão.'],
  ['it-v4-c1-3', 'Penale', '/peˈna.le/', 'Multa contratual / penalidade', 'Sostantivo', 'Il ritardo nella consegna comporta l’applicazione di una penale giornaliera.', 'O atraso na entrega acarreta a aplicação de uma multa diária.'],

  // it-v4-c1-4: Revisione Accademica e Metodo Critico (existing: Corroborare, Evincersi, Esiguo)
  ['it-v4-c1-4', 'Lacuna', '/laˈku.na/', 'Lacuna / falha', 'Sostantivo', 'I revisori hanno segnalato una lacuna metodologica nella raccolta dati.', 'Os revisores apontaram uma lacuna metodológica na coleta de dados.'],
  ['it-v4-c1-4', 'Ipotesi', '/iˈpɔ.te.zi/', 'Hipótese', 'Sostantivo', 'I risultati sperimentali confermano solo in parte questa ipotesi iniziale.', 'Os resultados experimentais confirmam apenas em parte a hipótese inicial.'],
  ['it-v4-c1-4', 'Attendibile', '/at.tenˈdi.bi.le/', 'Confiável / fidedigno', 'Aggettivo', 'Senza un gruppo di controllo il confronto statistico non risulta attendibile.', 'Sem um grupo de controle a comparação estatística não é confiável.'],

  // it-v4-c1-5: Dibattito Pubblico e Retorica Argomentativa (existing: Dicotomia, Confutare, Polarizzazione)
  ['it-v4-c1-5', 'Fallacia', '/falˈla.tʃa/', 'Falácia', 'Sostantivo', 'Ridurre la discussione a due soli estremi è una tipica fallacia logica.', 'Reduzir a discussão a apenas dois extremos é uma típica falácia lógica.'],
  ['it-v4-c1-5', 'Obiezione', '/ob.jetˈtsjo.ne/', 'Objeção', 'Sostantivo', 'Prima di concludere, vorrei rispondere a questa obiezione sollevata dal collega.', 'Antes de concluir, gostaria de responder à objeção levantada pelo colega.'],
  ['it-v4-c1-5', 'Tesi', '/ˈtɛ.zi/', 'Tese / argumento central', 'Sostantivo', 'L’autore sostiene la propria tesi con numerosi esempi storici.', 'O autor sustenta a própria tese com numerosos exemplos históricos.'],

  // it-v4-c1-6: Sicurezza Informatica e Tutela dei Dati (existing: Crittografia, Resilienza, Vulnerabilità)
  ['it-v4-c1-6', 'Violazione', '/vjo.latˈtsjo.ne/', 'Violação / vazamento (de dados)', 'Sostantivo', 'In caso di violazione dei dati personali, l’azienda deve notificare il Garante.', 'Em caso de violação de dados pessoais, a empresa deve notificar a Autoridade.'],
  ['it-v4-c1-6', 'Autenticazione', '/au.ten.ti.katˈtsjo.ne/', 'Autenticação', 'Sostantivo', 'Questa autenticazione a due fattori riduce drasticamente gli accessi illeciti.', 'A autenticação em dois fatores reduz drasticamente os acessos ilícitos.'],
  ['it-v4-c1-6', 'Conformità', '/kon.for.miˈta/', 'Conformidade (compliance)', 'Sostantivo', 'Il nuovo protocollo assicura la piena conformità alle norme europee.', 'O novo protocolo assegura a plena conformidade com as normas europeias.'],

  // it-v4-c1-7: Retorica, Eleganza Sintattica e Registro C1 (existing: Litote, Lungi da, Inedito)
  ['it-v4-c1-7', 'Perifrasi', '/peˈri.fra.zi/', 'Perífrase / rodeio estilístico', 'Sostantivo', 'L’autore ricorre spesso alla perifrasi per evitare ripetizioni pesanti.', 'O autor recorre frequentemente à perífrase para evitar repetições pesadas.'],
  ['it-v4-c1-7', 'Sfumatura', '/sfu.maˈtu.ra/', 'Nuance / sutileza', 'Sostantivo', 'Cogliere ogni sfumatura lessicale è essenziale nella traduzione letteraria.', 'Captar cada nuance lexical é essencial na tradução literária.'],
  ['it-v4-c1-7', 'Sobrietà', '/so.brjeˈta/', 'Sobriedade / contenção estilística', 'Sostantivo', 'La sobrietà dello stile conferisce maggiore forza alle argomentazioni.', 'A sobriedade do estilo confere maior força às argumentações.'],

  // it-v4-c1-8: Negoziato Diplomatico e Mediazione Multilaterale (existing: Reciprocità, Ratifica, Stallo)
  ['it-v4-c1-8', 'Riserva', '/riˈzɛr.va/', 'Reserva (diplomática / ressalva)', 'Sostantivo', 'La delegazione ha espresso una riserva formale sul terzo articolo.', 'A delegação expressou uma ressalva formal sobre o terceiro artigo.'],
  ['it-v4-c1-8', 'Concessione', '/kon.tʃesˈsjo.ne/', 'Concessão', 'Sostantivo', 'Il compromesso è stato raggiunto grazie a una reciproca concessione.', 'O compromisso foi alcançado graças a uma concessão mútua.'],
  ['it-v4-c1-8', 'Protocollo', '/pro.toˈkɔl.lo/', 'Protocolo (diplomático)', 'Sostantivo', 'I rappresentanti hanno firmato il protocollo d’intesa a margine del vertice.', 'Os representantes assinaram o protocolo de intenções à margem da cúpula.'],

  // it-v4-c1-9: Etica dell’IA, Bias e Supervisione Umana (existing: Distorsione, Supervisione, In capo a)
  ['it-v4-c1-9', 'Autonomia algoritmica', '/au.to.noˈmi.a al.ɡoˈrit.mi.ka/', 'Autonomia algorítmica', 'Sostantivo', 'Questa autonomia algoritmica deve sempre essere bilanciata dal controllo umano.', 'A autonomia algorítmica deve sempre ser equilibrada pelo controle humano.'],
  ['it-v4-c1-9', 'Diritto d’autore', '/diˈrit.to dauˈto.re/', 'Direito autoral', 'Sostantivo', 'L’addestramento dei modelli generativi solleva questioni sul diritto d’autore.', 'O treinamento de modelos generativos levanta questões sobre o direito autoral.'],
  ['it-v4-c1-9', 'Rendicontazione', '/ren.di.kon.tatˈtsjo.ne/', 'Prestação de contas (accountability)', 'Sostantivo', 'Servono criteri chiari di rendicontazione per le decisioni automatizzate.', 'São necessários critérios claros de prestação de contas para decisões automatizadas.'],

  // it-v4-c1-10: Critica Culturale, Estetica e Patrimonio (existing: Fruizione, Tessuto sociale, Essenzialità)
  ['it-v4-c1-10', 'Estetica', '/eˈstɛ.ti.ka/', 'Estética', 'Sostantivo', 'Questa estetica contemporanea dialoga spesso con i materiali della tradizione.', 'A estética contemporânea dialoga frequentemente com os materiais da tradição.'],
  ['it-v4-c1-10', 'Avanguardia', '/a.vanˈɡwar.dja/', 'Vanguarda', 'Sostantivo', 'La mostra ripercorre i movimenti di avanguardia del primo Novecento.', 'A exposição percorre os movimentos de vanguarda do início do século XX.'],
  ['it-v4-c1-10', 'Contaminazione', '/kon.ta.mi.natˈtsjo.ne/', 'Contaminação cultural / fusão', 'Sostantivo', 'La contaminazione tra generi diversi arricchisce il linguaggio artistico.', 'A fusão entre gêneros diferentes enriquece a linguagem artística.'],
];

export const VOCAB_FIXES_IT: VocabExampleFixMap = {
  'voc-it-a1-5-3': {
    exampleEn: 'Ci vediamo alle dodici, proprio a mezzogiorno, davanti alla stazione.',
    examplePt: 'Nos vemos às doze horas, bem ao meio-dia, em frente à estação.',
  },
  'voc-it-a1-7-3': {
    exampleEn: 'Dopo pranzo è importante riposarsi almeno mezz’ora sul divano.',
    examplePt: 'Depois do almoço é importante descansar pelo menos meia hora no sofá.',
  },
  'voc-it-a1-9-2': {
    exampleEn: 'Ogni sabato mattina vado al mercato a fare la spesa con mia madre.',
    examplePt: 'Todo sábado de manhã vou à feira fazer compras com minha mãe.',
  },
  'voc-it-a1-10-3': {
    exampleEn: 'Questo ufficio postale si trova proprio accanto alla farmacia.',
    examplePt: 'O correio fica bem ao lado da farmácia.',
  },
  'voc-it-v4-a1-1-3': {
    exampleEn: 'Alla cassa ho chiesto lo scontrino per controllare i prezzi.',
    examplePt: 'No caixa pedi a nota fiscal para conferir os preços.',
  },
  'voc-it-v4-a1-7-2': {
    exampleEn: 'Il paziente è stato portato subito in ospedale in ambulanza.',
    examplePt: 'Chamamos imediatamente uma ambulância porque o senhor passou mal.',
  },
  'voc-it-v4-a1-7-3': {
    exampleEn: 'Mi dica il suo indirizzo esatto così i soccorsi arrivano subito.',
    examplePt: 'Diga-me seu endereço exato para que o resgate chegue logo.',
  },
  'voc-it-a2-1-3': {
    exampleEn: 'Ieri ho preferito rimanere a casa tutto il giorno per colpa della pioggia.',
    examplePt: 'Ontem preferi ficar em casa o dia todo por causa da chuva.',
  },
  'voc-it-a2-2-3': {
    exampleEn: 'Conservi lo scontrino se desidera cambiare il maglione entro trenta giorni.',
    examplePt: 'Guarde a nota fiscal se desejar trocar o suéter em até trinta dias.',
  },
  'voc-it-a2-4-1': {
    exampleEn: 'Il gatto dorme tranquillamente nel cestino vicino al termosifone.',
    examplePt: 'O gato dorme tranquilamente no cestinho perto do aquecedor.',
  },
  'voc-it-v4-a2-1-2': {
    exampleEn: 'C’è un guasto alla caldaia e non abbiamo acqua calda da stamattina.',
    examplePt: 'Há um defeito no aquecedor e estamos sem água quente desde hoje de manhã.',
  },
  'voc-it-v4-a2-1-3': {
    exampleEn: 'Il proprietario ha chiamato un bravo idraulico per riparare il tubo che perde.',
    examplePt: 'O proprietário chamou o encanador para consertar o cano que está vazando.',
  },
  'voc-it-v4-a2-2-3': {
    exampleEn: 'Ho preso una multa perché ho parcheggiato nella zona a traffico limitato.',
    examplePt: 'Levei uma multa porque estacionei na zona de tráfego limitado.',
  },
  'voc-it-v4-a2-3-3': {
    exampleEn: 'Può elencarmi tutti gli ingredienti di questo piatto per sicurezza?',
    examplePt: 'Pode listar todos os ingredientes deste prato por segurança?',
  },
  'voc-it-v4-a2-6-2': {
    exampleEn: 'Ho rinnovato questo abbonamento annuale in palestra con uno sconto speciale.',
    examplePt: 'Renovei a assinatura anual na academia com um desconto especial.',
  },
  'voc-it-v4-a2-6-3': {
    exampleEn: 'Dopo un buon allenamento oggi mi sento pieno di energia.',
    examplePt: 'Depois do treino de hoje me sinto cheio de energia.',
  },
  'voc-it-v4-a2-7-1': {
    exampleEn: 'Il mio vicino di casa è molto gentile e ritira spesso i miei pacchi.',
    examplePt: 'Meu vizinho é muito gentil e muitas vezes recebe minhas encomendas.',
  },
  'voc-it-v4-a2-9-2': {
    exampleEn: 'Ho comprato delle pesche dolcissime alla bancarella all’angolo della piazza.',
    examplePt: 'Comprei pêssegos bem doces na barraca da esquina da praça.',
  },
  'voc-it-v4-a2-10-2': {
    exampleEn: 'Bisogna soffriggere lentamente l’aglio e la cipolla nell’olio d’oliva.',
    examplePt: 'É preciso refogar lentamente o alho e a cebola no azeite de oliva.',
  },
  'voc-it-b1-6-2': {
    exampleEn: 'Questo è un argomento molto delicato di cui preferisco parlare di persona.',
    examplePt: 'Este é um assunto muito delicado do qual prefiro falar pessoalmente.',
  },
  'voc-it-b1-7-2': {
    exampleEn: 'Domenica scorsa abbiamo visitato una mostra splendida agli Uffizi.',
    examplePt: 'No domingo passado visitamos uma exposição esplêndida nos Uffizi.',
  },
  'voc-it-b1-9-3': {
    exampleEn: 'Cerco sempre di restare aggiornato sulle notizie principali leggendo più giornali.',
    examplePt: 'Procuro sempre me manter atualizado sobre as principais notícias lendo vários jornais.',
  },
  'voc-it-v4-b1-1-2': {
    exampleEn: 'Per prenotare la visita specialistica serve una nuova impegnativa del medico di base.',
    examplePt: 'Para agendar a consulta com especialista é necessário o encaminhamento do médico de família.',
  },
  'voc-it-v4-b1-3-3': {
    exampleEn: 'Ho chiamato la banca per disconoscere un pagamento che non ho mai autorizzato.',
    examplePt: 'Liguei para o banco para contestar um pagamento que nunca autorizei.',
  },
  'voc-it-v4-b1-5-1': {
    exampleEn: 'Devo presentare la domanda per il rinnovo del permesso di soggiorno alle poste.',
    examplePt: 'Preciso apresentar o pedido de renovação da autorização de residência nos correios.',
  },
  'voc-it-v4-b1-7-1': {
    exampleEn: 'Faccio volontariato ogni sabato mattina presso la mensa del quartiere.',
    examplePt: 'Faço voluntariado todo sábado de manhã no refeitório comunitário do bairro.',
  },
  'voc-it-v4-b1-8-3': {
    exampleEn: 'Ho inviato la disdetta del contratto di affitto con tre mesi di preavviso.',
    examplePt: 'Enviei a rescisão do contrato de aluguel com três meses de aviso prévio.',
  },
  'voc-it-idioms-b1-2': {
    exampleEn: 'I ragazzi dicevano di non vedere l’ora di partire per la Sicilia.',
    examplePt: 'Os jovens diziam não ver a hora de partir para a Sicília.',
  },
  'voc-it-idioms-b1-4': {
    exampleEn: 'Ti racconto un segreto su Marco, ma mi raccomando: acqua in bocca!',
    examplePt: 'Vou te contar um segredo sobre o Marco, mas por favor: boca fechada!',
  },
  'voc-it-b2-1-3': {
    exampleEn: 'Molti esperti sembrano ritenere che il mercato sia ormai stabile.',
    examplePt: 'Muitos especialistas parecem considerar que o mercado já está estável.',
  },
  'voc-it-b2-2-1': {
    exampleEn: 'Se riducessimo il traffico privato, il livello di inquinamento calerebbe sensibilmente.',
    examplePt: 'Se reduzíssemos o tráfego privado, a poluição atmosférica cairia sensivelmente.',
  },
  'voc-it-b2-7-3': {
    exampleEn: 'Il comune ha deciso di stanziare nuovi fondi per il restauro delle scuole.',
    examplePt: 'A prefeitura decidiu destinar novos fundos para a restauração das escolas.',
  },
  'voc-it-b2-8-2': {
    exampleEn: 'Nonostante la tensione dell’esame orale, Giulia è riuscita a cavarsela benissimo.',
    examplePt: 'Apesar da tensão da prova oral, Giulia conseguiu se sair muito bem.',
  },
  'voc-it-b2-8-3': {
    exampleEn: 'È inutile prendersela così tanto per una battuta innocente.',
    examplePt: 'É inútil se ofender tanto assim por uma piada inocente.',
  },
  'voc-it-v4-b2-2-1': {
    exampleEn: 'Prima di condividere un articolo, bisogna sempre verificarne la reale attendibilità.',
    examplePt: 'Antes de compartilhar um artigo, é sempre preciso verificar sua confiabilidade.',
  },
  'voc-it-v4-b2-2-3': {
    exampleEn: 'Quel titolo è chiaramente fuorviante perché omette i dati principali dello studio.',
    examplePt: 'Aquele título é claramente enganoso porque omite os dados principais do estudo.',
  },
  'voc-it-v4-b2-4-3': {
    exampleEn: 'Il venditore è tenuto a garantire la conformità del prodotto acquistato.',
    examplePt: 'O vendedor é obrigado a garantir a conformidade do produto adquirido.',
  },
  'voc-it-v4-b2-8-2': {
    exampleEn: 'Il governo finanzia interventi di efficientamento energetico negli edifici pubblici.',
    examplePt: 'O governo financia intervenções de eficiência energética nos edifícios públicos.',
  },
  'voc-it-v4-b2-8-3': {
    exampleEn: 'L’energia solare è una risorsa rinnovabile fondamentale per il futuro.',
    examplePt: 'A energia solar é um recurso renovável fundamental para o futuro.',
  },
  'voc-it-taboo-register-b2-4': {
    exampleEn: 'In una discussione accesa qualcuno potrebbe urlare «vaffanculo», ma in contesti formali è un insulto gravissimo.',
    examplePt: 'Em uma discussão acalorada alguém pode gritar «vaffanculo», mas em contextos formais é um insulto gravíssimo.',
  },
  'voc-it-c1-1-2': {
    exampleEn: 'Se ci fosse stata maggiore intesa tra i soci, avremmo evitato il fallimento.',
    examplePt: 'Se tivesse havido maior entendimento entre os sócios, teríamos evitado a falência.',
  },
  'voc-it-c1-1-3': {
    exampleEn: 'Avremmo dovuto coinvolgere tutto il team fin dall’inizio del progetto.',
    examplePt: 'Deveríamos ter envolvido toda a equipe desde o início do projeto.',
  },
  'voc-it-c1-2-2': {
    exampleEn: 'Restiamo in attesa di conoscere il vero esito definitivo della valutazione.',
    examplePt: 'Aguardamos para conhecer o resultado definitivo da avaliação.',
  },
  'voc-it-c1-3-2': {
    exampleEn: 'L’uso di alcuni termini regionali è un tratto distintivo del suo stile.',
    examplePt: 'O uso de alguns termos regionais é um traço distintivo do seu estilo.',
  },
  'voc-it-c1-4-2': {
    exampleEn: 'Dante lasciò una profonda impronta sulla lingua e sulla letteratura italiana.',
    examplePt: 'Dante deixou uma marca indelével na língua e na literatura italiana.',
  },
  'voc-it-c1-6-3': {
    exampleEn: 'L’accordo internazionale ha segnato una svolta decisiva per l’economia del settore.',
    examplePt: 'O acordo internacional marcou uma virada decisiva para a economia do setor.',
  },
  'voc-it-c1-8-3': {
    exampleEn: 'Non vorrei che le mie parole si potessero fraintendere come una critica personale.',
    examplePt: 'Não gostaria que minhas palavras pudessem ser mal interpretadas como uma crítica pessoal.',
  },
  'voc-it-v4-c1-2-1': {
    exampleEn: 'L’attuale congiuntura economica richiede prudenza negli investimenti pubblici.',
    examplePt: 'A atual conjuntura econômica exige prudência nos investimentos públicos.',
  },
  'voc-it-v4-c1-2-2': {
    exampleEn: 'Secondo le stime, l’inflazione dovrebbe attestarsi intorno al due per cento.',
    examplePt: 'Segundo as estimativas, a inflação deverá se estabilizar em torno de dois por cento.',
  },
  'voc-it-v4-c1-3-2': {
    exampleEn: 'Il contratto prevede una clausola di manleva a favore del fornitore.',
    examplePt: 'O contrato prevê uma cláusula de isenção de responsabilidade em favor do fornecedor.',
  },
  'voc-it-v4-c1-4-2': {
    exampleEn: 'Dall’analisi dei dati sembra evincersi una correlazione significativa tra le variabili.',
    examplePt: 'Da análise dos dados parece deduzir-se uma correlação significativa entre as variáveis.',
  },
  'voc-it-v4-c1-4-3': {
    exampleEn: 'Il campione statistico è troppo esiguo per trarre conclusioni definitive.',
    examplePt: 'A amostra estatística é exígua demais para tirar conclusões definitivas.',
  },
  'voc-it-v4-c1-6-3': {
    exampleEn: 'L’aggiornamento di sicurezza corregge una grave vulnerabilità del sistema.',
    examplePt: 'A atualização de segurança corrige uma grave vulnerabilidade do sistema.',
  },
  'voc-it-v4-c1-7-2': {
    exampleEn: 'Lungi da me l’idea di criticare il suo operato, desidero solo proporre un’alternativa.',
    examplePt: 'Longe de mim a ideia de criticar seu trabalho, desejo apenas propor uma alternativa.',
  },
  'voc-it-v4-c1-10-3': {
    exampleEn: 'Questa essenzialità delle linee conferisce all’opera un’eleganza senza tempo.',
    examplePt: 'A essencialidade das linhas confere à obra uma elegância atemporal.',
  },
};
