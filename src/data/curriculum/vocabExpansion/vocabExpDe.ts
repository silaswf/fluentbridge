/**
 * @file src/data/curriculum/vocabExpansion/vocabExpDe.ts
 * @description Expansão e correções lexicais de vocabulário para o curso de Alemão.
 * @exports VOCAB_EXP_DE, VOCAB_FIXES_DE
 */
import type { VocabExampleFixMap, VocabExpansionTuple } from './types';

export const VOCAB_EXP_DE: VocabExpansionTuple[] = [
  // de-a1-1: Hallo! Cumprimentos, Sein/Haben & Sie vs. Du
  ['de-a1-1', 'Guten Morgen', '/ˈɡuːtn̩ ˈmɔʁɡn̩/', 'Bom dia', 'phrase', 'Guten Morgen, wie geht es Ihnen heute?', 'Bom dia, como o senhor está hoje?'],
  ['de-a1-1', 'Tschüss', '/tʃʏs/', 'Tchau', 'phrase', 'Tschüss, bis morgen in der Schule!', 'Tchau, até amanhã na escola!'],
  ['de-a1-1', 'Vorstellen', '/ˈfoːɐ̯ʃtɛlən/', 'Apresentar(-se)', 'verb', 'Darf ich mich kurz vorstellen? Ich bin Lukas.', 'Posso me apresentar brevemente? Eu sou o Lukas.'],

  // de-a1-2: Pronúncia Alemã: CH, SCH, EI, IE, Ä, Ö, Ü & ß
  ['de-a1-2', 'Die Tür', '/diː tyːɐ̯/', 'A porta', 'noun', 'Bitte mach die Tür zu, es ist kalt draußen.', 'Por favor, feche a porta, está frio lá fora.'],
  ['de-a1-2', 'Der Tisch', '/deːɐ̯ tɪʃ/', 'A mesa', 'noun', 'Das Buch liegt auf dem Tisch.', 'O livro está sobre a mesa.'],
  ['de-a1-2', 'Weiß', '/vaɪ̯s/', 'Branco', 'adjective', 'Mein neues Hemd ist ganz weiß.', 'Minha camisa nova é toda branca.'],

  // de-a1-3: Os 3 Gêneros (Der, Die, Das) & Plural
  ['de-a1-3', 'Der Stuhl', '/deːɐ̯ ʃtuːl/', 'A cadeira', 'noun', 'Der Stuhl neben dem Fenster ist noch frei.', 'A cadeira ao lado da janela ainda está livre.'],
  ['de-a1-3', 'Die Lampe', '/diː ˈlampə/', 'A luminária / lâmpada', 'noun', 'Die Lampe im Wohnzimmer gibt warmes Licht.', 'A luminária na sala dá uma luz quente.'],
  ['de-a1-3', 'Das Fenster', '/das ˈfɛnstɐ/', 'A janela', 'noun', 'Kannst du bitte das Fenster öffnen?', 'Você pode abrir a janela, por favor?'],

  // de-a1-4: Na Bäckerei & Café: Akkusativ na Prática
  ['de-a1-4', 'Der Kaffee', '/deːɐ̯ ˈkafe/', 'O café', 'noun', 'Ich hätte gern einen Kaffee mit Milch.', 'Eu gostaria de um café com leite.'],
  ['de-a1-4', 'Die Speisekarte', '/diː ˈʃpaɪ̯zəˌkaʁtə/', 'O cardápio', 'noun', 'Können Sie mir bitte die Speisekarte bringen?', 'O senhor pode me trazer o cardápio, por favor?'],
  ['de-a1-4', 'Bestellen', '/bəˈʃtɛlən/', 'Pedir (em café/restaurante)', 'verb', 'Möchten Sie schon etwas zu trinken bestellen?', 'O senhor já gostaria de pedir algo para beber?'],

  // de-a1-5: Números, Horas, Dias & Preços
  ['de-a1-5', 'Der Preis', '/deːɐ̯ pʁaɪ̯s/', 'O preço', 'noun', 'Wie hoch ist der Preis für das Ticket?', 'Qual é o preço do bilhete?'],
  ['de-a1-5', 'Die Woche', '/diː ˈvɔxə/', 'A semana', 'noun', 'Nächste Woche habe ich endlich Urlaub.', 'Na próxima semana eu finalmente tenho férias.'],
  ['de-a1-5', 'Geöffnet', '/ɡəˈʔœfnət/', 'Aberto', 'adjective', 'Das Museum ist heute bis achtzehn Uhr geöffnet.', 'O museu está aberto hoje até as dezoito horas.'],

  // de-a1-6: Rotina Diária & Verbos Separáveis (Aufstehen)
  ['de-a1-6', 'Frühstücken', '/ˈfʁyːˌʃtʏkn̩/', 'Tomar café da manhã', 'verb', 'Am Sonntag frühstücken wir immer zusammen.', 'No domingo nós sempre tomamos café da manhã juntos.'],
  ['de-a1-6', 'Einschlafen', '/ˈaɪ̯nˌʃlaːfn̩/', 'Adormecer', 'verb', 'Nach der Arbeit kann ich abends schnell einschlafen.', 'Depois do trabalho consigo adormecer rápido à noite.'],
  ['de-a1-6', 'Aufräumen', '/ˈaʊ̯fˌʁɔɪ̯mən/', 'Arrumar / organizar', 'verb', 'Vor dem Abendessen muss ich mein Zimmer aufräumen.', 'Antes do jantar preciso arrumar meu quarto.'],

  // de-a1-7: Família, Casa & Possessivos (Mein / Dein)
  ['de-a1-7', 'Die Eltern', '/diː ˈɛltɐn/', 'Os pais', 'noun', 'Meine Eltern wohnen in einer kleinen Stadt.', 'Meus pais moram em uma cidade pequena.'],
  ['de-a1-7', 'Die Küche', '/diː ˈkʏçə/', 'A cozinha', 'noun', 'Unsere Küche ist klein, aber sehr hell.', 'Nossa cozinha é pequena, mas muito clara.'],
  ['de-a1-7', 'Das Schlafzimmer', '/das ˈʃlaːfˌtsɪmɐ/', 'O quarto de dormir', 'noun', 'Im Schlafzimmer steht ein großes Bett.', 'No quarto há uma cama grande.'],

  // de-a1-8: Clima, Estações do Ano & O Que Vestir
  ['de-a1-8', 'Die Sonne', '/diː ˈzɔnə/', 'O sol', 'noun', 'Heute scheint die Sonne den ganzen Tag.', 'Hoje o sol brilha o dia inteiro.'],
  ['de-a1-8', 'Der Winter', '/deːɐ̯ ˈvɪntɐ/', 'O inverno', 'noun', 'Im Winter trage ich immer einen warmen Mantel.', 'No inverno eu sempre uso um casaco quente.'],
  ['de-a1-8', 'Die Jacke', '/diː ˈjakə/', 'A jaqueta / casaco', 'noun', 'Nimm deine Jacke mit, es wird kühl.', 'Leve sua jaqueta, vai esfriar.'],

  // de-a1-9: Hobbys, Tempo Livre & Verbos com Troca de Vogal
  ['de-a1-9', 'Schwimmen', '/ˈʃvɪmən/', 'Nadar', 'verb', 'Im Sommer gehe ich gern im See schwimmen.', 'No verão gosto de ir nadar no lago.'],
  ['de-a1-9', 'Lesen', '/ˈleːzn̩/', 'Ler', 'verb', 'Abends möchte ich noch ein Kapitel lesen.', 'À noite quero ler mais um capítulo.'],
  ['de-a1-9', 'Die Musik', '/diː muˈziːk/', 'A música', 'noun', 'Beim Kochen höre ich am liebsten ruhige Musik.', 'Enquanto cozinho prefiro ouvir música calma.'],

  // de-a1-10: No Supermercado: Compras, Quantidades & Cozinha
  ['de-a1-10', 'Das Brot', '/das bʁoːt/', 'O pão', 'noun', 'Wir brauchen noch ein frisches Brot für morgen.', 'Ainda precisamos de um pão fresco para amanhã.'],
  ['de-a1-10', 'Der Käse', '/deːɐ̯ ˈkɛːzə/', 'O queijo', 'noun', 'Ich kaufe zweihundert Gramm Käse an der Theke.', 'Vou comprar duzentos gramas de queijo no balcão.'],
  ['de-a1-10', 'Der Einkaufswagen', '/deːɐ̯ ˈaɪ̯nkaʊ̯fsˌvaːɡn̩/', 'O carrinho de compras', 'noun', 'Hast du eine Münze für den Einkaufswagen?', 'Você tem uma moeda para o carrinho de compras?'],

  // de-v4-a1-1: Supermercado, Caixa & Sistema de Pfand
  ['de-v4-a1-1', 'Die Kasse', '/diː ˈkasə/', 'O caixa (do supermercado)', 'noun', 'An der ersten Kasse ist die Schlange kürzer.', 'No primeiro caixa a fila está mais curta.'],
  ['de-v4-a1-1', 'Die Pfandflasche', '/diː ˈpfantˌflaʃə/', 'A garrafa retornável', 'noun', 'Jede Pfandflasche bringt fünfundzwanzig Cent zurück.', 'Cada garrafa retornável devolve vinte e cinco centavos.'],
  ['de-v4-a1-1', 'Mit Karte zahlen', '/mɪt ˈkaʁtə ˈtsaːlən/', 'Pagar com cartão', 'phrase', 'Kann ich hier bitte mit Karte zahlen?', 'Posso pagar com cartão aqui, por favor?'],

  // de-v4-a1-2: Na Farmácia: Sintomas, Dores & Remédios
  ['de-v4-a1-2', 'Die Kopfschmerzen', '/diː ˈkɔpfˌʃmɛʁtsn̩/', 'A dor de cabeça', 'noun', 'Gegen starke Kopfschmerzen hilft viel Wasser und Ruhe.', 'Contra dor de cabeça forte ajuda muita água e descanso.'],
  ['de-v4-a1-2', 'Der Hustensaft', '/deːɐ̯ ˈhuːstn̩ˌzaft/', 'O xarope para tosse', 'noun', 'Der Apotheker empfiehlt diesen Hustensaft für die Nacht.', 'O farmacêutico recomenda este xarope para a noite.'],
  ['de-v4-a1-2', 'Einnehmen', '/ˈaɪ̯nˌneːmən/', 'Tomar (remédio)', 'verb', 'Sie müssen die Medizin nach dem Essen einnehmen.', 'O senhor deve tomar o remédio depois de comer.'],

  // de-v4-a1-3: Metrô, Trens (DB) & Bilhetes na Plataforma
  ['de-v4-a1-3', 'Der Bahnhof', '/deːɐ̯ ˈbaːnhoːf/', 'A estação de trem', 'noun', 'Wir treffen uns um neun Uhr am Bahnhof.', 'Nós nos encontramos às nove horas na estação de trem.'],
  ['de-v4-a1-3', 'Die Abfahrt', '/diː ˈapfaːɐ̯t/', 'A partida / saída', 'noun', 'Die Abfahrt des Zuges ist um vierzehn Uhr zehn.', 'A partida do trem é às quatorze horas e dez.'],
  ['de-v4-a1-3', 'Der Fahrplan', '/deːɐ̯ ˈfaːɐ̯plaːn/', 'O horário dos trens', 'noun', 'Laut Fahrplan fährt die Bahn alle zehn Minuten.', 'Segundo o quadro de horários, o trem passa a cada dez minutos.'],

  // de-v4-a1-4: Check-in no Hotel & Senha do Wi-Fi (WLAN)
  ['de-v4-a1-4', 'Der Zimmerschlüssel', '/deːɐ̯ ˈtsɪmɐˌʃlʏsl̩/', 'A chave do quarto', 'noun', 'Hier ist Ihr Zimmerschlüssel für die dritte Etage.', 'Aqui está a chave do seu quarto para o terceiro andar.'],
  ['de-v4-a1-4', 'Das Passwort', '/das ˈpasvɔʁt/', 'A senha', 'noun', 'Wie lautet bitte das Passwort für das Hotelnetz?', 'Qual é a senha da rede do hotel, por favor?'],
  ['de-v4-a1-4', 'Die Rezeption', '/diː ʁetsɛpˈtsi̯oːn/', 'A recepção', 'noun', 'Die Rezeption ist rund um die Uhr besetzt.', 'A recepção funciona vinte e quatro horas por dia.'],

  // de-v4-a1-5: Aeroporto, Check-in & Embarque (Boarding)
  ['de-v4-a1-5', 'Der Koffer', '/deːɐ̯ ˈkɔfɐ/', 'A mala', 'noun', 'Mein Koffer wiegt genau zwanzig Kilogramm.', 'Minha mala pesa exatamente vinte quilos.'],
  ['de-v4-a1-5', 'Der Reisepass', '/deːɐ̯ ˈʁaɪ̯zəˌpas/', 'O passaporte', 'noun', 'Bitte halten Sie Ihren Reisepass am Schalter bereit.', 'Por favor, tenha seu passaporte em mãos no guichê.'],
  ['de-v4-a1-5', 'Das Flugsteig', '/das ˈfluːkʃtaɪ̯k/', 'O portão de embarque', 'noun', 'Unser Flug startet heute vom Flugsteig zwölf.', 'Nosso voo parte hoje do portão de embarque doze.'],

  // de-v4-a1-6: Roupas, Tamanhos & Provador na Loja
  ['de-v4-a1-6', 'Das Hemd', '/das hɛmt/', 'A camisa', 'noun', 'Dieses blaue Hemd passt sehr gut zur Hose.', 'Esta camisa azul combina muito bem com a calça.'],
  ['de-v4-a1-6', 'Die Hose', '/diː ˈhoːzə/', 'A calça', 'noun', 'Die Hose ist mir leider ein bisschen zu lang.', 'Infelizmente a calça está um pouco comprida demais para mim.'],
  ['de-v4-a1-6', 'Die Farbe', '/diː ˈfaʁbə/', 'A cor', 'noun', 'Haben Sie diesen Pullover auch in einer anderen Farbe?', 'O senhor tem este suéter também em outra cor?'],

  // de-v4-a1-7: Emergências: Polícia (110) & Ambulância/Bombeiros (112)
  ['de-v4-a1-7', 'Die Polizei', '/diː poliˈtsaɪ̯/', 'A polícia', 'noun', 'Die Polizei ist schon unterwegs zum Unfallort.', 'A polícia já está a caminho do local do acidente.'],
  ['de-v4-a1-7', 'Die Feuerwehr', '/diː ˈfɔɪ̯ɐveːɐ̯/', 'Os bombeiros', 'noun', 'Bei einem Brand muss man sofort die Feuerwehr rufen.', 'Em caso de incêndio deve-se chamar os bombeiros imediatamente.'],
  ['de-v4-a1-7', 'Die Hilfe', '/diː ˈhɪlfə/', 'A ajuda', 'noun', 'Wir brauchen dringend ärztliche Hilfe am Hauptplatz.', 'Precisamos urgentemente de ajuda médica na praça principal.'],

  // de-v4-a1-8: Banco, Caixa Eletrônico & Pagamentos
  ['de-v4-a1-8', 'Das Konto', '/das ˈkɔnto/', 'A conta bancária', 'noun', 'Ich möchte ein neues Konto bei Ihrer Bank eröffnen.', 'Gostaria de abrir uma nova conta no seu banco.'],
  ['de-v4-a1-8', 'Die Bankkarte', '/diː ˈbaŋkˌkaʁtə/', 'O cartão bancário', 'noun', 'Ohne Bankkarte kann man am Automaten kein Geld holen.', 'Sem cartão bancário não é possível sacar dinheiro no caixa eletrônico.'],
  ['de-v4-a1-8', 'Die Geheimzahl', '/diː ɡəˈhaɪ̯mˌtsaːl/', 'O código PIN / senha', 'noun', 'Geben Sie Ihre Geheimzahl bitte verdeckt ein.', 'Digite sua senha protegendo o teclado, por favor.'],

  // de-v4-a1-9: Cabeleireiro & Marcação de Horários (Termine)
  ['de-v4-a1-9', 'Haare schneiden', '/ˈhaːʁə ˈʃnaɪ̯dn̩/', 'Cortar o cabelo', 'phrase', 'Ich möchte mir heute nur die Haare schneiden lassen.', 'Hoje quero apenas cortar o cabelo.'],
  ['de-v4-a1-9', 'Vereinbaren', '/fɛɐ̯ˈʔaɪ̯nˌbaːʁən/', 'Marcar / combinar (horário)', 'verb', 'Können wir für Freitag einen neuen Termin vereinbaren?', 'Podemos marcar um novo horário para sexta-feira?'],
  ['de-v4-a1-9', 'Absagen', '/ˈapˌzaːɡn̩/', 'Cancelar (compromisso)', 'verb', 'Ich muss meinen Besuch leider kurzfristig absagen.', 'Infelizmente preciso cancelar minha visita em cima da hora.'],

  // de-v4-a1-10: Horas (Uhrzeit) & Encontros com Amigos
  ['de-v4-a1-10', 'Das Viertel', '/das ˈfɪʁtl̩/', 'Um quarto (de hora)', 'noun', 'Wir treffen uns um Viertel nach drei vor dem Kino.', 'Nós nos encontramos às três e quinze na frente do cinema.'],
  ['de-v4-a1-10', 'Verspätet', '/fɛɐ̯ˈʃpɛːtət/', 'Atrasado', 'adjective', 'Der Bus ist heute leider zehn Minuten verspätet.', 'Infelizmente o ônibus está dez minutos atrasado hoje.'],
  ['de-v4-a1-10', 'Die Einladung', '/diː ˈaɪ̯nˌlaːdʊŋ/', 'O convite', 'noun', 'Vielen Dank für deine freundliche Einladung zum Abendessen!', 'Muito obrigado pelo seu gentil convite para o jantar!'],

  // de-a2-1: Modalverben (Können, Müssen, Dürfen, Wollen)
  ['de-a2-1', 'Wollen', '/ˈvɔlən/', 'Querer', 'verb', 'Am Wochenende wollen wir einen Ausflug machen.', 'No fim de semana queremos fazer um passeio.'],
  ['de-a2-1', 'Sollen', '/ˈzɔlən/', 'Dever (conselho/obrigação)', 'verb', 'Der Arzt sagt, ich soll mehr Tee trinken.', 'O médico diz que eu devo beber mais chá.'],
  ['de-a2-1', 'Die Erlaubnis', '/diː ɛɐ̯ˈlaʊ̯pnɪs/', 'A permissão', 'noun', 'Für diesen Parkplatz brauchen Sie eine besondere Erlaubnis.', 'Para esta vaga de estacionamento você precisa de uma permissão especial.'],

  // de-a2-2: Perfekt: Falando do Passado (Haben vs. Sein)
  ['de-a2-2', 'Fahren', '/ˈfaːʁən/', 'Ir (de veículo) / dirigir', 'verb', 'Letzten Sommer wollten wir mit dem Zug nach Wien fahren.', 'No verão passado quisemos ir de trem para Viena.'],
  ['de-a2-2', 'Erleben', '/ɛɐ̯ˈleːbn̩/', 'Vivenciar / experimentar', 'verb', 'Auf unserer Reise haben wir viele schöne Dinge erlebt.', 'Em nossa viagem vivenciamos muitas coisas bonitas.'],
  ['de-a2-2', 'Vergessen', '/fɛɐ̯ˈɡɛsn̩/', 'Esquecer', 'verb', 'Ich habe leider meinen Regenschirm im Büro vergessen.', 'Infelizmente esqueci meu guarda-chuva no escritório.'],

  // de-a2-3: Transporte (Deutsche Bahn), Direções & Dativ
  ['de-a2-3', 'Der Anschluss', '/deːɐ̯ ˈanʃlʊs/', 'A conexão (trem/ônibus)', 'noun', 'In Frankfurt habe ich nur fünf Minuten Zeit für den Anschluss.', 'Em Frankfurt tenho apenas cinco minutos para a conexão.'],
  ['de-a2-3', 'Geradeaus', '/ɡəˈʁaːdəˌʔaʊ̯s/', 'Em frente / reto', 'adverb', 'Gehen Sie zweihundert Meter geradeaus bis zur Ampel.', 'Siga duzentos metros reto até o semáforo.'],
  ['de-a2-3', 'Die Kreuzung', '/diː ˈkʁɔɪ̯tsʊŋ/', 'O cruzamento', 'noun', 'An der nächsten Kreuzung müssen Sie links abbiegen.', 'No próximo cruzamento você deve virar à esquerda.'],

  // de-a2-4: Compras, Roupas & Dativ com Verbos (Gefallen/Stehen)
  ['de-a2-4', 'Anziehen', '/ˈanˌtsiːən/', 'Vestir(-se)', 'verb', 'Für die Feier möchte ich mein neues Kleid anziehen.', 'Para a festa quero vestir meu vestido novo.'],
  ['de-a2-4', 'Aussehen', '/ˈaʊ̯sˌzeːən/', 'Parecer / ter aparência', 'verb', 'Dieser Mantel lässt dich sehr elegant aussehen.', 'Este casaco faz você parecer muito elegante.'],
  ['de-a2-4', 'Der Rabatt', '/deːɐ̯ ʁaˈbat/', 'O desconto', 'noun', 'Auf alle Winterschuhe gibt es heute zwanzig Prozent Rabatt.', 'Hoje há vinte por cento de desconto em todos os sapatos de inverno.'],

  // de-a2-5: Wechselpräpositionen: Wo? (Dativ) vs. Wohin? (Akkusativ)
  ['de-a2-5', 'Hängen', '/ˈhɛŋən/', 'Pendurar / estar pendurado', 'verb', 'Das Bild soll über dem Sofa hängen.', 'O quadro deve ficar pendurado acima do sofá.'],
  ['de-a2-5', 'Sitzen', '/ˈzɪtsn̩/', 'Estar sentado', 'verb', 'Die Katze sitzt am liebsten auf dem warmen Teppich.', 'O gato prefere ficar sentado no tapete quentinho.'],
  ['de-a2-5', 'Das Regal', '/das ʁeˈɡaːl/', 'A estante / prateleira', 'noun', 'Alle Wörterbücher stehen ordentlich im Regal.', 'Todos os dicionários estão organizados na estante.'],

  // de-a2-6: Saúde, Corpo & Consultório Médico
  ['de-a2-6', 'Das Fieber', '/das ˈfiːbɐ/', 'A febre', 'noun', 'Mit hohem Fieber solltest du heute im Bett bleiben.', 'Com febre alta você deveria ficar na cama hoje.'],
  ['de-a2-6', 'Der Husten', '/deːɐ̯ ˈhuːstn̩/', 'A tosse', 'noun', 'Mein Husten ist nach drei Tagen schon viel besser.', 'Minha tosse já está bem melhor depois de três dias.'],
  ['de-a2-6', 'Untersuchen', '/ʊntɐˈzuːxn̩/', 'Examinar', 'verb', 'Die Ärztin möchte zuerst Ihren Hals untersuchen.', 'A médica quer examinar primeiro a sua garganta.'],

  // de-a2-7: TeKaMoLo: A Ordem Mágica das Palavras
  ['de-a2-7', 'Morgens', '/ˈmɔʁɡn̩s/', 'De manhã (habitualmente)', 'adverb', 'Morgens fahre ich wegen des Verkehrs lieber mit der Bahn.', 'De manhã prefiro ir de trem por causa do trânsito.'],
  ['de-a2-7', 'Sorgfältig', '/ˈzɔʁkfɛltɪç/', 'Cuidadosamente', 'adverb', 'Er liest jeden Vertrag vor der Unterschrift sorgfältig durch.', 'Ele lê cada contrato cuidadosamente antes de assinar.'],
  ['de-a2-7', 'Draußen', '/ˈdʁaʊ̯sn̩/', 'Lá fora', 'adverb', 'Bei gutem Wetter essen die Kinder gern draußen im Garten.', 'Com tempo bom as crianças gostam de comer lá fora no jardim.'],

  // de-a2-8: Präteritum de Sein/Haben/Modais & Nebensätze (Weil / Dass)
  ['de-a2-8', 'Deshalb', '/ˈdɛshalp/', 'Por isso', 'adverb', 'Der Zug fiel aus, deshalb kam ich später an.', 'O trem foi cancelado, por isso cheguei mais tarde.'],
  ['de-a2-8', 'Trotzdem', '/ˈtʁɔtsdeːm/', 'Mesmo assim / apesar disso', 'adverb', 'Es regnete stark, trotzdem gingen wir spazieren.', 'Chovia forte, mesmo assim fomos caminhar.'],
  ['de-a2-8', 'Erklären', '/ɛɐ̯ˈklɛːʁən/', 'Explicar', 'verb', 'Kannst du mir erklären, warum die Tür offen war?', 'Você pode me explicar por que a porta estava aberta?'],

  // de-a2-9: Viagens, Hotel & Reclamações Educadas
  ['de-a2-9', 'Die Klimaanlage', '/diː ˈkliːmaːˌʔanlaːɡə/', 'O ar-condicionado', 'noun', 'Leider funktioniert die Klimaanlage in unserem Zimmer nicht.', 'Infelizmente o ar-condicionado do nosso quarto não está funcionando.'],
  ['de-a2-9', 'Tauschen', '/ˈtaʊ̯ʃn̩/', 'Trocar', 'verb', 'Könnten wir das Handtuch bitte gegen ein frisches tauschen?', 'Poderíamos trocar a toalha por uma limpa, por favor?'],
  ['de-a2-9', 'Die Beschwerde', '/diː bəˈʃveːɐ̯də/', 'A reclamação', 'noun', 'Der Manager hat unsere Beschwerde sofort ernst genommen.', 'O gerente levou nossa reclamação a sério imediatamente.'],

  // de-a2-10: Comparativo, Superlativo & Formas Irregulares
  ['de-a2-10', 'Der Unterschied', '/deːɐ̯ ˈʊntɐʃiːt/', 'A diferença', 'noun', 'Der Unterschied zwischen beiden Modellen ist deutlich sichtbar.', 'A diferença entre os dois modelos é claramente visível.'],
  ['de-a2-10', 'Teurer', '/ˈtɔɪ̯ʁɐ/', 'Mais caro', 'adjective', 'Das Restaurant am Marktplatz ist leider viel teurer.', 'O restaurante na praça do mercado é infelizmente muito mais caro.'],
  ['de-a2-10', 'Am schnellsten', '/am ˈʃnɛlstn̩/', 'O mais rápido', 'adverb', 'Mit dem Fahrrad bist du im Stadtzentrum am schnellsten.', 'De bicicleta você é o mais rápido no centro da cidade.'],

  // de-v4-a2-1: Alugar Apartamento & Pedir Reparos ao Proprietário
  ['de-v4-a2-1', 'Die Kaution', '/diː kaʊ̯ˈtsi̯oːn/', 'O depósito caução', 'noun', 'Die Kaution beträgt drei Kaltmieten.', 'O depósito caução equivale a três aluguéis sem despesas.'],
  ['de-v4-a2-1', 'Der Wasserhahn', '/deːɐ̯ ˈvasɐhaːn/', 'A torneira', 'noun', 'Der Wasserhahn im Bad tropft seit gestern Abend.', 'A torneira do banheiro está pingando desde ontem à noite.'],
  ['de-v4-a2-1', 'Reparieren', '/ʁepaˈʁiːʁən/', 'Consertar / reparar', 'verb', 'Wann kann der Techniker die Tür reparieren?', 'Quando o técnico pode consertar a porta?'],

  // de-v4-a2-2: Aluguel de Carro & Posto de Gasolina (Tankstelle)
  ['de-v4-a2-2', 'Der Kraftstoff', '/deːɐ̯ ˈkʁaftʃtɔf/', 'O combustível', 'noun', 'Welchen Kraftstoff braucht dieses Fahrzeug: Benzin oder Diesel?', 'Qual combustível este veículo usa: gasolina ou diesel?'],
  ['de-v4-a2-2', 'Die Versicherung', '/diː fɛɐ̯ˈzɪçəʁʊŋ/', 'O seguro', 'noun', 'Ist eine Vollkasko-Versicherung im Preis enthalten?', 'O seguro completo está incluído no preço?'],
  ['de-v4-a2-2', 'Die Zapfsäule', '/diː ˈtsapfˌzɔɪ̯lə/', 'A bomba de combustível', 'noun', 'Ich habe an der Zapfsäule Nummer vier getankt.', 'Abasteci na bomba número quatro.'],

  // de-v4-a2-3: Alergias Alimentares & Pedidos no Restaurante
  ['de-v4-a2-3', 'Laktosefrei', '/lakˈtoːzəˌfʁaɪ̯/', 'Sem lactose', 'adjective', 'Haben Sie heute auch laktosefreie Milch für den Kaffee?', 'Vocês têm hoje também leite sem lactose para o café?'],
  ['de-v4-a2-3', 'Die Nuss', '/diː nʊs/', 'A noz / castanha', 'noun', 'Enthält dieser Kuchen vielleicht irgendeine Nuss?', 'Este bolo contém por acaso alguma noz ou castanha?'],
  ['de-v4-a2-3', 'Weglassen', '/ˈvɛkˌlasn̩/', 'Retirar / deixar de fora', 'verb', 'Könnte der Koch die Zwiebeln im Salat weglassen?', 'O cozinheiro poderia tirar as cebolas da salada?'],

  // de-v4-a2-4: Bagagem Extraviada no Aeroporto
  ['de-v4-a2-4', 'Der Gepäckschein', '/deːɐ̯ ɡəˈpɛkʃaɪ̯n/', 'O comprovante de bagagem', 'noun', 'Ohne den Gepäckschein ist die Suche deutlich schwieriger.', 'Sem o comprovante de bagagem a busca fica bem mais difícil.'],
  ['de-v4-a2-4', 'Beschädigt', '/bəˈʃɛːdɪçt/', 'Danificado', 'adjective', 'Mein Griff am Koffer wurde beim Flug leider beschädigt.', 'A alça da minha mala infelizmente foi danificada durante o voo.'],
  ['de-v4-a2-4', 'Nachsenden', '/ˈnaːxˌzɛndn̩/', 'Enviar posteriormente', 'verb', 'Die Fluggesellschaft will das Gepäck ins Hotel nachsenden.', 'A companhia aérea vai enviar a bagagem depois para o hotel.'],

  // de-v4-a2-5: Correios (Post), Encomendas & Rastreamento
  ['de-v4-a2-5', 'Der Briefkasten', '/deːɐ̯ ˈbʁiːfˌkastn̩/', 'A caixa de correio', 'noun', 'Der gelbe Briefkasten wird jeden Abend geleert.', 'A caixa de correio amarela é esvaziada todas as noites.'],
  ['de-v4-a2-5', 'Die Briefmarke', '/diː ˈbʁiːfˌmaʁkə/', 'O selo postal', 'noun', 'Für eine Postkarte ins Ausland brauche ich eine passende Briefmarke.', 'Para um cartão-postal para o exterior preciso de um selo adequado.'],
  ['de-v4-a2-5', 'Abholen', '/ˈapˌhoːlən/', 'Retirar / buscar', 'verb', 'Sie können Ihr Paket ab morgen in der Filiale abholen.', 'Você pode retirar sua encomenda a partir de amanhã na agência.'],

  // de-v4-a2-6: Academia (Fitnessstudio), Planos & Treinos
  ['de-v4-a2-6', 'Die Mitgliedschaft', '/diː ˈmɪtɡliːtʃaft/', 'A assinatura / matrícula', 'noun', 'Die Mitgliedschaft läuft zunächst über zwölf Monate.', 'A matrícula vale inicialmente por doze meses.'],
  ['de-v4-a2-6', 'Das Laufband', '/das ˈlaʊ̯fbant/', 'A esteira ergométrica', 'noun', 'Zum Aufwärmen gehe ich zwanzig Minuten aufs Laufband.', 'Para aquecer eu vou vinte minutos para a esteira.'],
  ['de-v4-a2-6', 'Die Umkleide', '/diː ˈʊmklaɪ̯də/', 'O vestiário', 'noun', 'In der Umkleide gibt es abschließbare Spinde.', 'No vestiário há armários com chave.'],

  // de-v4-a2-7: Vizinhos, Nachtruhe & Regras do Prédio (Hausordnung)
  ['de-v4-a2-7', 'Das Treppenhaus', '/das ˈtʁɛpn̩haʊ̯s/', 'A escadaria / hall do prédio', 'noun', 'Bitte stellen Sie keine Fahrräder ins Treppenhaus.', 'Por favor, não deixem bicicletas na escadaria do prédio.'],
  ['de-v4-a2-7', 'Die Mülltonne', '/diː ˈmʏlˌtɔnə/', 'A lixeira (do prédio)', 'noun', 'Die blaue Mülltonne für Papier steht im Hinterhof.', 'A lixeira azul para papel fica no pátio dos fundos.'],
  ['de-v4-a2-7', 'Rücksicht nehmen', '/ˈʁʏkzɪçt ˈneːmən/', 'Ter consideração / respeitar', 'phrase', 'Alle Mieter sollten abends auf die Nachbarn Rücksicht nehmen.', 'Todos os inquilinos devem ter consideração pelos vizinhos à noite.'],

  // de-v4-a2-8: Atendimento ao Cliente por Telefone
  ['de-v4-a2-8', 'Die Warteschleife', '/diː ˈvaʁtəˌʃlaɪ̯fə/', 'A fila de espera (telefônica)', 'noun', 'Ich hänge schon seit zehn Minuten in der Warteschleife.', 'Já estou há dez minutos na fila de espera do telefone.'],
  ['de-v4-a2-8', 'Weiterleiten', '/ˈvaɪ̯tɐˌlaɪ̯tn̩/', 'Transferir (ligação)', 'verb', 'Einen Moment bitte, ich werde Sie an die Fachabteilung weiterleiten.', 'Um momento por favor, vou transferir o senhor para o setor responsável.'],
  ['de-v4-a2-8', 'Die Störung', '/diː ˈʃtøːʁʊŋ/', 'A falha / instabilidade técnica', 'noun', 'Wegen einer technischen Störung haben wir kein Internet.', 'Por causa de uma falha técnica estamos sem internet.'],

  // de-v4-a2-9: Feira Livre (Wochenmarkt) & Produtos Regionais
  ['de-v4-a2-9', 'Frisch', '/fʁɪʃ/', 'Fresco', 'adjective', 'Die Erdbeeren vom Bauernhof schmecken besonders frisch.', 'Os morangos da fazenda têm um gosto especialmente fresco.'],
  ['de-v4-a2-9', 'Der Stand', '/deːɐ̯ ʃtant/', 'A barraca (da feira)', 'noun', 'An diesem Stand kaufe ich immer mein Gemüse.', 'Nesta barraca eu sempre compro meus legumes.'],
  ['de-v4-a2-9', 'Das Wechselgeld', '/das ˈvɛksl̩ˌɡɛlt/', 'O troco', 'noun', 'Hier ist Ihr Wechselgeld und noch ein Apfel gratis.', 'Aqui está o seu troco e mais uma maçã de brinde.'],

  // de-v4-a2-10: Cozinhar, Receitas & Utensílios de Cozinha
  ['de-v4-a2-10', 'Der Topf', '/deːɐ̯ tɔpf/', 'A panela', 'noun', 'Bringen Sie das Wasser in einem großen Topf zum Kochen.', 'Leve a água para ferver em uma panela grande.'],
  ['de-v4-a2-10', 'Umrühren', '/ˈʊmˌʁyːʁən/', 'Mexer (a comida)', 'verb', 'Bitte die Soße regelmäßig umrühren, damit nichts anbrennt.', 'Por favor, mexa o molho regularmente para que nada queime.'],
  ['de-v4-a2-10', 'Der Backofen', '/deːɐ̯ ˈbakˌʔoːfn̩/', 'O forno', 'noun', 'Der Kuchen bleibt dreißig Minuten im heißen Backofen.', 'O bolo fica trinta minutos no forno quente.'],

  // de-b1-1: Trabalho, Entrevista & Carreira na Alemanha
  ['de-b1-1', 'Die Stellenanzeige', '/diː ˈʃtɛlənˌʔantsaɪ̯ɡə/', 'O anúncio de vaga', 'noun', 'Ich habe Ihre Stellenanzeige online gesehen und mich direkt beworben.', 'Vi o anúncio da vaga online e me candidatei imediatamente.'],
  ['de-b1-1', 'Die Stärke', '/diː ˈʃtɛʁkə/', 'O ponto forte', 'noun', 'Teamfähigkeit ist meine größte berufliche Stärke.', 'Saber trabalhar em equipe é o meu maior ponto forte profissional.'],
  ['de-b1-1', 'Das Arbeitszeugnis', '/das ˈaʁbaɪ̯tsˌtsɔɪ̯knɪs/', 'A carta de referência profissional', 'noun', 'In Deutschland legt man dem Antrag oft ein Arbeitszeugnis bei.', 'Na Alemanha costuma-se anexar uma carta de referência à candidatura.'],

  // de-b1-2: Moradia (Wohnungssuche) & Contratos na Alemanha
  ['de-b1-2', 'Die Nebenkosten', '/diː ˈneːbn̩ˌkɔstn̩/', 'Os custos adicionais / condomínio', 'noun', 'In den Nebenkosten sind Heizung und Wasser bereits enthalten.', 'Nos custos adicionais, aquecimento e água já estão incluídos.'],
  ['de-b1-2', 'Der Vermieter', '/deːɐ̯ fɛɐ̯ˈmiːtɐ/', 'O proprietário / locador', 'noun', 'Unser Vermieter kümmert sich schnell um alle Anliegen.', 'Nosso proprietário cuida rapidamente de todas as solicitações.'],
  ['de-b1-2', 'Der Mietvertrag', '/deːɐ̯ ˈmiːtfɛɐ̯ˌtʁaːk/', 'O contrato de aluguel', 'noun', 'Wir haben den Mietvertrag gestern Nachmittag unterschrieben.', 'Assinamos o contrato de aluguel ontem à tarde.'],

  // de-b1-3: Konjunktiv II: Cortesia & Desejos (Würde / Hätte / Wäre)
  ['de-b1-3', 'Höflich', '/ˈhøːflɪç/', 'Educado / cortês', 'adjective', 'Mit dem Konjunktiv II klingt Ihre Bitte viel höflicher.', 'Com o Konjunktiv II o seu pedido soa muito mais educado.'],
  ['de-b1-3', 'Der Wunsch', '/deːɐ̯ vʊnʃ/', 'O desejo', 'noun', 'Mein größter Wunsch wäre ein Jahr im Ausland zu leben.', 'Meu maior desejo seria morar um ano no exterior.'],
  ['de-b1-3', 'Vorschlagen', '/ˈfoːɐ̯ˌʃlaːɡn̩/', 'Sugerir', 'verb', 'Ich würde vorschlagen, dass wir das Meeting auf Montag legen.', 'Eu sugeriria que marcássemos a reunião para segunda-feira.'],

  // de-b1-4: Verbos Reflexivos & Verbos com Preposição (Warten auf)
  ['de-b1-4', 'Sich interessieren für', '/zɪç ɪntəʁɛˈsiːʁən fyːɐ̯/', 'Interessar-se por', 'phrase', 'Ich interessiere mich sehr für moderne Architektur.', 'Eu me interesso muito por arquitetura moderna.'],
  ['de-b1-4', 'Warten auf', '/ˈvaʁtn̩ aʊ̯f/', 'Esperar por', 'phrase', 'Wir warten schon seit zwanzig Minuten auf die Antwort.', 'Já estamos esperando pela resposta há vinte minutos.'],
  ['de-b1-4', 'Sich erinnern an', '/zɪç ɛɐ̯ˈʔɪnɐn an/', 'Lembrar-se de', 'phrase', 'Kannst du dich noch an unseren ersten Deutschkurs erinnern?', 'Você ainda consegue se lembrar do nosso primeiro curso de alemão?'],

  // de-b1-5: Tecnologia, Homeoffice & Comunicação Digital
  ['de-b1-5', 'Die Videokonferenz', '/diː ˈviːdeoˌkɔnfəʁɛnts/', 'A videoconferência', 'noun', 'Um zehn Uhr beginnt die wöchentliche Videokonferenz mit dem Team.', 'Às dez horas começa a videoconferência semanal com a equipe.'],
  ['de-b1-5', 'Freigeben', '/ˈfʁaɪ̯ˌɡeːbn̩/', 'Compartilhar (tela/arquivo)', 'verb', 'Können Sie bitte kurz Ihren Bildschirm freigeben?', 'Você pode compartilhar sua tela rapidamente, por favor?'],
  ['de-b1-5', 'Die Datei', '/diː daˈtaɪ̯/', 'O arquivo (digital)', 'noun', 'Ich habe die aktuelle Datei im gemeinsamen Ordner gespeichert.', 'Salvei o arquivo atualizado na pasta compartilhada.'],

  // de-b1-6: Relativsätze: Conectando Ideias (Der, Die, Das, Denen)
  ['de-b1-6', 'Der Kollege', '/deːɐ̯ kɔˈleːɡə/', 'O colega (de trabalho)', 'noun', 'Der Kollege, mit dem ich arbeite, kommt aus Hamburg.', 'O colega com quem trabalho vem de Hamburgo.'],
  ['de-b1-6', 'Erwähnen', '/ɛɐ̯ˈvɛːnən/', 'Mencionar', 'verb', 'Das Buch, das du erwähnt hast, war wirklich spannend.', 'O livro que você mencionou era realmente empolgante.'],
  ['de-b1-6', 'Zuverlässig', '/ˈtsuːfɛɐ̯ˌlɛsɪç/', 'Confiável', 'adjective', 'Eine Nachbarin, auf die man sich verlassen kann, ist sehr zuverlässig.', 'Uma vizinha com quem se pode contar é muito confiável.'],

  // de-b1-7: Passiv (Voz Passiva) com Werden & Modal
  ['de-b1-7', 'Prüfen', '/ˈpʁyːfn̩/', 'Verificar / analisar', 'verb', 'Der Ausschuss muss alle Anträge innerhalb von drei Tagen prüfen.', 'O comitê deve analisar todos os pedidos dentro de três dias.'],
  ['de-b1-7', 'Herstellen', '/ˈheːɐ̯ˌʃtɛlən/', 'Produzir / fabricar', 'verb', 'Dieses Produkt lässt sich vollständig in Deutschland herstellen.', 'Este produto pode ser fabricado totalmente na Alemanha.'],
  ['de-b1-7', 'Die Genehmigung', '/diː ɡəˈneːmɪɡʊŋ/', 'A aprovação / autorização', 'noun', 'Ohne schriftliche Genehmigung darf das Gebäude nicht betreten werden.', 'Sem autorização por escrito não é permitido entrar no prédio.'],

  // de-b1-8: Meio Ambiente, Reciclagem & Sustentabilidade
  ['de-b1-8', 'Die Mülltrennung', '/diː ˈmʏlˌtʁɛnʊŋ/', 'A separação de lixo', 'noun', 'Die Mülltrennung spielt im deutschen Alltag eine große Rolle.', 'A separação de lixo desempenha um grande papel no dia a dia alemão.'],
  ['de-b1-8', 'Wiederverwerten', '/ˈviːdɐfɛɐ̯ˌveːɐ̯tn̩/', 'Reciclar / reaproveitar', 'verb', 'Glas und Papier lassen sich sehr gut wiederverwerten.', 'Vidro e papel podem ser reaproveitados muito bem.'],
  ['de-b1-8', 'Der Klimawandel', '/deːɐ̯ ˈkliːmaˌvandl̩/', 'A mudança climática', 'noun', 'Viele Städte investieren in neue Projekte gegen den Klimawandel.', 'Muitas cidades investem em novos projetos contra a mudança climática.'],

  // de-b1-9: Banco, Burocracia & Formulários (Anmeldung)
  ['de-b1-9', 'Das Bürgeramt', '/das ˈbʏʁɡɐˌʔamt/', 'O cartório / órgão municipal', 'noun', 'Für den neuen Ausweis muss ich zum Bürgeramt gehen.', 'Para o novo documento preciso ir ao Bürgeramt.'],
  ['de-b1-9', 'Der Antrag', '/deːɐ̯ ˈantʁaːk/', 'O requerimento / solicitação', 'noun', 'Haben Sie den Antrag schon vollständig eingereicht?', 'O senhor já enviou o requerimento completo?'],
  ['de-b1-9', 'Die Frist', '/diː fʁɪst/', 'O prazo', 'noun', 'Bitte beachten Sie die gesetzliche Frist von vierzehn Tagen.', 'Por favor, observe o prazo legal de quatorze dias.'],

  // de-b1-10: Passiva no Cotidiano & Orações com "um... zu"
  ['de-b1-10', 'Verpacken', '/fɛɐ̯ˈpakn̩/', 'Embalar', 'verb', 'Die Ware wird sorgfältig verpackt, um Schäden zu vermeiden.', 'A mercadoria é embalada cuidadosamente para evitar danos.'],
  ['de-b1-10', 'Bestätigen', '/bəˈʃtɛːtɪɡn̩/', 'Confirmar', 'verb', 'Der Termin muss noch per E-Mail bestätigt werden.', 'O horário ainda precisa ser confirmado por e-mail.'],
  ['de-b1-10', 'Die Absicht', '/diː ˈapzɪçt/', 'A intenção', 'noun', 'Er lernt jeden Tag, mit der Absicht, fließend zu sprechen.', 'Ele estuda todos os dias com a intenção de falar fluentemente.'],

  // de-v4-b1-1: Consulta com Especialista, Encaminhamento & E-Rezept
  ['de-v4-b1-1', 'Die Sprechstunde', '/diː ˈʃpʁɛçˌʃtʊndə/', 'O horário de atendimento médico', 'noun', 'Die offene Sprechstunde beginnt jeden Morgen um acht Uhr.', 'O atendimento sem hora marcada começa toda manhã às oito horas.'],
  ['de-v4-b1-1', 'Der Befund', '/deːɐ̯ bəˈfʊnt/', 'O laudo / resultado médico', 'noun', 'Der Arzt bespricht den aktuellen Befund direkt mit Ihnen.', 'O médico discutirá o laudo atual diretamente com você.'],
  ['de-v4-b1-1', 'Einlösen', '/ˈaɪ̯nˌløːzn̩/', 'Resgatar / usar (receita)', 'verb', 'Sie können das E-Rezept in jeder Apotheke einlösen.', 'Você pode usar a receita eletrônica em qualquer farmácia.'],

  // de-v4-b1-2: Entrevista de Emprego & Negociação Salarial
  ['de-v4-b1-2', 'Das Nettogehalt', '/das ˈnɛtoɡəˌhalt/', 'O salário líquido', 'noun', 'Nach den Steuern bleibt ein solides Nettogehalt übrig.', 'Depois dos impostos sobra um salário líquido sólido.'],
  ['de-v4-b1-2', 'Die Berufserfahrung', '/diː bəˈʁuːfsʔɛɐ̯ˌfaːʁʊŋ/', 'A experiência profissional', 'noun', 'Ich bringe fünf Jahre Berufserfahrung im Projektmanagement mit.', 'Trago cinco anos de experiência profissional em gestão de projetos.'],
  ['de-v4-b1-2', 'Verhandeln', '/fɛɐ̯ˈhandl̩n/', 'Negociar', 'verb', 'Im zweiten Gespräch können wir über die Urlaubstage verhandeln.', 'Na segunda conversa podemos negociar sobre os dias de férias.'],

  // de-v4-b1-3: Cartão Bloqueado, Fraude & Atendimento Bancário
  ['de-v4-b1-3', 'Der Betrug', '/deːɐ̯ bəˈtʁuːk/', 'A fraude', 'noun', 'Bei einem Verdacht auf Betrug sollten Sie sofort anrufen.', 'Em caso de suspeita de fraude, você deve ligar imediatamente.'],
  ['de-v4-b1-3', 'Der Kontoauszug', '/deːɐ̯ ˈkɔntoˌʔaʊ̯stsuːk/', 'O extrato bancário', 'noun', 'Auf meinem Kontoauszug steht eine unbekannte Zahlung.', 'No meu extrato bancário consta um pagamento desconhecido.'],
  ['de-v4-b1-3', 'Widersprechen', '/viːdɐˈʃpʁɛçn̩/', 'Contestar / opor-se', 'verb', 'Sie können dieser fehlerhaften Belastung schriftlich widersprechen.', 'Você pode contestar essa cobrança incorreta por escrito.'],

  // de-v4-b1-4: Seguro Viagem, Reembolso & Sinistros
  ['de-v4-b1-4', 'Der Schadensfall', '/deːɐ̯ ˈʃaːdn̩sˌfal/', 'O sinistro / ocorrência', 'noun', 'Im Schadensfall braucht die Versicherung Fotos und Belege.', 'Em caso de sinistro, a seguradora precisa de fotos e comprovantes.'],
  ['de-v4-b1-4', 'Die Quittung', '/diː ˈkvɪtʊŋ/', 'O recibo', 'noun', 'Bewahren Sie bitte jede Quittung für die Kostenerstattung auf.', 'Guarde cada recibo para o reembolso das despesas, por favor.'],
  ['de-v4-b1-4', 'Abdecken', '/ˈapˌdɛkn̩/', 'Cobrir (seguro/custos)', 'verb', 'Welche Risiken will diese Police genau abdecken?', 'Quais riscos exatamente esta apólice cobre?'],

  // de-v4-b1-5: Bürgeramt & Registro de Endereço (Anmeldung)
  ['de-v4-b1-5', 'Die Wohnungsgeberbestätigung', '/diː ˈvoːnʊŋsɡeːbɐbəˌʃtɛːtɪɡʊŋ/', 'A confirmação do locador', 'noun', 'Ohne Wohnungsgeberbestätigung ist die Anmeldung leider nicht möglich.', 'Sem a confirmação do locador, o registro infelizmente não é possível.'],
  ['de-v4-b1-5', 'Die Steuer-ID', '/diː ˈʃtɔɪ̯ɐˌʔiːdeː/', 'O número de identificação fiscal', 'noun', 'Ihre Steuer-ID erhalten Sie wenige Wochen später per Post.', 'Você receberá seu número fiscal poucas semanas depois pelo correio.'],
  ['de-v4-b1-5', 'Ummelden', '/ˈʊmˌmɛldn̩/', 'Atualizar o endereço registrado', 'verb', 'Nach einem Umzug innerhalb der Stadt muss man sich ummelden.', 'Após uma mudança dentro da cidade é preciso atualizar o registro.'],

  // de-v4-b1-6: Suporte de TI (IT-Support), Senhas & Acesso Remoto
  ['de-v4-b1-6', 'Das Netzwerk', '/das ˈnɛtsvɛʁk/', 'A rede (de dados)', 'noun', 'Die Verbindung zum Firmen-Netzwerk bricht heute ständig ab.', 'A conexão com a rede da empresa está caindo toda hora hoje.'],
  ['de-v4-b1-6', 'Zurücksetzen', '/tsuˈʁʏkˌzɛtsn̩/', 'Redefinir / resetar', 'verb', 'Könnten Sie bitte mein Kennwort für das Portal zurücksetzen?', 'Você poderia redefinir minha senha do portal, por favor?'],
  ['de-v4-b1-6', 'Die Aktualisierung', '/diː aktua̯liˈziːʁʊŋ/', 'A atualização', 'noun', 'Nach der letzten Aktualisierung startet das Programm nicht mehr.', 'Depois da última atualização o programa não inicia mais.'],

  // de-v4-b1-7: Trabalho Voluntário (Ehrenamt) & Projetos Sociais
  ['de-v4-b1-7', 'Die Spende', '/diː ˈʃpɛndə/', 'A doação', 'noun', 'Jede kleine Spende hilft unserem lokalen Tierheim.', 'Cada pequena doação ajuda o nosso abrigo local de animais.'],
  ['de-v4-b1-7', 'Unterstützen', '/ʊntɐˈʃtʏtsn̩/', 'Apoiar', 'verb', 'Wir suchen Freiwillige, die das Nachbarschaftsfest unterstützen.', 'Procuramos voluntários que apoiem a festa do bairro.'],
  ['de-v4-b1-7', 'Die Gemeinschaft', '/diː ɡəˈmaɪ̯nʃaft/', 'A comunidade', 'noun', 'Durch das Projekt entsteht eine starke Gemeinschaft im Viertel.', 'Com o projeto surge uma comunidade forte no bairro.'],

  // de-v4-b1-8: Renovar Contrato de Aluguel & Negociar Condições
  ['de-v4-b1-8', 'Die Kündigung', '/diː ˈkʏndɪɡʊŋ/', 'A rescisão / aviso prévio', 'noun', 'Die Kündigung muss spätestens am dritten Werktag eingehen.', 'A rescisão deve chegar no máximo até o terceiro dia útil.'],
  ['de-v4-b1-8', 'Die Mieterhöhung', '/diː ˈmiːtʔɛɐ̯ˌhøːʊŋ/', 'O aumento de aluguel', 'noun', 'Der Eigentümer hat eine moderate Mieterhöhung angekündigt.', 'O proprietário anunciou um aumento moderado de aluguel.'],
  ['de-v4-b1-8', 'Einigen', '/ˈaɪ̯nɪɡn̩/', 'Chegar a um acordo', 'verb', 'Wir konnten uns schnell auf faire Konditionen einigen.', 'Conseguimos chegar rapidamente a um acordo sobre condições justas.'],

  // de-v4-b1-9: Mudança (Umzug), Caixas & Entrega das Chaves
  ['de-v4-b1-9', 'Der Umzugskarton', '/deːɐ̯ ˈʊmtsuːksˌkaʁtɔŋ/', 'A caixa de mudança', 'noun', 'Jeder Umzugskarton sollte deutlich beschriftet werden.', 'Cada caixa de mudança deve ser etiquetada claramente.'],
  ['de-v4-b1-9', 'Streichen', '/ˈʃtʁaɪ̯çn̩/', 'Pintar (paredes)', 'verb', 'Vor der Rückgabe müssen wir das Wohnzimmer weiß streichen.', 'Antes da entrega precisamos pintar a sala de branco.'],
  ['de-v4-b1-9', 'Die Schlüsselübergabe', '/diː ˈʃlʏsl̩ˌʔyːbɐɡaːbə/', 'A entrega das chaves', 'noun', 'Die Schlüsselübergabe findet am Freitag um zehn Uhr statt.', 'A entrega das chaves acontece na sexta-feira às dez horas.'],

  // de-v4-b1-10: Crítica de Cinema & Literatura (Rezension)
  ['de-v4-b1-10', 'Die Hauptfigur', '/diː ˈhaʊ̯ptfiˌɡuːɐ̯/', 'O protagonista / personagem principal', 'noun', 'Die Hauptfigur entwickelt sich im Laufe des Romans stark weiter.', 'O protagonista se desenvolve bastante ao longo do romance.'],
  ['de-v4-b1-10', 'Spannend', '/ˈʃpanənt/', 'Empolgante / envolvente', 'adjective', 'Der neue Krimi war von der ersten Seite an unglaublich spannend.', 'O novo romance policial foi incrivelmente empolgante desde a primeira página.'],
  ['de-v4-b1-10', 'Der Schreibstil', '/deːɐ̯ ˈʃʁaɪ̯pʃtiːl/', 'O estilo de escrita', 'noun', 'Der klare Schreibstil der Autorin gefällt mir besonders gut.', 'O estilo claro de escrita da autora me agrada especialmente.'],

  // de-idioms-b1: Expressões Idiomáticas Alemãs
  ['de-idioms-b1', 'Ins kalte Wasser springen', '/ɪns ˈkaltə ˈvasɐ ˈʃpʁɪŋən/', 'Pular na água fria / encarar de cara', 'idiom', 'Am ersten Arbeitstag musste ich direkt ins kalte Wasser springen.', 'No primeiro dia de trabalho tive que encarar o desafio logo de cara.'],
  ['de-idioms-b1', 'Auf dem Schlauch stehen', '/aʊ̯f deːm ʃlaʊ̯x ˈʃteːən/', 'Dar branco / não entender na hora', 'idiom', 'Erklär es mir bitte nochmal, ich stehe gerade auf dem Schlauch.', 'Me explique de novo, por favor, estou meio perdido agora.'],

  // de-slang-b1: Gírias Alemãs (Umgangssprache)
  ['de-slang-b1', 'Chillen', '/ˈtʃɪlən/', 'Relaxar / ficar de boa', 'slang', 'Am Sonntag wollen wir einfach zu Hause chillen.', 'No domingo queremos simplesmente relaxar em casa.'],
  ['de-slang-b1', 'Der Hammer', '/deːɐ̯ ˈhamɐ/', 'Incrível / sensacional', 'slang', 'Das Konzert gestern Abend war echt der Hammer!', 'O show ontem à noite foi realmente sensacional!'],

  // de-b2-1: Adjektivdeklination (Der gute Kaffee)
  ['de-b2-1', 'Anspruchsvoll', '/ˈanʃpʁʊxsfɔl/', 'Exigente / desafiador', 'adjective', 'Das ist ein sehr anspruchsvolles Projekt für das gesamte Team.', 'Esse é um projeto muito desafiador para toda a equipe.'],
  ['de-b2-1', 'Ausführlich', '/ˈaʊ̯sˌfyːɐ̯lɪç/', 'Detalhado / minucioso', 'adjective', 'Sie hat uns einen ausführlichen Bericht vorgelegt.', 'Ela nos apresentou um relatório detalhado.'],
  ['de-b2-1', 'Zeitgemäß', '/ˈtsaɪ̯tɡəˌmɛːs/', 'Atual / moderno', 'adjective', 'Wir brauchen eine zeitgemäße Lösung für die digitale Verwaltung.', 'Precisamos de uma solução moderna para a administração digital.'],

  // de-b2-2: Der Genitiv im B2-Deutsch
  ['de-b2-2', 'Innerhalb (+ Gen.)', '/ˈɪnɐhalp/', 'Dentro de (tempo/espaço)', 'preposition', 'Die Lieferung erfolgt innerhalb einer Woche.', 'A entrega ocorre dentro de uma semana.'],
  ['de-b2-2', 'Stattdessen', '/ʃtatˈdɛsn̩/', 'Em vez disso', 'adverb', 'Wir sind nicht geflogen, stattdessen nahmen wir den Nachtzug.', 'Não fomos de avião; em vez disso, pegamos o trem noturno.'],
  ['de-b2-2', 'Anlässlich (+ Gen.)', '/ˈanlɛslɪç/', 'Por ocasião de', 'preposition', 'Anlässlich des Jubiläums fand ein großer Empfang statt.', 'Por ocasião do aniversário houve uma grande recepção.'],

  // de-b2-3: Doppelkonjunktionen B2
  ['de-b2-3', 'Sowohl ... als auch', '/zoˈvoːl als aʊ̯x/', 'Tanto ... quanto', 'conjunction', 'Das Seminar richtet sich sowohl an Anfänger als auch an Profis.', 'O seminário se dirige tanto a iniciantes quanto a profissionais.'],
  ['de-b2-3', 'Entweder ... oder', '/ˈɛntveːdɐ ˈoːdɐ/', 'Ou ... ou', 'conjunction', 'Wir fahren entweder im Juli oder erst im September in den Urlaub.', 'Vamos viajar de férias ou em julho ou só em setembro.'],
  ['de-b2-3', 'Je ... desto', '/jeː ˈdɛsto/', 'Quanto mais ... mais', 'conjunction', 'Je regelmäßiger man übt, desto sicherer spricht man.', 'Quanto mais regularmente se pratica, mais seguro se fala.'],

  // de-b2-4: Plusquamperfekt (Nachdem) und Futur
  ['de-b2-4', 'Zuvor', '/tsuˈfoːɐ̯/', 'Antes / previamente', 'adverb', 'Er kannte die Stadt gut, da er sie zuvor oft besucht hatte.', 'Ele conhecia bem a cidade, pois a havia visitado muitas vezes antes.'],
  ['de-b2-4', 'Vermutlich', '/fɛɐ̯ˈmuːtlɪç/', 'Provavelmente', 'adverb', 'Der Zug wird vermutlich zehn Minuten Verspätung haben.', 'O trem provavelmente terá dez minutos de atraso.'],
  ['de-b2-4', 'Abschließen', '/ˈapˌʃliːsn̩/', 'Concluir / finalizar', 'verb', 'Sie wird das Studium bald abschließen und dann nach Berlin ziehen.', 'Ela concluirá os estudos em breve e depois se mudará para Berlim.'],

  // de-b2-5: Medien, Meinung und Diskussion B2
  ['de-b2-5', 'Die Berichterstattung', '/diː bəˈʁɪçtʔɛɐ̯ˌʃtatʊŋ/', 'A cobertura jornalística', 'noun', 'Die Berichterstattung über das Thema war sehr ausgewogen.', 'A cobertura jornalística sobre o tema foi muito equilibrada.'],
  ['de-b2-5', 'Widersprechen', '/viːdɐˈʃpʁɛçn̩/', 'Discordar / contradizer', 'verb', 'In diesem Punkt muss ich Ihrer Argumentation leider widersprechen.', 'Nesse ponto preciso infelizmente discordar da sua argumentação.'],
  ['de-b2-5', 'Das Argument', '/das aʁɡuˈmɛnt/', 'O argumento', 'noun', 'Ihr stärkstes Argument betrifft die langfristigen Kosten.', 'O argumento mais forte dela diz respeito aos custos de longo prazo.'],

  // de-b2-6: Komposita und Falsche Freunde
  ['de-b2-6', 'Das Rathaus', '/das ˈʁaːthaʊ̯s/', 'A prefeitura', 'noun', 'Im Rathaus werden viele städtische Entscheidungen getroffen.', 'Na prefeitura são tomadas muitas decisões municipais.'],
  ['de-b2-6', 'Das Gift', '/das ɡɪft/', 'O veneno (falso amigo: gift)', 'noun', 'In alten Geschichten spielt ein gefährliches Gift oft eine Rolle.', 'Em histórias antigas um veneno perigoso muitas vezes tem um papel.'],
  ['de-b2-6', 'Aktuell', '/aktuˈɛl/', 'Atual (falso amigo: actual)', 'adjective', 'Die aktuelle Statistik zeigt einen klaren Trend nach oben.', 'A estatística atual mostra uma clara tendência de alta.'],

  // de-b2-7: Geschäftskommunikation und Verhandlung
  ['de-b2-7', 'Die Fristverlängerung', '/diː ˈfʁɪstfɛɐ̯ˌlɛŋəʁʊŋ/', 'A prorrogação de prazo', 'noun', 'Wir bitten höflich um eine kurze Fristverlängerung bis Freitag.', 'Pedimos gentilmente uma breve prorrogação de prazo até sexta-feira.'],
  ['de-b2-7', 'Unterbreiten', '/ʊntɐˈbʁaɪ̯tn̩/', 'Apresentar (proposta)', 'verb', 'Gerne möchten wir Ihnen ein maßgeschneidertes Angebot unterbreiten.', 'Teremos prazer em lhe apresentar uma proposta sob medida.'],
  ['de-b2-7', 'Verbindlich', '/fɛɐ̯ˈbɪntlɪç/', 'Vinculativo / oficial', 'adjective', 'Ab diesem Datum ist die Bestellung für beide Seiten verbindlich.', 'A partir desta data o pedido é vinculativo para ambos os lados.'],

  // de-b2-8: Zustandspassiv und Passiversatzformen
  ['de-b2-8', 'Erledigt', '/ɛɐ̯ˈleːdɪçt/', 'Concluído / resolvido', 'adjective', 'Alle dringenden Aufgaben sind für heute bereits erledigt.', 'Todas as tarefas urgentes de hoje já estão concluídas.'],
  ['de-b2-8', 'Machbar', '/ˈmaxbaːɐ̯/', 'Viável / factível', 'adjective', 'Mit etwas mehr Zeit ist dieser Plan durchaus machbar.', 'Com um pouco mais de tempo esse plano é perfeitamente viável.'],
  ['de-b2-8', 'Geöffnet', '/ɡəˈʔœfnət/', 'Aberto (estado)', 'adjective', 'Die Ausstellung ist den ganzen Sommer über für Besucher geöffnet.', 'A exposição está aberta aos visitantes durante todo o verão.'],

  // de-b2-9: Nomen-Verb-Verbindungen im Berufsalltag
  ['de-b2-9', 'Zur Verfügung stehen', '/tsuːɐ̯ fɛɐ̯ˈfyːɡʊŋ ˈʃteːən/', 'Estar à disposição', 'phrase', 'Bei Rückfragen stehe ich Ihnen jederzeit gern zur Verfügung.', 'Em caso de dúvidas estou sempre à sua disposição.'],
  ['de-b2-9', 'Eine Entscheidung treffen', '/ˈaɪ̯nə ɛntˈʃaɪ̯dʊŋ ˈtʁɛfn̩/', 'Tomar uma decisão', 'phrase', 'Bis morgen müssen wir eine klare Entscheidung treffen.', 'Até amanhã precisamos tomar uma decisão clara.'],
  ['de-b2-9', 'Kritik üben an', '/kʁiˈtiːk ˈyːbn̩ an/', 'Fazer crítica a', 'phrase', 'Einige Abteilungen üben berechtigte Kritik an dem neuen Verfahren.', 'Alguns departamentos fazem críticas justificadas ao novo procedimento.'],

  // de-b2-10: Subjektive Modalverben (Vermutung & Quelle)
  ['de-b2-10', 'Die Vermutung', '/diː fɛɐ̯ˈmuːtʊŋ/', 'A suposição', 'noun', 'Meine Vermutung hat sich nach dem Gespräch bestätigt.', 'Minha suposição se confirmou depois da conversa.'],
  ['de-b2-10', 'Offenbar', '/ˈɔfn̩baːɐ̯/', 'Aparentemente / ao que parece', 'adverb', 'Offenbar wurde der Termin kurzfristig verschoben.', 'Aparentemente o compromisso foi adiado em cima da hora.'],
  ['de-b2-10', 'Wahrscheinlich', '/vaːɐ̯ˈʃaɪ̯nlɪç/', 'Provável / provavelmente', 'adverb', 'Er dürfte wahrscheinlich schon auf dem Heimweg sein.', 'Ele provavelmente já deve estar a caminho de casa.'],

  // de-v4-b2-1: Konfliktlösung im Team
  ['de-v4-b2-1', 'Der Kompromiss', '/deːɐ̯ kɔmpʁoˈmɪs/', 'O compromisso / acordo mútuo', 'noun', 'Beide Teams haben schließlich einen fairen Kompromiss gefunden.', 'Ambas as equipes acabaram encontrando um acordo justo.'],
  ['de-v4-b2-1', 'Sachlich', '/ˈzaxlɪç/', 'Objetivo / imparcial', 'adjective', 'In schwierigen Gesprächen hilft ein sachlicher Ton enorm.', 'Em conversas difíceis um tom objetivo ajuda enormemente.'],
  ['de-v4-b2-1', 'Vermitteln', '/fɛɐ̯ˈmɪtl̩n/', 'Mediar / intermediar', 'verb', 'Die Projektleiterin musste zwischen den Kollegen vermitteln.', 'A gerente de projeto teve que mediar entre os colegas.'],

  // de-v4-b2-2: Medienkompetenz
  ['de-v4-b2-2', 'Die Glaubwürdigkeit', '/diː ˈɡlaʊ̯pvʏʁdɪçkaɪ̯t/', 'A credibilidade', 'noun', 'Man sollte immer die Glaubwürdigkeit einer Quelle prüfen.', 'Deve-se sempre verificar a credibilidade de uma fonte.'],
  ['de-v4-b2-2', 'Verbreiten', '/fɛɐ̯ˈbʁaɪ̯tn̩/', 'Espalhar / divulgar', 'verb', 'Soziale Netzwerke können unbestätigte Gerüchte rasant verbreiten.', 'As redes sociais podem espalhar rumores não confirmados rapidamente.'],
  ['de-v4-b2-2', 'Objektiv', '/ɔpjɛkˈtiːf/', 'Objetivo / imparcial', 'adjective', 'Eine seriöse Analyse bleibt stets objektiv und faktenbasiert.', 'Uma análise séria permanece sempre objetiva e baseada em fatos.'],

  // de-v4-b2-3: Nachhaltige Lieferketten
  ['de-v4-b2-3', 'Der Lieferant', '/deːɐ̯ liːfəˈʁant/', 'O fornecedor', 'noun', 'Jeder neue Lieferant muss unsere Umweltstandards erfüllen.', 'Cada novo fornecedor precisa cumprir nossos padrões ambientais.'],
  ['de-v4-b2-3', 'Die Transparenz', '/diː tʁanspaˈʁɛnts/', 'A transparência', 'noun', 'Kunden fordern heute deutlich mehr Transparenz bei der Produktion.', 'Os clientes exigem hoje muito mais transparência na produção.'],
  ['de-v4-b2-3', 'Zertifizieren', '/tsɛʁtifiˈtsiːʁən/', 'Certificar', 'verb', 'Viele Betriebe lassen ihre Lieferketten unabhängig zertifizieren.', 'Muitas empresas mandam certificar suas cadeias de suprimentos de forma independente.'],

  // de-v4-b2-4: Verbraucherrechte
  ['de-v4-b2-4', 'Der Mangel', '/deːɐ̯ ˈmaŋl̩/', 'O defeito / vício (do produto)', 'noun', 'Bei einem versteckten Mangel haben Sie Anspruch auf Nachbesserung.', 'Em caso de defeito oculto você tem direito ao reparo.'],
  ['de-v4-b2-4', 'Die Fristwahrung', '/diː ˈfʁɪstˌvaːʁʊŋ/', 'O cumprimento do prazo', 'noun', 'Für die Fristwahrung zählt das Datum des Poststempels.', 'Para o cumprimento do prazo vale a data do carimbo postal.'],
  ['de-v4-b2-4', 'Reklamieren', '/ʁeklaˈmiːʁən/', 'Reclamar / contestar produto', 'verb', 'Sie können die defekte Kaffeemaschine im Geschäft reklamieren.', 'Você pode reclamar da cafeteira com defeito na loja.'],

  // de-v4-b2-5: Homeoffice-Kultur
  ['de-v4-b2-5', 'Die Erreichbarkeit', '/diː ɛɐ̯ˈʁaɪ̯çbaːɐ̯kaɪ̯t/', 'A disponibilidade / acessibilidade', 'noun', 'Klare Regeln zur Erreichbarkeit schützen vor Überlastung.', 'Regras claras sobre disponibilidade protegem contra sobrecarga.'],
  ['de-v4-b2-5', 'Die Eigenständigkeit', '/diː ˈaɪ̯ɡn̩ʃtɛndɪçkaɪ̯t/', 'A autonomia / independência', 'noun', 'Mobiles Arbeiten erfordert ein hohes Maß an Eigenständigkeit.', 'O trabalho remoto exige um alto grau de autonomia.'],
  ['de-v4-b2-5', 'Fokussieren', '/fokuˈsiːʁən/', 'Focar / concentrar-se', 'verb', 'Ohne ständige Benachrichtigungen kann man sich besser fokussieren.', 'Sem notificações constantes é possível se concentrar melhor.'],

  // de-v4-b2-6: Wohnungsmarkt & Mietspiegel
  ['de-v4-b2-6', 'Die Wohnungsknappheit', '/diː ˈvoːnʊŋsˌknaphaɪ̯t/', 'A escassez de moradias', 'noun', 'In Großstädten verschärft sich die Wohnungsknappheit weiter.', 'Nas grandes cidades a escassez de moradias continua se agravando.'],
  ['de-v4-b2-6', 'Der Quadratmeterpreis', '/deːɐ̯ kvaˈdʁaːtmeːtɐˌpʁaɪ̯s/', 'O preço por metro quadrado', 'noun', 'Der durchschnittliche Quadratmeterpreis liegt hier bei fünfzehn Euro.', 'O preço médio por metro quadrado aqui gira em torno de quinze euros.'],
  ['de-v4-b2-6', 'Bezahlbar', '/bəˈtsaːlbaːɐ̯/', 'Acessível (financeiramente)', 'adjective', 'Viele Familien suchen dringend nach bezahlbarem Wohnraum.', 'Muitas famílias procuram urgentemente por moradia acessível.'],

  // de-v4-b2-7: Persönliche Finanzen
  ['de-v4-b2-7', 'Die Rücklage', '/diː ˈʁʏkˌlaːɡə/', 'A reserva financeira', 'noun', 'Eine finanzielle Rücklage gibt Sicherheit bei unerwarteten Ausgaben.', 'Uma reserva financeira dá segurança em despesas inesperadas.'],
  ['de-v4-b2-7', 'Die Rendite', '/diː ʁɛnˈdiːtə/', 'O rendimento / retorno', 'noun', 'Höhere Renditen gehen fast immer mit einem größeren Risiko einher.', 'Rendimentos mais altos quase sempre vêm acompanhados de maior risco.'],
  ['de-v4-b2-7', 'Anlegen', '/ˈanˌleːɡn̩/', 'Investir / aplicar (dinheiro)', 'verb', 'Man sollte sein Erspartes möglichst breit gestreut anlegen.', 'Deve-se investir as economias da forma mais diversificada possível.'],

  // de-v4-b2-8: Energiewende & Infrastruktur
  ['de-v4-b2-8', 'Die Windkraft', '/diː ˈvɪntkʁaft/', 'A energia eólica', 'noun', 'Die Windkraft liefert im Norden bereits einen Großteil des Stroms.', 'A energia eólica já fornece grande parte da eletricidade no norte.'],
  ['de-v4-b2-8', 'Der Speicher', '/deːɐ̯ ˈʃpaɪ̯çɐ/', 'O armazenamento / bateria', 'noun', 'Moderne Speicher gleichen Schwankungen im Stromnetz aus.', 'Sistemas modernos de armazenamento compensam oscilações na rede elétrica.'],
  ['de-v4-b2-8', 'Ausbauen', '/ˈaʊ̯sˌbaʊ̯ən/', 'Expandir / ampliar', 'verb', 'Das Land will die erneuerbaren Energien noch schneller ausbauen.', 'O país quer expandir as energias renováveis ainda mais rápido.'],

  // de-v4-b2-9: DACH-Unterschiede
  ['de-v4-b2-9', 'Die Redewendung', '/diː ˈʁeːdəˌvɛndʊŋ/', 'A expressão idiomática', 'noun', 'Diese regionale Redewendung versteht man vor allem in Wien.', 'Essa expressão regional é compreendida sobretudo em Viena.'],
  ['de-v4-b2-9', 'Abweichen', '/ˈapˌvaɪ̯çn̩/', 'Divergir / diferir', 'verb', 'In der Schweiz können manche Begriffe vom Standarddeutsch abweichen.', 'Na Suíça alguns termos podem divergir do alemão padrão.'],
  ['de-v4-b2-9', 'Das Velo', '/das ˈveːlo/', 'A bicicleta (suíço)', 'noun', 'In Zürich fahren viele Berufstätige mit dem Velo zur Arbeit.', 'Em Zurique muitos trabalhadores vão de bicicleta para o trabalho.'],

  // de-v4-b2-10: Führungskompetenz
  ['de-v4-b2-10', 'Die Wertschätzung', '/diː ˈveːɐ̯tˌʃɛtsʊŋ/', 'A valorização / reconhecimento', 'noun', 'Ehrliche Wertschätzung steigert die Motivation im gesamten Team.', 'A valorização sincera aumenta a motivação em toda a equipe.'],
  ['de-v4-b2-10', 'Anleiten', '/ˈanˌlaɪ̯tn̩/', 'Orientar / guiar', 'verb', 'Gute Führungskräfte können neue Mitarbeiter geduldig anleiten.', 'Bons líderes sabem orientar novos colaboradores com paciência.'],
  ['de-v4-b2-10', 'Die Transparenz', '/diː tʁanspaˈʁɛnts/', 'A transparência', 'noun', 'Regelmäßige Updates sorgen für Transparenz bei wichtigen Zielen.', 'Atualizações regulares garantem transparência nos objetivos importantes.'],

  // de-taboo-register-b2: Register & Tabuwörter: Schimpfwörter & Höfliche Alternativen
  ['de-taboo-register-b2', 'Unsinn', '/ˈʊnzɪn/', 'Absurdo / bobagem (formal)', 'noun', 'Das ist völliger Unsinn, dafür gibt es keinerlei Belege.', 'Isso é um completo absurdo, não há nenhuma evidência disso.'],
  ['de-taboo-register-b2', 'Ärgerlich', '/ˈɛʁɡɐlɪç/', 'Irritante / chato (educado)', 'adjective', 'Dass der Zug wieder ausfällt, ist wirklich sehr ärgerlich.', 'É realmente muito chato que o trem seja cancelado de novo.'],

  // de-c1-1: Konjunktiv I und Indirekte Rede
  ['de-c1-1', 'Die Aussage', '/diː ˈaʊ̯sˌzaːɡə/', 'A declaração / afirmação', 'noun', 'Die Aussage des Ministers wurde von mehreren Medien zitiert.', 'A declaração do ministro foi citada por vários veículos de mídia.'],
  ['de-c1-1', 'Behaupten', '/bəˈhaʊ̯ptn̩/', 'Afirmar / alegar', 'verb', 'Der Sprecher behauptet, die Reform sei bereits wirksam.', 'O porta-voz afirma que a reforma já está em vigor.'],
  ['de-c1-1', 'Zitieren', '/tsiˈtiːʁən/', 'Citar', 'verb', 'In diesem Artikel wird eine aktuelle Studie ausführlich zitiert.', 'Neste artigo um estudo recente é citado detalhadamente.'],

  // de-c1-2: DACH-Region: Deutschland, Österreich, Schweiz
  ['de-c1-2', 'Der Dialekt', '/deːɐ̯ diaˈlɛkt/', 'O dialeto', 'noun', 'Der bayerische Dialekt unterscheidet sich stark vom Hochdeutschen.', 'O dialeto bávaro se diferencia bastante do alemão padrão.'],
  ['de-c1-2', 'Die Mundart', '/diː ˈmʊntʔaːɐ̯t/', 'O falar regional / dialeto', 'noun', 'In vielen Alpenregionen wird die lokale Mundart aktiv gepflegt.', 'Em muitas regiões alpinas o falar local é ativamente preservado.'],
  ['de-c1-2', 'Die Besonderheit', '/diː bəˈzɔndɐhaɪ̯t/', 'A particularidade', 'noun', 'Eine kulinarische Besonderheit Österreichs ist die vielfältige Mehlspeisküche.', 'Uma particularidade culinária da Áustria é a variada confeitaria.'],

  // de-c1-3: Nominalisierung und Partizipialkonstruktionen
  ['de-c1-3', 'Die Umsetzung', '/diː ˈʊmzɛtsʊŋ/', 'A implementação / execução', 'noun', 'Die Umsetzung des Projekts erfordert eine sorgfältige Planung.', 'A implementação do projeto exige um planejamento cuidadoso.'],
  ['de-c1-3', 'Ausstehend', '/ˈaʊ̯sˌʃteːənt/', 'Pendente', 'adjective', 'Die noch ausstehenden Berichte müssen bis Freitag vorliegen.', 'Os relatórios ainda pendentes devem estar disponíveis até sexta-feira.'],
  ['de-c1-3', 'Die Reduzierung', '/diː ʁeduˈtsiːʁʊŋ/', 'A redução', 'noun', 'Zur Reduzierung der Kosten wurden interne Abläufe optimiert.', 'Para a redução dos custos foram otimizados processos internos.'],

  // de-c1-4: Goethe C1: Konnektoren und Präzision
  ['de-c1-4', 'Indessen', '/ɪnˈdɛsn̩/', 'Entretanto / no entanto', 'adverb', 'Die Zahlen stiegen leicht; indessen blieb die Skepsis bestehen.', 'Os números subiram ligeiramente; entretanto, o ceticismo permaneceu.'],
  ['de-c1-4', 'Sofern', '/zoˈfɛʁn/', 'Desde que / caso', 'conjunction', 'Wir starten morgen, sofern alle Unterlagen vollständig sind.', 'Começamos amanhã, desde que todos os documentos estejam completos.'],
  ['de-c1-4', 'Demzufolge', '/deːmtsuˈfɔlɡə/', 'Por conseguinte / portanto', 'adverb', 'Die Nachfrage sank; demzufolge passte das Werk die Produktion an.', 'A demanda caiu; por conseguinte, a fábrica ajustou a produção.'],

  // de-c1-5: Redewendungen und Modalpartikeln
  ['de-c1-5', 'Eben', '/ˈeːbn̩/', 'Justamente / pois é (partícula)', 'adverb', 'Das ist eben der entscheidende Unterschied zwischen Theorie und Praxis.', 'Essa é justamente a diferença decisiva entre teoria e prática.'],
  ['de-c1-5', 'Allerdings', '/alɐˈdɪŋs/', 'No entanto / com certeza', 'adverb', 'Der Vorschlag klingt gut, allerdings fehlt noch das Budget.', 'A proposta soa bem; no entanto, ainda falta o orçamento.'],
  ['de-c1-5', 'Übrigens', '/ˈyːbʁɪɡn̩s/', 'A propósito / aliás', 'adverb', 'Übrigens findet das nächste Treffen in einem größeren Raum statt.', 'A propósito, o próximo encontro acontecerá em uma sala maior.'],

  // de-c1-6: Wissenschaft, Technik und Datenpräsentation
  ['de-c1-6', 'Der Rückgang', '/deːɐ̯ ˈʁʏkɡaŋ/', 'A queda / redução', 'noun', 'Die Grafik zeigt einen deutlichen Rückgang der Emissionen.', 'O gráfico mostra uma queda clara nas emissões.'],
  ['de-c1-6', 'Schwanken', '/ˈʃvaŋkn̩/', 'Oscilar / variar', 'verb', 'Die Messwerte schwanken je nach Tageszeit erheblich.', 'Os valores medidos oscilam consideravelmente conforme a hora do dia.'],
  ['de-c1-6', 'Die Korrelation', '/diː kɔʁelaˈtsi̯oːn/', 'A correlação', 'noun', 'Zwischen beiden Faktoren lässt sich eine klare Korrelation erkennen.', 'Entre ambos os fatores pode-se reconhecer uma clara correlação.'],

  // de-c1-7: Rhetorik, Diplomatie und Synthese C1
  ['de-c1-7', 'Hervorheben', '/hɛɐ̯ˈfoːɐ̯ˌheːbn̩/', 'Destacar / ressaltar', 'verb', 'Abschließend möchte ich die enorme Leistung des Teams hervorheben.', 'Para concluir, gostaria de destacar o enorme desempenho da equipe.'],
  ['de-c1-7', 'Der Konsens', '/deːɐ̯ kɔnˈzɛns/', 'O consenso', 'noun', 'Nach intensiven Gesprächen entstand ein tragfähiger Konsens.', 'Após conversas intensas surgiu um consenso sólido.'],
  ['de-c1-7', 'Abwägen', '/ˈapˌvɛːɡn̩/', 'Ponderar / sopesar', 'verb', 'Man muss Chancen und Risiken sehr sorgfältig abwägen.', 'É preciso ponderar oportunidades e riscos com muito cuidado.'],

  // de-c1-8: Erweiterte Partizipialattribute im Fachstil
  ['de-c1-8', 'Zugrunde liegend', '/tsuˈɡʁʊndə ˈliːɡn̩t/', 'Subjacente / que serve de base', 'adjective', 'Die der Studie zugrunde liegenden Daten sind öffentlich zugänglich.', 'Os dados subjacentes ao estudo são acessíveis ao público.'],
  ['de-c1-8', 'Maßgeblich', '/ˈmaːsɡeːplɪç/', 'Determinante / decisivo', 'adjective', 'Dieser Faktor war maßgeblich für den Erfolg des Verfahrens.', 'Esse fator foi determinante para o sucesso do procedimento.'],
  ['de-c1-8', 'Vorliegend', '/ˈfoːɐ̯ˌliːɡn̩t/', 'Presente / em questão', 'adjective', 'Der vorliegende Entwurf bedarf noch einiger kleiner Korrekturen.', 'O esboço em questão ainda necessita de alguns pequenos ajustes.'],

  // de-c1-9: Irreale Vergleiche und Konjunktiv II
  ['de-c1-9', 'Anscheinend', '/ˈanʃaɪ̯nənt/', 'Aparentemente', 'adverb', 'Er tat so, als hätte er die Frage anscheinend überhört.', 'Ele agiu como se aparentemente não tivesse ouvido a pergunta.'],
  ['de-c1-9', 'Souverän', '/zuvəˈʁɛːn/', 'Segura / confiante / soberana', 'adjective', 'Sie wirkte auf der Bühne so souverän, als wäre es ihr Alltag.', 'Ela parecia tão segura no palco como se fosse seu dia a dia.'],
  ['de-c1-9', 'Hypothetisch', '/hypoˈteːtɪʃ/', 'Hipotético', 'adjective', 'Selbst in einem rein hypothetischen Szenario wäre das Risiko hoch.', 'Mesmo em um cenário puramente hipotético, o risco seria alto.'],

  // de-c1-10: Akademisches Argumentieren und Kulturkritik
  ['de-c1-10', 'Differenziert', '/dɪfəʁɛnˈtsiːɐ̯t/', 'Matizado / detalhado / diferenciado', 'adjective', 'Eine komplexe Debatte verlangt nach einer differenzierten Betrachtung.', 'Um debate complexo exige uma análise matizada.'],
  ['de-c1-10', 'Die Perspektive', '/diː pɛʁspɛkˈtiːvə/', 'A perspectiva', 'noun', 'Der Essay beleuchtet das Phänomen aus einer historischen Perspektive.', 'O ensaio ilumina o fenômeno a partir de uma perspectiva histórica.'],
  ['de-c1-10', 'Widerlegen', '/viːdɐˈleːɡn̩/', 'Refutar', 'verb', 'Die zentrale These lässt sich durch neue Quellen leicht widerlegen.', 'A tese central pode ser facilmente refutada por novas fontes.'],

  // de-v4-c1-1: Krisenkommunikation
  ['de-v4-c1-1', 'Die Stellungnahme', '/diː ˈʃtɛlʊŋˌnaːmə/', 'O posicionamento / nota oficial', 'noun', 'Das Unternehmen veröffentlichte innerhalb einer Stunde eine klare Stellungnahme.', 'A empresa publicou dentro de uma hora uma nota oficial clara.'],
  ['de-v4-c1-1', 'Eindämmen', '/ˈaɪ̯nˌdɛmən/', 'Conter / limitar (danos)', 'verb', 'Durch schnelles Handeln können wir den Reputationsschaden wirksam eindämmen.', 'Por meio de ação rápida podemos conter eficazmente os danos à reputação.'],
  ['de-v4-c1-1', 'Die Spekulation', '/diː ʃpekulaˈtsi̯oːn/', 'A especulação', 'noun', 'Wir kommentieren keine Spekulationen, sondern nennen gesicherte Fakten.', 'Não comentamos especulações, mas citamos fatos confirmados.'],

  // de-v4-c1-2: Makroökonomie & Geldpolitik
  ['de-v4-c1-2', 'Die Geldpolitik', '/diː ˈɡɛltpoliˌtiːk/', 'A política monetária', 'noun', 'Die Geldpolitik der Zentralbank reagiert sensibel auf Preissteigerungen.', 'A política monetária do banco central reage sensivelmente ao aumento de preços.'],
  ['de-v4-c1-2', 'Die Konjunktur', '/diː kɔnjʊŋkˈtuːɐ̯/', 'A conjuntura econômica', 'noun', 'Eine schwache Konjunktur bremst oft private Investitionen.', 'Uma conjuntura fraca frequentemente freia investimentos privados.'],
  ['de-v4-c1-2', 'Ankurbeln', '/ˈanˌkʊʁbl̩n/', 'Impulsionar / estimular', 'verb', 'Niedrigere Zinsen sollen das wirtschaftliche Wachstum wieder ankurbeln.', 'Juros mais baixos devem voltar a impulsionar o crescimento econômico.'],

  // de-v4-c1-3: Vertragsklauseln
  ['de-v4-c1-3', 'Die Haftung', '/diː ˈhaftʊŋ/', 'A responsabilidade jurídica', 'noun', 'Die Haftung für leichte Schäden wird vertraglich begrenzt.', 'A responsabilidade por danos leves é limitada contratualmente.'],
  ['de-v4-c1-3', 'Die Vertragspartei', '/diː fɛɐ̯ˈtʁaːksˌpaʁtaɪ̯/', 'A parte contratante', 'noun', 'Jede Vertragspartei erhält eine unterschriebene Ausfertigung.', 'Cada parte contratante recebe uma via assinada.'],
  ['de-v4-c1-3', 'Ausschließen', '/ˈaʊ̯sˌʃliːsn̩/', 'Excluir (cláusula)', 'verb', 'Diese Klausel soll künftige Missverständnisse vollständig ausschließen.', 'Esta cláusula deve excluir completamente futuros mal-entendidos.'],

  // de-v4-c1-4: Wissenschaftliches Peer-Review
  ['de-v4-c1-4', 'Die Methodik', '/diː meˈtoːdɪk/', 'A metodologia', 'noun', 'Die Methodik der Untersuchung wird im zweiten Kapitel erläutert.', 'A metodologia da investigação é explicada no segundo capítulo.'],
  ['de-v4-c1-4', 'Der Einwand', '/deːɐ̯ ˈaɪ̯nvant/', 'A objeção', 'noun', 'Der Gutachter brachte einen wichtigen Einwand gegen das Modell vor.', 'O parecerista apresentou uma objeção importante contra o modelo.'],
  ['de-v4-c1-4', 'Reproduzierbar', '/ʁepʁoduˈtsiːɐ̯baːɐ̯/', 'Reproduzível', 'adjective', 'Wissenschaftliche Experimente müssen jederzeit reproduzierbar sein.', 'Experimentos científicos precisam ser reproduzíveis a qualquer momento.'],

  // de-v4-c1-5: Politische Debatte
  ['de-v4-c1-5', 'Der Gesetzentwurf', '/deːɐ̯ ɡəˈzɛtsʔɛntˌvʊʁf/', 'O projeto de lei', 'noun', 'Der neue Gesetzentwurf wird heute im Parlament kontrovers diskutiert.', 'O novo projeto de lei é debatido hoje de forma controversa no parlamento.'],
  ['de-v4-c1-5', 'Die Mehrheit', '/diː ˈmeːɐ̯haɪ̯t/', 'A maioria', 'noun', 'Für diesen Beschluss ist eine klare parlamentarische Mehrheit nötig.', 'Para essa decisão é necessária uma clara maioria parlamentar.'],
  ['de-v4-c1-5', 'Abmildern', '/ˈapˌmɪldɐn/', 'Mitigar / suavizar', 'verb', 'Soziale Ausgleichsmaßnahmen können die Härten der Reform abmildern.', 'Medidas de compensação social podem mitigar os impactos da reforma.'],

  // de-v4-c1-6: Cybersicherheit & DSGVO
  ['de-v4-c1-6', 'Die Verschlüsselung', '/diː fɛɐ̯ˈʃlʏsəlʊŋ/', 'A criptografia', 'noun', 'Eine starke Verschlüsselung schützt sensible Kundendaten zuverlässig.', 'Uma criptografia forte protege dados sensíveis de clientes com segurança.'],
  ['de-v4-c1-6', 'Der Datenschutz', '/deːɐ̯ ˈdaːtn̩ˌʃʊts/', 'A proteção de dados', 'noun', 'Strenge Regeln zum Datenschutz gelten für alle digitalen Dienste.', 'Regras rígidas de proteção de dados valem para todos os serviços digitais.'],
  ['de-v4-c1-6', 'Absichern', '/ˈapˌzɪçɐn/', 'Proteger / blindar', 'verb', 'Zugänge lassen sich durch Zwei-Faktor-Authentifizierung besser absichern.', 'Acessos podem ser mais bem protegidos com autenticação em dois fatores.'],

  // de-v4-c1-7: Rhetorik & Nominalstil
  ['de-v4-c1-7', 'Prägnant', '/pʁɛɡˈnant/', 'Conciso e expressivo', 'adjective', 'Eine prägnante Formulierung bleibt dem Publikum sofort im Gedächtnis.', 'Uma formulação concisa e expressiva fica logo na memória do público.'],
  ['de-v4-c1-7', 'Die Redundanz', '/diː ʁedʊnˈdants/', 'A redundância', 'noun', 'Durch klare Struktur vermeidet der Text unnötige Redundanz.', 'Com uma estrutura clara, o texto evita redundância desnecessária.'],
  ['de-v4-c1-7', 'Verdichten', '/fɛɐ̯ˈdɪçtn̩/', 'Condensar', 'verb', 'Im Fachartikel lassen sich lange Nebensätze elegant verdichten.', 'No artigo técnico, orações subordinadas longas podem ser elegantemente condensadas.'],

  // de-v4-c1-8: Diplomatische Verhandlung
  ['de-v4-c1-8', 'Die Annäherung', '/diː ˈanˌnɛːəʁʊŋ/', 'A aproximação', 'noun', 'Nach langen Gesprächen gelang endlich eine diplomatische Annäherung.', 'Após longas conversas, conseguiu-se finalmente uma aproximação diplomática.'],
  ['de-v4-c1-8', 'Der Vorbehalt', '/deːɐ̯ ˈfoːɐ̯bəhalt/', 'A ressalva / reserva', 'noun', 'Die Delegation stimmte dem Papier nur unter Vorbehalt zu.', 'A delegação concordou com o documento apenas com ressalvas.'],
  ['de-v4-c1-8', 'Entschärfen', '/ɛntˈʃɛʁfn̩/', 'Desarmar / atenuar (tensão)', 'verb', 'Durch geschicktes Nachfragen konnte sie die angespannte Lage entschärfen.', 'Por meio de perguntas hábeis ela conseguiu atenuar a situação tensa.'],

  // de-v4-c1-9: KI-Ethik & Governance
  ['de-v4-c1-9', 'Die Nachvollziehbarkeit', '/diː ˈnaːxfɔltsiːbaːɐ̯kaɪ̯t/', 'A rastreabilidade / explicabilidade', 'noun', 'Bei automatisierten Entscheidungen ist hohe Nachvollziehbarkeit unverzichtbar.', 'Em decisões automatizadas, alta rastreabilidade é indispensável.'],
  ['de-v4-c1-9', 'Die Regulierung', '/diː ʁeɡuˈliːʁʊŋ/', 'A regulamentação', 'noun', 'Eine ausgewogene Regulierung soll Innovation und Sicherheit verbinden.', 'Uma regulamentação equilibrada deve unir inovação e segurança.'],
  ['de-v4-c1-9', 'Überwachen', '/yːbɐˈvaxn̩/', 'Monitorar / supervisionar', 'verb', 'Menschliche Fachkräfte müssen kritische Systeme dauerhaft überwachen.', 'Especialistas humanos precisam monitorar sistemas críticos continuamente.'],

  // de-v4-c1-10: Gegenwartsliteratur
  ['de-v4-c1-10', 'Die Erzählperspektive', '/diː ɛɐ̯ˈtsɛːlpɛʁspɛkˌtiːvə/', 'A perspectiva narrativa', 'noun', 'Der Roman wechselt geschickt zwischen zwei verschiedenen Erzählperspektiven.', 'O romance alterna com habilidade entre duas perspectivas narrativas diferentes.'],
  ['de-v4-c1-10', 'Die Metapher', '/diː meˈtafɐ/', 'A metáfora', 'noun', 'Das verlassene Haus dient im Text als starke Metapher für Vergänglichkeit.', 'A casa abandonada serve no texto como uma forte metáfora da transitoriedade.'],
  ['de-v4-c1-10', 'Vielschichtig', '/ˈfiːlˌʃɪçtɪç/', 'Multifacetado / complexo', 'adjective', 'Die Figuren wirken realistisch, widersprüchlich und ausgesprochen vielschichtig.', 'Os personagens parecem realistas, contraditórios e extremamente complexos.'],
];

export const VOCAB_FIXES_DE: VocabExampleFixMap = {
  'voc-de-a1-5-1': {
    exampleEn: 'Können Sie mir bitte die genaue Uhrzeit sagen?',
    examplePt: 'O senhor pode me dizer a hora exata, por favor?',
  },
  'voc-de-a1-6-1': {
    exampleEn: 'Unter der Woche muss ich schon um sechs Uhr aufstehen.',
    examplePt: 'Durante a semana preciso me levantar já às seis horas.',
  },
  'voc-de-a1-6-2': {
    exampleEn: 'Nach der Arbeit gehe ich noch schnell im Supermarkt einkaufen.',
    examplePt: 'Depois do trabalho ainda vou rápido fazer compras no supermercado.',
  },
  'voc-de-a1-6-3': {
    exampleEn: 'Ich werde dich heute Abend nach dem Essen anrufen.',
    examplePt: 'Vou te ligar hoje à noite depois do jantar.',
  },
  'voc-de-a1-7-2': {
    exampleEn: 'Meine Geschwister wohnen beide nicht mehr bei unseren Eltern.',
    examplePt: 'Meus irmãos não moram mais nenhum dos dois com nossos pais.',
  },
  'voc-de-a1-7-3': {
    exampleEn: 'Unser kleines Wohnzimmer ist am Abend besonders gemütlich.',
    examplePt: 'Nossa pequena sala de estar é especialmente aconchegante à noite.',
  },
  'voc-de-v4-a1-10-3': {
    exampleEn: 'Ich habe heute um siebzehn Uhr eine Verabredung im Café.',
    examplePt: 'Tenho hoje às dezessete horas um encontro marcado no café.',
  },
  'voc-de-a2-2-2': {
    exampleEn: 'Wegen des schlechten Wetters wollten wir am Sonntag lieber zu Hause bleiben.',
    examplePt: 'Por causa do mau tempo preferimos ficar em casa no domingo.',
  },
  'voc-de-a2-2-3': {
    exampleEn: 'Gestern wollte ich meine alte Schulfreundin im Zentrum treffen.',
    examplePt: 'Ontem quis encontrar minha antiga amiga de escola no centro.',
  },
  'voc-de-v4-a2-3-2': {
    exampleEn: 'Welche Zutat macht diese Suppe eigentlich so würzig?',
    examplePt: 'Qual ingrediente deixa essa sopa tão temperada, afinal?',
  },
  'voc-de-v4-a2-8-3': {
    exampleEn: 'Könnten Sie Ihren Nachnamen bitte langsam buchstabieren?',
    examplePt: 'O senhor poderia soletrar o seu sobrenome devagar, por favor?',
  },
  'voc-de-v4-a2-9-1': {
    exampleEn: 'Jeden Samstagmorgen gehe ich gern auf den Wochenmarkt.',
    examplePt: 'Todo sábado de manhã gosto de ir à feira livre.',
  },
  'voc-de-b1-1-2': {
    exampleEn: 'Bitte fügen Sie Ihrer E-Mail einen aktuellen Lebenslauf bei.',
    examplePt: 'Por favor, anexe um currículo atualizado ao seu e-mail.',
  },
  'voc-de-b1-1-3': {
    exampleEn: 'Für diese Position ist praktische Erfahrung im Kundenservice wichtig.',
    examplePt: 'Para essa vaga é importante ter experiência prática no atendimento ao cliente.',
  },
  'voc-de-b1-2-3': {
    exampleEn: 'Die ruhige Lage der Wohnung gefällt uns wirklich sehr.',
    examplePt: 'A localização tranquila do apartamento nos agrada muito mesmo.',
  },
  'voc-de-b1-5-3': {
    exampleEn: 'Sie können die neue Version der App kostenlos herunterladen.',
    examplePt: 'Você pode baixar a nova versão do aplicativo gratuitamente.',
  },
  'voc-de-b1-6-1': {
    exampleEn: 'Welches Restaurant in diesem Viertel können Sie mir empfehlen?',
    examplePt: 'Qual restaurante neste bairro você pode me recomendar?',
  },
  'voc-de-b1-7-2': {
    exampleEn: 'Der Vertrag lässt sich heute noch von beiden Seiten unterschreiben.',
    examplePt: 'O contrato ainda pode ser assinado hoje por ambas as partes.',
  },
  'voc-de-b1-7-3': {
    exampleEn: 'Die guten Ideen lassen sich bereits nächste Woche umsetzen.',
    examplePt: 'As boas ideias já podem ser colocadas em prática na próxima semana.',
  },
  'voc-de-b1-9-2': {
    exampleEn: 'Bitte dieses Formular vollständig und leserlich ausfüllen.',
    examplePt: 'Por favor, preencher este formulário de forma completa e legível.',
  },
  'voc-de-b1-10-1': {
    exampleEn: 'Die Spedition wird die bestellten Möbel direkt bis in die Wohnung liefern.',
    examplePt: 'A transportadora entregará os móveis encomendados diretamente dentro do apartamento.',
  },
  'voc-de-v4-b1-2-2': {
    exampleEn: 'Das vereinbarte Bruttogehalt steht genau im Arbeitsvertrag.',
    examplePt: 'O salário bruto combinado consta exatamente no contrato de trabalho.',
  },
  'voc-de-v4-b1-2-3': {
    exampleEn: 'Ich möchte mich nächste Woche um die offene Stelle bewerben.',
    examplePt: 'Quero me candidatar na próxima semana para a vaga aberta.',
  },
  'voc-de-v4-b1-6-3': {
    exampleEn: 'Nach der Installation müssen Sie das Gerät einmal neu starten.',
    examplePt: 'Após a instalação você precisa reiniciar o aparelho uma vez.',
  },
  'voc-de-idioms-b1-4': {
    exampleEn: 'Lass uns nicht lange um den heißen Brei reden und direkt anfangen.',
    examplePt: 'Não vamos ficar enrolando e vamos começar diretamente.',
  },
  'voc-de-slang-b1-3': {
    exampleEn: 'Neuer Job und direkt eine tolle Wohnung – läuft bei dir!',
    examplePt: 'Emprego novo e logo um ótimo apartamento – você está voando!',
  },
  'voc-de-slang-b1-4': {
    exampleEn: 'Danke für die schnelle Hilfe! – Kein Ding, mache ich gern.',
    examplePt: 'Obrigado pela ajuda rápida! – Sem problema, faço com prazer.',
  },
  'voc-de-b2-4-3': {
    exampleEn: 'Vergiss nicht, das Dokument regelmäßig zu speichern.',
    examplePt: 'Não se esqueça de salvar o documento regularmente.',
  },
  'voc-de-b2-5-1': {
    exampleEn: 'Diesem wichtigen Punkt kann ich aus voller Überzeugung zustimmen.',
    examplePt: 'Posso concordar com esse ponto importante com plena convicção.',
  },
  'voc-de-v4-b2-1-2': {
    exampleEn: 'Wir brauchen eine tragfähige Lösung für das gesamte Team.',
    examplePt: 'Precisamos de uma solução viável e duradoura para toda a equipe.',
  },
  'voc-de-v4-b2-2-2': {
    exampleEn: 'Eine gezielte Falschmeldung verbreitet sich im Netz oft schneller als Fakten.',
    examplePt: 'Uma notícia falsa direcionada se espalha na rede muitas vezes mais rápido que fatos.',
  },
  'voc-de-v4-b2-2-3': {
    exampleEn: 'Man sollte reißerische Überschriften immer kritisch hinterfragen.',
    examplePt: 'Deve-se sempre questionar criticamente manchetes sensacionalistas.',
  },
  'voc-de-v4-b2-3-2': {
    exampleEn: 'Die gesetzliche Sorgfaltspflicht gilt auch für internationale Zulieferer.',
    examplePt: 'O dever legal de diligência também se aplica a fornecedores internacionais.',
  },
  'voc-de-v4-b2-3-3': {
    exampleEn: 'Jede Charge des Materials muss bis zur Quelle rückverfolgbar sein.',
    examplePt: 'Cada lote do material precisa ser rastreável até a origem.',
  },
  'voc-de-v4-b2-5-2': {
    exampleEn: 'Während der Kernarbeitszeit sind alle Teammitglieder für Absprachen erreichbar.',
    examplePt: 'Durante o horário núcleo todos os membros da equipe estão disponíveis para alinhamentos.',
  },
  'voc-de-v4-b2-5-3': {
    exampleEn: 'Viele Statusupdates lassen sich problemlos asynchron per Chat klären.',
    examplePt: 'Muitas atualizações de status podem ser resolvidas sem problemas de forma assíncrona por chat.',
  },
  'voc-de-v4-b2-7-3': {
    exampleEn: 'Vor einer großen Investition sollte man alle Risiken genau abwägen.',
    examplePt: 'Antes de um grande investimento deve-se ponderar todos os riscos com precisão.',
  },
  'voc-de-v4-b2-9-1': {
    exampleEn: 'Deutsch gilt als plurizentrische Sprache mit mehreren nationalen Standards.',
    examplePt: 'O alemão é considerado uma língua pluricêntrica com vários padrões nacionais.',
  },
  'voc-de-v4-b2-9-2': {
    exampleEn: 'Das Wort „Parkieren“ ist ein bekannter Helvetismus aus der Schweiz.',
    examplePt: 'A palavra „Parkieren“ é um conhecido helvetismo da Suíça.',
  },
  'voc-de-v4-b2-9-3': {
    exampleEn: 'Für Kartoffeln verwendet man in Österreich den Austriazismus „Erdäpfel“.',
    examplePt: 'Para batatas usa-se na Áustria o austriacismo „Erdäpfel“.',
  },
  'voc-de-taboo-register-b2-3': {
    exampleEn: 'Ach, das ist doch totaler Quatsch! Glaub ihm kein Wort.',
    examplePt: 'Ah, isso é pura besteira! Não acredite em nenhuma palavra dele.',
  },
  'voc-de-taboo-register-b2-4': {
    exampleEn: 'Im Film schrie der wütende Fahrer „Arschloch“, doch im Alltag meidet man das Wort.',
    examplePt: 'No filme o motorista furioso gritou um palavrão pesado, mas no dia a dia evita-se essa palavra.',
  },
  'voc-de-c1-2-2': {
    exampleEn: 'Regionale Ausdrücke bereichern die deutsche Gegenwartssprache ungemein.',
    examplePt: 'Expressões regionais enriquecem imensamente a língua alemã contemporânea.',
  },
  'voc-de-c1-9-3': {
    exampleEn: 'Bei solch komplexen Verträgen sollte man unbedingt eine Juristin hinzuziehen.',
    examplePt: 'Em contratos tão complexos deve-se sem dúvida consultar uma jurista.',
  },
  'voc-de-v4-c1-1-3': {
    exampleEn: 'Vor einer offiziellen Pressemitteilung müssen wir jede Information verifizieren.',
    examplePt: 'Antes de um comunicado oficial à imprensa precisamos verificar cada informação.',
  },
  'voc-de-v4-c1-4-3': {
    exampleEn: 'Die Autorin muss einräumen, dass die Datenbasis noch begrenzt ist.',
    examplePt: 'A autora precisa admitir que a base de dados ainda é limitada.',
  },
  'voc-de-v4-c1-5-1': {
    exampleEn: 'Diesem Vorschlag lässt sich jedoch entgegenhalten, dass die Kosten steigen.',
    examplePt: 'A essa proposta pode-se contrapor, contudo, que os custos sobem.',
  },
  'voc-de-v4-c1-6-3': {
    exampleEn: 'Bei einem Datenleck greift nach der DSGVO eine strikte Meldepflicht.',
    examplePt: 'Em caso de vazamento de dados aplica-se, segundo a DSGVO, uma obrigação estrita de notificação.',
  },
  'voc-de-v4-c1-10-3': {
    exampleEn: 'Die Erzählungen der Autorin bestechen durch ihre präzise Beobachtungsgabe.',
    examplePt: 'Os contos da autora se destacam por sua capacidade precisa de observação.',
  },
};
