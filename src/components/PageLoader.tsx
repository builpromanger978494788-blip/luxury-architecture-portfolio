import { Loader2 } from 'lucide-react';
import styles from './PageLoader.module.css';

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className={styles.loaderContainer}>
      <Loader2 className={styles.spinner} aria-hidden="true" />
      <p className="eyebrow">{message}</p>
    </div>
  );
}
