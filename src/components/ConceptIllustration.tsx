/**
 * @file src/components/ConceptIllustration.tsx
 * @description Componente reutilizável de ilustração de conceito visual com carregamento lazy e fallback SVG determinístico.
 * @exports ConceptIllustration
 */
import { useEffect, useState } from 'react';
import {
  buildConceptFallbackSvgDataUri,
  getConceptImageUrl,
  VISUAL_CONCEPTS_MAP,
} from '../data/visualConcepts';

interface ConceptIllustrationProps {
  conceptId?: string;
  imageUrl?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<ConceptIllustrationProps['size']>, string> = {
  xs: 'h-8 w-8 rounded-lg',
  sm: 'h-12 w-12 rounded-xl',
  md: 'h-20 w-20 rounded-2xl',
  lg: 'h-28 w-28 rounded-3xl',
};

export function ConceptIllustration({
  conceptId,
  imageUrl,
  alt,
  size = 'md',
  className = '',
}: ConceptIllustrationProps) {
  const safeId = conceptId || 'default';
  const concept = conceptId ? VISUAL_CONCEPTS_MAP.get(conceptId) : undefined;
  const fallbackUri = buildConceptFallbackSvgDataUri(safeId);
  const primarySrc =
    imageUrl?.trim() || (conceptId ? getConceptImageUrl(conceptId) : fallbackUri);

  const [src, setSrc] = useState<string>(primarySrc);

  useEffect(() => {
    setSrc(primarySrc);
  }, [primarySrc]);

  const handleFallback = () => {
    if (src !== fallbackUri) {
      setSrc(fallbackUri);
    }
  };

  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden bg-slate-100 ring-1 ring-slate-200/80 dark:bg-slate-800 dark:ring-slate-700/80 ${SIZE_CLASSES[size]} ${className}`}
    >
      <img
        src={src}
        alt={alt || concept?.labelPt || conceptId || 'Ilustração'}
        loading="lazy"
        decoding="async"
        onError={handleFallback}
        onLoad={(e) => {
          if (e.currentTarget.naturalWidth === 0) {
            handleFallback();
          }
        }}
        className="h-full w-full object-contain select-none"
      />
    </div>
  );
}
