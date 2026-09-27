import referenceHtml from '../reference/smdark-ui-reference.html?raw';

const styleMatch = referenceHtml.match(/<style>([\s\S]*?)<\/style>/i);

/**
 * Uses the original site's visual stylesheet as an immutable design reference.
 * The old HTML and its scripts are never rendered or executed; React owns the
 * markup and all dynamic Firebase rendering.
 */
export function mountLegacyTheme() {
  const styleId = 'sohan-mali-legacy-visual-theme';
  if (document.getElementById(styleId)) return () => undefined;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = (styleMatch?.[1] ?? '')
    .replaceAll("url('", "url('/media/")
    .replaceAll('url("', 'url("/media/');
  document.head.appendChild(style);

  return () => style.remove();
}
