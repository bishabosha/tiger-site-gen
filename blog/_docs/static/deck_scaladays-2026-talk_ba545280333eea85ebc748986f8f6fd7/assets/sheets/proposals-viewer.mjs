import { installPreviewCloseShortcut } from '../preview-shortcuts.mjs';

installPreviewCloseShortcut(document, () => {
  if (window.parent === window) return false;
  try {
    const close = window.parent.document.querySelector('.r-overlay-preview .r-overlay-close');
    if (!close) return false;
    close.click();
    return true;
  } catch {
    return false;
  }
});

const search = document.querySelector('#search');
const source = document.querySelector('#source');
const status = document.querySelector('#status');
const count = document.querySelector('#count');
const body = document.querySelector('tbody');
const message = document.querySelector('#message');
const viewMode = document.querySelector('#view-mode');
function setPresentation(enabled) {
  document.body.classList.toggle('presentation', enabled);
  viewMode.setAttribute('aria-pressed', String(enabled));
  viewMode.textContent = enabled ? 'Full table' : 'Presentation view';
  document.querySelector('main').setAttribute('aria-label', enabled
    ? 'Proposals, statuses and comments' : 'Proposals table, scroll to see all columns');
}
setPresentation(new URLSearchParams(location.search).get('view') === 'present');
viewMode.addEventListener('click', () => setPresentation(!document.body.classList.contains('presentation')));

try {
  const response = await fetch(new URL('./proposals-data.json', import.meta.url));
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  // Keep all source columns, placing the proposal and review together for browsing.
  const columns = [3, 0, 7, 8, 4, 5, 1, 2, 6];
  const labels = ['Proposal', 'Source', 'Status', 'Comments', 'Created', 'Updated', 'Kind', 'ID', 'Original discussion'];
  const header = document.createElement('tr');
  for (const label of labels) {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = label;
    header.append(cell);
  }
  document.querySelector('thead').append(header);
  for (const [select, index] of [[source, 0], [status, 7]]) {
    for (const value of [...new Set(data.rows.map(row => row[index]).filter(Boolean))].sort()) {
      select.add(new Option(value, value));
    }
  }
  const rows = data.rows.map(row => ({ cells: row, search: row.join(' ').toLocaleLowerCase() }));
  function render() {
    const query = search.value.trim().toLocaleLowerCase();
    const matching = rows.filter(row => row.search.includes(query)
      && (!source.value || row.cells[0] === source.value)
      && (!status.value || row.cells[7] === status.value));
    const fragment = document.createDocumentFragment();
    for (const { cells } of matching) {
      const tr = document.createElement('tr');
      for (const index of columns) {
        const td = document.createElement('td');
        const value = cells[index] ?? '';
        if (index === 6 && /^https?:\/\//i.test(value)) {
          const link = document.createElement('a');
          link.href = value;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = value;
          td.append(link);
        } else td.textContent = value;
        if (index === 3) {
          const context = document.createElement('span');
          context.className = 'proposal-context';
          context.append(document.createTextNode(cells[0] ?? ''));
          if (/^https?:\/\//i.test(cells[6] ?? '')) {
            const link = document.createElement('a');
            link.href = cells[6];
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'Original discussion';
            context.append(document.createTextNode(' · '), link);
          }
          td.append(context);
        }
        tr.append(td);
      }
      fragment.append(tr);
    }
    body.replaceChildren(fragment);
    count.textContent = `${matching.length} of ${rows.length} proposals`;
    message.hidden = matching.length > 0;
    message.textContent = 'No proposals match these filters.';
    document.querySelector('main').scrollTop = 0;
  }
  search.addEventListener('input', render);
  source.addEventListener('change', render);
  status.addEventListener('change', render);
  document.querySelector('form').addEventListener('reset', () => {
    search.value = source.value = status.value = '';
    render();
  });
  render();
} catch (error) {
  count.textContent = 'Unable to load proposals';
  message.hidden = false;
  message.textContent = 'The inventory could not be loaded. Reload the viewer or download the original XLSX above.';
  console.error(error);
}
