// Presentation-only navigation over the native notebook cells and result chips.
// Editing, evaluation, dependencies and inspection remain notebook.sc's own UI.
const stages = [
  ['Data', 'data'], ['Projection', 'projection'], ['Filter', 'controls'],
  ['Group', 'monthly'], ['Chart', 'chart'], ['Types', 'schema'],
];
function cellFor(id) {
  return [...document.querySelectorAll('.cell')].find(cell =>
    cell.querySelector('.cell-head > span')?.textContent.trim() === id);
}
function show(id) {
  const cell = cellFor(id);
  if (!cell) return;
  const main = cell.closest('.main');
  if (main) main.scrollTo({top:main.scrollTop + cell.getBoundingClientRect().top - main.getBoundingClientRect().top});
  cell.querySelector('.var-chip')?.click();
}
function install() {
  const toolbar = document.querySelector('.toolbar');
  if (!toolbar || !cellFor('projection')?.querySelector('.var-chip')) return false;
  const nav = document.createElement('nav');
  nav.className = 'demo-steps';
  nav.setAttribute('aria-label', 'Demo stages');
  for (const [label, id] of stages) {
    const button = document.createElement('button');
    button.textContent = label;
    button.addEventListener('click', () => show(id));
    nav.append(button);
  }
  toolbar.after(nav);
  requestAnimationFrame(() => show('projection'));
  return true;
}
if (!install()) {
  const observer = new MutationObserver(() => { if (install()) observer.disconnect(); });
  observer.observe(document.body, {childList:true, subtree:true});
}
