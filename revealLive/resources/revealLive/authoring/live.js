// Included only in Live builds: the Reveal plugin for the live client, the thumbnail sidebar and
// the toolbar's Edit slide action.
import { revealPlugin } from './patch.js';

const deck = new URL('..', import.meta.url);
(window.tigerLivePlugins ||= []).push(revealPlugin(deck));

// Shared Reveal toolbar: source lookup by slide ID stays current after slide reordering.
const installEditor = () => {
  const reveal = window.Reveal;
  const tools = document.querySelector('.reveal .presentation-tools');
  if (!reveal || !tools || new URLSearchParams(location.search).has('print-pdf')) return;
  import('./sidebar.js').then(({ installSidebar }) => installSidebar(reveal, tools)).catch(console.error);
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Edit slide';
  button.title = 'Open this slide’s Markdown source in VS Code';
  tools.append(button);
  const status = document.createElement('span');
  status.setAttribute('role', 'status');
  tools.append(status);
  button.addEventListener('click', async () => {
    button.disabled = true;
    status.textContent = '';
    try {
      const directory = decodeURIComponent(deck.pathname).replace(/^\/+|\/+$/g, '') + '/slides';
      const response = await fetch('/__author/open', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directory, id: reveal.getCurrentSlide()?.id })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not open VS Code');
    } catch (error) {
      status.textContent = `Could not open slide: ${error.message}`;
    } finally { button.disabled = false; }
  });
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installEditor, { once: true });
else installEditor();
