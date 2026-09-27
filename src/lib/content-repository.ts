import { onValue, ref } from 'firebase/database';
import seed from '../data/content.seed.json';
import { CONTENT_PATH, database, hasFirebaseConfig } from './firebase';
import type { WebsiteContent } from '../types/content';

export type ContentSource = 'firebase' | 'seed';

/**
 * The website reads only from Firebase. The seed is an offline/development
 * fallback, never a second writable CMS source.
 */
export function subscribeToContent(
  onContent: (content: WebsiteContent, source: ContentSource) => void,
  onError: (error: Error) => void,
) {
  if (!hasFirebaseConfig || !database) {
    onContent(seed as WebsiteContent, 'seed');
    return () => undefined;
  }

  return onValue(
    ref(database, CONTENT_PATH),
    (snapshot) => {
      const value = snapshot.val();
      onContent((value ?? seed) as WebsiteContent, value ? 'firebase' : 'seed');
    },
    (error) => {
      onError(error);
      onContent(seed as WebsiteContent, 'seed');
    },
  );
}
