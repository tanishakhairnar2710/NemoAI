import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDocuments } from './useDocuments';

export function useSelectedDocumentId() {
  const [params] = useSearchParams();
  const { documents } = useDocuments();
  return useMemo(() => {
    const fromUrl = Number(params.get('documentId'));
    if (Number.isFinite(fromUrl) && fromUrl > 0) return fromUrl;
    return documents[0]?.id;
  }, [params, documents]);
}
