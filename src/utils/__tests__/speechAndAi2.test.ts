/**
 * @file src/utils/__tests__/speechAndAi2.test.ts
 * @description Suíte de testes unitários Vitest validando classificação do mapa de calor fonético (SpeakingStepView) e parsing da memória pedagógica (AITutor).
 * @exports
 */
import { describe, expect, it } from 'vitest';
import { parsePedagogicalMemory } from '../../components/AITutor';
import { classifyWordHeatmap } from '../../components/lesson/SpeakingStepView';

describe('SpeakingStepView phonetic heatmap classification', () => {
  it('classifies matched words with high or undefined confidence as exact', () => {
    expect(classifyWordHeatmap({ matched: true })).toBe('exact');
    expect(classifyWordHeatmap({ matched: true, confidence: 0.92 })).toBe('exact');
    expect(classifyWordHeatmap({ matched: true, confidence: 0.75 })).toBe('exact');
  });

  it('classifies matched words with moderate confidence or near-miss words as close', () => {
    expect(classifyWordHeatmap({ matched: true, confidence: 0.6 })).toBe('close');
    expect(classifyWordHeatmap({ matched: false, confidence: 0.42 })).toBe('close');
    expect(classifyWordHeatmap({ matched: false, confidence: 0.35 })).toBe('close');
  });

  it('classifies unmatched words with low or missing confidence as missed', () => {
    expect(classifyWordHeatmap({ matched: false })).toBe('missed');
    expect(classifyWordHeatmap({ matched: false, confidence: 0.2 })).toBe('missed');
  });
});

describe('AITutor pedagogical memory parsing', () => {
  it('extracts weakWords and recentMistakes from formatted pedagogicalMemory string', () => {
    const raw =
      'Vocabulário prioritário do aluno no SRS para reforçar naturalmente na conversa: negotiate, deadline, bottleneck. ' +
      'Erros recentes do aluno no Caderno de Erros para corrigir com delicadeza se surgirem: I am 25 years old (erro: "I have 25 years"); Where is the station? (erro: "Where the station?").';

    const parsed = parsePedagogicalMemory(raw);
    expect(parsed.weakWords).toEqual(['negotiate', 'deadline', 'bottleneck']);
    expect(parsed.recentMistakes).toEqual([
      'I am 25 years old (erro: "I have 25 years")',
      'Where is the station? (erro: "Where the station?")',
    ]);
  });

  it('returns empty arrays for empty or undefined memory', () => {
    expect(parsePedagogicalMemory(undefined)).toEqual({
      weakWords: [],
      recentMistakes: [],
    });
    expect(parsePedagogicalMemory('   ')).toEqual({
      weakWords: [],
      recentMistakes: [],
    });
  });

  it('handles custom unstructured memory strings gracefully', () => {
    const parsed = parsePedagogicalMemory('th sound; past tense -ed');
    expect(parsed.weakWords).toEqual([]);
    expect(parsed.recentMistakes).toEqual(['th sound', 'past tense -ed']);
  });
});
