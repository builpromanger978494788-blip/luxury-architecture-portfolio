import { useEffect, useState } from 'react';
import { subscribeToContent, type ContentSource } from '../lib/content-repository';
import type { WebsiteContent } from '../types/content';

export function useWebsiteContent() {
  const [content, setContent] = useState<WebsiteContent>();
  const [source, setSource] = useState<ContentSource>();
  const [error, setError] = useState<string>();

  useEffect(() => subscribeToContent(
    (next, nextSource) => { setContent(next); setSource(nextSource); },
    (nextError) => setError(nextError.message),
  ), []);

  return { content, source, error, loading: !content };
}
