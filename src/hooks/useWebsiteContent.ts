import { useEffect, useState } from 'react';
import { subscribeToContent, type ContentSource } from '../lib/content-repository';
import type { WebsiteContent } from '../types/content';
import seed from '../data/content.seed.json';

const CACHE_KEY = 'sohan_mali_website_content_cache';

function getCachedContent(): WebsiteContent {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.home && parsed.projects) {
          return parsed as WebsiteContent;
        }
      }
    } catch (err) {
      console.warn('Failed to parse cached website content:', err);
    }
  }
  return seed as WebsiteContent;
}

export function useWebsiteContent() {
  const [content, setContent] = useState<WebsiteContent>(getCachedContent);
  const [source, setSource] = useState<ContentSource>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(CACHE_KEY)) {
      return 'firebase';
    }
    return 'seed';
  });
  const [error, setError] = useState<string>();

  useEffect(() => subscribeToContent(
    (next, nextSource) => {
      setContent(next);
      setSource(nextSource);
      if (nextSource === 'firebase' && typeof window !== 'undefined') {
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(next));
        } catch {
          // Ignore quota errors
        }
      }
    },
    (nextError) => setError(nextError.message),
  ), []);

  return { content, source, error, loading: false };
}
