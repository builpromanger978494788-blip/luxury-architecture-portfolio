import { useEffect, useState } from 'react';
import { subscribeToContent, type ContentSource } from '../lib/content-repository';
import type { WebsiteContent } from '../types/content';
import seed from '../data/content.seed.json';

export function useWebsiteContent() {
  const [content, setContent] = useState<WebsiteContent>(seed as WebsiteContent);
  const [source, setSource] = useState<ContentSource>('seed');
  const [error, setError] = useState<string>();

  useEffect(() => subscribeToContent(
    (next, nextSource) => { setContent(next); setSource(nextSource); },
    (nextError) => setError(nextError.message),
  ), []);

  return { content, source, error, loading: false };
}
