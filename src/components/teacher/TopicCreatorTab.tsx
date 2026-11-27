import { useState } from 'react';
import { Plus, Sparkles, Trash2 } from 'lucide-react';
import { DEFAULT_BACKEND_API_URL } from '../../config/appConfig';
import { getLanguageCourseMeta, LANGUAGE_COURSES_META } from '../../data/platformDefaults';
import type { CEFRLevel, LanguageCode, TipCategory, Topic } from '../../types/learning';

interface TopicCreatorTabProps {
  teacherName: string;
  customTopics: Topic[];
  onAddCustomTopic: (topic: Topic) => void;
  onDeleteCustomTopic: (topicId: string) => void;
  onPlayTopic: (topic: Topic) => void;
}

export function TopicCreatorTab({
  teacherName,
  customTopics,
  onAddCustomTopic,
  onDeleteCustomTopic,
  onPlayTopic,
}: TopicCreatorTabProps) {
  const [aiTopicIdea, setAiTopicIdea] = useState('');
  const [isGeneratingAiTopic, setIsGeneratingAiTopic] = useState(false);
  const [aiStatusMsg, setAiStatusMsg] = useState<string | null>(null);

  const [topicLanguage, setTopicLanguage] = useState<LanguageCode>('en');
  const [titlePt, setTitlePt] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [level, setLevel] = useState<CEFRLevel>('A2');
  const [tipCategory, setTipCategory] = useState<TipCategory>('grammar');
  const [tipTitle, setTipTitle] = useState('');
  const [tipSummary, setTipSummary] = useState('');
  const [tipDetails, setTipDetails] = useState('');
  const [tipExampleEn, setTipExampleEn] = useState('');
  const [tipExamplePt, setTipExamplePt] = useState('');

  const [listenAudio, setListenAudio] = useState('');
  const [listenQuestion, setListenQuestion] = useState('');
  const [listenRight, setListenRight] = useState('');
  const [listenWrong, setListenWrong] = useState('');

  const [readText, setReadText] = useState('');
  const [readQuestion, setReadQuestion] = useState('');
  const [readRight, setReadRight] = useState('');
  const [readWrong, setReadWrong] = useState('');

  const [speakSentence, setSpeakSentence] = useState('');
  const [speakTranslation, setSpeakTranslation] = useState('');
  const [speakHint, setSpeakHint] = useState('');

  const [writePrompt, setWritePrompt] = useState('');
  const [writeModel, setWriteModel] = useState('');

  const selectedCourseName = getLanguageCourseMeta(topicLanguage).namePt;

  const handlePrefillSampleTopic = () => {
    setTitlePt('Negócios & Networking Internacional');
    setTitleEn('International Networking');
    setSubtitle('Apresente sua empresa, faça perguntas inteligentes e troque contatos.');
    setLevel('B1');
    setTipCategory('culture');
    setTipTitle('Small talk que gera conexão real');
    setTipSummary('Evite perguntas fechadas (sim/não). Pergunte "What brought you to..."');
    setTipDetails(
      'Em conferências ou cafés corporativos, perguntas abertas convidam o outro a contar histórias e destravam a conversa naturalmente.',
    );
    setTipExampleEn('What brought you to this year’s conference?');
    setTipExamplePt('O que trouxe você para a conferência deste ano?');
    setListenAudio(
      "Hi! I'm Laura from Lisbon. Currently I lead customer partnerships at a clean-tech startup. What kind of projects is your team focusing on?",
    );
    setListenQuestion('Qual é o cargo atual da Laura?');
    setListenRight('Ela lidera parcerias com clientes em uma startup de tecnologia limpa.');
    setListenWrong('Ela é estudante de medicina em Londres.');
    setReadText(
      'Hi David! Great meeting you at the panel earlier. As promised, here is the link to our case study. Let us touch base next Tuesday for a quick 15-minute call.',
    );
    setReadQuestion('O que a mensagem propõe para a próxima terça-feira?');
    setReadRight('Uma ligação rápida de 15 minutos para manter contato.');
    setReadWrong('Cancelar a parceria atual.');
    setSpeakSentence("It was great connecting—let's touch base next week!");
    setSpeakTranslation('Foi ótimo conectar com você — vamos conversar na semana que vem!');
    setSpeakHint('Pronuncie "touch base" com clareza.');
    setWritePrompt('Escreva uma mensagem curta de follow-up após conhecer alguém em um evento.');
    setWriteModel(
      'Hi Alex! It was great meeting you at the workshop today. Let us stay in touch on LinkedIn!',
    );
  };

  const handleGenerateAiDraft = async () => {
    if (!aiTopicIdea.trim()) return;
    setIsGeneratingAiTopic(true);
    setAiStatusMsg(null);
    const audienceLabel =
      topicLanguage === 'pt'
        ? 'English-speaking learners of Portuguese (scaffolding in English for A1-B1, Portuguese for B2-C1)'
        : 'Brazilian Portuguese students';
    try {
      const res = await fetch(
        `${DEFAULT_BACKEND_API_URL.replace(/\/+$/, '')}/api/gemini-tutor`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `Create a language lesson draft in ${topicLanguage} (${selectedCourseName}, CEFR ${level}) for ${audienceLabel} on topic "${aiTopicIdea.trim()}". Reply ONLY with JSON: {"titlePt":"","titleEn":"","subtitle":"","tipTitle":"","tipSummary":"","tipDetails":"","tipExampleEn":"","tipExamplePt":"","listenAudio":"","listenQuestion":"","listenRight":"","listenWrong":"","readText":"","readQuestion":"","readRight":"","readWrong":"","speakSentence":"","speakTranslation":"","speakHint":"","writePrompt":"","writeModel":""}`,
                  },
                ],
              },
            ],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        },
      );
      if (res.ok) {
        const json = (await res.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const raw = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const d = JSON.parse(raw) as Record<string, string>;
          if (d.titlePt) setTitlePt(d.titlePt);
          if (d.titleEn) setTitleEn(d.titleEn);
          if (d.subtitle) setSubtitle(d.subtitle);
          if (d.tipTitle) setTipTitle(d.tipTitle);
          if (d.tipSummary) setTipSummary(d.tipSummary);
          if (d.tipDetails) setTipDetails(d.tipDetails);
          if (d.tipExampleEn) setTipExampleEn(d.tipExampleEn);
          if (d.tipExamplePt) setTipExamplePt(d.tipExamplePt);
          if (d.listenAudio) setListenAudio(d.listenAudio);
          if (d.listenQuestion) setListenQuestion(d.listenQuestion);
          if (d.listenRight) setListenRight(d.listenRight);
          if (d.listenWrong) setListenWrong(d.listenWrong);
          if (d.readText) setReadText(d.readText);
          if (d.readQuestion) setReadQuestion(d.readQuestion);
          if (d.readRight) setReadRight(d.readRight);
          if (d.readWrong) setReadWrong(d.readWrong);
          if (d.speakSentence) setSpeakSentence(d.speakSentence);
          if (d.speakTranslation) setSpeakTranslation(d.speakTranslation);
          if (d.speakHint) setSpeakHint(d.speakHint);
          if (d.writePrompt) setWritePrompt(d.writePrompt);
          if (d.writeModel) setWriteModel(d.writeModel);
          setAiStatusMsg('Rascunho completo gerado com IA! Revise os campos e publique.');
          return;
        }
      }
      setAiStatusMsg('Não foi possível gerar agora. Você pode usar "Exemplo pronto" ou preencher manualmente.');
    } catch {
      setAiStatusMsg('Falha de conexão com a IA. Use "Exemplo pronto" ou preencha manualmente.');
    } finally {
      setIsGeneratingAiTopic(false);
    }
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titlePt.trim() || !speakSentence.trim() || !listenAudio.trim() || !readText.trim()) {
      return;
    }

    const id = `custom-${Date.now()}`;
    const newTopic: Topic = {
      id,
      languageCode: topicLanguage,
      titlePt: titlePt.trim(),
      titleEn: titleEn.trim() || titlePt.trim(),
      subtitle:
        subtitle.trim() ||
        'Lição personalizada criada pelo professor com as 4 habilidades.',
      level,
      estimatedMinutes: 8,
      icon: 'Sparkles',
      color: '#7C3AED',
      isCustom: true,
      topicTipsSummary: [tipTitle.trim() || 'Dica exclusiva do professor'],
      steps: [
        {
          id: `${id}-tip`,
          type: 'tip',
          tip: {
            id: `${id}-tip-content`,
            category: tipCategory,
            title: tipTitle.trim() || 'Dica do Professor',
            summary: tipSummary.trim() || 'Ponto de atenção para este tópico.',
            details:
              tipDetails.trim() ||
              'Revise o exemplo abaixo em voz alta para memorizar a estrutura.',
            examples: [
              {
                en: tipExampleEn.trim() || speakSentence.trim(),
                pt: tipExamplePt.trim() || speakTranslation.trim() || 'Exemplo prático.',
              },
            ],
          },
        },
        {
          id: `${id}-listen`,
          type: 'listening',
          speakerLabel: `Áudio do Professor · ${teacherName}`,
          contextPt: 'Ouça o áudio com atenção e escolha a resposta correta.',
          audioText: listenAudio.trim(),
          question: listenQuestion.trim() || 'O que foi informado no áudio?',
          options: [
            listenRight.trim() || 'A informação principal dita no áudio.',
            listenWrong.trim() || 'Uma informação diferente do áudio.',
          ],
          correctIndex: 0,
          explanation: `No áudio ouvimos: "${listenAudio.trim()}".`,
          hintTip: 'Use a velocidade 0.75x se precisar captar cada palavra.',
        },
        {
          id: `${id}-read`,
          type: 'reading',
          title: 'Leitura Guiada',
          format: 'article',
          text: readText.trim(),
          glossary: [],
          question: readQuestion.trim() || 'Qual é a ideia principal do texto?',
          options: [
            readRight.trim() || 'Ideia principal confirmada pelo texto.',
            readWrong.trim() || 'Afirmação incorreta sobre o texto.',
          ],
          correctIndex: 0,
          explanation: 'Confira o trecho principal do texto acima.',
          hintTip: 'Você pode clicar em "Ouvir texto" para treinar leitura + áudio juntos.',
        },
        {
          id: `${id}-speak`,
          type: 'speaking',
          promptPt: 'Pratique esta frase-chave em voz alta:',
          targetSentence: speakSentence.trim(),
          translationPt: speakTranslation.trim() || 'Pratique a pronúncia natural.',
          ipa: '/prática guiada/',
          brPhoneticHint: speakHint.trim() || 'Fale pausadamente mantendo o ritmo.',
          focusTip: speakHint.trim() || 'Foque na clareza das palavras principais.',
        },
        {
          id: `${id}-write`,
          type: 'writing_free',
          promptPt: writePrompt.trim() || 'Escreva 1 ou 2 frases sobre este tema.',
          scenarioPt: 'Sua resposta poderá ser enviada diretamente para correção do professor.',
          minWords: 6,
          checklist: [{ label: `Pelo menos 6 palavras em ${selectedCourseName}`, keywords: [' '] }],
          modelAnswer: writeModel.trim() || speakSentence.trim(),
          hintTip: 'Use a estrutura da dica inicial para montar sua frase.',
        },
      ],
    };

    onAddCustomTopic(newTopic);
    setTitlePt('');
    setTitleEn('');
    setSubtitle('');
    setTipTitle('');
    setTipSummary('');
    setTipDetails('');
    setTipExampleEn('');
    setTipExamplePt('');
    setListenAudio('');
    setListenQuestion('');
    setListenRight('');
    setListenWrong('');
    setReadText('');
    setReadQuestion('');
    setReadRight('');
    setReadWrong('');
    setSpeakSentence('');
    setSpeakTranslation('');
    setSpeakHint('');
    setWritePrompt('');
    setWriteModel('');
    setAiStatusMsg(null);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <form
        onSubmit={handleCreateTopic}
        className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Criar Tópico com as 4 Habilidades + Dica
            </h2>
            <p className="text-xs text-slate-500">
              Ao publicar, a lição fica disponível para toda a escola na Trilha de Estudos.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePrefillSampleTopic}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Exemplo pronto</span>
          </button>
        </div>

        {/* AI Unit Generator */}
        <div className="space-y-2 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={aiTopicIdea}
              onChange={(e) => setAiTopicIdea(e.target.value)}
              placeholder="Tema p/ IA gerar lição (ex: Negociar aumento, Pedir comida em Paris)..."
              className="min-w-[200px] flex-1 rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs"
            />
            <button
              type="button"
              disabled={isGeneratingAiTopic || !aiTopicIdea.trim()}
              onClick={() => void handleGenerateAiDraft()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isGeneratingAiTopic ? 'Gerando...' : 'Gerar rascunho com IA'}</span>
            </button>
          </div>
          {aiStatusMsg && (
            <p className="text-[11px] font-semibold text-indigo-900">{aiStatusMsg}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700">Título Principal *</label>
            <input
              required
              value={titlePt}
              onChange={(e) => setTitlePt(e.target.value)}
              placeholder="Ex: Check-in no Hotel"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700">Idioma (17)</label>
            <select
              value={topicLanguage}
              onChange={(e) => setTopicLanguage(e.target.value as LanguageCode)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {LANGUAGE_COURSES_META.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.namePt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700">Nível CEFR</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as CEFRLevel)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="A1">A1 · Iniciante</option>
              <option value="A2">A2 · Básico</option>
              <option value="B1">B1 · Intermediário</option>
              <option value="B2">B2 · Avançado</option>
              <option value="C1">C1 · Proficiência</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder={`Título em ${selectedCourseName} (opcional)`}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtítulo curto"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
          <p className="text-xs font-extrabold text-amber-900 uppercase">
            1. Dica do Professor durante o tópico
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              value={tipTitle}
              onChange={(e) => setTipTitle(e.target.value)}
              placeholder="Título da dica"
              className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm sm:col-span-2"
            />
            <select
              value={tipCategory}
              onChange={(e) => setTipCategory(e.target.value as TipCategory)}
              className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm"
            >
              <option value="grammar">Gramática</option>
              <option value="pronunciation">Pronúncia</option>
              <option value="false_friend">Falso Cognato</option>
              <option value="culture">Cultura</option>
            </select>
          </div>
          <input
            value={tipSummary}
            onChange={(e) => setTipSummary(e.target.value)}
            placeholder="Resumo em 1 linha"
            className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm"
          />
          <textarea
            rows={2}
            value={tipDetails}
            onChange={(e) => setTipDetails(e.target.value)}
            placeholder="Explicação completa da dica..."
            className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              value={tipExampleEn}
              onChange={(e) => setTipExampleEn(e.target.value)}
              placeholder={`Exemplo em ${selectedCourseName}`}
              className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm"
            />
            <input
              value={tipExamplePt}
              onChange={(e) => setTipExamplePt(e.target.value)}
              placeholder="Tradução do exemplo"
              className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2.5 rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4">
            <p className="text-xs font-extrabold text-indigo-900 uppercase">
              2. Listening (Áudio em {selectedCourseName}) *
            </p>
            <textarea
              required
              rows={2}
              value={listenAudio}
              onChange={(e) => setListenAudio(e.target.value)}
              placeholder={`Texto em ${selectedCourseName} que o app falará...`}
              className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs"
            />
            <input
              value={listenQuestion}
              onChange={(e) => setListenQuestion(e.target.value)}
              placeholder="Pergunta de compreensão"
              className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs"
            />
            <input
              value={listenRight}
              onChange={(e) => setListenRight(e.target.value)}
              placeholder="Alternativa correta"
              className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs"
            />
            <input
              value={listenWrong}
              onChange={(e) => setListenWrong(e.target.value)}
              placeholder="Alternativa distratora"
              className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs"
            />
          </div>

          <div className="space-y-2.5 rounded-2xl border border-teal-200 bg-teal-50/40 p-4">
            <p className="text-xs font-extrabold text-teal-900 uppercase">
              3. Reading (Texto em {selectedCourseName}) *
            </p>
            <textarea
              required
              rows={2}
              value={readText}
              onChange={(e) => setReadText(e.target.value)}
              placeholder={`Texto ou e-mail curto em ${selectedCourseName}...`}
              className="w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs"
            />
            <input
              value={readQuestion}
              onChange={(e) => setReadQuestion(e.target.value)}
              placeholder="Pergunta sobre o texto"
              className="w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs"
            />
            <input
              value={readRight}
              onChange={(e) => setReadRight(e.target.value)}
              placeholder="Alternativa correta"
              className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs"
            />
            <input
              value={readWrong}
              onChange={(e) => setReadWrong(e.target.value)}
              placeholder="Alternativa distratora"
              className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2.5 rounded-2xl border border-rose-200 bg-rose-50/40 p-4">
            <p className="text-xs font-extrabold text-rose-900 uppercase">
              4. Speaking (Fala) *
            </p>
            <input
              required
              value={speakSentence}
              onChange={(e) => setSpeakSentence(e.target.value)}
              placeholder={`Frase alvo em ${selectedCourseName}...`}
              className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs"
            />
            <input
              value={speakTranslation}
              onChange={(e) => setSpeakTranslation(e.target.value)}
              placeholder="Tradução da frase"
              className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs"
            />
            <input
              value={speakHint}
              onChange={(e) => setSpeakHint(e.target.value)}
              placeholder="Dica de pronúncia"
              className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs"
            />
          </div>

          <div className="space-y-2.5 rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
            <p className="text-xs font-extrabold text-amber-900 uppercase">
              5. Writing (Escrita)
            </p>
            <input
              value={writePrompt}
              onChange={(e) => setWritePrompt(e.target.value)}
              placeholder="Instrução da escrita"
              className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs"
            />
            <textarea
              rows={2}
              value={writeModel}
              onChange={(e) => setWriteModel(e.target.value)}
              placeholder={`Resposta modelo em ${selectedCourseName}`}
              className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Publicar tópico na Trilha de Estudos</span>
        </button>
      </form>

      <div className="space-y-3 lg:col-span-4">
        <h3 className="font-display text-sm font-bold tracking-wide text-slate-500 uppercase">
          Seus tópicos publicados ({customTopics.length})
        </h3>
        {customTopics.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center text-xs text-slate-500">
            Você ainda não criou tópicos próprios. Use “Exemplo pronto” ao lado para testar em 1 clique!
          </div>
        ) : (
          customTopics.map((topic) => (
            <div
              key={topic.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-slate-600">
                      {topic.languageCode ?? 'en'}
                    </span>
                    <span className="rounded-full bg-purple-50 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-700">
                      {topic.level}
                    </span>
                  </div>
                  <h4 className="mt-1 font-display text-sm font-bold text-slate-900">
                    {topic.titlePt}
                  </h4>
                  <p className="text-xs text-slate-500">{topic.steps.length} etapas</p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteCustomTopic(topic.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                  aria-label={`Remover ${topic.titlePt}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => onPlayTopic(topic)}
                className="mt-3 w-full rounded-xl border border-blue-200 bg-blue-50 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
              >
                Testar tópico agora →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
