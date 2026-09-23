import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — TheInnoVibe` : 'TheInnoVibe — Think.Build.Vibe';
  }, [title]);
}
